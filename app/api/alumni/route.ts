import { NextResponse } from "next/server";

import { connectDb } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDb();

    const users = await User.find({ status: "active", role: "alumni" })
      .select("-password -email")
      .sort({ fullName: 1 })
      .lean();

    const list = users.map((u) => ({
      id: String(u._id),
      fullName: u.fullName,
      batch: u.batch,
      passingYear: u.passingYear,
      profession: u.profession || "",
      location: u.location || "",
      profilePicture: u.profilePicture || "",
      collegeName: u.collegeName || "",
      universityName: u.universityName || "",
      bio: u.bio || "",
    }));

    return NextResponse.json({ alumni: list });
  } catch {
    return NextResponse.json(
      { message: "Failed to load alumni." },
      { status: 500 }
    );
  }
}
