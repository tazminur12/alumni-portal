import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { connectDb } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();
    const token = body.token?.trim();
    const password = body.password as string | undefined;

    if (!email || !token || !password) {
      return NextResponse.json(
        { message: "Email, token, and new password are required." },
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

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      email,
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "This password reset link is invalid or has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return NextResponse.json({
      message: "Your password has been updated successfully. You can now log in.",
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Reset password API error:", error);
    return NextResponse.json(
      {
        message:
          "Unable to reset password right now. Please try again later.",
      },
      { status: 500 }
    );
  }
}

