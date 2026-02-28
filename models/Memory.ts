import { Model, Schema, model, models, Types } from "mongoose";

export interface IMemory {
  title: string;
  description: string;
  date: string;
  batch: string;
  author: string;
  authorId?: Types.ObjectId;
  imageUrl?: string;
  images?: string[];
  likes: number;
  comments: number;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

type MemoryModel = Model<IMemory>;

const memorySchema = new Schema<IMemory>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    batch: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function(val: string[]) {
          return val.length <= 10;
        },
        message: 'A memory can have at most 10 images.'
      }
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    comments: {
      type: Number,
      default: 0,
      min: 0,
    },
    color: {
      type: String,
      default: "from-primary/5 to-primary/10",
    },
  },
  { timestamps: true }
);

const Memory =
  (models.Memory as MemoryModel) || model<IMemory>("Memory", memorySchema);

export default Memory;
