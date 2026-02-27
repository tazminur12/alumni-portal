import { Model, Schema, model, models } from "mongoose";

export interface IDonation {
  donorName: string;
  campaign: string;
  amount: number;
  method: "bKash" | "Nagad" | "Bank" | "Card" | "Cash";
  donationDate: string;
  note?: string;
  status: "received" | "pending" | "refunded";
  createdAt?: Date;
}

type DonationModel = Model<IDonation>;

const donationSchema = new Schema<IDonation>(
  {
    donorName: {
      type: String,
      required: true,
      trim: true,
    },
    campaign: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: ["bKash", "Nagad", "Bank", "Card", "Cash"],
      required: true,
      index: true,
    },
    donationDate: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["received", "pending", "refunded"],
      default: "received",
      index: true,
    },
  },
  { timestamps: true }
);

const Donation =
  (models.Donation as DonationModel) ||
  model<IDonation>("Donation", donationSchema);

export default Donation;
