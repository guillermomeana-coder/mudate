import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: 'USD' | 'ARS';
  operation: 'venta' | 'alquiler';
  type: 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina' | 'campo' | 'cochera' | 'galpon';
  ciudad: string;
  barrio: string;
  provincia: string;
  ambientes?: number;
  dormitorios?: number;
  banos?: number;
  superficie_total?: number;
  superficie_cubierta?: number;
  images: string[];
  coordinates?: { lat: number; lng: number };
  source_url?: string;
  source: 'zonaprop' | 'argenprop' | 'manual';
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, enum: ['USD', 'ARS'], default: 'USD' },
    operation: { type: String, enum: ['venta', 'alquiler'], required: true },
    type: {
      type: String,
      enum: ['casa', 'departamento', 'terreno', 'local', 'oficina', 'campo', 'cochera', 'galpon'],
      required: true,
    },
    ciudad: { type: String, required: true },
    barrio: { type: String, default: '' },
    provincia: { type: String, default: 'Córdoba' },
    ambientes: Number,
    dormitorios: Number,
    banos: Number,
    superficie_total: Number,
    superficie_cubierta: Number,
    images: [String],
    coordinates: { lat: Number, lng: Number },
    source_url: String,
    source: { type: String, enum: ['zonaprop', 'argenprop', 'manual'], default: 'manual' },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PropertySchema.index({ ciudad: 1, operation: 1, type: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ featured: 1, published: 1 });

export const Property =
  mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
