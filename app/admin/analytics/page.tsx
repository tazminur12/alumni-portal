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
  BarChart3,
} from "lucide-react";

export default async function AdminAnalyticsPage() {
  await connectDb();

  const [totalUsers, activeEvents, donations, publishedPosts] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments({ status: "upcoming" }),
    Donation.find({ status: "received" }),
    Post.countDocuments({ status: "Published" }),
  ]);

  const totalDonationsAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  const overviewStats = [
    { label: "Total Alumni", value: totalUsers.toString(), icon: Users, color: "bg-primary/10 text-primary", trend: "Total registered" },
    { label: "Active Events", value: activeEvents.toString(), icon: Calendar, color: "bg-blue-500/10 text-blue-600", trend: "Upcoming events" },
    { label: "Total Donations", value: `৳${totalDonationsAmount.toLocaleString()}`, icon: Heart, color: "bg-pink-500/10 text-pink-600", trend: "Received donations" },
    { label: "Published Posts", value: publishedPosts.toString(), icon: FileText, color: "bg-purple-500/10 text-purple-600", trend: "Live posts" },
  ];

  // Batch Distribution
  const batchAggregation = await User.aggregate([
    {
      $group: {
        _id: "$batch",
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const batchDistribution = batchAggregation.map(b => ({
    batch: b._id || "Unknown",
    count: b.count
  }));

  const maxBatchCount = Math.max(...batchDistribution.map(b => b.count), 1);

  // Monthly Activity (Registrations)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const monthlyRegAggregation = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Fill missing months
  const monthlyActivity = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    
    const found = monthlyRegAggregation.find(m => m._id.year === year && m._id.month === month);
    monthlyActivity.push({
      month: monthNames[month - 1],
      registrations: found ? found.count : 0,
    });
  }

  const maxReg = Math.max(...monthlyActivity.map((m) => m.registrations), 1);

  // Top Donors
  const topDonorsAggregation = await Donation.aggregate([
    { $match: { status: "received" } },
    {
      $group: {
        _id: "$donorName",
        totalAmount: { $sum: "$amount" }
      }
    },
    { $sort: { totalAmount: -1 } },
    { $limit: 4 }
  ]);

  const topDonors = topDonorsAggregation.map(d => ({
    name: d._id || "Anonymous",
    amount: `৳${d.totalAmount.toLocaleString()}`,
  }));

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
              const pct = Math.round((item.count / maxBatchCount) * 100);
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
          {topDonors.map((donor, i) => (
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
