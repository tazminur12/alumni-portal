import { NextResponse } from "next/server";

import { getCurrentUser, isAdminRole } from "@/lib/current-user";
import { connectDb } from "@/lib/db";
import DonationCampaign from "@/models/DonationCampaign";

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    if (!isAdminRole(currentUser.role)) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { campaignId } = await params;
    const body = await request.json();
    const validated = validateCampaignBody(body);
    if ("error" in validated) {
      return NextResponse.json({ message: validated.error }, { status: 400 });
    }

    await connectDb();
    const updatedCampaign = await DonationCampaign.findByIdAndUpdate(
      campaignId,
      { $set: validated.data },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedCampaign) {
      return NextResponse.json(
        { message: "Campaign not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Donation campaign updated successfully.",
      campaign: {
        id: String(updatedCampaign._id),
        title: updatedCampaign.title,
        isActive: updatedCampaign.isActive,
      },
    });
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
      { message: "Failed to update donation campaign." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    if (!isAdminRole(currentUser.role)) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { campaignId } = await params;
    await connectDb();

    const deletedCampaign = await DonationCampaign.findByIdAndDelete(campaignId);
    if (!deletedCampaign) {
      return NextResponse.json(
        { message: "Campaign not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Campaign deleted successfully." });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete donation campaign." },
      { status: 500 }
    );
  }
}
