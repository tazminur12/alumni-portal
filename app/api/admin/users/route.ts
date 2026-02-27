import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { getCurrentUser, isAdminRole } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    if (!isAdminRole(currentUser.role)) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    await connectDb();

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      users: users.map((user: any) => ({
        id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        batch: user.batch,
        passingYear: user.passingYear,
        collegeName: user.collegeName,
        universityName: user.universityName ?? "",
        profession: user.profession ?? "",
        phone: user.phone ?? "",
        location: user.location ?? "",
        bio: user.bio ?? "",
        profilePicture: user.profilePicture ?? "",
        role: user.role ?? "alumni",
        status: user.status ?? "active",
        createdAt: user.createdAt,
      })),
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load users." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    if (!isAdminRole(currentUser.role)) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const body = await request.json();

    const fullName = body.fullName?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const batch = body.batch?.trim();
    const passingYear = body.passingYear?.trim();
    const collegeName = body.collegeName?.trim();
    const universityName = body.universityName?.trim() || "";
    const profession = body.profession?.trim() || "";
    const role = body.role || "alumni";
    const status = body.status || "active";

    if (!fullName || !email || !password || !batch || !passingYear || !collegeName) {
      return NextResponse.json(
        {
          message:
            "Full name, email, password, batch, passing year, and college name are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    await connectDb();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { message: "A user with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profilePicture =
      body.profilePicture?.trim() ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        fullName
      )}&background=0d6b58&color=fff`;

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      batch,
      passingYear,
      collegeName,
      universityName,
      profession,
      role,
      status,
      profilePicture,
    });

    return NextResponse.json(
      {
        message: "User created successfully.",
        user: {
          id: String(user._id),
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to create user." },
      { status: 500 }
    );
  }
}
