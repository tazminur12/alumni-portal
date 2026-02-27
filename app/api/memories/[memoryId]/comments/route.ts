import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import Memory from "@/models/Memory";
import MemoryComment from "@/models/MemoryComment";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ memoryId: string }> }
) {
  try {
    const { memoryId } = await params;
    const body = await request.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const authorName = typeof body.authorName === "string" ? body.authorName.trim() : "";

    if (!text) {
      return NextResponse.json(
        { message: "Comment text is required." },
        { status: 400 }
      );
    }

    await connectDb();

    const memory = await Memory.findById(memoryId);
    if (!memory) {
      return NextResponse.json({ message: "Memory not found." }, { status: 404 });
    }

    let name = authorName;
    const currentUser = await getCurrentUser();
    if (currentUser) {
      name = currentUser.fullName;
    } else if (!name) {
      return NextResponse.json(
        { message: "Please provide your name or login to comment." },
        { status: 400 }
      );
    }

    const comment = await MemoryComment.create({
      memoryId,
      authorName: name,
      authorId: currentUser?._id,
      text,
    });

    await Memory.findByIdAndUpdate(memoryId, {
      $inc: { comments: 1 },
    });

    return NextResponse.json(
      {
        comment: {
          id: String(comment._id),
          authorName: comment.authorName,
          text: comment.text,
          createdAt: comment.createdAt,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to add comment." },
      { status: 500 }
    );
  }
}
