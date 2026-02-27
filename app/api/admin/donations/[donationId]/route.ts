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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ donationId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    if (!isAdminRole(currentUser.role)) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { donationId } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const validated = validateDonationBody(body);
    if ("error" in validated) {
      return NextResponse.json({ message: validated.error }, { status: 400 });
    }

    await connectDb();

    const existingDonation = await Donation.findById(donationId).lean();
    if (!existingDonation) {
      return NextResponse.json(
        { message: "Donation not found." },
        { status: 404 }
      );
    }

    const updatedDonation = await Donation.findByIdAndUpdate(
      donationId,
      { $set: validated.data },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedDonation) {
      return NextResponse.json(
        { message: "Donation not found." },
        { status: 404 }
      );
    }

    const oldCampaign = String((existingDonation as any).campaign ?? "");
    const newCampaign = String(updatedDonation.campaign ?? "");

    // Recalculate (best-effort) for affected campaigns so collectedAmount stays correct.
    await Promise.all([
      oldCampaign ? recalcCampaignCollectedAmount(oldCampaign) : Promise.resolve(),
      newCampaign && newCampaign !== oldCampaign
        ? recalcCampaignCollectedAmount(newCampaign)
        : Promise.resolve(),
    ]);

    return NextResponse.json({
      message: "Donation updated successfully.",
      donation: {
        id: String(updatedDonation._id),
        donorName: updatedDonation.donorName,
        amount: updatedDonation.amount,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to update donation." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ donationId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    if (!isAdminRole(currentUser.role)) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    const { donationId } = await params;
    await connectDb();

    const deletedDonation = await Donation.findByIdAndDelete(donationId).lean();
    if (!deletedDonation) {
      return NextResponse.json(
        { message: "Donation not found." },
        { status: 404 }
      );
    }

    const campaignTitle = String((deletedDonation as any).campaign ?? "");
    if ((deletedDonation as any).status === "received" && campaignTitle) {
      await recalcCampaignCollectedAmount(campaignTitle);
    }

    return NextResponse.json({ message: "Donation deleted successfully." });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete donation." },
      { status: 500 }
    );
  }
}
