import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILead extends Document {
  nombre: string;
  telefono: string;
  email?: string;
  mensaje?: string;
  propertySlug: string;
  propertyTitle: string;
  ciudad: string;
  source: string;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    nombre:        { type: String, required: true },
    telefono:      { type: String, required: true },
    email:         { type: String },
    mensaje:       { type: String },
    propertySlug:  { type: String, required: true },
    propertyTitle: { type: String },
    ciudad:        { type: String },
    source:        { type: String, default: 'propiedades' },
  },
  { timestamps: true }
);

LeadSchema.index({ propertySlug: 1 });
LeadSchema.index({ createdAt: -1 });

export const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
