"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, MapPin, Clock, Users, Filter } from "lucide-react";
import EventRegistrationModal from "@/components/EventRegistrationModal";

type EventData = {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  expectedAttendees: number;
  registeredAttendees: number;
  type: string;
  description: string;
  status: string;
  isRegistrationOpen: boolean;
  registrationDeadline?: string;
};

type UserData = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  batch?: string;
} | null;

export default function DashboardEventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData>(null);
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsRes, meRes, regRes] = await Promise.all([
        fetch("/api/events", { cache: "no-store" }),
        fetch("/api/auth/me"),
        fetch("/api/events/my-registrations"),
      ]);

      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEvents(data.events ?? []);
      }

      if (meRes.ok) {
        const meData = await meRes.json();
        setUser(meData.user);
      }

      if (regRes.ok) {
        const regData = await regRes.json();
        setRegisteredEventIds(new Set(regData.eventIds ?? []));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredEvents = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return events;
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        e.type.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query)
    );
  }, [events, searchTerm]);

  const hasDeadline = (e: EventData) =>
    e.registrationDeadline && e.registrationDeadline.trim() !== "";
  const isDeadlinePassed = (e: EventData) =>
    hasDeadline(e)
      ? new Date(`${e.registrationDeadline}T23:59:59`) < new Date()
      : false;

  const canRegister = (e: EventData, isRegistered: boolean) =>
    Boolean(e.isRegistrationOpen) &&
    !isDeadlinePassed(e) &&
    e.status === "upcoming" &&
    !isRegistered;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Events</h2>
          <p className="text-sm text-muted">Browse and register for events</p>
        </div>
        <div className="relative max-w-xs">
          <Filter
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events..."
            className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-sm text-muted">
          Loading events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-sm text-muted">
          No events found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredEvents.map((event) => {
            const isRegistered = registeredEventIds.has(event._id);
            const showRegister = canRegister(event, isRegistered);
            return (
              <div
                key={event._id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {event.type}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isRegistered
                        ? "bg-green-50 text-green-600"
                        : showRegister
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isRegistered ? "Registered" : showRegister ? "Open" : "Closed"}
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
                    {event.registeredAttendees} / {event.expectedAttendees} attendees
                  </p>
                </div>

                <button
                  onClick={() => showRegister && setSelectedEvent(event)}
                  disabled={isRegistered || !showRegister}
                  className={`mt-4 w-full rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                    isRegistered || !showRegister
                      ? "cursor-not-allowed border border-border bg-gray-50 text-muted"
                      : "bg-primary text-white hover:bg-primary-dark"
                  }`}
                >
                  {isRegistered ? "Already Registered" : showRegister ? "Register Now" : "Registration Closed"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {selectedEvent && (
        <EventRegistrationModal
          eventId={selectedEvent._id}
          eventTitle={selectedEvent.title}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          user={user}
          onRegistrationSuccess={loadData}
        />
      )}
    </div>
  );
}
