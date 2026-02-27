import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import Donation from "@/models/Donation";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ donations: [], totalAmount: 0 });
    }

    await connectDb();

    const donations = await Donation.find({
      donorName: currentUser.fullName,
      status: { $ne: "refunded" },
    })
      .sort({ createdAt: -1 })
      .lean();

    const totalAmount = donations.reduce(
      (sum, d) => sum + Number(d.amount ?? 0),
      0
    );

    const list = donations.map((d) => ({
      id: String(d._id),
      campaign: d.campaign,
      amount: d.amount,
      donationDate: d.donationDate,
      status: d.status,
      createdAt: d.createdAt,
    }));

    return NextResponse.json({ donations: list, totalAmount });
  } catch {
    return NextResponse.json(
      { message: "Failed to load donations." },
      { status: 500 }
    );
  }
}
