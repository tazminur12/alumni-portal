import { NextResponse } from "next/server";

import { getCurrentUser, isAdminRole } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import Donation from "@/models/Donation";
import DonationCampaign from "@/models/DonationCampaign";

async function recalcCampaignCollectedAmount(campaignTitle: string) {
  if (!campaignTitle) return;

  const exists = await DonationCampaign.exists({ title: campaignTitle });
  if (!exists) return;

  const agg = await Donation.aggregate([
    { $match: { campaign: campaignTitle, status: "received" } },
    { $group: { _id: "$campaign", total: { $sum: "$amount" } } },
  ]);

  const total = Number(agg?.[0]?.total ?? 0);
  await DonationCampaign.updateOne(
    { title: campaignTitle },
    { $set: { collectedAmount: total } }
  );
}

function validateDonationBody(body: Record<string, unknown>) {
  const donorName =
    typeof body.donorName === "string" ? body.donorName.trim() : "";
  const campaign = typeof body.campaign === "string" ? body.campaign.trim() : "";
  const amount = Number(body.amount);
  const method = typeof body.method === "string" ? body.method.trim() : "";
  const donationDate =
    typeof body.donationDate === "string" ? body.donationDate.trim() : "";
  const note = typeof body.note === "string" ? body.note.trim() : "";
  const sentToLabel =
    typeof body.sentToLabel === "string" ? body.sentToLabel.trim() : "";
  const sentToDetails =
    typeof body.sentToDetails === "string" ? body.sentToDetails.trim() : "";
  const fromAccount =
    typeof body.fromAccount === "string" ? body.fromAccount.trim() : "";
  const status = typeof body.status === "string" ? body.status.trim() : "";

  if (!donorName || !campaign || !method || !donationDate) {
    return { error: "Donor name, campaign, method and date are required." };
  }

  if (Number.isNaN(amount) || amount < 0) {
    return { error: "Amount must be a valid non-negative number." };
  }

  if (!["received", "pending", "refunded"].includes(status)) {
    return { error: "Invalid donation status." };
  }

  return {
    data: {
      donorName,
      campaign,
      amount,
      method,
      sentToLabel,
      sentToDetails,
      fromAccount,
      donationDate,
      note,
      status,
    },
  };
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    if (!isAdminRole(currentUser.role)) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    await connectDb();

    const donations = await Donation.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      donations: donations.map((donation) => {
        const d = donation as {
          _id: unknown;
          donorName?: string;
          campaign?: string;
          amount?: number;
          method?: string;
          sentToLabel?: string;
          sentToDetails?: string;
          fromAccount?: string;
          donationDate?: string;
          note?: string;
          status?: string;
          createdAt?: unknown;
        };

        return {
          id: String(d._id),
          donorName: d.donorName ?? "",
          campaign: d.campaign ?? "",
          amount: Number(d.amount ?? 0),
          method: d.method ?? "",
          sentToLabel: d.sentToLabel ?? "",
          sentToDetails: d.sentToDetails ?? "",
          fromAccount: d.fromAccount ?? "",
          donationDate: d.donationDate ?? "",
          note: d.note ?? "",
          status: d.status ?? "pending",
          createdAt: d.createdAt,
        };
      }),
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load donations." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    if (!isAdminRole(currentUser.role)) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const validated = validateDonationBody(body);
    if ("error" in validated) {
      return NextResponse.json({ message: validated.error }, { status: 400 });
    }

    await connectDb();
    const donation = await Donation.create(validated.data);

    if (donation.status === "received") {
      await recalcCampaignCollectedAmount(donation.campaign);
    }

    return NextResponse.json(
      {
        message: "Donation created successfully.",
        donation: {
          id: String(donation._id),
          donorName: donation.donorName,
          amount: donation.amount,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to create donation." },
      { status: 500 }
    );
  }
}
