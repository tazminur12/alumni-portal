import { Model, Schema, model, models } from "mongoose";

export interface IEvent {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  expectedAttendees: number;
  status: "upcoming" | "draft" | "completed";
  isRegistrationOpen: boolean;
  registrationDeadline?: string;
  registeredAttendees: number;
  createdAt: Date;
  updatedAt: Date;
}

type EventModel = Model<IEvent>;

const eventSchema = new Schema<IEvent>(
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
    time: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    expectedAttendees: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["upcoming", "draft", "completed"],
      default: "draft",
      index: true,
    },
    isRegistrationOpen: {
      type: Boolean,
      default: false,
    },
    registrationDeadline: {
      type: String,
    },
    registeredAttendees: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Event = (models.Event as EventModel) || model<IEvent>("Event", eventSchema);

export default Event;
