import { NextResponse } from "next/server";

import { getCurrentUser, isAdminRole } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

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
    const body = (await request.json()) as { isFeatured?: unknown };
    const isFeatured =
      typeof body.isFeatured === "boolean"
        ? body.isFeatured
        : body.isFeatured === "true";

    if (typeof isFeatured !== "boolean") {
      return NextResponse.json(
        { message: "isFeatured boolean value is required." },
        { status: 400 }
      );
    }

    await connectDb();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    user.isFeatured = isFeatured;
    await user.save();

    return NextResponse.json({
      message: "User featured status updated successfully.",
      user: {
        id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        isFeatured: Boolean(user.isFeatured),
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to update user featured status." },
      { status: 500 }
    );
  }
}

