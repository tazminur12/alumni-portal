import { NextResponse } from "next/server";

import { getCurrentUser, isAdminRole } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

const allowedRoles = ["super_admin", "admin", "moderator", "alumni"] as const;
const allowedStatuses = ["active", "pending", "suspended"] as const;

type RoleType = (typeof allowedRoles)[number];
type StatusType = (typeof allowedStatuses)[number];

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

    const updateData: { role?: RoleType; status?: StatusType } = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: updateData,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
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
