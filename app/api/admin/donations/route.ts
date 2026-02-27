import { NextResponse } from "next/server";

import { getCurrentUser, isAdminRole } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import Donation from "@/models/Donation";

function validateDonationBody(body: any) {
  const donorName = body.donorName?.trim();
  const campaign = body.campaign?.trim();
  const amount = Number(body.amount);
  const method = body.method?.trim();
  const donationDate = body.donationDate?.trim();
  const note = body.note?.trim() || "";
  const status = body.status?.trim();

  if (!donorName || !campaign || !method || !donationDate) {
    return { error: "Donor name, campaign, method and date are required." };
  }

  if (Number.isNaN(amount) || amount < 0) {
    return { error: "Amount must be a valid non-negative number." };
  }

  if (!["bKash", "Nagad", "Bank", "Card", "Cash"].includes(method)) {
    return { error: "Invalid payment method." };
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
      donations: donations.map((donation: any) => ({
        id: String(donation._id),
        donorName: donation.donorName,
        campaign: donation.campaign,
        amount: donation.amount,
        method: donation.method,
        donationDate: donation.donationDate,
        note: donation.note ?? "",
        status: donation.status,
        createdAt: donation.createdAt,
      })),
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

    const body = await request.json();
    const validated = validateDonationBody(body);
    if ("error" in validated) {
      return NextResponse.json({ message: validated.error }, { status: 400 });
    }

    await connectDb();
    const donation = await Donation.create(validated.data);

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
