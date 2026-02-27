import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Event from "@/models/Event";
import EventRegistration from "@/models/EventRegistration";
import { getCurrentUser } from "@/lib/current-user";
import { Types } from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    const { fullName, email, phone, batch } = body;

    if (!fullName || !email || !phone || !batch) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    await connectDb();

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { message: "Event not found." },
        { status: 404 }
      );
    }

    if (!event.isRegistrationOpen) {
      return NextResponse.json(
        { message: "Registration is not open for this event." },
        { status: 400 }
      );
    }

    if (event.registrationDeadline && new Date(`${event.registrationDeadline}T23:59:59`) < new Date()) {
      return NextResponse.json(
        { message: "Registration deadline has passed." },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser();

    // Check if already registered
    const existingRegistration = await EventRegistration.findOne({
      eventId: new Types.ObjectId(eventId),
      email,
    });

    if (existingRegistration) {
      return NextResponse.json(
        { message: "You have already registered for this event." },
        { status: 400 }
      );
    }

    const registration = await EventRegistration.create({
      eventId: new Types.ObjectId(eventId),
      userId: currentUser?.id ? new Types.ObjectId(currentUser.id) : undefined,
      fullName,
      email,
      phone,
      batch,
    });

    // Increment registered attendees count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { registeredAttendees: 1 },
    });

    return NextResponse.json(
      { message: "Registered successfully.", registration },
      { status: 201 }
    );
  } catch (error) {
    console.error("Event registration error:", error);
    return NextResponse.json(
      { message: "Failed to register for event." },
      { status: 500 }
    );
  }
}
