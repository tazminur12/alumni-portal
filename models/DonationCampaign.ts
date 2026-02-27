import { Model, Schema, model, models } from "mongoose";

export interface IDonationCampaign {
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  deadline: string;
  bannerImage: string;
  // legacy single-field storage (kept for backward compatibility)
  paymentAccount?: string;
  // preferred: multiple payment accounts
  paymentAccounts: Array<{
    label: string;
    details: string;
  }>;
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
      default: "",
      trim: true,
    },
    paymentAccounts: {
      type: [
        {
          label: { type: String, default: "", trim: true },
          details: { type: String, default: "", trim: true },
        },
      ],
      default: [],
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
  // If the model was compiled with older schema, relax required constraint at runtime.
  const paymentAccountPath = existingDonationCampaignModel.schema.path("paymentAccount");
  if (paymentAccountPath) {
    // Mongoose schema types expose `.required(...)` and `.options` but types are loose here.
    const schemaType = paymentAccountPath as unknown as {
      required?: (required: boolean) => void;
      options?: { required?: boolean };
    };
    if (typeof schemaType.required === "function") {
      schemaType.required(false);
    }
    if (schemaType.options) {
      schemaType.options.required = false;
    }
  }

  const extraFields = {
    targetAmount: { type: Number, min: 0, default: 0 },
    collectedAmount: { type: Number, min: 0, default: 0 },
    deadline: { type: String, default: "", trim: true },
    bannerImage: { type: String, default: "", trim: true },
    paymentAccount: { type: String, default: "", trim: true },
    paymentAccounts: {
      type: [
        {
          label: { type: String, default: "", trim: true },
          details: { type: String, default: "", trim: true },
        },
      ],
      default: [],
    },
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
