import { getCurrentUser } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import User from "@/models/User";
import Event from "@/models/Event";
import Post from "@/models/Post";
import Donation from "@/models/Donation";
import {
  Users,
  Calendar,
  Heart,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const statusColors: Record<string, string> = {
  active: "bg-green-50 text-green-600",
  pending: "bg-amber-50 text-amber-600",
  suspended: "bg-red-50 text-red-600",
};

export default async function AdminDashboard() {
  const currentUser = await getCurrentUser();
  const isModerator = currentUser?.role === "moderator";

  await connectDb();

  const [totalUsers, totalEvents, totalPosts, donations] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    Post.countDocuments(),
    Donation.find({ status: "completed" }),
  ]);

  const totalDonationsAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  const recentUsersData = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("fullName batch email status");

  const statsCards = [
    { label: "Total Alumni", value: totalUsers.toString(), change: "+12%", up: true, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Total Events", value: totalEvents.toString(), change: "+5%", up: true, icon: Calendar, color: "bg-blue-500/10 text-blue-600" },
    { label: "Total Donations", value: `৳${totalDonationsAmount.toLocaleString()}`, change: "+18%", up: true, icon: Heart, color: "bg-pink-500/10 text-pink-600" },
    { label: "Total Posts", value: totalPosts.toString(), change: "-3%", up: false, icon: FileText, color: "bg-purple-500/10 text-purple-600" },
  ];

  const filteredStats = isModerator 
    ? statsCards.filter(stat => stat.label !== "Total Donations")
    : statsCards;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          {isModerator ? "Moderator Dashboard" : "Admin Dashboard"}
        </h2>
        <p className="text-sm text-muted">
          Overview of your alumni portal
        </p>
      </div>

      {/* Stats */}
      <div className={`grid gap-4 sm:grid-cols-2 ${isModerator ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
        {filteredStats.map((stat) => (
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
                {recentUsersData.map((user) => (
                  <tr key={user.email} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-foreground">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted">
                      {user.batch}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColors[user.status as string] ?? ""}`}
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
              ]
                .filter((action) => {
                  if (isModerator) {
                    return action.label !== "View Donations" && action.label !== "View Analytics";
                  }
                  return true;
                })
                .map((action) => (
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
