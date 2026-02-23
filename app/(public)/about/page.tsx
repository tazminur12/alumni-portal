import { GraduationCap, Target, Eye, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To foster a lifelong connection among alumni, support the school's growth, and create opportunities for mutual benefit and community development.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To build the most active and supportive alumni network in the region, where every graduate feels connected and empowered.",
  },
  {
    icon: Heart,
    title: "Our Values",
    description:
      "Unity, integrity, and service. We believe in giving back to the institution that shaped our futures and supporting the next generation.",
  },
];

const milestones = [
  { year: "1975", event: "Amtoli Model High School established" },
  { year: "1990", event: "First batch of SSC examinees" },
  { year: "2005", event: "School celebrated 30th anniversary" },
  { year: "2015", event: "Alumni Association officially formed" },
  { year: "2024", event: "Alumni Portal launched online" },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-dark to-primary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/90">
              <GraduationCap size={16} />
              About Us
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Our School, Our Pride
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Amtoli Model High School has been a beacon of education in
              Shibganj, Bogura for decades. Our alumni association keeps the
              spirit alive.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {values.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-8 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-bold text-foreground">
            School Milestones
          </h2>

          <div className="relative border-l-2 border-primary/20 pl-8">
            {milestones.map((m) => (
              <div key={m.year} className="relative mb-10 last:mb-0">
                <div className="absolute -left-10.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-white">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <span className="text-sm font-bold text-primary">
                  {m.year}
                </span>
                <p className="mt-1 text-foreground">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
