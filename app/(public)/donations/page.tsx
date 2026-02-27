"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, Users, TrendingUp, ArrowRight, Gift, Plus } from "lucide-react";
import DonationModal from "@/components/DonationModal";

type Campaign = {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  deadline: string;
  bannerImage: string;
  paymentAccount: string;
  paymentAccounts?: Array<{ label: string; details: string }>;
};

export default function DonationsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [summaryStats, setSummaryStats] = useState({
    totalRaised: 0,
    totalDonors: 0,
    activeCampaigns: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCampaign, setModalCampaign] = useState<string | null>(null);
  const [user, setUser] = useState<{ fullName: string } | null>(null);

  const loadCampaigns = async () => {
    setIsLoadingCampaigns(true);
    try {
      const [campaignsRes, meRes] = await Promise.all([
        fetch("/api/donation-campaigns", { cache: "no-store" }),
        fetch("/api/auth/me"),
      ]);

      if (meRes.ok) {
        const meData = await meRes.json();
        setUser(meData.user ? { fullName: meData.user.fullName } : null);
      }

      const response = campaignsRes;
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to load campaigns.");
      }
      const nextCampaigns: Campaign[] = result.campaigns ?? [];
      setCampaigns(nextCampaigns);
      setSummaryStats(
        result.stats ?? {
          totalRaised: 0,
          totalDonors: 0,
          activeCampaigns: nextCampaigns.length,
        }
      );
    } catch {
      setCampaigns([]);
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  const getProgressWidthClass = (percentage: number) => {
    if (percentage >= 100) return "w-full";
    if (percentage >= 90) return "w-11/12";
    if (percentage >= 80) return "w-10/12";
    if (percentage >= 70) return "w-9/12";
    if (percentage >= 60) return "w-8/12";
    if (percentage >= 50) return "w-7/12";
    if (percentage >= 40) return "w-6/12";
    if (percentage >= 30) return "w-5/12";
    if (percentage >= 20) return "w-4/12";
    if (percentage >= 10) return "w-3/12";
    if (percentage > 0) return "w-2/12";
    return "w-0";
  };

  useEffect(() => {
    void loadCampaigns();
  }, []);

  const openDonationModal = (campaignTitle?: string | null) => {
    setModalCampaign(campaignTitle ?? null);
    setIsModalOpen(true);
  };

  const stats = [
    {
      label: "Total Raised",
      value: `৳${summaryStats.totalRaised.toLocaleString()}`,
      icon: TrendingUp,
    },
    { label: "Total Donors", value: `${summaryStats.totalDonors}`, icon: Users },
    {
      label: "Active Campaigns",
      value: `${summaryStats.activeCampaigns}`,
      icon: Gift,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-linear-to-br from-primary-dark to-primary py-16 sm:py-20">
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
          <div className="mb-6 flex justify-end">
            {!isLoadingCampaigns && campaigns.length > 0 && (
              <button
                onClick={() => openDonationModal(null)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                <Plus size={16} />
                Make a Donation
              </button>
            )}
          </div>
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

          {isLoadingCampaigns ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted">
              Loading active campaigns...
            </div>
          ) : campaigns.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted">
              No active campaigns available right now.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    className="group rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="h-36 overflow-hidden rounded-t-2xl bg-linear-to-br from-primary/5 to-primary/10">
                      {campaign.bannerImage ? (
                        <Image
                          src={campaign.bannerImage}
                          alt={campaign.title}
                          width={800}
                          height={400}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-5xl">
                          🎯
                        </div>
                      )}
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
                            ৳{campaign.collectedAmount.toLocaleString()}
                          </span>
                          <span className="text-muted">
                            of ৳{campaign.targetAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full bg-linear-to-r from-primary to-primary-light transition-all ${getProgressWidthClass(
                              pct
                            )}`}
                          />
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-xs text-muted">
                          <span>{pct}% raised</span>
                          <span>Deadline: {campaign.deadline}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => openDonationModal(campaign.title)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                      >
                        Donate Now
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campaigns={campaigns}
        preselectedCampaign={modalCampaign}
        user={user}
        onSuccess={loadCampaigns}
      />

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
