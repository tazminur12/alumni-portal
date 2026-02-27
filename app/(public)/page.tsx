import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Users,
  Calendar,
  ArrowRight,
  MapPin,
  Clock,
} from "lucide-react";
import { connectDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";
import User from "@/models/User";
import Event from "@/models/Event";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function HomePage() {
  await connectDb();

  const [currentUser, alumniCount, batches, eventsCount, featuredAlumni, upcomingEvents] =
    await Promise.all([
      getCurrentUser(),
      User.countDocuments({ status: "active", role: "alumni" }),
      User.distinct("batch", { status: "active", role: "alumni" }),
      Event.countDocuments(),
      User.find({ status: "active", role: "alumni" })
        .select("fullName batch profession profilePicture")
        .sort({ createdAt: -1 })
        .limit(4)
        .lean(),
      Event.find({ status: "upcoming" })
        .select("title date time location type")
        .sort({ date: 1 })
        .limit(3)
        .lean(),
    ]);

  const totalBatches = batches.filter(Boolean).length;
  const stats = [
    { label: "Total Alumni", value: String(alumniCount), icon: Users },
    { label: "Batches", value: String(totalBatches), icon: GraduationCap },
    { label: "Events", value: String(eventsCount), icon: Calendar },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
              <GraduationCap size={16} />
              Amtoli Model High School, Shibganj, Bogura
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Welcome to Our{" "}
              <span className="text-accent-light">Alumni Portal</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/80 sm:text-xl">
              Reconnect with classmates, share memories, and stay updated with
              school events. Join a growing network of alumni building the
              future together.
            </p>
            {!currentUser && (
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-amber-600"
                >
                  Join Alumni Network
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/alumni"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  Browse Alumni
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path
              d="M0 60V20C240 0 480 0 720 20C960 40 1200 40 1440 20V60H0Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Highlights */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Featured Alumni
            </h2>
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
                    className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xl font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      {alumni.profilePicture ? (
                        <Image
                          src={alumni.profilePicture}
                          alt={alumni.fullName}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getInitials(alumni.fullName)
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {alumni.fullName}
                    </h3>
                    <p className="text-sm text-primary">Batch {alumni.batch}</p>
                    <p className="mt-1 text-sm text-muted">
                      {alumni.profession || "—"}
                    </p>
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

      {/* Upcoming Events */}
      <section className="border-t border-border bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Upcoming Events
            </h2>
            <p className="mt-2 text-muted">
              Join us at these exciting upcoming events
            </p>
          </div>

          {upcomingEvents.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <Link
                    key={String(event._id)}
                    href="/events"
                    className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <span className="mb-3 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                      {event.type || "Event"}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground">
                      {event.title}
                    </h3>
                    <div className="mt-3 space-y-2">
                      <p className="flex items-center gap-2 text-sm text-muted">
                        <Clock size={14} />
                        {event.date}
                        {event.time ? ` • ${event.time}` : ""}
                      </p>
                      <p className="flex items-center gap-2 text-sm text-muted">
                        <MapPin size={14} />
                        {event.location}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  View All Events
                  <ArrowRight size={14} />
                </Link>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted">
              No upcoming events at the moment.
            </div>
          )}
        </div>
      </section>

      {!currentUser && (
        <section className="bg-primary-dark py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Are You an Alumnus?
            </h2>
            <p className="mt-4 text-lg text-white/70">
              Register today and reconnect with your school community. Share your
              journey, mentor juniors, and contribute to building a stronger
              network.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
            >
              Register Now
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
