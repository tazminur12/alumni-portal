import { NextResponse } from "next/server";

import { connectDb } from "@/lib/db";
import User from "@/models/User";
import Event from "@/models/Event";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export async function GET() {
  try {
    await connectDb();

    const [alumniCount, batchCount, eventsCount, featuredAlumni, upcomingEvents] =
      await Promise.all([
        User.countDocuments({ status: "active", role: "alumni" }),
        User.distinct("batch", { status: "active", role: "alumni" }).then(
          (batches) => batches.filter(Boolean).length
        ),
        Event.countDocuments(),
        User.find({ status: "active", role: "alumni" })
          .select("fullName batch profession profilePicture")
          .sort({ createdAt: -1 })
          .limit(4)
          .lean(),
        Event.find({ status: "upcoming" })
          .select("title date time location type")
          .sort({ date: 1 })
          .limit(3)
          .lean(),
      ]);

    const featured = featuredAlumni.map((u) => ({
      name: u.fullName,
      batch: u.batch,
      role: u.profession || "",
      initials: getInitials(u.fullName),
      profilePicture: u.profilePicture || "",
    }));

    const events = upcomingEvents.map((e) => ({
      id: String(e._id),
      title: e.title,
      date: e.date,
      time: e.time,
      location: e.location,
      type: e.type || "Event",
    }));

    return NextResponse.json({
      stats: {
        totalAlumni: alumniCount,
        totalBatches: batchCount,
        totalEvents: eventsCount,
      },
      featuredAlumni: featured,
      upcomingEvents: events,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load home data." },
      { status: 500 }
    );
  }
}
