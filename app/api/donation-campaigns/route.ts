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
};

export async function GET() {
  try {
    await connectDb();

    const campaigns = await DonationCampaign.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    const totalDonors = await Donation.countDocuments({
      status: { $ne: "refunded" },
    });

    const campaignItems = (campaigns as CampaignLean[]).map((campaign) => {
      return {
        id: String(campaign._id),
        title: campaign.title,
        description: campaign.description,
        targetAmount: Number(campaign.targetAmount ?? campaign.goalAmount ?? 0),
        collectedAmount: Number(campaign.collectedAmount ?? 0),
        deadline: campaign.deadline ?? "",
        bannerImage: campaign.bannerImage ?? campaign.imageEmoji ?? "",
        paymentAccount: campaign.paymentAccount ?? "",
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
