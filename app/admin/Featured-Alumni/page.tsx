"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import { Star, Search, UserCheck, Users } from "lucide-react";

type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  batch: string;
  passingYear: string;
  collegeName: string;
  universityName: string;
  profession: string;
  phone: string;
  location: string;
  bio: string;
  profilePicture: string;
  role: string;
  status: "active" | "pending" | "suspended";
  isFeatured?: boolean;
  createdAt?: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AdminFeaturedAlumniPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to load users.");
      }
      setUsers(result.users ?? []);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Load failed",
        text: error instanceof Error ? error.message : "Could not load users.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const activeAlumni = useMemo(
    () =>
      users.filter(
        (user) => user.role === "alumni" && user.status === "active"
      ),
    [users]
  );

  const filtered = useMemo(() => {
    let list = activeAlumni;
    if (showOnlyFeatured) {
      list = list.filter((user) => user.isFeatured);
    }
    const text = query.toLowerCase().trim();
    if (!text) return list;
    return list.filter((user) => {
      return (
        user.fullName.toLowerCase().includes(text) ||
        user.email.toLowerCase().includes(text) ||
        user.batch.toLowerCase().includes(text) ||
        user.profession.toLowerCase().includes(text)
      );
    });
  }, [activeAlumni, query, showOnlyFeatured]);

  const featuredCount = useMemo(
    () => activeAlumni.filter((user) => user.isFeatured).length,
    [activeAlumni]
  );

  const handleToggleFeatured = async (user: AdminUser) => {
    setWorkingId(user.id);
    try {
      const response = await fetch(`/api/admin/users/${user.id}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !user.isFeatured }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Could not update featured status.");
      }

      await Swal.fire({
        icon: "success",
        title: user.isFeatured ? "Removed from featured" : "Marked as featured",
        timer: 1000,
        showConfirmButton: false,
      });

      await loadUsers();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text:
          error instanceof Error
            ? error.message
            : "Could not update featured status.",
      });
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 pb-6 pt-2 sm:px-4 sm:pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Featured Alumni (Home Page)
          </h2>
          <p className="mt-1 text-sm text-muted">
            Choose which active alumni will appear in the{" "}
            <span className="font-semibold">Featured Alumni</span> section on
            the public home page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs sm:text-sm">
            <Users size={16} className="text-muted" />
            <span className="font-semibold text-foreground">
              {activeAlumni.length}
            </span>
            <span className="text-muted">active alumni</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 sm:text-sm">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            Featured: {featuredCount}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-md flex-1 min-w-[220px]">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email, batch, profession..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-muted sm:text-sm">
          <input
            type="checkbox"
            checked={showOnlyFeatured}
            onChange={(event) => setShowOnlyFeatured(event.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Show only featured
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="hidden border-b border-border bg-gray-50/70 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted sm:grid sm:grid-cols-[minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,0.9fr)] sm:gap-4">
          <span>Alumni</span>
          <span>Batch &amp; Education</span>
          <span>Profession</span>
          <span className="text-right">Action</span>
        </div>

        {loading ? (
          <p className="px-4 py-6 text-sm text-muted">Loading alumni...</p>
        ) : filtered.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted">
            No matching active alumni found.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((user) => {
              const isWorking = workingId === user.id;
              const isFeatured = Boolean(user.isFeatured);

              return (
                <div
                  key={user.id}
                  className="px-4 py-3 text-sm hover:bg-gray-50/70"
                >
                  {/* Desktop layout */}
                  <div className="hidden items-center gap-4 sm:grid sm:grid-cols-[minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,0.9fr)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {user.profilePicture ? (
                          <Image
                            src={user.profilePicture}
                            alt={user.fullName}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getInitials(user.fullName)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-muted">{user.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">
                        Batch {user.batch}
                      </p>
                      <p className="text-xs text-muted">
                        {user.collegeName}
                        {user.universityName
                          ? ` • ${user.universityName}`
                          : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">
                        {user.profession || "—"}
                      </p>
                      <p className="text-xs text-muted">
                        {user.location || user.phone || ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() => void handleToggleFeatured(user)}
                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                          isFeatured
                            ? "border border-amber-200 bg-amber-50 text-amber-800"
                            : "border border-border bg-white text-foreground hover:bg-gray-50"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <Star
                          size={14}
                          className={
                            isFeatured
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted"
                          }
                        />
                        {isFeatured ? "Featured" : "Feature on home"}
                      </button>
                    </div>
                  </div>

                  {/* Mobile layout */}
                  <div className="flex flex-col gap-2 sm:hidden">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {user.profilePicture ? (
                          <Image
                            src={user.profilePicture}
                            alt={user.fullName}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getInitials(user.fullName)
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-muted">{user.email}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                        <UserCheck size={12} />
                        Active
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted">
                      <span>Batch {user.batch}</span>
                      {user.collegeName && <span>{user.collegeName}</span>}
                      {user.universityName && <span>{user.universityName}</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted">
                      {user.profession && <span>{user.profession}</span>}
                      {user.location && <span>{user.location}</span>}
                    </div>
                    <div className="mt-1 flex">
                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() => void handleToggleFeatured(user)}
                        className={`inline-flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                          isFeatured
                            ? "border border-amber-200 bg-amber-50 text-amber-800"
                            : "border border-border bg-white text-foreground hover:bg-gray-50"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <Star
                          size={14}
                          className={
                            isFeatured
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted"
                          }
                        />
                        {isFeatured ? "Remove from featured" : "Feature on home"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

