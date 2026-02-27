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
    const body = await request.json();
    const validated = validateDonationBody(body);
    if ("error" in validated) {
      return NextResponse.json({ message: validated.error }, { status: 400 });
    }

    await connectDb();

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

    const deletedDonation = await Donation.findByIdAndDelete(donationId);
    if (!deletedDonation) {
      return NextResponse.json(
        { message: "Donation not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Donation deleted successfully." });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete donation." },
      { status: 500 }
    );
  }
}
