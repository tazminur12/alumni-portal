import { NextResponse } from "next/server";

import { getCurrentUser, isAdminRole } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import Gallery from "@/models/Gallery";

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

    const items = await Gallery.find()
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({
      items: items.map((item) => ({
        id: String(item._id),
        imageUrl: item.imageUrl,
        caption: item.caption || "",
        order: item.order,
        createdAt: item.createdAt,
      })),
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load gallery." },
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

    const item = await Gallery.create({ imageUrl, caption, order });

    return NextResponse.json(
      {
        message: "Image added successfully.",
        item: {
          id: String(item._id),
          imageUrl: item.imageUrl,
          caption: item.caption || "",
          order: item.order,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to add image." },
      { status: 500 }
    );
  }
}
