"use client";

import { useEffect, useState } from "react";
import { Heart, TrendingUp, Gift, ArrowRight, Plus } from "lucide-react";
import DonationModal from "@/components/DonationModal";

type Campaign = {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  deadline: string;
  bannerImage?: string;
  paymentAccount?: string;
  paymentAccounts?: Array<{ label: string; details: string }>;
};

type MyDonation = {
  id: string;
  campaign: string;
  amount: number;
  donationDate: string;
  status: string;
};

type UserData = { fullName: string } | null;

export default function DashboardDonationsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [myDonations, setMyDonations] = useState<MyDonation[]>([]);
  const [user, setUser] = useState<UserData>(null);
  const [stats, setStats] = useState({
    myTotal: 0,
    activeCampaigns: 0,
    totalRaised: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCampaign, setModalCampaign] = useState<string | null>(null);

  const openDonationModal = (campaignTitle?: string | null) => {
    setModalCampaign(campaignTitle ?? null);
    setIsModalOpen(true);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [campaignsRes, myRes, meRes] = await Promise.all([
        fetch("/api/donation-campaigns", { cache: "no-store" }),
        fetch("/api/donations/me"),
        fetch("/api/auth/me"),
      ]);

      if (meRes.ok) {
        const meData = await meRes.json();
        setUser(meData.user ? { fullName: meData.user.fullName } : null);
      }

      if (campaignsRes.ok) {
        const data = await campaignsRes.json();
        const list: Campaign[] = data.campaigns ?? [];
        setCampaigns(list);
        setStats((prev) => ({
          ...prev,
          activeCampaigns: list.length,
          totalRaised: data.stats?.totalRaised ?? 0,
        }));
      }

      if (myRes.ok) {
        const data = await myRes.json();
        setMyDonations(data.donations ?? []);
        setStats((prev) => ({
          ...prev,
          myTotal: data.totalAmount ?? 0,
        }));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr ?? "—";
    }
  };

  const statsCards = [
    {
      label: "My Total Donations",
      value: `৳${stats.myTotal.toLocaleString()}`,
      icon: Heart,
      color: "bg-pink-500/10 text-pink-600",
    },
    {
      label: "Active Campaigns",
      value: String(stats.activeCampaigns),
      icon: Gift,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Total Raised",
      value: `৳${stats.totalRaised.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-green-500/10 text-green-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Donations</h2>
          <p className="text-sm text-muted">
            Contribute to school development projects
          </p>
        </div>
        {!loading && campaigns.length > 0 && (
          <button
            onClick={() => openDonationModal(null)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            <Plus size={16} />
            Make a Donation
          </button>
        )}
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-border bg-card"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {statsCards.map((stat) => (
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
      )}

      {/* Active Campaigns */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Active Campaigns
        </h3>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl border border-border bg-card"
              />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted">
            No active campaigns at the moment.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => {
              const pct = Math.round(
                Math.min(
                  campaign.targetAmount > 0
                    ? (campaign.collectedAmount / campaign.targetAmount) * 100
                    : 0,
                  100
                )
              );
              return (
                <div
                  key={campaign.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <h4 className="font-semibold text-foreground">
                    {campaign.title}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">
                    {campaign.description}
                  </p>

                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        ৳{campaign.collectedAmount.toLocaleString()}
                      </span>
                      <span className="text-muted">
                        ৳{campaign.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {pct}% raised
                      {campaign.deadline && (
                        <> &middot; Deadline: {campaign.deadline}</>
                      )}
                    </p>
                  </div>

                  <button
                    onClick={() => openDonationModal(campaign.title)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                  >
                    Donate Now
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* My Donations */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          My Donation History
        </h3>
        {loading ? (
          <div className="h-40 animate-pulse rounded-2xl border border-border bg-card" />
        ) : myDonations.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted">
            No donations yet. Make your first contribution above!
          </div>
        ) : (
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
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 text-sm text-foreground">
                      {d.campaign}
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-primary">
                      ৳{Number(d.amount).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-sm text-muted">
                      {formatDate(d.donationDate)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          d.status === "received"
                            ? "bg-green-50 text-green-600"
                            : d.status === "pending"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campaigns={campaigns}
        preselectedCampaign={modalCampaign}
        user={user}
        onSuccess={loadData}
      />
    </div>
  );
}
