import { Model, Schema, model, models } from "mongoose";

export interface IGallery {
  imageUrl: string;
  caption?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

type GalleryModel = Model<IGallery>;

const gallerySchema = new Schema<IGallery>(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      default: "",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Gallery =
  (models.Gallery as GalleryModel) ||
  model<IGallery, GalleryModel>("Gallery", gallerySchema);

export default Gallery;
