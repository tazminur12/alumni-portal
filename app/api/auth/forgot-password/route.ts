import crypto from "crypto";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { connectDb } from "@/lib/db";
import User from "@/models/User";

const appEmail = process.env.APP_EMAIL;
const appPassword = process.env.APP_PASSWORD;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    await connectDb();

    const user = await User.findOne({ email });

    // Always respond with success message to avoid leaking whether the email exists.
    const genericSuccessResponse = NextResponse.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });

    if (!user || !appEmail || !appPassword) {
      return genericSuccessResponse;
    }

    // Create a secure token and store its hash in the database
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const resetExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = resetExpires;
    await user.save();

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(
      email
    )}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: appEmail,
        pass: appPassword,
      },
    });

    await transporter.sendMail({
      from: `"Amtoli Alumni Portal" <${appEmail}>`,
      to: user.email,
      subject: "Reset your Amtoli Alumni Portal password",
      html: `
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #111827;">
          <h1 style="font-size: 20px; margin-bottom: 12px;">Password reset request</h1>
          <p style="margin-bottom: 12px;">
            Hello ${user.fullName},
          </p>
          <p style="margin-bottom: 12px;">
            We received a request to reset the password for your Amtoli Alumni Portal account.
          </p>
          <p style="margin-bottom: 12px;">
            Click the button below to choose a new password. This link will expire in 1 hour.
          </p>
          <p style="margin: 20px 0;">
            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                padding: 10px 18px;
                background-color: #2563eb;
                color: #ffffff;
                text-decoration: none;
                border-radius: 9999px;
                font-weight: 600;
              "
            >
              Reset password
            </a>
          </p>
          <p style="margin-bottom: 12px;">
            If you did not request this, you can safely ignore this email.
          </p>
          <p style="margin-top: 24px; font-size: 12px; color: #6b7280;">
            &copy; ${new Date().getFullYear()} Amtoli Alumni Portal. All rights reserved.
          </p>
        </div>
      `,
      text: `Hello ${user.fullName},

We received a request to reset the password for your Amtoli Alumni Portal account.

Use the link below to choose a new password. This link will expire in 1 hour:
${resetUrl}

If you did not request this, you can safely ignore this email.

— Amtoli Alumni Portal
`,
    });

    return genericSuccessResponse;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      {
        message:
          "Unable to process password reset request right now. Please try again later.",
      },
      { status: 500 }
    );
  }
}

