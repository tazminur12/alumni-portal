"use client";

import { useEffect, useState } from "react";
import EventCard from "./EventCard";

type EventData = {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  expectedAttendees: number;
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
};

interface EventsClientSectionProps {
  events: EventData[];
}

export default function EventsClientSection({ events }: EventsClientSectionProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadUserAndRegistrations = async () => {
      try {
        const [meRes, regRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/events/my-registrations"),
        ]);

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
    void loadUserAndRegistrations();
  }, []);

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">No events found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          user={user}
          isRegistered={!loading && registeredEventIds.has(event._id)}
          onRegistrationSuccess={loadUserAndRegistrations}
        />
      ))}
    </div>
  );
}
