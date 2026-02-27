import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { getCurrentUser, isAdminRole } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

const allowedRoles = ["super_admin", "admin", "moderator", "alumni"] as const;
const allowedStatuses = ["active", "pending", "suspended"] as const;

type RoleType = (typeof allowedRoles)[number];
type StatusType = (typeof allowedStatuses)[number];

const appEmail = process.env.APP_EMAIL;
const appPassword = process.env.APP_PASSWORD;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    if (!isAdminRole(currentUser.role)) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { userId } = await params;
    const body = await request.json();
    const role = body.role as RoleType | undefined;
    const status = body.status as StatusType | undefined;

    if (!role && !status) {
      return NextResponse.json(
        { message: "Role or status is required." },
        { status: 400 }
      );
    }

    if (role && !allowedRoles.includes(role)) {
      return NextResponse.json(
        { message: "Invalid role value." },
        { status: 400 }
      );
    }

    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value." },
        { status: 400 }
      );
    }

    await connectDb();

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const previousStatus = existingUser.status ?? "pending";

    const updateData: { role?: RoleType; status?: StatusType } = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    Object.assign(existingUser, updateData);
    const updatedUser = await existingUser.save();

    // If an account moved from pending to active, send approval email (best-effort).
    if (
      previousStatus === "pending" &&
      updatedUser.status === "active" &&
      appEmail &&
      appPassword
    ) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: appEmail,
            pass: appPassword,
          },
        });

        await transporter.sendMail({
          from: `"Amtoli Alumni Portal" <${appEmail}>`,
          to: updatedUser.email,
          subject: "Your alumni account has been approved",
          html: `
            <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #111827;">
              <h1 style="font-size: 20px; margin-bottom: 12px;">Account approved</h1>
              <p style="margin-bottom: 12px;">
                Hello ${updatedUser.fullName},
              </p>
              <p style="margin-bottom: 12px;">
                Good news – your Amtoli Alumni Portal account has been reviewed and <strong>approved</strong>.
              </p>
              <p style="margin-bottom: 12px;">
                You can now sign in using the email address <strong>${updatedUser.email}</strong> and the password you chose during registration.
              </p>
              <p style="margin-bottom: 12px;">
                Login here:
              </p>
              <p style="margin: 20px 0;">
                <a
                  href="${
                    process.env.NEXT_PUBLIC_APP_URL ||
                    process.env.NEXTAUTH_URL ||
                    "http://localhost:3000"
                  }/login"
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
                  Go to login
                </a>
              </p>
              <p style="margin-bottom: 12px;">
                If you did not create this account, please ignore this email.
              </p>
              <p style="margin-top: 24px; font-size: 12px; color: #6b7280;">
                &copy; ${new Date().getFullYear()} Amtoli Alumni Portal. All rights reserved.
              </p>
            </div>
          `,
          text: `Hello ${updatedUser.fullName},

Your Amtoli Alumni Portal account has been reviewed and approved.

You can now sign in using your email address (${updatedUser.email}) and the password you chose during registration.

Login: ${
            process.env.NEXT_PUBLIC_APP_URL ||
            process.env.NEXTAUTH_URL ||
            "http://localhost:3000"
          }/login

If you did not create this account, you can ignore this email.

— Amtoli Alumni Portal
`,
        });
      } catch {
        // Email failure should not prevent the admin action from succeeding.
      }
    }

    return NextResponse.json({
      message: "User role updated successfully.",
      user: {
        id: String(updatedUser._id),
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role ?? "alumni",
        status: updatedUser.status ?? "active",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to update user role." },
      { status: 500 }
    );
  }
}
