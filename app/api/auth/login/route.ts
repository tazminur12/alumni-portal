import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { signAuthToken } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectDb();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (user.status === "pending") {
      return NextResponse.json(
        { message: "Your account is pending approval from a moderator." },
        { status: 403 }
      );
    }

    if (user.status === "suspended") {
      return NextResponse.json(
        { message: "Your account has been suspended." },
        { status: 403 }
      );
    }

    const token = signAuthToken({
      userId: String(user._id),
      email: user.email,
      fullName: user.fullName,
    });

    const response = NextResponse.json({
      message: "Login successful.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role ?? "alumni",
        status: user.status ?? "active",
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
