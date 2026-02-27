import { Model, Schema, model, models, Types } from "mongoose";

export interface IMemoryComment {
  memoryId: Types.ObjectId;
  authorName: string;
  authorId?: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

type MemoryCommentModel = Model<IMemoryComment>;

const memoryCommentSchema = new Schema<IMemoryComment>(
  {
    memoryId: {
      type: Schema.Types.ObjectId,
      ref: "Memory",
      required: true,
      index: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const MemoryComment =
  (models.MemoryComment as MemoryCommentModel) ||
  model<IMemoryComment>("MemoryComment", memoryCommentSchema);

export default MemoryComment;
