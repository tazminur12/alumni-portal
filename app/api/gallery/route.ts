import { NextResponse } from "next/server";

import { connectDb } from "@/lib/db";
import Gallery from "@/models/Gallery";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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
      })),
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load gallery." },
      { status: 500 }
    );
  }
}
