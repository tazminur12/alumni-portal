import { NextResponse } from "next/server";

import { getCurrentUser, isAdminRole } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import Slideshow from "@/models/Slideshow";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    if (!isAdminRole(currentUser.role)) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { id } = await params;
    const body = await _request.json();

    const update: Record<string, string | number> = {};
    if (typeof body.imageUrl === "string" && body.imageUrl.trim()) {
      update.imageUrl = body.imageUrl.trim();
    }
    if (typeof body.caption === "string") {
      update.caption = body.caption.trim();
    }
    if (typeof body.order === "number") {
      update.order = body.order;
    }

    await connectDb();

    const slide = await Slideshow.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    ).lean();

    if (!slide) {
      return NextResponse.json({ message: "Slide not found." }, { status: 404 });
    }

    return NextResponse.json({
      slide: {
        id: String(slide._id),
        imageUrl: slide.imageUrl,
        caption: slide.caption || "",
        order: slide.order,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to update slide." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    if (!isAdminRole(currentUser.role)) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { id } = await params;

    await connectDb();

    const slide = await Slideshow.findByIdAndDelete(id);

    if (!slide) {
      return NextResponse.json({ message: "Slide not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Slide deleted successfully." });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete slide." },
      { status: 500 }
    );
  }
}
