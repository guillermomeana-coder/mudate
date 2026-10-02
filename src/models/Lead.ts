import mongoose, { Schema, Document, Model } from 'mongoose';

export type LeadStatus = 'nuevo' | 'contactado' | 'calificado' | 'en_tratativa' | 'cerrado' | 'perdido';

export interface ILead extends Document {
  nombre: string;
  telefono: string;
  email?: string;
  mensaje?: string;
  propertySlug: string;
  propertyTitle: string;
  ciudad: string;
  source: string;
  status: LeadStatus;
  assignedTo?: string;   // Setter._id as string
  assignedName?: string; // Setter nombre (denormalized for fast reads)
  assignedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
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
    status:        { type: String, enum: ['nuevo', 'contactado', 'calificado', 'en_tratativa', 'cerrado', 'perdido'], default: 'nuevo' },
    assignedTo:    { type: String },
    assignedName:  { type: String },
    assignedAt:    { type: Date },
    notes:         { type: String },
  },
  { timestamps: true }
);

LeadSchema.index({ propertySlug: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ assignedTo: 1 });

export const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
