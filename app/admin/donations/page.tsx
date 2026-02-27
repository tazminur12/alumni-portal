"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  Search,
  Heart,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
  Megaphone,
} from "lucide-react";

type DonationStatus = "received" | "pending" | "refunded";
type DonationMethod = "bKash" | "Nagad" | "Bank" | "Card" | "Cash";
type CampaignItem = {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  deadline: string;
  bannerImage: string;
  paymentAccount: string;
  isActive: boolean;
};

type DonationItem = {
  id: string;
  donorName: string;
  campaign: string;
  amount: number;
  method: DonationMethod;
  donationDate: string;
  note: string;
  status: DonationStatus;
  createdAt: string;
};

const statusColors: Record<DonationStatus, string> = {
  received: "bg-green-50 text-green-600",
  pending: "bg-amber-50 text-amber-600",
  refunded: "bg-red-50 text-red-600",
};

const emptyForm = {
  donorName: "",
  campaign: "",
  amount: "0",
  method: "bKash" as DonationMethod,
  donationDate: "",
  note: "",
  status: "received" as DonationStatus,
};

const emptyCampaignForm = {
  title: "",
  description: "",
  targetAmount: "0",
  collectedAmount: "0",
  deadline: "",
  bannerImage: "",
  paymentAccount: "",
  isActive: true,
};

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<DonationItem | null>(null);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCampaignSubmitting, setIsCampaignSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [campaignForm, setCampaignForm] = useState(emptyCampaignForm);

  const loadDonations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/donations", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to load donations.");
      }
      setDonations(result.donations ?? []);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Load failed",
        text: error instanceof Error ? error.message : "Could not load donations.",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCampaigns = async () => {
    setLoadingCampaigns(true);
    try {
      const response = await fetch("/api/admin/donation-campaigns", {
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to load campaigns.");
      }
      setCampaigns(result.campaigns ?? []);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Load failed",
        text: error instanceof Error ? error.message : "Could not load campaigns.",
      });
    } finally {
      setLoadingCampaigns(false);
    }
  };

  useEffect(() => {
    void loadDonations();
    void loadCampaigns();
  }, []);

  const filteredDonations = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return donations;
    return donations.filter((donation) => {
      return (
        donation.donorName.toLowerCase().includes(query) ||
        donation.campaign.toLowerCase().includes(query) ||
        donation.method.toLowerCase().includes(query)
      );
    });
  }, [donations, searchTerm]);

  const totalDonations = useMemo(() => {
    return donations.reduce((sum, donation) => sum + donation.amount, 0);
  }, [donations]);

  const monthDonations = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return donations
      .filter((donation) => {
        const date = new Date(donation.createdAt);
        return date.getMonth() === month && date.getFullYear() === year;
      })
      .reduce((sum, donation) => sum + donation.amount, 0);
  }, [donations]);

  const openCreateModal = () => {
    setEditingDonation(null);
    setForm((prev) => ({
      ...emptyForm,
      campaign: campaigns[0]?.title || prev.campaign || "",
    }));
    setIsModalOpen(true);
  };

  const openEditModal = (donation: DonationItem) => {
    setEditingDonation(donation);
    setForm({
      donorName: donation.donorName,
      campaign: donation.campaign,
      amount: String(donation.amount),
      method: donation.method,
      donationDate: donation.donationDate,
      note: donation.note,
      status: donation.status,
    });
    setIsModalOpen(true);
  };

  const openCreateCampaignModal = () => {
    setEditingCampaign(null);
    setCampaignForm(emptyCampaignForm);
    setIsCampaignModalOpen(true);
  };

  const openEditCampaignModal = (campaign: CampaignItem) => {
    setEditingCampaign(campaign);
    setCampaignForm({
      title: campaign.title,
      description: campaign.description,
      targetAmount: String(campaign.targetAmount),
      collectedAmount: String(campaign.collectedAmount),
      deadline: campaign.deadline,
      bannerImage: campaign.bannerImage,
      paymentAccount: campaign.paymentAccount,
      isActive: campaign.isActive,
    });
    setIsCampaignModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDonation(null);
    setForm(emptyForm);
  };

  const closeCampaignModal = () => {
    setIsCampaignModalOpen(false);
    setEditingCampaign(null);
    setCampaignForm(emptyCampaignForm);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      const endpoint = editingDonation
        ? `/api/admin/donations/${editingDonation.id}`
        : "/api/admin/donations";
      const method = editingDonation ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Could not save donation.");
      }

      await Swal.fire({
        icon: "success",
        title: editingDonation ? "Donation updated" : "Donation created",
        timer: 1200,
        showConfirmButton: false,
      });

      closeModal();
      await loadDonations();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Save failed",
        text: error instanceof Error ? error.message : "Could not save donation.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCampaignSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCampaignSubmitting(true);
    try {
      const payload = {
        ...campaignForm,
        targetAmount: Number(campaignForm.targetAmount),
        collectedAmount: Number(campaignForm.collectedAmount),
      };

      const endpoint = editingCampaign
        ? `/api/admin/donation-campaigns/${editingCampaign.id}`
        : "/api/admin/donation-campaigns";
      const method = editingCampaign ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Could not save campaign.");
      }

      await Swal.fire({
        icon: "success",
        title: editingCampaign ? "Campaign updated" : "Campaign created",
        timer: 1200,
        showConfirmButton: false,
      });
      closeCampaignModal();
      await loadCampaigns();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Save failed",
        text: error instanceof Error ? error.message : "Could not save campaign.",
      });
    } finally {
      setIsCampaignSubmitting(false);
    }
  };

  const handleDelete = async (donation: DonationItem) => {
    const confirmation = await Swal.fire({
      icon: "warning",
      title: "Delete donation?",
      text: `Delete donation from ${donation.donorName}?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });
    if (!confirmation.isConfirmed) return;

    try {
      const response = await fetch(`/api/admin/donations/${donation.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Could not delete donation.");
      }

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1000,
        showConfirmButton: false,
      });
      await loadDonations();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: error instanceof Error ? error.message : "Could not delete donation.",
      });
    }
  };

  const handleDeleteCampaign = async (campaign: CampaignItem) => {
    const confirmation = await Swal.fire({
      icon: "warning",
      title: "Delete campaign?",
      text: `Delete campaign "${campaign.title}"?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });
    if (!confirmation.isConfirmed) return;

    try {
      const response = await fetch(
        `/api/admin/donation-campaigns/${campaign.id}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Could not delete campaign.");
      }

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1000,
        showConfirmButton: false,
      });
      await loadCampaigns();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: error instanceof Error ? error.message : "Could not delete campaign.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Donation Management</h2>
          <p className="text-sm text-muted">
            Manage donation campaigns from admin panel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openCreateCampaignModal}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-gray-50"
          >
            <Megaphone size={16} />
            Add Campaign
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            <Plus size={16} />
            Add Donation
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Total Donations</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                ৳{totalDonations.toLocaleString()}
              </p>
              <p className="mt-0.5 text-xs text-primary">
                {donations.length} total entries
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600">
              <Heart size={22} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">This Month</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                ৳{monthDonations.toLocaleString()}
              </p>
              <p className="mt-0.5 text-xs text-primary">Monthly received amount</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <TrendingUp size={22} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Donation Campaigns
          </h3>
          <button
            onClick={openCreateCampaignModal}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Create campaign
          </button>
        </div>
        {loadingCampaigns ? (
          <p className="text-sm text-muted">Loading campaigns...</p>
        ) : campaigns.length === 0 ? (
          <p className="text-sm text-muted">No campaigns created yet.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px]">
                <thead>
                  <tr className="border-b border-border bg-gray-50/70">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      Target
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      Collected
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      Deadline
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      Account
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-foreground">{campaign.title}</p>
                        <p className="mt-0.5 max-w-[320px] truncate text-xs text-muted">
                          {campaign.description}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-primary">
                        ৳{campaign.targetAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        ৳{campaign.collectedAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">{campaign.deadline}</td>
                      <td className="px-4 py-3 text-sm text-muted">
                        <p className="max-w-[220px] truncate">{campaign.paymentAccount}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            campaign.isActive
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {campaign.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openEditCampaignModal(campaign)}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(campaign)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {editingDonation ? "Edit Donation" : "Add Donation"}
              </h3>
              <button
                onClick={closeModal}
                className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
              <input
                required
                value={form.donorName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, donorName: event.target.value }))
                }
                placeholder="Donor name"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <select
                required
                aria-label="Select donation campaign"
                value={form.campaign}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, campaign: event.target.value }))
                }
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {campaigns.length === 0 ? (
                  <option value="">No campaign available</option>
                ) : (
                  campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.title}>
                      {campaign.title}
                    </option>
                  ))
                )}
              </select>
              <input
                required
                type="number"
                min={0}
                value={form.amount}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, amount: event.target.value }))
                }
                placeholder="Amount"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <select
                aria-label="Donation method"
                value={form.method}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    method: event.target.value as DonationMethod,
                  }))
                }
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Bank">Bank</option>
                <option value="Card">Card</option>
                <option value="Cash">Cash</option>
              </select>
              <input
                required
                value={form.donationDate}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, donationDate: event.target.value }))
                }
                placeholder="Donation date (e.g. Feb 20, 2026)"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <select
                aria-label="Donation status"
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value as DonationStatus,
                  }))
                }
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="received">Received</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
              <textarea
                value={form.note}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, note: event.target.value }))
                }
                rows={3}
                placeholder="Note (optional)"
                className="resize-none rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary sm:col-span-2"
              />
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingDonation
                      ? "Update Donation"
                      : "Add Donation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {editingCampaign ? "Edit Campaign" : "Create Campaign"}
              </h3>
              <button
                onClick={closeCampaignModal}
                className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <form
              onSubmit={handleCampaignSubmit}
              className="grid gap-3 sm:grid-cols-2"
            >
              <input
                required
                value={campaignForm.title}
                onChange={(event) =>
                  setCampaignForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="Campaign title"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary sm:col-span-2"
              />
              <textarea
                required
                rows={3}
                value={campaignForm.description}
                onChange={(event) =>
                  setCampaignForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Campaign description"
                className="resize-none rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary sm:col-span-2"
              />
              <input
                required
                type="number"
                min={0}
                value={campaignForm.targetAmount}
                onChange={(event) =>
                  setCampaignForm((prev) => ({
                    ...prev,
                    targetAmount: event.target.value,
                  }))
                }
                placeholder="Target amount (লক্ষ্য টাকা)"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                required
                type="number"
                min={0}
                value={campaignForm.collectedAmount}
                onChange={(event) =>
                  setCampaignForm((prev) => ({
                    ...prev,
                    collectedAmount: event.target.value,
                  }))
                }
                placeholder="Collected amount (বর্তমান সংগ্রহ)"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                required
                type="date"
                aria-label="Campaign deadline"
                value={campaignForm.deadline}
                onChange={(event) =>
                  setCampaignForm((prev) => ({
                    ...prev,
                    deadline: event.target.value,
                  }))
                }
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                value={campaignForm.bannerImage}
                onChange={(event) =>
                  setCampaignForm((prev) => ({
                    ...prev,
                    bannerImage: event.target.value,
                  }))
                }
                placeholder="Banner image URL"
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <textarea
                required
                rows={2}
                value={campaignForm.paymentAccount}
                onChange={(event) =>
                  setCampaignForm((prev) => ({
                    ...prev,
                    paymentAccount: event.target.value,
                  }))
                }
                placeholder="Payment account details (Bkash/Nagad/Bank account)"
                className="resize-none rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary sm:col-span-2"
              />
              <label className="sm:col-span-2 flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={campaignForm.isActive}
                  onChange={(event) =>
                    setCampaignForm((prev) => ({
                      ...prev,
                      isActive: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-primary"
                />
                Active campaign (show on public page)
              </label>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isCampaignSubmitting}
                  className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
                >
                  {isCampaignSubmitting
                    ? "Saving..."
                    : editingCampaign
                      ? "Update Campaign"
                      : "Create Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
