import { NextResponse } from "next/server";

import { getCurrentUser, isAdminRole } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import Event from "@/models/Event";

function validateEventBody(body: Record<string, unknown>) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const date = typeof body.date === "string" ? body.date.trim() : "";
  const time = typeof body.time === "string" ? body.time.trim() : "";
  const location = typeof body.location === "string" ? body.location.trim() : "";
  const type = typeof body.type === "string" ? body.type.trim() : "";
  const expectedAttendees = Number(body.expectedAttendees ?? 0);
  const status = typeof body.status === "string" ? body.status.trim() : "";
  const isRegistrationOpen = Boolean(body.isRegistrationOpen);
  const registrationDeadline = typeof body.registrationDeadline === "string" ? body.registrationDeadline.trim() : undefined;
  const bannerImage = typeof body.bannerImage === "string" ? body.bannerImage.trim() : "";

  if (!title || !description || !date || !time || !location || !type) {
    return { error: "All event fields are required." };
  }

  if (!["upcoming", "draft", "completed"].includes(status)) {
    return { error: "Invalid event status." };
  }

  if (Number.isNaN(expectedAttendees) || expectedAttendees < 0) {
    return { error: "Expected attendees must be a valid non-negative number." };
  }

  return {
    data: {
      title,
      description,
      date,
      time,
      location,
      type,
      expectedAttendees,
      status,
      isRegistrationOpen,
      registrationDeadline,
      bannerImage,
    },
  };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    if (!isAdminRole(currentUser.role)) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { eventId } = await params;
    const body = await request.json();
    const validated = validateEventBody(body);
    if ("error" in validated) {
      return NextResponse.json({ message: validated.error }, { status: 400 });
    }

    await connectDb();

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: validated.data },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedEvent) {
      return NextResponse.json({ message: "Event not found." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Event updated successfully.",
      event: {
        id: String(updatedEvent._id),
        title: updatedEvent.title,
        status: updatedEvent.status,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to update event." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    if (!isAdminRole(currentUser.role)) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { eventId } = await params;
    await connectDb();

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      return NextResponse.json({ message: "Event not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Event deleted successfully." });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete event." },
      { status: 500 }
    );
  }
}
