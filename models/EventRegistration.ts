import { Model, Schema, model, models, Types } from "mongoose";

export interface IEventRegistration {
  eventId: Types.ObjectId;
  userId?: Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  batch: string;
  status: "registered" | "cancelled";
  registeredAt?: Date;
  createdAt?: Date;
}

type EventRegistrationModel = Model<IEventRegistration>;

const eventRegistrationSchema = new Schema<IEventRegistration>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["registered", "cancelled"],
      default: "registered",
    },
  },
  { timestamps: true }
);

const EventRegistration =
  (models.EventRegistration as EventRegistrationModel) ||
  model<IEventRegistration>("EventRegistration", eventRegistrationSchema);

export default EventRegistration;
