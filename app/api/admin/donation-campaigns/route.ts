import { NextResponse } from "next/server";

import { getCurrentUser, isAdminRole } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import DonationCampaign from "@/models/DonationCampaign";
import Donation from "@/models/Donation";

type CampaignBody = {
  title?: string;
  description?: string;
  targetAmount?: number | string;
  collectedAmount?: number | string;
  deadline?: string;
  bannerImage?: string;
  paymentAccount?: string;
  paymentAccounts?: Array<{ label?: string; details?: string }>;
  isActive?: boolean;
};

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
  isActive?: boolean;
  createdAt?: Date | string;
};

function validateCampaignBody(body: CampaignBody) {
  const title = body.title?.trim();
  const description = body.description?.trim();
  const targetAmount = Number(body.targetAmount);
  const collectedAmount = Number(body.collectedAmount ?? 0);
  const deadline = body.deadline?.trim();
  const bannerImage = body.bannerImage?.trim() || "";
  const paymentAccounts =
    Array.isArray(body.paymentAccounts) && body.paymentAccounts.length > 0
      ? body.paymentAccounts
          .map((a) => ({
            label: String(a?.label ?? "").trim(),
            details: String(a?.details ?? "").trim(),
          }))
          .filter((a) => a.label || a.details)
      : typeof body.paymentAccount === "string" && body.paymentAccount.trim()
        ? [{ label: "Payment", details: body.paymentAccount.trim() }]
        : [];
  const legacyPaymentAccount = paymentAccounts
    .map((a) => (a.label ? `${a.label}: ${a.details}` : a.details))
    .filter(Boolean)
    .join("\n");
  const isActive = Boolean(body.isActive);

  if (!title || !description || !deadline || paymentAccounts.length === 0) {
    return {
      error:
        "Campaign title, description, deadline and at least one payment account are required.",
    };
  }

  if (Number.isNaN(targetAmount) || targetAmount < 0) {
    return { error: "Target amount must be a valid non-negative number." };
  }

  if (Number.isNaN(collectedAmount) || collectedAmount < 0) {
    return { error: "Collected amount must be a valid non-negative number." };
  }

  return {
    data: {
      title,
      description,
      targetAmount,
      goalAmount: targetAmount,
      collectedAmount,
      deadline,
      bannerImage,
      imageEmoji: bannerImage || "🎯",
      // keep legacy field populated for older schema / UI
      paymentAccount: legacyPaymentAccount,
      paymentAccounts,
      isActive,
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
    const campaigns = await DonationCampaign.find().sort({ createdAt: -1 }).lean();
    const receivedTotals = await Donation.aggregate([
      { $match: { status: "received" } },
      { $group: { _id: "$campaign", total: { $sum: "$amount" } } },
    ]);
    const receivedMap = new Map<string, number>(
      (receivedTotals as Array<{ _id: unknown; total?: unknown }>).map((r) => [
        String(r._id),
        Number(r.total ?? 0),
      ])
    );

    return NextResponse.json({
      campaigns: (campaigns as CampaignLean[]).map((campaign) => ({
        id: String(campaign._id),
        title: campaign.title,
        description: campaign.description,
        targetAmount: campaign.targetAmount ?? campaign.goalAmount ?? 0,
        collectedAmount:
          typeof campaign.title === "string" && receivedMap.has(campaign.title)
            ? receivedMap.get(campaign.title) ?? 0
            : campaign.collectedAmount ?? 0,
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
        isActive: Boolean(campaign.isActive),
        createdAt: campaign.createdAt,
      })),
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load donation campaigns." },
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
    const validated = validateCampaignBody(body);
    if ("error" in validated) {
      return NextResponse.json({ message: validated.error }, { status: 400 });
    }

    await connectDb();
    const campaign = await DonationCampaign.create(validated.data);

    return NextResponse.json(
      {
        message: "Donation campaign created successfully.",
        campaign: {
          id: String(campaign._id),
          title: campaign.title,
          isActive: campaign.isActive,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        { message: "Campaign title already exists. Use a different title." },
        { status: 409 }
      );
    }

    if (error instanceof Error && error.message) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Failed to create donation campaign." },
      { status: 500 }
    );
  }
}
