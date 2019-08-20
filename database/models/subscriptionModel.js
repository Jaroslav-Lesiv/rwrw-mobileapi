import { Schema } from "mongoose";

const ObjectId = Schema.ObjectId;

const SubscriptionSchema = new Schema(
  {
    price: { type: Number, default: 0, notNull: true, required: true },
    period: { type: Number, required: true, default: 1 },
    active: { type: Boolean, required: true, default: true }
  },
  { timestamps: true }
);

export default SubscriptionSchema;
