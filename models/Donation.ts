import { Model, Schema, model, models } from "mongoose";

export interface IDonation {
  donorName: string;
  campaign: string;
  amount: number;
  // payment method / channel label (admin-defined)
  method: string;
  // which receiver account was used (snapshot at time of donation)
  sentToLabel?: string;
  sentToDetails?: string;
  // sender account/number used to pay
  fromAccount?: string;
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
      required: true,
      index: true,
      trim: true,
    },
    sentToLabel: {
      type: String,
      default: "",
      trim: true,
    },
    sentToDetails: {
      type: String,
      default: "",
      trim: true,
    },
    fromAccount: {
      type: String,
      default: "",
      trim: true,
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
