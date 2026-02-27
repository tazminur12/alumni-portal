import { Model, Schema, model, models } from "mongoose";

export interface IDonationCampaign {
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  deadline: string;
  bannerImage: string;
  paymentAccount: string;
  isActive: boolean;
}

type DonationCampaignModel = Model<IDonationCampaign>;

const donationCampaignSchema = new Schema<IDonationCampaign>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    collectedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deadline: {
      type: String,
      required: true,
      trim: true,
    },
    bannerImage: {
      type: String,
      default: "",
      trim: true,
    },
    paymentAccount: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

const existingDonationCampaignModel = models.DonationCampaign as
  | DonationCampaignModel
  | undefined;

if (existingDonationCampaignModel) {
  const extraFields = {
    targetAmount: { type: Number, min: 0, default: 0 },
    collectedAmount: { type: Number, min: 0, default: 0 },
    deadline: { type: String, default: "", trim: true },
    bannerImage: { type: String, default: "", trim: true },
    paymentAccount: { type: String, default: "", trim: true },
  };

  for (const [field, options] of Object.entries(extraFields)) {
    if (!existingDonationCampaignModel.schema.path(field)) {
      existingDonationCampaignModel.schema.add({ [field]: options });
    }
  }
}

const DonationCampaign =
  existingDonationCampaignModel ||
  model<IDonationCampaign>("DonationCampaign", donationCampaignSchema);

export default DonationCampaign;
