"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { CheckCircle2, Trash2, Clock3, Search } from "lucide-react";

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
  createdAt: string;
  sentToLabel?: string;
  sentToDetails?: string;
  fromAccount?: string;
};

const statusClasses: Record<DonationStatus, string> = {
  received: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  refunded: "bg-red-50 text-red-700",
};

export default function DonationHistoryPage() {
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [viewDonation, setViewDonation] = useState<DonationItem | null>(null);

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

  useEffect(() => {
    void loadDonations();
  }, []);

  const filteredDonations = useMemo(() => {
    const text = query.toLowerCase().trim();
    if (!text) return donations;

    return donations.filter((item) => {
      return (
        item.donorName.toLowerCase().includes(text) ||
        item.campaign.toLowerCase().includes(text) ||
        item.method.toLowerCase().includes(text) ||
        item.status.toLowerCase().includes(text)
      );
    });
  }, [donations, query]);

  const pendingCount = useMemo(
    () => donations.filter((item) => item.status === "pending").length,
    [donations]
  );

  const handleApprove = async (donation: DonationItem) => {
    setWorkingId(donation.id);
    try {
      const response = await fetch(`/api/admin/donations/${donation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...donation, status: "received" }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Could not approve donation.");
      }

      await Swal.fire({
        icon: "success",
        title: "Approved",
        timer: 1200,
        showConfirmButton: false,
      });

      await loadDonations();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Approve failed",
        text: error instanceof Error ? error.message : "Could not approve donation.",
      });
    } finally {
      setWorkingId(null);
    }
  };

  const handleRejectAsFake = async (donation: DonationItem) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Reject as fake?",
      text: `This will permanently remove ${donation.donorName}'s donation record.`,
      showCancelButton: true,
      confirmButtonText: "Reject & Remove",
      confirmButtonColor: "#dc2626",
    });

    if (!confirm.isConfirmed) return;

    setWorkingId(donation.id);
    try {
      const response = await fetch(`/api/admin/donations/${donation.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Could not remove fake donation.");
      }

      await Swal.fire({
        icon: "success",
        title: "Rejected & removed",
        timer: 1200,
        showConfirmButton: false,
      });

      await loadDonations();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Action failed",
        text: error instanceof Error ? error.message : "Could not remove donation.",
      });
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 pb-6 pt-2 sm:px-4 sm:pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Donation History Verification</h2>
          <p className="text-sm text-muted">
            Verify pending donations and remove fake entries from this panel.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
          <Clock3 size={16} />
          Pending: {pendingCount}
        </div>
      </div>

      <div className="relative max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search donor, campaign, method..."
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
        />
      </div>

      {/* Desktop / tablet table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="border-b border-border bg-gray-50/70">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Donor
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Campaign
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Method
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">
                  Verify
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td className="px-5 py-6 text-sm text-muted" colSpan={7}>
                    Loading donations...
                  </td>
                </tr>
              ) : filteredDonations.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-sm text-muted" colSpan={7}>
                    No donation records found.
                  </td>
                </tr>
              ) : (
                filteredDonations.map((donation) => {
                  const isPending = donation.status === "pending";
                  const isWorking = workingId === donation.id;

                  return (
                    <tr key={donation.id} className="hover:bg-gray-50/60">
                      <td className="px-5 py-3 text-sm font-medium text-foreground">
                        <p>{donation.donorName}</p>
                        {donation.note ? (
                          <p className="mt-0.5 max-w-[260px] truncate text-xs text-muted">
                            Note: {donation.note}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-5 py-3 text-sm text-muted">{donation.campaign}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-primary">
                        ৳{donation.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-sm text-muted">{donation.method}</td>
                      <td className="px-5 py-3 text-sm text-muted">{donation.donationDate}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClasses[donation.status]}`}
                        >
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewDonation(donation)}
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-gray-50"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            disabled={!isPending || isWorking}
                            onClick={() => handleApprove(donation)}
                            className="inline-flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <CheckCircle2 size={14} />
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={isWorking}
                            onClick={() => handleRejectAsFake(donation)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="rounded-2xl border border-border bg-card px-4 py-5 text-sm text-muted">
            Loading donations...
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-4 py-5 text-sm text-muted">
            No donation records found.
          </div>
        ) : (
          filteredDonations.map((donation) => {
            const isPending = donation.status === "pending";
            const isWorking = workingId === donation.id;

            return (
              <div
                key={donation.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {donation.donorName}
                    </p>
                    <p className="text-xs text-muted">{donation.campaign}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClasses[donation.status]}`}
                  >
                    {donation.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-0.5">
                    <p className="text-[11px] uppercase tracking-wide text-muted">
                      Amount
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      ৳{donation.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] uppercase tracking-wide text-muted">
                      Method
                    </p>
                    <p className="text-sm text-foreground">
                      {donation.method || "—"}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] uppercase tracking-wide text-muted">
                      Date
                    </p>
                    <p className="text-sm text-foreground">
                      {donation.donationDate}
                    </p>
                  </div>
                  {donation.note && (
                    <div className="col-span-2 space-y-0.5">
                      <p className="text-[11px] uppercase tracking-wide text-muted">
                        Note
                      </p>
                      <p className="line-clamp-2 text-sm text-foreground">
                        {donation.note}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setViewDonation(donation)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-gray-50"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    disabled={!isPending || isWorking}
                    onClick={() => handleApprove(donation)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle2 size={14} />
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={isWorking}
                    onClick={() => handleRejectAsFake(donation)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    Reject
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {viewDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-6 sm:px-4 sm:py-8">
          <div className="max-h-full w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-white p-4 shadow-xl sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Donation details
                </h3>
                <p className="text-xs text-muted">
                  Created at{" "}
                  {new Date(viewDonation.createdAt).toLocaleString("en-GB")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewDonation(null)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-muted">Donor</p>
                <p className="text-sm font-semibold text-foreground">
                  {viewDonation.donorName}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-muted">Campaign</p>
                  <p className="text-sm font-semibold text-foreground">
                    {viewDonation.campaign}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-muted">Amount</p>
                  <p className="text-sm font-semibold text-primary">
                    ৳{viewDonation.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-muted">Payment method</p>
                  <p className="text-sm font-medium text-foreground">
                    {viewDonation.method || "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-muted">Donation date</p>
                  <p className="text-sm font-medium text-foreground">
                    {viewDonation.donationDate}
                  </p>
                </div>
              </div>

              {(viewDonation.sentToLabel || viewDonation.sentToDetails) && (
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-muted">Sent to (receiver account)</p>
                  <p className="text-sm font-medium text-foreground">
                    {viewDonation.sentToLabel
                      ? `${viewDonation.sentToLabel}: `
                      : null}
                    {viewDonation.sentToDetails}
                  </p>
                </div>
              )}

              {viewDonation.fromAccount && (
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-muted">From (sender account)</p>
                  <p className="text-sm font-medium text-foreground">
                    {viewDonation.fromAccount}
                  </p>
                </div>
              )}

              {viewDonation.note && (
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-muted">Reference / note</p>
                  <p className="text-sm font-medium text-foreground">
                    {viewDonation.note}
                  </p>
                </div>
              )}

              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-muted">Status</p>
                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-0.5 text-xs font-semibold ${statusClasses[viewDonation.status]}`}
                >
                  {viewDonation.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
