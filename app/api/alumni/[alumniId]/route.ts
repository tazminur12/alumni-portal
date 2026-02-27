import { NextResponse } from "next/server";

import { connectDb } from "@/lib/db";
import User from "@/models/User";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ alumniId: string }> }
) {
  try {
    const { alumniId } = await params;

    await connectDb();

    const user = await User.findById(alumniId)
      .select("-password -email")
      .lean();

    if (!user || user.status !== "active" || user.role !== "alumni") {
      return NextResponse.json({ message: "Alumni not found." }, { status: 404 });
    }

    return NextResponse.json({
      alumni: {
        id: String(user._id),
        fullName: user.fullName,
        batch: user.batch,
        passingYear: user.passingYear,
        profession: user.profession || "",
        location: user.location || "",
        profilePicture: user.profilePicture || "",
        collegeName: user.collegeName || "",
        universityName: user.universityName || "",
        bio: user.bio || "",
        phone: user.phone || "",
        whatsapp: user.whatsapp || "",
        linkedin: user.linkedin || "",
        facebook: user.facebook || "",
        instagram: user.instagram || "",
        skills: user.skills || "",
        website: user.website || "",
        currentJobTitle: user.currentJobTitle || "",
        company: user.company || "",
        industry: user.industry || "",
        workLocation: user.workLocation || "",
        department: user.department || "",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load alumni." },
      { status: 500 }
    );
  }
}
