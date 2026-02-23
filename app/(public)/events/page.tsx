import { MapPin, Clock, Users } from "lucide-react";

const events = [
  {
    title: "Annual Alumni Reunion 2026",
    date: "March 15, 2026",
    time: "10:00 AM - 6:00 PM",
    location: "School Campus, Amtoli",
    attendees: 150,
    type: "Reunion",
    description:
      "Join us for the biggest alumni gathering of the year! Reconnect with old friends, meet teachers, and celebrate our school.",
    status: "upcoming",
  },
  {
    title: "Career Guidance Seminar",
    date: "April 5, 2026",
    time: "3:00 PM - 5:00 PM",
    location: "Online (Zoom)",
    attendees: 80,
    type: "Seminar",
    description:
      "Alumni professionals share insights on career paths, industry trends, and guide current students toward their goals.",
    status: "upcoming",
  },
  {
    title: "School Foundation Day",
    date: "May 20, 2026",
    time: "9:00 AM - 4:00 PM",
    location: "School Auditorium",
    attendees: 200,
    type: "Celebration",
    description:
      "Celebrate the founding of our beloved school with cultural programs, exhibitions, and special felicitations.",
    status: "upcoming",
  },
  {
    title: "Fundraiser for Library Renovation",
    date: "June 10, 2026",
    time: "5:00 PM - 8:00 PM",
    location: "Bogura City Community Hall",
    attendees: 60,
    type: "Fundraiser",
    description:
      "Help us modernize the school library with new books, computers, and a digital reading room.",
    status: "upcoming",
  },
];

const typeColors: Record<string, string> = {
  Reunion: "bg-primary/10 text-primary",
  Seminar: "bg-blue-500/10 text-blue-600",
  Celebration: "bg-accent/10 text-accent",
  Fundraiser: "bg-pink-500/10 text-pink-600",
};

export default function EventsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-dark to-primary py-16 sm:py-20">
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
          <div className="grid gap-6 lg:grid-cols-2">
            {events.map((event) => (
              <div
                key={event.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${typeColors[event.type] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {event.type}
                  </span>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                    Upcoming
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-foreground">
                  {event.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {event.description}
                </p>

                <div className="mt-4 space-y-2">
                  <p className="flex items-center gap-2 text-sm text-muted">
                    <Clock size={14} className="text-primary" />
                    {event.date} &middot; {event.time}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-muted">
                    <MapPin size={14} className="text-primary" />
                    {event.location}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-muted">
                    <Users size={14} className="text-primary" />
                    {event.attendees} expected attendees
                  </p>
                </div>

                <button className="mt-5 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
                  Register for Event
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
