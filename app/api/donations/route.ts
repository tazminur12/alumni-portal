import { NextResponse } from "next/server";

import { connectDb } from "@/lib/db";
import Donation from "@/models/Donation";

function validateDonationBody(body: any) {
  const donorName = body.donorName?.trim();
  const campaign = body.campaign?.trim();
  const amount = Number(body.amount);
  const method = body.method?.trim();
  const donationDate = body.donationDate?.trim();
  const note = body.note?.trim() || "";

  if (!donorName || !campaign || !method || !donationDate) {
    return { error: "Donor name, campaign, payment method and date are required." };
  }

  if (Number.isNaN(amount) || amount <= 0) {
    return { error: "Amount must be a valid positive number." };
  }

  if (!["bKash", "Nagad", "Bank", "Card", "Cash"].includes(method)) {
    return { error: "Invalid payment method." };
  }

  return {
    data: {
      donorName,
      campaign,
      amount,
      method,
      donationDate,
      note,
    },
  };
}

export async function GET() {
  try {
    await connectDb();

    const donations = await Donation.find({ status: { $ne: "refunded" } })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const totalAmount = donations.reduce(
      (sum: number, donation: any) => sum + Number(donation.amount ?? 0),
      0
    );
    const donorSet = new Set(
      donations.map((donation: any) => donation.donorName?.trim()).filter(Boolean)
    );

    return NextResponse.json({
      stats: {
        totalAmount,
        totalDonors: donorSet.size,
      },
      donations: donations.map((donation: any) => ({
        id: String(donation._id),
        donorName: donation.donorName,
        campaign: donation.campaign,
        amount: donation.amount,
        method: donation.method,
        donationDate: donation.donationDate,
        status: donation.status,
        createdAt: donation.createdAt,
      })),
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load donation data." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = validateDonationBody(body);
    if ("error" in validated) {
      return NextResponse.json({ message: validated.error }, { status: 400 });
    }

    await connectDb();

    const donation = await Donation.create({
      ...validated.data,
      status: "pending",
    });

    return NextResponse.json(
      {
        message: "Donation submitted successfully.",
        donation: {
          id: String(donation._id),
          donorName: donation.donorName,
          amount: donation.amount,
          status: donation.status,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to submit donation." },
      { status: 500 }
    );
  }
}
