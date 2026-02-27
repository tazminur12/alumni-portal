import { NextResponse } from "next/server";

import { getCurrentUser, isAdminRole } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import Gallery from "@/models/Gallery";

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

    const item = await Gallery.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ message: "Image not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Image deleted successfully." });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete image." },
      { status: 500 }
    );
  }
}
