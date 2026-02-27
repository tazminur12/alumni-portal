"use client";

import { useState, FormEvent, useEffect } from "react";
import Swal from "sweetalert2";

type UserData = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  batch?: string;
} | null;

interface EventRegistrationModalProps {
  eventId: string;
  eventTitle: string;
  isOpen: boolean;
  onClose: () => void;
  user?: UserData;
  onRegistrationSuccess?: () => void;
}

export default function EventRegistrationModal({
  eventId,
  eventTitle,
  isOpen,
  onClose,
  user,
  onRegistrationSuccess,
}: EventRegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    batch: "",
  });

  useEffect(() => {
    if (isOpen && user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        batch: user.batch || prev.batch,
      }));
    } else if (!isOpen) {
      setForm({ fullName: "", email: "", phone: "", batch: "" });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      await Swal.fire({
        icon: "success",
        title: "Registered Successfully!",
        text: "You have been registered for this event.",
        timer: 2000,
        showConfirmButton: false,
      });

      onRegistrationSuccess?.();
      onClose();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Register for {eventTitle}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-foreground">
              Full Name
            </label>
            <input
              id="fullName"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-foreground">
              Phone Number
            </label>
            <input
              id="phone"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="01XXXXXXXXX"
            />
          </div>
          <div>
            <label htmlFor="batch" className="mb-1 block text-sm font-medium text-foreground">
              Batch / Passing Year
            </label>
            <input
              id="batch"
              required
              value={form.batch}
              onChange={(e) => setForm({ ...form, batch: e.target.value })}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="e.g. 2015"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {isSubmitting ? "Registering..." : "Confirm Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}
