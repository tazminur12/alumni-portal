import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import Memory from "@/models/Memory";

const COLOR_OPTIONS = [
  "from-emerald-100 to-teal-100",
  "from-blue-100 to-indigo-100",
  "from-amber-100 to-orange-100",
  "from-purple-100 to-pink-100",
  "from-red-100 to-rose-100",
  "from-slate-100 to-gray-200",
  "from-cyan-100 to-sky-100",
  "from-green-100 to-emerald-100",
  "from-lime-100 to-green-100",
  "from-primary/5 to-primary/10",
];

function randomColor() {
  return COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)];
}

export async function GET() {
  try {
    await connectDb();

    const memories = await Memory.find()
      .sort({ createdAt: -1 })
      .lean();

    const list = memories.map((m) => ({
      id: String(m._id),
      title: m.title,
      description: m.description,
      date: m.date,
      batch: m.batch,
      author: m.author,
      authorId: m.authorId ? String(m.authorId) : "",
      imageUrl: m.imageUrl || "",
      likes: m.likes ?? 0,
      comments: m.comments ?? 0,
      color: m.color || "from-primary/5 to-primary/10",
      createdAt: m.createdAt,
    }));

    return NextResponse.json({ memories: list });
  } catch {
    return NextResponse.json(
      { message: "Failed to load memories." },
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

    const memory = await Memory.create({
      title,
      description,
      date,
      batch,
      author: currentUser.fullName,
      authorId: currentUser._id,
      color: randomColor(),
      imageUrl: imageUrl || undefined,
    });

    return NextResponse.json(
      {
        message: "Memory shared successfully.",
        memory: {
          id: String(memory._id),
          title: memory.title,
          description: memory.description,
          date: memory.date,
          batch: memory.batch,
          author: memory.author,
          likes: memory.likes,
          comments: memory.comments,
          color: memory.color,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to share memory." },
      { status: 500 }
    );
  }
}
