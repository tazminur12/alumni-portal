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
import Slideshow from "@/models/Slideshow";
import FeaturedAlumni from "@/components/FeaturedAlumni";
import HeroSlideshow from "@/components/HeroSlideshow";

const fallbackHeroImage =
  process.env.NEXT_PUBLIC_HERO_IMAGE === ""
    ? ""
    : (process.env.NEXT_PUBLIC_HERO_IMAGE || "/Hero.jpg");

export default async function HomePage() {
  await connectDb();

  const [
    currentUser,
    alumniCount,
    batches,
    eventsCount,
    featuredAlumni,
    upcomingEvents,
    slideshowSlides,
  ] = await Promise.all([
    getCurrentUser(),
    User.countDocuments({ status: "active", role: "alumni" }),
    User.distinct("batch", { status: "active", role: "alumni" }),
    Event.countDocuments(),
    User.find({ status: "active", role: "alumni", isFeatured: true })
      .select("fullName batch profilePicture location collegeName universityName")
      .sort({ createdAt: -1 })
      .limit(4)
      .lean(),
    Event.find({ status: "upcoming" })
      .select("title date time location type bannerImage")
      .sort({ date: 1 })
      .limit(3)
      .lean(),
    Slideshow.find().sort({ order: 1, createdAt: 1 }).lean(),
  ]);

  const slides = slideshowSlides.map((s) => ({
    id: String(s._id),
    imageUrl: s.imageUrl,
    caption: s.caption || "",
  }));
  const heroImage = slides.length > 0 ? null : fallbackHeroImage;

  const totalBatches = batches.filter(Boolean).length;
  const stats = [
    { label: "Total Alumni", value: String(alumniCount), icon: Users },
    { label: "Batches", value: String(totalBatches), icon: GraduationCap },
    { label: "Events", value: String(eventsCount), icon: Calendar },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-dark via-primary to-primary-light">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div
            className={
              heroImage || slides.length > 0
                ? "flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
                : "mx-auto max-w-3xl text-center"
            }
          >
            <div
            className={
              heroImage || slides.length > 0
                ? "flex-1 text-center lg:text-left"
                : "mx-auto max-w-3xl text-center"
            }
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
                <GraduationCap size={16} />
                Amtoli Model High School, Shibganj, Bogura
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Welcome to Our{" "}
                <span className="text-accent-light">Alumni Portal</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/80 sm:text-xl">
                Reconnect with classmates, share memories, and stay updated with
                school events. Join a growing network of alumni building the
                future together.
              </p>
              {!currentUser && (
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
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
            {slides.length > 0 ? (
              <HeroSlideshow slides={slides} />
            ) : heroImage ? (
              <div className="relative my-8 h-96 w-full shrink-0 overflow-hidden sm:my-10 sm:h-104 lg:my-12 lg:h-128 lg:w-xl lg:max-w-none">
                <Image
                  src={heroImage}
                  alt="Alumni Portal"
                  fill
                  sizes="(min-width: 1024px) 576px, (min-width: 640px) 100vw, 100vw"
                  className="object-contain object-center"
                  priority
                />
              </div>
            ) : null}
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
      <FeaturedAlumni featuredAlumni={featuredAlumni} />

      {/* Upcoming Events */}
      <section className="border-t border-border bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Upcoming Events
              </h2>
              <p className="mt-2 text-muted">
                Join the next few programs happening soon
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-gray-50"
            >
              View all events
              <ArrowRight size={14} />
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <Link
                    key={String(event._id)}
                    href="/events"
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                  >
                    {event.bannerImage && (
                      <div className="relative w-full overflow-hidden bg-gray-100 pb-[56.25%]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={event.bannerImage}
                          alt={event.title}
                          className="absolute inset-0 h-full w-full object-cover object-center"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                          {event.type || "Event"}
                        </span>
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          Upcoming
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground sm:text-lg">
                        {event.title}
                      </h3>
                      <div className="mt-3 space-y-2 text-sm text-muted">
                        <p className="flex items-center gap-2">
                          <Clock size={14} className="text-primary" />
                          <span>
                            {event.date}
                            {event.time ? ` • ${event.time}` : ""}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin size={14} className="text-primary" />
                          <span className="truncate">{event.location}</span>
                        </p>
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                        View event details
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
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
