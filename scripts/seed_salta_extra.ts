import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://inmocultural_db_user:fIVTKcJ6PLk41elg@mudate.8u0oikg.mongodb.net/mudate?retryWrites=true&w=majority&appName=mudate';

const PropertySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: String, description: String, price: Number, currency: String,
  operation: String, type: String, ciudad: String, barrio: String,
  provincia: String, ambientes: Number, dormitorios: Number, banos: Number,
  superficie_total: Number, superficie_cubierta: Number,
  images: [String], source: String, featured: Boolean, published: Boolean,
}, { timestamps: true });

const Property = mongoose.models?.Property || mongoose.model('Property', PropertySchema);

const extra = [
  { slug: 'terreno-salta-cerrillos-1500m2', title: 'Terreno 1.500 m² — Cerrillos', price: 68000, currency: 'USD', type: 'terreno', ciudad: 'Salta', barrio: 'Cerrillos', provincia: 'Salta', ambientes: 0, dormitorios: 0, banos: 0, superficie_cubierta: 1500, images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'], featured: false, published: true },
  { slug: 'terreno-salta-campo-quijano-2000m2', title: 'Terreno 2.000 m² en quebrada — Campo Quijano', price: 52000, currency: 'USD', type: 'terreno', ciudad: 'Salta', barrio: 'Campo Quijano', provincia: 'Salta', ambientes: 0, dormitorios: 0, banos: 0, superficie_cubierta: 2000, images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'], featured: false, published: true },
  { slug: 'casa-salta-centro-historico-colonial', title: 'Casa colonial en centro histórico — Salta', price: 145000, currency: 'USD', type: 'casa', ciudad: 'Salta', barrio: 'Centro Histórico', provincia: 'Salta', ambientes: 4, dormitorios: 3, banos: 2, superficie_cubierta: 180, images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80'], featured: true, published: true },
  { slug: 'depto-salta-tres-cerritos-3amb', title: 'Departamento 3 ambientes luminoso — Tres Cerritos', price: 175000, currency: 'USD', type: 'departamento', ciudad: 'Salta', barrio: 'Tres Cerritos', provincia: 'Salta', ambientes: 3, dormitorios: 2, banos: 2, superficie_cubierta: 88, images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'], featured: false, published: true },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  let ok = 0;
  for (const p of extra) {
    const full = { ...p, operation: 'venta', source: 'mudate-curated', description: `${p.title} en ${p.ciudad}. Excelente oportunidad de inversión.` };
    await Property.findOneAndUpdate({ slug: p.slug }, { $setOnInsert: full }, { upsert: true, new: true });
    ok++;
    console.log('OK:', p.slug);
  }
  console.log(`Done: ${ok} seeded`);
  await mongoose.disconnect();
}
seed().catch(console.error);
