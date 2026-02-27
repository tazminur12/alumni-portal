import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import EventRegistration from "@/models/EventRegistration";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ eventIds: [] });
    }

    await connectDb();

    const registrations = await EventRegistration.find({
      email: currentUser.email,
      status: "registered",
    })
      .select("eventId")
      .lean();

    const eventIds = registrations.map((r) => String(r.eventId));

    return NextResponse.json({ eventIds });
  } catch {
    return NextResponse.json({ eventIds: [] });
  }
}
