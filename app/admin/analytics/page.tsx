import {
  Users,
  Calendar,
  Heart,
  FileText,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const overviewStats = [
  { label: "Total Alumni", value: "2,543", icon: Users, color: "bg-primary/10 text-primary", trend: "+12% from last year" },
  { label: "Active Events", value: "8", icon: Calendar, color: "bg-blue-500/10 text-blue-600", trend: "+3 this month" },
  { label: "Total Donations", value: "৳12,45,000", icon: Heart, color: "bg-pink-500/10 text-pink-600", trend: "+18% from last year" },
  { label: "Published Posts", value: "867", icon: FileText, color: "bg-purple-500/10 text-purple-600", trend: "+45 this month" },
];

const batchDistribution = [
  { batch: "2000-2005", count: 320 },
  { batch: "2006-2010", count: 480 },
  { batch: "2011-2015", count: 620 },
  { batch: "2016-2020", count: 750 },
  { batch: "2021-2025", count: 373 },
];

const monthlyActivity = [
  { month: "Sep", registrations: 18, donations: 12 },
  { month: "Oct", registrations: 25, donations: 15 },
  { month: "Nov", registrations: 22, donations: 20 },
  { month: "Dec", registrations: 30, donations: 25 },
  { month: "Jan", registrations: 35, donations: 28 },
  { month: "Feb", registrations: 28, donations: 22 },
];

const maxReg = Math.max(...monthlyActivity.map((m) => m.registrations));

export default function AdminAnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
        <p className="text-sm text-muted">
          Insights and statistics for the alumni portal
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon size={22} />
              </div>
              <TrendingUp size={14} className="text-green-500" />
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-1 text-xs text-primary">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Batch Distribution */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              Alumni by Batch Range
            </h3>
            <BarChart3 size={18} className="text-muted" />
          </div>
          <div className="space-y-4">
            {batchDistribution.map((item) => {
              const pct = Math.round((item.count / 750) * 100);
              return (
                <div key={item.batch}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {item.batch}
                    </span>
                    <span className="text-muted">{item.count} alumni</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Activity */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Monthly Activity</h3>
            <TrendingUp size={18} className="text-muted" />
          </div>
          <div className="flex h-52 items-end gap-3">
            {monthlyActivity.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold text-primary">
                    {m.registrations}
                  </span>
                  <div
                    className="w-full rounded-t-md bg-primary/80"
                    style={{
                      height: `${(m.registrations / maxReg) * 140}px`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-muted">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-primary/80" />
              Registrations
            </span>
          </div>
        </div>
      </div>

      {/* Top Donors */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 font-semibold text-foreground">Top Donors</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Anonymous", amount: "৳15,000", batch: "-" },
            { name: "Kamal Hossain", amount: "৳10,000", batch: "2010" },
            { name: "Mizanur Rahman", amount: "৳7,500", batch: "2003" },
            { name: "Rafiq Ahmed", amount: "৳5,000", batch: "2005" },
          ].map((donor, i) => (
            <div
              key={donor.name}
              className="flex items-center gap-3 rounded-xl border border-border p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                #{i + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {donor.name}
                </p>
                <p className="text-xs text-primary">{donor.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
