import { NextResponse } from "next/server";

import { getCurrentUser, isAdminRole } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import Slideshow from "@/models/Slideshow";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    if (!isAdminRole(currentUser.role)) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

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
        createdAt: s.createdAt,
      })),
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load slideshow." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    if (!isAdminRole(currentUser.role)) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const body = await request.json();
    const imageUrl =
      typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
    const caption =
      typeof body.caption === "string" ? body.caption.trim() : "";
    const order = Number(body.order) || 0;

    if (!imageUrl) {
      return NextResponse.json(
        { message: "Image URL is required." },
        { status: 400 }
      );
    }

    await connectDb();

    const slide = await Slideshow.create({ imageUrl, caption, order });

    return NextResponse.json(
      {
        message: "Slide added successfully.",
        slide: {
          id: String(slide._id),
          imageUrl: slide.imageUrl,
          caption: slide.caption || "",
          order: slide.order,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to add slide." },
      { status: 500 }
    );
  }
}
