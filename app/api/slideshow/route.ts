import { NextResponse } from "next/server";

import { connectDb } from "@/lib/db";
import Slideshow from "@/models/Slideshow";

export async function GET() {
  try {
    await connectDb();

    const slides = await Slideshow.find()
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({
      slides: slides.map((s) => ({
        id: String(s._id),
        imageUrl: s.imageUrl,
        caption: s.caption || "",
        order: s.order,
      })),
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load slideshow." },
      { status: 500 }
    );
  }
}
