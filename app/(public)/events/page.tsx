import { connectDb } from "@/lib/db";
import Event from "@/models/Event";
import EventsClientSection from "@/components/EventsClientSection";

export default async function EventsPage() {
  await connectDb();

  const events = await Event.find({ status: { $in: ["upcoming", "completed"] } })
    .sort({ createdAt: -1 })
    .lean();

  const serializedEvents = events.map((event) => ({
    _id: String(event._id),
    title: event.title,
    date: event.date,
    time: event.time,
    location: event.location,
    expectedAttendees: event.expectedAttendees,
    type: event.type,
    description: event.description,
    status: event.status,
    isRegistrationOpen: event.isRegistrationOpen || false,
    registrationDeadline: event.registrationDeadline || "",
    bannerImage: event.bannerImage || "",
  }));

  return (
    <>
      <section className="bg-linear-to-br from-primary-dark to-primary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Events
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Stay updated with upcoming alumni events and school programs
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {serializedEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted">No events found.</p>
            </div>
          ) : (
            <EventsClientSection events={serializedEvents} />
          )}
        </div>
      </section>
    </>
  );
}
