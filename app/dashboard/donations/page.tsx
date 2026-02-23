import { Heart, TrendingUp, Gift, ArrowRight } from "lucide-react";

const campaigns = [
  {
    title: "School Library Renovation",
    description: "Help us modernize the school library with new books and computers.",
    raised: 125000,
    goal: 300000,
    donors: 45,
  },
  {
    title: "Student Scholarship Fund",
    description: "Support meritorious students who need financial assistance.",
    raised: 89000,
    goal: 200000,
    donors: 67,
  },
  {
    title: "Computer Lab Setup",
    description: "Setting up a modern computer lab for the students.",
    raised: 210000,
    goal: 500000,
    donors: 82,
  },
];

const myDonations = [
  { campaign: "Library Renovation", amount: "৳2,000", date: "Jan 15, 2026" },
  { campaign: "Scholarship Fund", amount: "৳1,500", date: "Dec 10, 2025" },
  { campaign: "Computer Lab Setup", amount: "৳1,700", date: "Nov 5, 2025" },
];

export default function DonationsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Donations</h2>
        <p className="text-sm text-muted">
          Contribute to school development projects
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "My Total Donations", value: "৳5,200", icon: Heart, color: "bg-pink-500/10 text-pink-600" },
          { label: "Active Campaigns", value: "3", icon: Gift, color: "bg-primary/10 text-primary" },
          { label: "Total Raised", value: "৳4,24,000", icon: TrendingUp, color: "bg-green-500/10 text-green-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Campaigns */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Active Campaigns
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
            const pct = Math.round((campaign.raised / campaign.goal) * 100);
            return (
              <div
                key={campaign.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <h4 className="font-semibold text-foreground">
                  {campaign.title}
                </h4>
                <p className="mt-1 text-sm text-muted">
                  {campaign.description}
                </p>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      ৳{campaign.raised.toLocaleString()}
                    </span>
                    <span className="text-muted">
                      ৳{campaign.goal.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {pct}% raised &middot; {campaign.donors} donors
                  </p>
                </div>

                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
                  Donate Now
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* My Donations */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          My Donation History
        </h3>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Campaign
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myDonations.map((d) => (
                <tr key={d.date} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3 text-sm text-foreground">
                    {d.campaign}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-primary">
                    {d.amount}
                  </td>
                  <td className="px-5 py-3 text-sm text-muted">{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
