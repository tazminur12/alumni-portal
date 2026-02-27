import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyAuthToken } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAuthToken(token);

    await connectDb();
    const user = await User.findById(payload.userId).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.status === "pending") {
      return NextResponse.json({ message: "Account pending approval" }, { status: 403 });
    }

    if (user.status === "suspended") {
      return NextResponse.json({ message: "Account suspended" }, { status: 403 });
    }

    return NextResponse.json({
      user: {
        id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        batch: user.batch,
        passingYear: user.passingYear,
        profilePicture: user.profilePicture,
        collegeName: user.collegeName,
        universityName: user.universityName,
        profession: user.profession ?? "",
        phone: user.phone ?? "",
        location: user.location ?? "",
        bio: user.bio ?? "",
        role: user.role ?? "alumni",
        status: user.status ?? "active",
      },
    });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
