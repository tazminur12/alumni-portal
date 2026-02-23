import {
  Users,
  Calendar,
  Heart,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const statsCards = [
  { label: "Total Alumni", value: "2,543", change: "+12%", up: true, icon: Users, color: "bg-primary/10 text-primary" },
  { label: "Total Events", value: "124", change: "+5%", up: true, icon: Calendar, color: "bg-blue-500/10 text-blue-600" },
  { label: "Total Donations", value: "৳12,45,000", change: "+18%", up: true, icon: Heart, color: "bg-pink-500/10 text-pink-600" },
  { label: "Total Posts", value: "867", change: "-3%", up: false, icon: FileText, color: "bg-purple-500/10 text-purple-600" },
];

const recentUsers = [
  { name: "Taslima Sultana", batch: "2018", email: "taslima@mail.com", status: "Active" },
  { name: "Rashed Khan", batch: "2020", email: "rashed@mail.com", status: "Pending" },
  { name: "Ayesha Siddika", batch: "2016", email: "ayesha@mail.com", status: "Active" },
  { name: "Jahangir Alam", batch: "2014", email: "jahangir@mail.com", status: "Active" },
  { name: "Sumaiya Islam", batch: "2019", email: "sumaiya@mail.com", status: "Pending" },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-50 text-green-600",
  Pending: "bg-amber-50 text-amber-600",
};

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-sm text-muted">
          Overview of your alumni portal
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
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
              <span
                className={`flex items-center gap-0.5 text-xs font-semibold ${stat.up ? "text-green-600" : "text-red-500"}`}
              >
                {stat.up ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                {stat.change}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent Users Table */}
        <div className="rounded-2xl border border-border bg-card shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="font-semibold text-foreground">Recent Registrations</h3>
            <a
              href="/admin/users"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Name
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Batch
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentUsers.map((user) => (
                  <tr key={user.email} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-foreground">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted">
                      {user.batch}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[user.status] ?? ""}`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-foreground">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: "Create New Event", href: "/admin/events" },
                { label: "Manage Users", href: "/admin/users" },
                { label: "View Donations", href: "/admin/donations" },
                { label: "View Analytics", href: "/admin/analytics" },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-between rounded-xl border border-border p-3 text-sm font-medium text-foreground transition-colors hover:bg-gray-50"
                >
                  {action.label}
                  <TrendingUp size={14} className="text-muted" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
