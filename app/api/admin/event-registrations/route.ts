import { NextResponse } from "next/server";

import { getCurrentUser, isAdminRole } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import EventRegistration from "@/models/EventRegistration";
import Event from "@/models/Event";

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

    const registrations = await EventRegistration.find({ status: "registered" })
      .sort({ createdAt: -1 })
      .lean();

    const eventIds = [...new Set(registrations.map((r) => String(r.eventId)))];
    const events = await Event.find({ _id: { $in: eventIds } })
      .select("title date time location")
      .lean();

    const eventMap = new Map<string, { title: string; date: string; time: string; location: string }>();
    for (const e of events) {
      eventMap.set(String(e._id), {
        title: e.title,
        date: e.date,
        time: e.time,
        location: e.location,
      });
    }

    const list = registrations.map((reg) => {
      const event = eventMap.get(String(reg.eventId));
      return {
        id: String(reg._id),
        eventId: String(reg.eventId),
        eventTitle: event?.title ?? "Unknown Event",
        eventDate: event?.date ?? "",
        eventTime: event?.time ?? "",
        eventLocation: event?.location ?? "",
        fullName: reg.fullName,
        email: reg.email,
        phone: reg.phone,
        batch: reg.batch,
        registeredAt: reg.createdAt ?? reg.registeredAt,
      };
    });

    return NextResponse.json({ registrations: list });
  } catch {
    return NextResponse.json(
      { message: "Failed to load event registrations." },
      { status: 500 }
    );
  }
}
