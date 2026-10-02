import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  source: string;
  active: boolean;
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email:  { type: String, required: true, lowercase: true },
    source: { type: String, default: 'newsletter' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SubscriberSchema.index({ email: 1 }, { unique: true });

export const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);
