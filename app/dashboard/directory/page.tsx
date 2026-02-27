"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, MapPin, Briefcase, GraduationCap, ArrowRight } from "lucide-react";

type Alumni = {
  id: string;
  fullName: string;
  batch: string;
  passingYear: string;
  profession: string;
  location: string;
  profilePicture: string;
  collegeName: string;
  universityName: string;
  bio: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function DirectoryPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/alumni", { cache: "no-store" });
        const data = await res.json();
        if (res.ok) {
          setAlumni(data.alumni ?? []);
        } else {
          setAlumni([]);
        }
      } catch {
        setAlumni([]);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const batchOptions = useMemo(() => {
    return [...new Set(alumni.map((a) => a.batch).filter(Boolean))].sort();
  }, [alumni]);

  const filteredAlumni = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    const batch = batchFilter.trim();
    return alumni.filter((a) => {
      const matchSearch =
        !q ||
        a.fullName.toLowerCase().includes(q) ||
        a.batch.toLowerCase().includes(q) ||
        a.passingYear.toLowerCase().includes(q) ||
        a.profession.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q);
      const matchBatch = !batch || a.batch === batch;
      return matchSearch && matchBatch;
    });
  }, [alumni, searchTerm, batchFilter]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Alumni Directory
          </h2>
          <p className="text-sm text-muted">
            Browse and connect with fellow alumni
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, batch, profession, or location..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={batchFilter}
          onChange={(event) => setBatchFilter(event.target.value)}
          aria-label="Filter by batch"
          className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground outline-none focus:border-primary"
        >
          <option value="">All Batches</option>
          {batchOptions.map((batch) => (
            <option key={batch} value={batch}>
              Batch {batch}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl border border-border bg-card"
            />
          ))
        ) : filteredAlumni.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted sm:col-span-2 lg:col-span-3">
            No alumni found.
          </div>
        ) : (
          filteredAlumni.map((person) => (
            <Link
              key={person.id}
              href={`/alumni/${person.id}`}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-primary/10">
                {person.profilePicture ? (
                  <Image
                    src={person.profilePicture}
                    alt={person.fullName}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-bold text-primary">
                    {getInitials(person.fullName)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary">
                  {person.fullName}
                </h3>
                <p className="text-xs font-medium text-primary">
                  Batch {person.batch} {person.passingYear ? `• ${person.passingYear}` : ""}
                </p>
                <div className="mt-2 space-y-1">
                  {person.profession ? (
                    <p className="flex items-center gap-1.5 text-xs text-muted">
                      <Briefcase size={11} />
                      {person.profession}
                    </p>
                  ) : null}
                  {person.location ? (
                    <p className="flex items-center gap-1.5 text-xs text-muted">
                      <MapPin size={11} />
                      {person.location}
                    </p>
                  ) : null}
                  {person.collegeName || person.universityName ? (
                    <p className="flex items-center gap-1.5 text-xs text-muted">
                      <GraduationCap size={11} />
                      <span className="truncate">
                        {person.universityName || person.collegeName}
                      </span>
                    </p>
                  ) : null}
                </div>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  View details
                  <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
