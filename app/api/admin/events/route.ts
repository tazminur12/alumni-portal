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
    },
  };
}

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

    const events = await Event.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      events: events.map((event) => ({
        id: String(event._id),
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        type: event.type,
        expectedAttendees: event.expectedAttendees,
        status: event.status,
        isRegistrationOpen: event.isRegistrationOpen || false,
        registrationDeadline: event.registrationDeadline || "",
        registeredAttendees: event.registeredAttendees || 0,
        createdAt: event.createdAt,
      })),
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load events." },
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
    const validated = validateEventBody(body);
    if ("error" in validated) {
      return NextResponse.json({ message: validated.error }, { status: 400 });
    }

    await connectDb();
    const event = await Event.create(validated.data);

    return NextResponse.json(
      {
        message: "Event created successfully.",
        event: {
          id: String(event._id),
          title: event.title,
          status: event.status,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to create event." },
      { status: 500 }
    );
  }
}
