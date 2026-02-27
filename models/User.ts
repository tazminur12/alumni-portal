import { Model, Schema, model, models } from "mongoose";

export interface IUser {
  fullName: string;
  batch: string;
  passingYear: string;
  email: string;
  password: string;
  profilePicture: string;
  collegeName: string;
  universityName: string;
  profession?: string;
  phone?: string;
  location?: string;
  bio?: string;
  role?: "super_admin" | "admin" | "moderator" | "alumni";
  status?: "active" | "pending" | "suspended";
}

type UserModel = Model<IUser>;

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    batch: {
      type: String,
      required: true,
      trim: true,
    },
    passingYear: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: true,
    },
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },
    universityName: {
      type: String,
      default: "",
      trim: true,
    },
    profession: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "moderator", "alumni"],
      default: "alumni",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "pending", "suspended"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

const existingUserModel = models.User as UserModel | undefined;

if (existingUserModel) {
  const extraFields = {
    phone: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    bio: { type: String, default: "", trim: true },
    role: {
      type: String,
      enum: ["super_admin", "admin", "moderator", "alumni"],
      default: "alumni",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "pending", "suspended"],
      default: "pending",
      index: true,
    },
  };

  for (const [field, options] of Object.entries(extraFields)) {
    if (!existingUserModel.schema.path(field)) {
      existingUserModel.schema.add({ [field]: options });
    }
  }
}

const User = existingUserModel || model<IUser>("User", userSchema);

export default User;
