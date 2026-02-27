"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Plus, Search, Calendar, Pencil, Trash2 } from "lucide-react";

type EventStatus = "upcoming" | "draft" | "completed";

type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  expectedAttendees: number;
  status: EventStatus;
  isRegistrationOpen: boolean;
  registrationDeadline?: string;
  registeredAttendees?: number;
  bannerImage?: string;
  createdAt: string;
};

const emptyForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  type: "",
  expectedAttendees: "0",
  status: "draft" as EventStatus,
  isRegistrationOpen: false,
  registrationDeadline: "",
  bannerImage: "",
};

const statusColors: Record<EventStatus, string> = {
  upcoming: "bg-green-50 text-green-600",
  draft: "bg-gray-100 text-gray-600",
  completed: "bg-blue-50 text-blue-600",
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const uploadEventBanner = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary environment variables are missing.");
    }

    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body,
      }
    );

    const result = await response.json();
    if (!response.ok || !result.secure_url) {
      throw new Error("Upload failed.");
    }

    return String(result.secure_url);
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/events", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to load events.");
      }
      setEvents(result.events ?? []);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Load failed",
        text: error instanceof Error ? error.message : "Could not load events.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return events;
    return events.filter((event) => {
      return (
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.type.toLowerCase().includes(query)
      );
    });
  }, [events, searchTerm]);

  const openCreateModal = () => {
    setEditingEvent(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (event: EventItem) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      expectedAttendees: String(event.expectedAttendees),
      status: event.status,
      isRegistrationOpen: event.isRegistrationOpen || false,
      registrationDeadline: event.registrationDeadline || "",
      bannerImage: event.bannerImage || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        expectedAttendees: Number(form.expectedAttendees),
        isRegistrationOpen: Boolean(form.isRegistrationOpen),
      };

      const endpoint = editingEvent
        ? `/api/admin/events/${editingEvent.id}`
        : "/api/admin/events";
      const method = editingEvent ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Request failed.");
      }

      await Swal.fire({
        icon: "success",
        title: editingEvent ? "Event updated" : "Event created",
        timer: 1200,
        showConfirmButton: false,
      });

      closeModal();
      await loadEvents();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Save failed",
        text: error instanceof Error ? error.message : "Could not save event.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (eventItem: EventItem) => {
    const confirmation = await Swal.fire({
      icon: "warning",
      title: "Delete event?",
      text: `Are you sure you want to delete "${eventItem.title}"?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });

    if (!confirmation.isConfirmed) return;

    try {
      const response = await fetch(`/api/admin/events/${eventItem.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to delete event.");
      }

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1000,
        showConfirmButton: false,
      });
      await loadEvents();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        text:
          error instanceof Error ? error.message : "Could not delete this event.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Event Management</h2>
          <p className="text-sm text-muted">
            Create, edit and delete alumni events
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
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
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
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
                  Registration
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
              {loading ? (
                <tr>
                  <td className="px-5 py-6 text-center text-sm text-muted" colSpan={7}>
                    Loading events...
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-center text-sm text-muted" colSpan={7}>
                    No events found.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Calendar size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {event.title}
                          </p>
                          <p className="text-xs text-muted">{event.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted">
                      {event.date} • {event.time}
                    </td>
                    <td className="px-5 py-3 text-sm text-muted">{event.location}</td>
                    <td className="px-5 py-3 text-sm text-muted">
                      {event.registeredAttendees || 0} / {event.expectedAttendees}
                    </td>
                    <td className="px-5 py-3">
                      {event.isRegistrationOpen ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                          Open
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                          Closed
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[event.status]}`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(event)}
                          className="rounded-lg p-1.5 text-muted hover:bg-gray-100"
                          aria-label="Edit event"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(event)}
                          className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                          aria-label="Delete event"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {editingEvent ? "Edit Event" : "Create Event"}
              </h3>
              <button
                onClick={closeModal}
                className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
              <input
                required
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="Event title"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary sm:col-span-2"
              />
              <textarea
                required
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                placeholder="Event description"
                rows={4}
                className="resize-none rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary sm:col-span-2"
              />
              <label htmlFor="event-date" className="sr-only">
                Event date
              </label>
              <input
                id="event-date"
                required
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, date: event.target.value }))
                }
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                required
                value={form.time}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, time: event.target.value }))
                }
                placeholder="Time (e.g. 10:00 AM - 5:00 PM)"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                required
                value={form.location}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, location: event.target.value }))
                }
                placeholder="Location"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                required
                value={form.type}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, type: event.target.value }))
                }
                placeholder="Type (Reunion/Seminar/etc)"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                value={form.bannerImage}
                disabled
                placeholder="Event banner image will be uploaded"
                className="rounded-xl border border-border bg-gray-50 px-3 py-2 text-sm text-muted outline-none sm:col-span-2"
              />
              <div className="sm:col-span-2">
                <label className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm cursor-pointer">
                  <span className="font-medium text-foreground">
                    Upload event banner image
                  </span>
                  <span className="text-xs text-muted">
                    {isImageUploading ? "Uploading..." : "Choose file"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setIsImageUploading(true);
                      try {
                        const url = await uploadEventBanner(file);
                        setForm((prev) => ({ ...prev, bannerImage: url }));
                        await Swal.fire({
                          icon: "success",
                          title: "Banner uploaded",
                          timer: 1000,
                          showConfirmButton: false,
                        });
                      } catch (error) {
                        await Swal.fire({
                          icon: "error",
                          title: "Upload failed",
                          text:
                            error instanceof Error
                              ? error.message
                              : "Could not upload image.",
                        });
                      } finally {
                        setIsImageUploading(false);
                        event.target.value = "";
                      }
                    }}
                    disabled={isImageUploading}
                  />
                </label>
                {form.bannerImage ? (
                  <p className="mt-2 text-xs text-muted">
                    Uploaded: {form.bannerImage}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-muted">
                    No banner uploaded yet (optional).
                  </p>
                )}
              </div>
              <input
                required
                type="number"
                min={0}
                value={form.expectedAttendees}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    expectedAttendees: event.target.value,
                  }))
                }
                placeholder="Expected attendees"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <select
                aria-label="Event status"
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value as EventStatus,
                  }))
                }
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="upcoming">Upcoming</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
              </select>

              <div className="flex flex-col gap-1 sm:col-span-2 mt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isRegistrationOpen"
                    checked={form.isRegistrationOpen}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        isRegistrationOpen: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isRegistrationOpen" className="text-sm font-medium text-foreground">
                    Enable Registration
                  </label>
                </div>
                {form.isRegistrationOpen && (
                  <p className="text-xs text-muted">
                    Set status to &quot;Upcoming&quot; for the Register button to appear on the public events page.
                  </p>
                )}
              </div>

              {form.isRegistrationOpen && (
                <div className="sm:col-span-2">
                  <label htmlFor="registrationDeadline" className="mb-1 block text-xs font-medium text-muted">
                    Registration Deadline
                  </label>
                  <input
                    id="registrationDeadline"
                    type="date"
                    value={form.registrationDeadline}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        registrationDeadline: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              )}

              <div className="sm:col-span-2 mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingEvent
                      ? "Update Event"
                      : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
