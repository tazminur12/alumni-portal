import { Plus, Search, Calendar, MoreHorizontal } from "lucide-react";

const events = [
  { title: "Annual Alumni Reunion 2026", date: "Mar 15, 2026", location: "School Campus", attendees: 150, status: "Upcoming" },
  { title: "Career Guidance Seminar", date: "Apr 5, 2026", location: "Online", attendees: 80, status: "Upcoming" },
  { title: "Foundation Day", date: "May 20, 2026", location: "School Auditorium", attendees: 200, status: "Draft" },
  { title: "Cricket Tournament", date: "Jun 15, 2026", location: "School Ground", attendees: 44, status: "Draft" },
  { title: "Reunion 2025", date: "Mar 10, 2025", location: "School Campus", attendees: 180, status: "Completed" },
];

const statusColors: Record<string, string> = {
  Upcoming: "bg-green-50 text-green-600",
  Draft: "bg-gray-100 text-gray-600",
  Completed: "bg-blue-50 text-blue-600",
};

export default function AdminEventsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Event Management
          </h2>
          <p className="text-sm text-muted">Create and manage alumni events</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
          <Plus size={16} />
          Create Event
        </button>
      </div>

      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          placeholder="Search events..."
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Event
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Location
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Attendees
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((event) => (
                <tr key={event.title} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Calendar size={16} />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {event.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted">
                    {event.date}
                  </td>
                  <td className="px-5 py-3 text-sm text-muted">
                    {event.location}
                  </td>
                  <td className="px-5 py-3 text-sm text-muted">
                    {event.attendees}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[event.status] ?? ""}`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="rounded-lg p-1.5 text-muted hover:bg-gray-100">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
