import { Search, Heart, MoreHorizontal, TrendingUp } from "lucide-react";

const donations = [
  { donor: "Rafiq Ahmed", campaign: "Library Renovation", amount: "৳5,000", date: "Feb 20, 2026", method: "bKash" },
  { donor: "Nasreen Begum", campaign: "Scholarship Fund", amount: "৳3,000", date: "Feb 18, 2026", method: "Nagad" },
  { donor: "Kamal Hossain", campaign: "Computer Lab", amount: "৳10,000", date: "Feb 15, 2026", method: "Bank" },
  { donor: "Fatema Khatun", campaign: "Library Renovation", amount: "৳2,000", date: "Feb 10, 2026", method: "bKash" },
  { donor: "Anonymous", campaign: "Scholarship Fund", amount: "৳15,000", date: "Feb 5, 2026", method: "Bank" },
  { donor: "Mizanur Rahman", campaign: "Computer Lab", amount: "৳7,500", date: "Jan 28, 2026", method: "Nagad" },
];

const summaryCards = [
  { label: "Total Donations", value: "৳12,45,000", change: "+18% this month", icon: Heart },
  { label: "This Month", value: "৳42,500", change: "6 donations", icon: TrendingUp },
];

export default function AdminDonationsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Donation Management
        </h2>
        <p className="text-sm text-muted">Track and manage all donations</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">{card.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {card.value}
                </p>
                <p className="mt-0.5 text-xs text-primary">{card.change}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600">
                <card.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          placeholder="Search donations..."
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Donor
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Campaign
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Method
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Date
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {donations.map((d, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3 text-sm font-medium text-foreground">
                    {d.donor}
                  </td>
                  <td className="px-5 py-3 text-sm text-muted">
                    {d.campaign}
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-primary">
                    {d.amount}
                  </td>
                  <td className="px-5 py-3 text-sm text-muted">{d.method}</td>
                  <td className="px-5 py-3 text-sm text-muted">{d.date}</td>
                  <td className="px-5 py-3 text-right">
                    <button className="rounded-lg p-1.5 text-muted hover:bg-gray-100">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
