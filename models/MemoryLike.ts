import { Model, Schema, model, models, Types } from "mongoose";

export interface IMemoryLike {
  memoryId: Types.ObjectId;
  likerKey: string; // "user-{id}" or "guest-{id}"
  userId?: Types.ObjectId;
  guestId?: string;
  createdAt: Date;
}

type MemoryLikeModel = Model<IMemoryLike>;

const memoryLikeSchema = new Schema<IMemoryLike>(
  {
    memoryId: {
      type: Schema.Types.ObjectId,
      ref: "Memory",
      required: true,
      index: true,
    },
    likerKey: {
      type: String,
      required: true,
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    guestId: { type: String },
  },
  { timestamps: true }
);

memoryLikeSchema.index({ memoryId: 1, likerKey: 1 }, { unique: true });

const MemoryLike =
  (models.MemoryLike as MemoryLikeModel) ||
  model<IMemoryLike>("MemoryLike", memoryLikeSchema);

export default MemoryLike;
