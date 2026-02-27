"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Phone,
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
  phone: string;
  whatsapp: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  skills: string;
  website: string;
  currentJobTitle: string;
  company: string;
  industry: string;
  workLocation: string;
  department: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AlumniDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [alumni, setAlumni] = useState<Alumni | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/alumni/${id}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setAlumni(data.alumni);
        } else {
          setAlumni(null);
        }
      } catch {
        setAlumni(null);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <section className="bg-linear-to-br from-primary-dark to-primary py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-32 animate-pulse rounded-lg bg-white/20" />
          </div>
        </section>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="h-64 animate-pulse rounded-2xl border border-border bg-card" />
        </div>
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="min-h-screen bg-background">
        <section className="bg-linear-to-br from-primary-dark to-primary py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/alumni"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white"
            >
              <ArrowLeft size={18} />
              Back to Alumni
            </Link>
          </div>
        </section>
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <p className="text-muted">Alumni not found.</p>
          <Link
            href="/alumni"
            className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Alumni Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-linear-to-br from-primary-dark to-primary py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/alumni"
            className="inline-flex items-center gap-2 text-white/90 transition-colors hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Alumni Directory
          </Link>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            <div className="bg-linear-to-br from-primary/5 to-primary/10 px-6 py-12 sm:px-12 sm:py-16">
              <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8">
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-xl ring-2 ring-primary/20">
                  {alumni.profilePicture ? (
                    <Image
                      src={alumni.profilePicture}
                      alt={alumni.fullName}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/20 text-3xl font-bold text-primary">
                      {getInitials(alumni.fullName)}
                    </div>
                  )}
                </div>
                <div className="mt-6 flex-1 text-center sm:mt-0 sm:text-left">
                  <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                    {alumni.fullName}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <span className="rounded-full bg-primary px-4 py-1 text-sm font-semibold text-white">
                      Batch {alumni.batch}
                    </span>
                    {alumni.passingYear && (
                      <span className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-sm text-muted">
                        <Calendar size={14} />
                        Passing Year: {alumni.passingYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              {/* Professional Info */}
              {(alumni.profession ||
                alumni.currentJobTitle ||
                alumni.company ||
                alumni.industry ||
                alumni.workLocation ||
                alumni.website) && (
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
                      Professional Info
                    </h2>
                    <div className="mt-1 space-y-1 text-base text-foreground">
                      {alumni.profession && (
                        <p className="font-medium">{alumni.profession}</p>
                      )}
                      {alumni.currentJobTitle && (
                        <p>
                          <span className="font-semibold">Current Position: </span>
                          {alumni.currentJobTitle}
                        </p>
                      )}
                      {alumni.company && (
                        <p>
                          <span className="font-semibold">Company: </span>
                          {alumni.company}
                        </p>
                      )}
                      {alumni.industry && (
                        <p>
                          <span className="font-semibold">Industry: </span>
                          {alumni.industry}
                        </p>
                      )}
                      {alumni.workLocation && (
                        <p>
                          <span className="font-semibold">Work Location: </span>
                          {alumni.workLocation}
                        </p>
                      )}
                      {alumni.website && (
                        <p>
                          <span className="font-semibold">Website / Portfolio: </span>
                          <a
                            href={alumni.website.startsWith('http') ? alumni.website : `https://${alumni.website}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline"
                          >
                            {alumni.website}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Location */}
              {alumni.location && (
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
                      Location
                    </h2>
                    <p className="mt-1 text-base font-medium text-foreground">
                      {alumni.location}
                    </p>
                  </div>
                </div>
              )}

              {/* Education */}
              {(alumni.collegeName || alumni.universityName || alumni.department) && (
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
                      Education
                    </h2>
                    <div className="mt-1 space-y-1 text-base text-foreground">
                      {alumni.collegeName && (
                        <p className="font-medium">{alumni.collegeName}</p>
                      )}
                      {alumni.universityName && (
                        <p className="text-muted">{alumni.universityName}</p>
                      )}
                      {alumni.department && (
                        <p>
                          <span className="font-semibold">Department / Subject: </span>
                          {alumni.department}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact & Social */}
              {(alumni.phone ||
                alumni.whatsapp ||
                alumni.linkedin ||
                alumni.facebook ||
                alumni.instagram ||
                alumni.skills) && (
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
                      Social & Networking
                    </h2>
                    <div className="mt-1 space-y-1 text-base text-foreground">
                      {alumni.phone && (
                        <p>
                          <span className="font-semibold">Phone / WhatsApp: </span>
                          {alumni.phone}
                        </p>
                      )}
                      {alumni.whatsapp && (
                        <p>
                          <span className="font-semibold">WhatsApp: </span>
                          {alumni.whatsapp}
                        </p>
                      )}
                      {alumni.linkedin && (
                        <p>
                          <span className="font-semibold">LinkedIn: </span>
                          <a
                            href={alumni.linkedin.startsWith('http') ? alumni.linkedin : `https://${alumni.linkedin}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline"
                          >
                            {alumni.linkedin}
                          </a>
                        </p>
                      )}
                      {alumni.facebook && (
                        <p>
                          <span className="font-semibold">Facebook: </span>
                          <a
                            href={alumni.facebook.startsWith('http') ? alumni.facebook : `https://${alumni.facebook}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline"
                          >
                            {alumni.facebook}
                          </a>
                        </p>
                      )}
                      {alumni.instagram && (
                        <p>
                          <span className="font-semibold">Instagram: </span>
                          <a
                            href={alumni.instagram.startsWith('http') ? alumni.instagram : `https://${alumni.instagram}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline"
                          >
                            {alumni.instagram}
                          </a>
                        </p>
                      )}
                      {alumni.skills && (
                        <p>
                          <span className="font-semibold">Skills / Expertise: </span>
                          {alumni.skills}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* About */}
              {alumni.bio && (
                <div className="border-t border-border pt-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
                    About
                  </h2>
                  <p className="mt-2 whitespace-pre-wrap text-base leading-relaxed text-foreground">
                    {alumni.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
