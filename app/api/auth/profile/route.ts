import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyAuthToken } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    const body = await request.json();

    const fullName = body.fullName?.trim();
    const batch = body.batch?.trim();
    const passingYear = body.passingYear?.trim();
    const collegeName = body.collegeName?.trim();

    if (!fullName || !batch || !passingYear || !collegeName) {
      return NextResponse.json(
        {
          message:
            "Full name, batch, passing year and college name are required.",
        },
        { status: 400 }
      );
    }

    await connectDb();

    const updateData: Record<string, string> = {
      fullName,
      batch,
      passingYear,
      collegeName,
      universityName: body.universityName?.trim() || "",
      profession: body.profession?.trim() || "",
      phone: body.phone?.trim() || "",
      location: body.location?.trim() || "",
      bio: body.bio?.trim() || "",
    };

    const profilePicture = body.profilePicture?.trim();
    if (profilePicture) {
      updateData.profilePicture = profilePicture;
    }

    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { $set: updateData },
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: {
        id: String(updatedUser._id),
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        batch: updatedUser.batch,
        passingYear: updatedUser.passingYear,
        profilePicture: updatedUser.profilePicture,
        collegeName: updatedUser.collegeName,
        universityName: updatedUser.universityName,
        profession: updatedUser.profession ?? "",
        phone: updatedUser.phone ?? "",
        location: updatedUser.location ?? "",
        bio: updatedUser.bio ?? "",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to update profile." },
      { status: 500 }
    );
  }
}
