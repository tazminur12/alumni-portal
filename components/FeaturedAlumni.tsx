import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, GraduationCap } from "lucide-react";

type FeaturedAlumniItem = {
  _id: unknown;
  fullName: string;
  batch: string;
  profession?: string;
  profilePicture?: string;
  location?: string;
  collegeName?: string;
  universityName?: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface FeaturedAlumniProps {
  featuredAlumni: FeaturedAlumniItem[];
}

export default function FeaturedAlumni({ featuredAlumni }: FeaturedAlumniProps) {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground">Featured Alumni</h2>
          <p className="mt-2 text-muted">
            Celebrating the achievements of our proud alumni
          </p>
        </div>

        {featuredAlumni.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredAlumni.map((alumni) => (
                <Link
                  key={String(alumni._id)}
                  href={`/alumni/${String(alumni._id)}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-primary/20"
                >
                  <div className="relative flex flex-col items-center bg-linear-to-br from-primary/5 via-transparent to-primary/5 px-6 pt-8 pb-5">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-xl ring-2 ring-primary/20 transition-transform duration-300 group-hover:scale-105">
                      {alumni.profilePicture ? (
                        <Image
                          src={alumni.profilePicture}
                          alt={alumni.fullName}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/15 text-2xl font-bold text-primary">
                          {getInitials(alumni.fullName)}
                        </div>
                      )}
                    </div>
                    <h3 className="mt-4 text-center text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                      {alumni.fullName}
                    </h3>
                    <span className="mt-2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white shadow-sm">
                      Batch {alumni.batch}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col border-t border-border bg-white px-5 py-4">
                    {/* Show university/college instead of job */}
                    {alumni.location && (
                      <p className="mt-2 flex items-start gap-2.5 text-sm text-muted">
                        <MapPin size={15} className="mt-0.5 shrink-0 text-primary/70" />
                        <span className="truncate">{alumni.location}</span>
                      </p>
                    )}
                    {(alumni.collegeName || alumni.universityName) && (
                      <p className="mt-2 flex items-start gap-2.5 text-xs text-muted">
                        <GraduationCap
                          size={13}
                          className="mt-0.5 shrink-0 text-primary/70"
                        />
                        <span className="line-clamp-1">
                          {alumni.universityName || alumni.collegeName}
                        </span>
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      View Profile
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/alumni"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                View All Alumni
                <ArrowRight size={14} />
              </Link>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted">
            No alumni yet. Be the first to register!
          </div>
        )}
      </div>
    </section>
  );
}

