import { NextResponse } from "next/server";

import { connectDb } from "@/lib/db";
import Event from "@/models/Event";

export async function GET() {
  try {
    await connectDb();

    const events = await Event.find({ status: { $in: ["upcoming", "completed"] } })
      .sort({ createdAt: -1 })
      .lean();

    const list = events.map((event) => ({
      _id: String(event._id),
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      expectedAttendees: event.expectedAttendees,
      registeredAttendees: event.registeredAttendees ?? 0,
      type: event.type,
      description: event.description,
      status: event.status,
      isRegistrationOpen: event.isRegistrationOpen || false,
      registrationDeadline: event.registrationDeadline || "",
    }));

    return NextResponse.json({ events: list });
  } catch {
    return NextResponse.json(
      { message: "Failed to load events." },
      { status: 500 }
    );
  }
}
