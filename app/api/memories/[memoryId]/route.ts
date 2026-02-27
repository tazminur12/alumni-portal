import { NextResponse } from "next/server";

import { getCurrentUser, isAdminRole } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import Memory from "@/models/Memory";
import MemoryLike from "@/models/MemoryLike";
import MemoryComment from "@/models/MemoryComment";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ memoryId: string }> }
) {
  try {
    const { memoryId } = await params;
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get("guestId") || undefined;

    await connectDb();

    const memory = await Memory.findById(memoryId).lean();
    if (!memory) {
      return NextResponse.json({ message: "Memory not found." }, { status: 404 });
    }

    const [likesCount, commentsList] = await Promise.all([
      MemoryLike.countDocuments({ memoryId }),
      MemoryComment.find({ memoryId })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    let hasLiked = false;
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const like = await MemoryLike.findOne({
          memoryId,
          likerKey: `user-${currentUser._id}`,
        });
        hasLiked = !!like;
      } else if (guestId) {
        const like = await MemoryLike.findOne({
          memoryId,
          likerKey: `guest-${guestId}`,
        });
        hasLiked = !!like;
      }
    } catch {
      // ignore
    }

    const comments = commentsList.map((c) => ({
      id: String(c._id),
      authorName: c.authorName,
      text: c.text,
      createdAt: c.createdAt,
    }));

    return NextResponse.json({
      memory: {
        id: String(memory._id),
        title: memory.title,
        description: memory.description,
        date: memory.date,
        batch: memory.batch,
        author: memory.author,
        imageUrl: memory.imageUrl || "",
        color: memory.color || "from-primary/5 to-primary/10",
        createdAt: memory.createdAt,
      },
      likes: likesCount,
      hasLiked,
      comments,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load memory." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ memoryId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { memoryId } = await params;
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    const date = typeof body.date === "string" ? body.date.trim() : "";
    const batch = typeof body.batch === "string" ? body.batch.trim() : "";
    const imageUrl =
      typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";

    if (!title || !description || !date || !batch) {
      return NextResponse.json(
        { message: "Title, description, date and batch are required." },
        { status: 400 }
      );
    }

    await connectDb();

    const memory = await Memory.findById(memoryId);
    if (!memory) {
      return NextResponse.json({ message: "Memory not found." }, { status: 404 });
    }

    const isOwner = String(memory.authorId) === String(currentUser._id);
    const isAdmin = isAdminRole(currentUser.role);
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    memory.title = title;
    memory.description = description;
    memory.date = date;
    memory.batch = batch;
    if (imageUrl !== undefined) memory.imageUrl = imageUrl;
    await memory.save();

    return NextResponse.json({
      message: "Memory updated successfully.",
      memory: {
        id: String(memory._id),
        title: memory.title,
        description: memory.description,
        date: memory.date,
        batch: memory.batch,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to update memory." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ memoryId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { memoryId } = await params;
    await connectDb();

    const memory = await Memory.findById(memoryId);
    if (!memory) {
      return NextResponse.json({ message: "Memory not found." }, { status: 404 });
    }

    const isOwner = String(memory.authorId) === String(currentUser._id);
    const isAdmin = isAdminRole(currentUser.role);
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    await Memory.findByIdAndDelete(memoryId);

    return NextResponse.json({ message: "Memory deleted successfully." });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete memory." },
      { status: 500 }
    );
  }
}
