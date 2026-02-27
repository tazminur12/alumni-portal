"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Search, Calendar, User, Mail, Phone, GraduationCap } from "lucide-react";

type RegistrationItem = {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  fullName: string;
  email: string;
  phone: string;
  batch: string;
  registeredAt: string;
};

export default function AdminEventRegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadRegistrations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/event-registrations", {
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to load registrations.");
      }
      setRegistrations(result.registrations ?? []);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Load failed",
        text:
          error instanceof Error ? error.message : "Could not load registrations.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRegistrations();
  }, []);

  const filteredRegistrations = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return registrations;
    return registrations.filter(
      (r) =>
        r.fullName.toLowerCase().includes(query) ||
        r.email.toLowerCase().includes(query) ||
        r.phone.includes(query) ||
        r.batch.toLowerCase().includes(query) ||
        r.eventTitle.toLowerCase().includes(query)
    );
  }, [registrations, searchTerm]);

  const registrationsByEvent = useMemo(() => {
    const groups = new Map<
      string,
      { event: RegistrationItem; registrants: RegistrationItem[] }
    >();
    for (const reg of filteredRegistrations) {
      const key = reg.eventId;
      const existing = groups.get(key);
      const eventInfo = {
        eventTitle: reg.eventTitle,
        eventDate: reg.eventDate,
        eventTime: reg.eventTime,
        eventLocation: reg.eventLocation,
      };
      if (existing) {
        existing.registrants.push(reg);
      } else {
        groups.set(key, {
          event: { ...reg, ...eventInfo },
          registrants: [reg],
        });
      }
    }
    return Array.from(groups.values());
  }, [filteredRegistrations]);

  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return "—";
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Event Registrations
        </h2>
        <p className="text-sm text-muted">
          List of all alumni who registered for events
        </p>
      </div>

      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder="Search by name, email, phone, batch or event..."
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted">
          Loading registrations...
        </div>
      ) : registrationsByEvent.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted">
          No registrations found.
        </div>
      ) : (
        <div className="space-y-6">
          {registrationsByEvent.map(({ event, registrants }) => (
            <div
              key={event.eventId}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="border-b border-border bg-gray-50/50 px-5 py-4">
                <h3 className="text-base font-semibold text-foreground">
                  {event.eventTitle}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {event.eventDate} • {event.eventTime}
                  </span>
                  {event.eventLocation && (
                    <span>{event.eventLocation}</span>
                  )}
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {registrants.length} registrant{registrants.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-gray-50/30">
                      <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                        Registrant
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                        Email
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                        Phone
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                        Batch
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                        Registered At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {registrants.map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <User size={16} />
                            </div>
                            <p className="text-sm font-medium text-foreground">
                              {reg.fullName}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="flex items-center gap-1 text-sm text-muted">
                            <Mail size={12} />
                            {reg.email}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-muted">
                          <span className="flex items-center gap-1">
                            <Phone size={12} />
                            {reg.phone}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-muted">
                          <span className="flex items-center gap-1">
                            <GraduationCap size={12} />
                            {reg.batch}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-muted">
                          {formatDate(reg.registeredAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
