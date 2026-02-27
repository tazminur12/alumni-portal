import { NextResponse } from "next/server";

import { connectDb } from "@/lib/db";
import Donation from "@/models/Donation";
import DonationCampaign from "@/models/DonationCampaign";

type CampaignLean = {
  _id: unknown;
  title?: string;
  description?: string;
  targetAmount?: number;
  goalAmount?: number;
  collectedAmount?: number;
  deadline?: string;
  bannerImage?: string;
  imageEmoji?: string;
  paymentAccount?: string;
  paymentAccounts?: Array<{ label?: string; details?: string }>;
};

export async function GET() {
  try {
    await connectDb();

    const campaigns = await DonationCampaign.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    const receivedTotals = await Donation.aggregate([
      { $match: { status: "received" } },
      { $group: { _id: "$campaign", total: { $sum: "$amount" } } },
    ]);
    const receivedMap = new Map<string, number>(
      receivedTotals.map((r: any) => [String(r._id), Number(r.total ?? 0)])
    );
    const totalDonors = await Donation.countDocuments({
      status: { $ne: "refunded" },
    });

    const campaignItems = (campaigns as CampaignLean[]).map((campaign) => {
      const title = String(campaign.title ?? "");
      const computedCollected = receivedMap.get(title);
      return {
        id: String(campaign._id),
        title,
        description: campaign.description,
        targetAmount: Number(campaign.targetAmount ?? campaign.goalAmount ?? 0),
        collectedAmount:
          typeof computedCollected === "number"
            ? computedCollected
            : Number(campaign.collectedAmount ?? 0),
        deadline: campaign.deadline ?? "",
        bannerImage: campaign.bannerImage ?? campaign.imageEmoji ?? "",
        paymentAccount: campaign.paymentAccount ?? "",
        paymentAccounts: Array.isArray(campaign.paymentAccounts)
          ? campaign.paymentAccounts.map((a) => ({
              label: String(a?.label ?? ""),
              details: String(a?.details ?? ""),
            }))
          : campaign.paymentAccount
            ? [{ label: "Payment", details: campaign.paymentAccount }]
            : [],
      };
    });

    const totalRaised = campaignItems.reduce(
      (sum, campaign) => sum + campaign.collectedAmount,
      0
    );
    return NextResponse.json({
      stats: {
        totalRaised,
        totalDonors,
        activeCampaigns: campaignItems.length,
      },
      campaigns: campaignItems,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load active donation campaigns." },
      { status: 500 }
    );
  }
}
