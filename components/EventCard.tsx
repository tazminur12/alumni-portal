"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Clock, Users, CheckCircle } from "lucide-react";
import EventRegistrationModal from "./EventRegistrationModal";

type UserData = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  batch?: string;
} | null;

interface EventCardProps {
  event: {
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
    bannerImage?: string;
  };
  user?: UserData;
  isRegistered?: boolean;
  onRegistrationSuccess?: () => void;
}

const typeColors: Record<string, string> = {
  Reunion: "bg-primary/10 text-primary",
  Seminar: "bg-blue-500/10 text-blue-600",
  Celebration: "bg-accent/10 text-accent",
  Fundraiser: "bg-pink-500/10 text-pink-600",
};

export default function EventCard({ event, user, isRegistered = false, onRegistrationSuccess }: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasDeadline = event.registrationDeadline && event.registrationDeadline.trim() !== "";
  const isDeadlinePassed = hasDeadline
    ? new Date(`${event.registrationDeadline}T23:59:59`) < new Date()
    : false;

  const canRegister =
    Boolean(event.isRegistrationOpen) &&
    !isDeadlinePassed &&
    event.status === "upcoming" &&
    !isRegistered;

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
        {event.bannerImage && (
          <div className="relative w-full overflow-hidden bg-gray-100 pb-[40%]">
            <Image
              src={event.bannerImage}
              alt={event.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        )}

        <div className="flex flex-col p-4">
          <div className="mb-2 flex items-center justify-between">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                typeColors[event.type] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              {event.type}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                event.status === "upcoming"
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-foreground sm:text-base">
            {event.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-muted grow">
            {event.description}
          </p>

          <div className="mt-2 space-y-1.5">
            <p className="flex items-center gap-2 text-xs text-muted">
              <Clock size={14} className="text-primary" />
              {event.date} • {event.time}
            </p>
            <p className="flex items-center gap-2 text-xs text-muted">
              <MapPin size={14} className="text-primary" />
              {event.location}
            </p>
            {event.expectedAttendees > 0 && (
              <p className="flex items-center gap-2 text-xs text-muted">
                <Users size={14} className="text-primary" />
                {event.expectedAttendees} Expected
              </p>
            )}
          </div>

          {canRegister && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-3 w-full rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Register for Event
            </button>
          )}
          {isRegistered && (
            <div className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
              <CheckCircle size={16} />
              Already Registered
            </div>
          )}
          {!canRegister && !isRegistered && event.isRegistrationOpen && isDeadlinePassed && (
            <button
              disabled
              className="mt-6 w-full rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-400 cursor-not-allowed"
            >
              Registration Closed
            </button>
          )}
        </div>
      </div>

      <EventRegistrationModal
        eventId={event._id}
        eventTitle={event.title}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onRegistrationSuccess={onRegistrationSuccess}
      />
    </>
  );
}
