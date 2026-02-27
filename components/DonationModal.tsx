"use client";

import { FormEvent, useState, useEffect } from "react";
import Swal from "sweetalert2";

type PaymentAccountItem = { label: string; details: string };

type Campaign = {
  id: string;
  title: string;
  paymentAccount?: string;
  paymentAccounts?: PaymentAccountItem[];
};

type UserData = {
  fullName: string;
} | null;

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: Campaign[];
  preselectedCampaign?: string | null;
  user?: UserData;
  onSuccess?: () => void;
}

export default function DonationModal({
  isOpen,
  onClose,
  campaigns,
  preselectedCampaign,
  user,
  onSuccess,
}: DonationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(
    preselectedCampaign || campaigns[0]?.title || ""
  );
  const [selectedPaymentLabel, setSelectedPaymentLabel] = useState("");
  const [form, setForm] = useState({
    donorName: "",
    campaign: "",
    amount: "",
    method: "",
    donationDate: new Date().toISOString().slice(0, 10),
    note: "",
    fromAccount: "",
  });

  useEffect(() => {
    if (isOpen && campaigns.length > 0) {
      const campaign = preselectedCampaign || campaigns[0].title;
      const campaignData = campaigns.find((c) => c.title === campaign);
      const accounts =
        campaignData?.paymentAccounts && campaignData.paymentAccounts.length > 0
          ? campaignData.paymentAccounts
          : campaignData?.paymentAccount
            ? [{ label: "Payment", details: campaignData.paymentAccount }]
            : [];
      const defaultLabel = accounts[0]?.label ?? "";
      setSelectedCampaign(campaign);
      setSelectedPaymentLabel(defaultLabel);
      setForm((prev) => ({
        ...prev,
        donorName: user?.fullName || prev.donorName,
        campaign,
        amount: "",
        method: defaultLabel,
        donationDate: new Date().toISOString().slice(0, 10),
        note: "",
      }));
    }
  }, [isOpen, campaigns, preselectedCampaign, user?.fullName]);

  const selectedCampaignData = campaigns.find(
    (c) => c.title === selectedCampaign
  );
  const campaignPaymentAccounts =
    selectedCampaignData?.paymentAccounts && selectedCampaignData.paymentAccounts.length > 0
      ? selectedCampaignData.paymentAccounts
      : selectedCampaignData?.paymentAccount
        ? [{ label: "Payment", details: selectedCampaignData.paymentAccount }]
        : [];
  const selectedPaymentDetails =
    campaignPaymentAccounts.find((a) => a.label === selectedPaymentLabel)?.details ||
    campaignPaymentAccounts[0]?.details ||
    "";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        donorName: form.donorName.trim(),
        campaign: selectedCampaign,
        amount: Number(form.amount),
        method: selectedPaymentLabel || form.method,
        sentToLabel: selectedPaymentLabel || form.method,
        sentToDetails: selectedPaymentDetails,
        fromAccount: form.fromAccount.trim(),
        donationDate: form.donationDate,
        note: form.note.trim(),
      };

      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Donation submit failed.");
      }

      await Swal.fire({
        icon: "success",
        title: "Donation submitted",
        text: "Thank you! Admin will verify and update the donation status.",
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Submission failed",
        text: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Make a Donation
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:bg-gray-100"
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="donorName"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Donor full name
            </label>
            <input
              id="donorName"
              required
              value={form.donorName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, donorName: e.target.value }))
              }
              placeholder="Your full name"
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label
              htmlFor="campaign"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Campaign
            </label>
            <select
              id="campaign"
              required
              value={selectedCampaign}
              onChange={(e) => {
                setSelectedCampaign(e.target.value);
                setForm((prev) => ({ ...prev, campaign: e.target.value }));
              }}
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.title}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-sm">
            <p className="font-semibold text-primary">
              Where to send money (Payment Account)
            </p>
            <p className="mt-1 text-foreground">
              {selectedPaymentDetails || "No account details yet."}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="amount"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Amount (BDT)
              </label>
              <input
                id="amount"
                required
                type="number"
                min={1}
                value={form.amount}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, amount: e.target.value }))
                }
                placeholder="Amount"
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="method"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Payment method
              </label>
              <select
                id="method"
                required
                value={selectedPaymentLabel}
                onChange={(e) => {
                  setSelectedPaymentLabel(e.target.value);
                  setForm((prev) => ({ ...prev, method: e.target.value }));
                }}
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                {campaignPaymentAccounts.length === 0 ? (
                  <option value="">No payment accounts</option>
                ) : (
                  campaignPaymentAccounts.map((acc, idx) => (
                    <option key={`${acc.label}-${idx}`} value={acc.label}>
                      {acc.label || `Payment ${idx + 1}`}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="donationDate"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Donation date
            </label>
            <input
              id="donationDate"
              required
              type="date"
              value={form.donationDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, donationDate: e.target.value }))
              }
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label
              htmlFor="note"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Reference / note (optional)
            </label>
            <input
              id="note"
              value={form.note}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, note: e.target.value }))
              }
              placeholder="Transaction ID or note"
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label
              htmlFor="fromAccount"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Your payment account / number (optional)
            </label>
            <input
              id="fromAccount"
              value={form.fromAccount}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, fromAccount: e.target.value }))
              }
              placeholder="e.g. your bKash/Nagad/Bank account you paid from"
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit Donation"}
          </button>
        </form>
      </div>
    </div>
  );
}
