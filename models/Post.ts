import { Model, Schema, model, models } from "mongoose";

export interface IPost {
  title: string;
  content: string;
  author: string; // Storing author name or ID
  category: "Announcement" | "Career" | "News" | "Events" | "Story";
  status: "Published" | "Draft" | "Review";
  createdAt: Date;
  updatedAt: Date;
}

type PostModel = Model<IPost>;

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Announcement", "Career", "News", "Events", "Story"],
      default: "Announcement",
    },
    status: {
      type: String,
      enum: ["Published", "Draft", "Review"],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

const Post = (models.Post as PostModel) || model<IPost, PostModel>("Post", postSchema);

export default Post;
