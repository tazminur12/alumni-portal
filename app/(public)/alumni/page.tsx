"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  Briefcase,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

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
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/alumni", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setAlumni(data.alumni ?? []);
        }
      } catch {
        setAlumni([]);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const filteredAlumni = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    const batch = batchFilter.trim();
    return alumni.filter((a) => {
      const matchSearch =
        !q ||
        a.fullName.toLowerCase().includes(q) ||
        a.batch.toLowerCase().includes(q) ||
        a.profession.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.collegeName.toLowerCase().includes(q) ||
        a.universityName.toLowerCase().includes(q);
      const matchBatch = !batch || a.batch === batch || a.passingYear === batch;
      return matchSearch && matchBatch;
    });
  }, [alumni, searchTerm, batchFilter]);

  const batchOptions = useMemo(() => {
    const batches = [...new Set(alumni.map((a) => a.batch).filter(Boolean))].sort();
    return batches;
  }, [alumni]);

  return (
    <>
      <section className="bg-gradient-to-br from-primary-dark to-primary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/90">
              <GraduationCap size={16} />
              Alumni Network
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Alumni Directory
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Find and connect with fellow alumni from Amtoli Model High School
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search & Filter */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search alumni by name, batch, profession, or location..."
                className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              aria-label="Filter by batch"
              className="rounded-xl border border-border bg-card px-5 py-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">All Batches</option>
              {batchOptions.map((batch) => (
                <option key={batch} value={batch}>
                  Batch {batch}
                </option>
              ))}
            </select>
          </div>

          {/* Alumni Grid */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-2xl border border-border bg-card"
                />
              ))}
            </div>
          ) : filteredAlumni.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted">
              No alumni found.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAlumni.map((a) => (
                <Link
                  key={a.id}
                  href={`/alumni/${a.id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-primary/20"
                >
                  <div className="relative flex flex-col items-center bg-gradient-to-br from-primary/5 via-transparent to-primary/5 px-6 pt-10 pb-6">
                    <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-xl ring-2 ring-primary/20 transition-transform duration-300 group-hover:scale-105">
                      {a.profilePicture ? (
                        <Image
                          src={a.profilePicture}
                          alt={a.fullName}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/15 text-2xl font-bold text-primary">
                          {getInitials(a.fullName)}
                        </div>
                      )}
                    </div>
                    <h3 className="mt-4 text-center text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                      {a.fullName}
                    </h3>
                    <span className="mt-2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white shadow-sm">
                      Batch {a.batch}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col border-t border-border bg-white px-5 py-4">
                    {a.profession && (
                      <p className="flex items-start gap-2.5 text-sm">
                        <Briefcase size={15} className="mt-0.5 shrink-0 text-primary" />
                        <span className="truncate font-medium text-foreground">
                          {a.profession}
                        </span>
                      </p>
                    )}
                    {a.location && (
                      <p className="mt-2 flex items-start gap-2.5 text-sm text-muted">
                        <MapPin size={15} className="mt-0.5 shrink-0 text-primary/70" />
                        <span className="truncate">{a.location}</span>
                      </p>
                    )}
                    {(a.collegeName || a.universityName) && (
                      <p className="mt-2 flex items-start gap-2.5 text-xs text-muted">
                        <GraduationCap size={13} className="mt-0.5 shrink-0 text-primary/70" />
                        <span className="line-clamp-1">
                          {a.universityName || a.collegeName}
                        </span>
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      View Profile
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
