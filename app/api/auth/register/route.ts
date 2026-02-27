import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { connectDb } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = body.fullName?.trim();
    const batch = body.batch?.trim();
    const passingYear = body.passingYear?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const profilePicture = body.profilePicture?.trim();
    const collegeName = body.collegeName?.trim();
    const universityName = body.universityName?.trim() || "";
    const profession = body.profession?.trim() || "";

    if (
      !fullName ||
      !batch ||
      !passingYear ||
      !email ||
      !password ||
      !profilePicture ||
      !collegeName
    ) {
      return NextResponse.json(
        {
          message:
            "Full name, batch, passing year, college name, profile picture, email, and password are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    await connectDb();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered. Please log in." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      batch,
      passingYear,
      email,
      password: hashedPassword,
      profilePicture,
      collegeName,
      universityName,
      profession,
      status: "pending", // Set default status to pending for moderator approval
    });

    const response = NextResponse.json(
      {
        message: "Registration successful. Your account is pending approval from a moderator.",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role ?? "alumni",
          status: user.status ?? "pending",
        },
      },
      { status: 201 }
    );

    return response;
  } catch (error) {
    console.error("Register API error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Registration failed. Please try again.";

    return NextResponse.json(
      {
        message:
          process.env.NODE_ENV === "development"
            ? message
            : "Registration failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
