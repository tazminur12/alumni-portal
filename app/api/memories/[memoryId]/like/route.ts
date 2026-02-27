import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import Memory from "@/models/Memory";
import MemoryLike from "@/models/MemoryLike";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ memoryId: string }> }
) {
  try {
    const { memoryId } = await params;
    const body = await request.json().catch(() => ({}));
    const guestId = typeof body.guestId === "string" ? body.guestId.trim() : undefined;

    await connectDb();

    const memory = await Memory.findById(memoryId);
    if (!memory) {
      return NextResponse.json({ message: "Memory not found." }, { status: 404 });
    }

    let likerKey: string | undefined;
    const currentUser = await getCurrentUser();
    if (currentUser) {
      likerKey = `user-${currentUser._id}`;
    } else if (guestId) {
      likerKey = `guest-${guestId}`;
    } else {
      return NextResponse.json(
        { message: "Please provide guestId or login to like." },
        { status: 400 }
      );
    }

    const existing = await MemoryLike.findOne({ memoryId, likerKey });

    if (existing) {
      await MemoryLike.deleteOne({ _id: existing._id });
      await Memory.findByIdAndUpdate(memoryId, { $inc: { likes: -1 } });
      const newCount = Math.max(0, (memory.likes ?? 0) - 1);
      return NextResponse.json({
        liked: false,
        likes: newCount,
      });
    } else {
      await MemoryLike.create({
        memoryId,
        likerKey,
        userId: currentUser?._id,
        guestId: currentUser ? undefined : guestId,
      });
      await Memory.findByIdAndUpdate(memoryId, {
        $inc: { likes: 1 },
      });
      return NextResponse.json({
        liked: true,
        likes: (memory.likes ?? 0) + 1,
      });
    }
  } catch {
    return NextResponse.json(
      { message: "Failed to toggle like." },
      { status: 500 }
    );
  }
}
