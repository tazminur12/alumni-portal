"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Calendar,
  Heart,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";

type AlumniListItem = {
  id: string;
};

type EventItem = {
  _id: string;
  title: string;
  date: string;
  expectedAttendees: number;
  registeredAttendees: number;
  status: "upcoming" | "completed" | "draft";
};

type DonationItem = {
  id: string;
  campaign: string;
  amount: number;
  donationDate: string;
  createdAt: string;
};

type ActivityItem = {
  text: string;
  time: string;
};

function formatBDT(amount: number) {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `৳${Math.round(safe).toLocaleString()}`;
}

function parseEventDate(dateText: string) {
  const ts = Date.parse(dateText);
  return Number.isFinite(ts) ? ts : Number.POSITIVE_INFINITY;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [alumniCount, setAlumniCount] = useState(0);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [donationTotal, setDonationTotal] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [alumniRes, eventsRes, regRes, donationsRes] = await Promise.all([
          fetch("/api/alumni", { cache: "no-store" }),
          fetch("/api/events", { cache: "no-store" }),
          fetch("/api/events/my-registrations", { cache: "no-store" }),
          fetch("/api/donations/me", { cache: "no-store" }),
        ]);

        const [alumniJson, eventsJson, regJson, donationsJson] =
          await Promise.all([
            alumniRes.json().catch(() => null),
            eventsRes.json().catch(() => null),
            regRes.json().catch(() => null),
            donationsRes.json().catch(() => null),
          ]);

        const alumniList = (alumniJson?.alumni ?? []) as AlumniListItem[];
        setAlumniCount(Array.isArray(alumniList) ? alumniList.length : 0);

        const eventList = (eventsJson?.events ?? []) as EventItem[];
        setEvents(Array.isArray(eventList) ? eventList : []);

        const eventIds = (regJson?.eventIds ?? []) as string[];
        setRegisteredEventIds(Array.isArray(eventIds) ? eventIds : []);

        const donationList = (donationsJson?.donations ?? []) as DonationItem[];
        setDonations(Array.isArray(donationList) ? donationList : []);
        setDonationTotal(Number(donationsJson?.totalAmount ?? 0));
      } catch {
        setAlumniCount(0);
        setEvents([]);
        setRegisteredEventIds([]);
        setDonations([]);
        setDonationTotal(0);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const upcomingEvents = useMemo(() => {
    return events
      .filter((e) => e.status === "upcoming")
      .sort((a, b) => parseEventDate(a.date) - parseEventDate(b.date))
      .slice(0, 3);
  }, [events]);

  const recentActivity = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];

    for (const d of donations.slice(0, 3)) {
      items.push({
        text: `You donated ${formatBDT(Number(d.amount ?? 0))} to ${d.campaign}.`,
        time: d.donationDate || new Date(d.createdAt).toLocaleDateString(),
      });
    }

    const eventTitleById = new Map(events.map((e) => [String(e._id), e.title]));
    const registeredTitles = registeredEventIds
      .map((id) => eventTitleById.get(String(id)))
      .filter(Boolean) as string[];

    for (const title of registeredTitles.slice(0, 2)) {
      items.push({
        text: `You registered for ${title}.`,
        time: "Recently",
      });
    }

    if (items.length === 0) {
      items.push({
        text: "No recent activity yet.",
        time: "—",
      });
    }

    return items.slice(0, 5);
  }, [donations, events, registeredEventIds]);

  const statsCards = useMemo(() => {
    return [
      {
        label: "Total Alumni",
        value: String(alumniCount),
        icon: Users,
        color: "bg-primary/10 text-primary",
      },
      {
        label: "Total Events",
        value: String(events.length),
        icon: Calendar,
        color: "bg-blue-500/10 text-blue-600",
      },
      {
        label: "Your Registrations",
        value: String(registeredEventIds.length),
        icon: Clock,
        color: "bg-amber-500/10 text-amber-700",
      },
      {
        label: "Your Donations",
        value: formatBDT(donationTotal),
        icon: Heart,
        color: "bg-pink-500/10 text-pink-600",
      },
    ] as const;
  }, [alumniCount, events.length, registeredEventIds.length, donationTotal]);

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
                  {loading ? "—" : stat.value}
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
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-xl border border-border bg-white"
                  />
                ))}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="rounded-xl border border-border p-3 text-sm text-muted">
                No upcoming events.
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="rounded-xl border border-border p-3"
                >
                  <h4 className="text-sm font-semibold text-foreground">
                    {event.title}
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    {event.date}
                    {typeof event.registeredAttendees === "number"
                      ? ` · ${event.registeredAttendees} registered`
                      : ""}
                  </p>
                </div>
              ))
            )}
          </div>
          <Link
            href="/dashboard/events"
            className="mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all events <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
