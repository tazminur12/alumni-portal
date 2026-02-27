import { Model, Schema, model, models } from "mongoose";

export interface ISlideshow {
  imageUrl: string;
  caption?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

type SlideshowModel = Model<ISlideshow>;

const slideshowSchema = new Schema<ISlideshow>(
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

const Slideshow =
  (models.Slideshow as SlideshowModel) ||
  model<ISlideshow, SlideshowModel>("Slideshow", slideshowSchema);

export default Slideshow;
