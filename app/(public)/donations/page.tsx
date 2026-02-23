import { Heart, Users, TrendingUp, ArrowRight, Gift } from "lucide-react";

const campaigns = [
  {
    title: "School Library Renovation",
    description:
      "Help us modernize the school library with new books, computers, and a digital reading room for students.",
    raised: 125000,
    goal: 300000,
    donors: 45,
    image: "📚",
  },
  {
    title: "Student Scholarship Fund",
    description:
      "Support meritorious students from underprivileged backgrounds who need financial assistance to continue their studies.",
    raised: 89000,
    goal: 200000,
    donors: 67,
    image: "🎓",
  },
  {
    title: "Computer Lab Setup",
    description:
      "Setting up a modern computer lab with 30 workstations, high-speed internet, and software for the students.",
    raised: 210000,
    goal: 500000,
    donors: 82,
    image: "💻",
  },
  {
    title: "Sports Equipment Fund",
    description:
      "Upgrade the school playground and purchase new sports equipment for cricket, football, and athletics.",
    raised: 55000,
    goal: 150000,
    donors: 38,
    image: "⚽",
  },
  {
    title: "Science Lab Modernization",
    description:
      "Equip the physics, chemistry, and biology labs with modern instruments and safety gear for hands-on learning.",
    raised: 178000,
    goal: 400000,
    donors: 56,
    image: "🔬",
  },
  {
    title: "School Bus Fund",
    description:
      "Raise funds to purchase a school bus for students commuting from distant villages around Amtoli.",
    raised: 320000,
    goal: 800000,
    donors: 104,
    image: "🚌",
  },
];

const stats = [
  { label: "Total Raised", value: "৳9,77,000+", icon: TrendingUp },
  { label: "Total Donors", value: "392+", icon: Users },
  { label: "Active Campaigns", value: "6", icon: Gift },
];

export default function DonationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-dark to-primary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/90">
              <Heart size={16} />
              Give Back to Your School
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Donations
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Your contribution helps build a better future for the students of
              Amtoli Model High School. Every taka makes a difference.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

      {/* Campaigns */}
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Active Campaigns
            </h2>
            <p className="mt-2 text-muted">
              Choose a cause and make your contribution today
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => {
              const pct = Math.round(
                (campaign.raised / campaign.goal) * 100
              );
              return (
                <div
                  key={campaign.title}
                  className="group rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-36 items-center justify-center rounded-t-2xl bg-gradient-to-br from-primary/5 to-primary/10 text-5xl">
                    {campaign.image}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground">
                      {campaign.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {campaign.description}
                    </p>

                    <div className="mt-4">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-semibold text-primary">
                          ৳{campaign.raised.toLocaleString()}
                        </span>
                        <span className="text-muted">
                          of ৳{campaign.goal.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-xs text-muted">
                        <span>{pct}% raised</span>
                        <span>{campaign.donors} donors</span>
                      </div>
                    </div>

                    <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
                      Donate Now
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Heart size={40} className="mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Every Contribution Matters
          </h2>
          <p className="mt-4 text-lg text-muted">
            Whether it&apos;s ৳100 or ৳10,000 — your donation directly
            supports the growth and development of Amtoli Model High School.
            Together we can make a lasting impact.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-primary-dark"
            >
              Join & Donate
              <ArrowRight size={16} />
            </a>
            <a
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-gray-50"
            >
              Learn More About Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
