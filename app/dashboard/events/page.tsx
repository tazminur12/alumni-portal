import { Calendar, MapPin, Clock, Users, Filter } from "lucide-react";

const events = [
  {
    title: "Annual Alumni Reunion 2026",
    date: "March 15, 2026",
    time: "10:00 AM - 6:00 PM",
    location: "School Campus",
    attendees: 150,
    status: "Registered",
    type: "Reunion",
  },
  {
    title: "Career Guidance Seminar",
    date: "April 5, 2026",
    time: "3:00 PM - 5:00 PM",
    location: "Online (Zoom)",
    attendees: 80,
    status: "Open",
    type: "Seminar",
  },
  {
    title: "Foundation Day Celebration",
    date: "May 20, 2026",
    time: "9:00 AM - 4:00 PM",
    location: "School Auditorium",
    attendees: 200,
    status: "Open",
    type: "Celebration",
  },
  {
    title: "Alumni Cricket Tournament",
    date: "June 15, 2026",
    time: "8:00 AM - 5:00 PM",
    location: "School Ground",
    attendees: 44,
    status: "Open",
    type: "Sports",
  },
];

const statusColors: Record<string, string> = {
  Registered: "bg-green-50 text-green-600",
  Open: "bg-blue-50 text-blue-600",
};

export default function DashboardEventsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Events</h2>
          <p className="text-sm text-muted">Browse and register for events</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-gray-50">
          <Filter size={14} />
          Filter Events
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {events.map((event) => (
          <div
            key={event.title}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {event.type}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[event.status] ?? ""}`}
              >
                {event.status}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-foreground">
              {event.title}
            </h3>

            <div className="mt-3 space-y-2">
              <p className="flex items-center gap-2 text-sm text-muted">
                <Calendar size={14} />
                {event.date}
              </p>
              <p className="flex items-center gap-2 text-sm text-muted">
                <Clock size={14} />
                {event.time}
              </p>
              <p className="flex items-center gap-2 text-sm text-muted">
                <MapPin size={14} />
                {event.location}
              </p>
              <p className="flex items-center gap-2 text-sm text-muted">
                <Users size={14} />
                {event.attendees} attendees
              </p>
            </div>

            <button
              className={`mt-4 w-full rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                event.status === "Registered"
                  ? "border border-border bg-gray-50 text-muted"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
              disabled={event.status === "Registered"}
            >
              {event.status === "Registered" ? "Already Registered" : "Register Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
