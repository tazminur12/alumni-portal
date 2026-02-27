import {
  Users,
  Calendar,
  Heart,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";

const statsCards = [
  { label: "Total Connections", value: "128", icon: Users, color: "bg-primary/10 text-primary" },
  { label: "Events Attended", value: "12", icon: Calendar, color: "bg-blue-500/10 text-blue-600" },
  { label: "Donations Made", value: "৳5,200", icon: Heart, color: "bg-pink-500/10 text-pink-600" },
];

const recentActivity = [
  { text: "Rafiq Ahmed posted in Batch 2005 group", time: "2 hours ago" },
  { text: "New event: Annual Reunion 2026 announced", time: "5 hours ago" },
  { text: "Nasreen Begum accepted your connection", time: "1 day ago" },
  { text: "You donated ৳1,000 to Library Fund", time: "3 days ago" },
  { text: "Career seminar registration is now open", time: "5 days ago" },
];

const upcomingEvents = [
  { title: "Annual Alumni Reunion", date: "Mar 15, 2026", attendees: 150 },
  { title: "Career Guidance Seminar", date: "Apr 5, 2026", attendees: 80 },
  { title: "Foundation Day Celebration", date: "May 20, 2026", attendees: 200 },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Welcome back, Alumni!
        </h2>
        <p className="text-sm text-muted">
          Here&apos;s what&apos;s happening in your alumni network
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent Activity */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
            <TrendingUp size={18} className="text-muted" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.text}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                    <Clock size={10} />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Upcoming Events</h3>
            <Calendar size={18} className="text-muted" />
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.title}
                className="rounded-xl border border-border p-3"
              >
                <h4 className="text-sm font-semibold text-foreground">
                  {event.title}
                </h4>
                <p className="mt-1 text-xs text-muted">
                  {event.date} &middot; {event.attendees} attending
                </p>
              </div>
            ))}
          </div>
          <a
            href="/dashboard/events"
            className="mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all events <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
