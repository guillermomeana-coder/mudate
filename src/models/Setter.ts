import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISetter extends Document {
  nombre: string;
  email: string;
  telefono?: string;
  active: boolean;
  assignedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SetterSchema = new Schema<ISetter>(
  {
    nombre:        { type: String, required: true },
    email:         { type: String, required: true, unique: true },
    telefono:      { type: String },
    active:        { type: Boolean, default: true },
    assignedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Setter: Model<ISetter> =
  mongoose.models.Setter || mongoose.model<ISetter>('Setter', SetterSchema);
