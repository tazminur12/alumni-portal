"use client";

import { useEffect, useMemo, useState } from "react";

type DonationStatus = "received" | "pending" | "refunded";

type DonationItem = {
  id: string;
  donorName: string;
  campaign: string;
  amount: number;
  method: string;
  donationDate: string;
  note: string;
  status: DonationStatus;
  createdAt?: string | Date | null;
  sentToLabel?: string;
  sentToDetails?: string;
  fromAccount?: string;
};

type CampaignGroup = {
  campaign: string;
  totalAmount: number;
  donationCount: number;
};

export default function DonationsTransparencyPage() {
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/donations", { cache: "no-store" });
        const result = (await response.json()) as { donations?: DonationItem[]; message?: string };
        if (!response.ok) {
          throw new Error(result.message || "Failed to load donations.");
        }

        const onlyReceived = (result.donations ?? []).filter(
          (item) => item.status === "received"
        );
        setDonations(onlyReceived);

        if (onlyReceived.length > 0 && !selectedCampaign) {
          setSelectedCampaign(onlyReceived[0].campaign);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const campaignGroups = useMemo<CampaignGroup[]>(() => {
    const map = new Map<string, CampaignGroup>();
    for (const donation of donations) {
      if (!donation.campaign) continue;
      const existing = map.get(donation.campaign) ?? {
        campaign: donation.campaign,
        totalAmount: 0,
        donationCount: 0,
      };
      existing.totalAmount += donation.amount;
      existing.donationCount += 1;
      map.set(donation.campaign, existing);
    }

    return Array.from(map.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [donations]);

  const selectedDonations = useMemo(
    () =>
      donations.filter(
        (donation) => donation.campaign === selectedCampaign && donation.status === "received"
      ),
    [donations, selectedCampaign]
  );

  const totalReceivedAmount = useMemo(
    () => donations.reduce((sum, d) => sum + (d.status === "received" ? d.amount : 0), 0),
    [donations]
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-3 pb-6 pt-2 sm:px-4 sm:pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Donation Transparency (Approved Donors)
          </h2>
          <p className="mt-1 text-sm text-muted">
            Only donations marked as <span className="font-semibold">received</span> from the
            history panel are shown here, grouped by campaign.
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-right text-xs font-semibold text-emerald-800 sm:text-sm">
          <p>Total approved amount</p>
          <p className="text-base sm:text-lg">
            ৳{totalReceivedAmount.toLocaleString("en-BD")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
        {/* Campaign list */}
        <div className="space-y-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Campaigns
          </p>
          {loading ? (
            <p className="py-4 text-sm text-muted">Loading campaigns...</p>
          ) : campaignGroups.length === 0 ? (
            <p className="py-4 text-sm text-muted">
              No approved donations yet. Approve donations from the verification panel first.
            </p>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1 md:block md:space-y-2 md:overflow-visible">
              {campaignGroups.map((group) => {
                const isActive = group.campaign === selectedCampaign;
                return (
                  <button
                    key={group.campaign}
                    type="button"
                    onClick={() => setSelectedCampaign(group.campaign)}
                    className={`min-w-[180px] rounded-2xl border px-3 py-2 text-left text-xs transition ${
                      isActive
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:bg-gray-50"
                    }`}
                  >
                    <p className="line-clamp-2 text-sm font-semibold text-foreground">
                      {group.campaign}
                    </p>
                    <p className="mt-1 text-[11px] text-muted">
                      Donors:{" "}
                      <span className="font-semibold text-foreground">
                        {group.donationCount}
                      </span>
                    </p>
                    <p className="text-[11px] text-muted">
                      Total:{" "}
                      <span className="font-semibold text-primary">
                        ৳{group.totalAmount.toLocaleString("en-BD")}
                      </span>
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Donor list for selected campaign */}
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Donor list
              </p>
              <p className="text-sm font-semibold text-foreground">
                {selectedCampaign || "No campaign selected"}
              </p>
            </div>
            {selectedCampaign && (
              <div className="text-right text-xs text-muted">
                <p>
                  Donors:{" "}
                  <span className="font-semibold text-foreground">
                    {selectedDonations.length}
                  </span>
                </p>
                <p>
                  Total:{" "}
                  <span className="font-semibold text-primary">
                    ৳
                    {selectedDonations
                      .reduce((sum, d) => sum + d.amount, 0)
                      .toLocaleString("en-BD")}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="mt-2 space-y-3">
            {loading ? (
              <p className="py-4 text-sm text-muted">Loading donors...</p>
            ) : !selectedCampaign ? (
              <p className="py-4 text-sm text-muted">
                Select a campaign from the left to see approved donors.
              </p>
            ) : selectedDonations.length === 0 ? (
              <p className="py-4 text-sm text-muted">
                No approved donations found for this campaign yet.
              </p>
            ) : (
              selectedDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="rounded-2xl border border-border bg-background p-3 text-xs sm:text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-foreground">
                      {donation.donorName || "Anonymous donor"}
                    </p>
                    <p className="font-semibold text-primary">
                      ৳{donation.amount.toLocaleString("en-BD")}
                    </p>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted sm:text-xs">
                    {donation.method && <span>Method: {donation.method}</span>}
                    {donation.donationDate && (
                      <span>Date: {donation.donationDate}</span>
                    )}
                  </div>

                  {(donation.sentToLabel || donation.sentToDetails) && (
                    <p className="mt-1 text-[11px] text-muted sm:text-xs">
                      Sent to:{" "}
                      <span className="font-medium text-foreground">
                        {donation.sentToLabel
                          ? `${donation.sentToLabel}: `
                          : null}
                        {donation.sentToDetails}
                      </span>
                    </p>
                  )}

                  {donation.fromAccount && (
                    <p className="mt-1 text-[11px] text-muted sm:text-xs">
                      From account:{" "}
                      <span className="font-medium text-foreground">
                        {donation.fromAccount}
                      </span>
                    </p>
                  )}

                  {donation.note && (
                    <p className="mt-1 text-[11px] text-muted sm:text-xs">
                      Note:{" "}
                      <span className="font-medium text-foreground">
                        {donation.note}
                      </span>
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
