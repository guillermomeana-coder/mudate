/**
 * Seed properties for new hub pages:
 * Buenos Aires Capital, Rosario, Mendoza, Bariloche, Salta, Neuquén
 */
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

const IMGS = {
  depto: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  ],
  casa: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  ],
  terreno: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  ],
};

function img(type: string, i: number) {
  const arr = type === 'departamento' ? IMGS.depto : type === 'terreno' ? IMGS.terreno : IMGS.casa;
  return arr[i % arr.length];
}

function desc(title: string, ciudad: string, sup?: number, dorm?: number) {
  return `${title} en ${ciudad}.${sup ? ` ${sup} m² cubiertos.` : ''}${dorm ? ` ${dorm} dormitorio${dorm > 1 ? 's' : ''}.` : ''} Excelente ubicación y estado. Consultar disponibilidad.`;
}

const properties = [
  // ── BUENOS AIRES CAPITAL ─────────────────────────────────────────────────
  { slug: 'depto-palermo-2amb-luminoso', title: 'Departamento 2 ambientes luminoso — Palermo', price: 172000, currency: 'USD', type: 'departamento', ciudad: 'Buenos Aires Capital', barrio: 'Palermo', provincia: 'Buenos Aires', ambientes: 2, dormitorios: 1, banos: 1, superficie_cubierta: 58, images: [img('departamento', 0)], featured: true, published: true },
  { slug: 'depto-palermo-soho-3amb', title: 'Departamento 3 ambientes con balcón — Palermo Soho', price: 235000, currency: 'USD', type: 'departamento', ciudad: 'Buenos Aires Capital', barrio: 'Palermo Soho', provincia: 'Buenos Aires', ambientes: 3, dormitorios: 2, banos: 2, superficie_cubierta: 82, images: [img('departamento', 1)], featured: true, published: true },
  { slug: 'ph-recoleta-terraza-3amb', title: 'PH con terraza 3 ambientes — Recoleta', price: 315000, currency: 'USD', type: 'departamento', ciudad: 'Buenos Aires Capital', barrio: 'Recoleta', provincia: 'Buenos Aires', ambientes: 3, dormitorios: 2, banos: 2, superficie_cubierta: 115, images: [img('departamento', 2)], featured: true, published: true },
  { slug: 'monoambiente-belgrano-estrenar', title: 'Monoambiente a estrenar — Belgrano', price: 88000, currency: 'USD', type: 'departamento', ciudad: 'Buenos Aires Capital', barrio: 'Belgrano', provincia: 'Buenos Aires', ambientes: 1, dormitorios: 0, banos: 1, superficie_cubierta: 38, images: [img('departamento', 3)], featured: false, published: true },
  { slug: 'depto-villa-crespo-2amb', title: 'Departamento 2 ambientes — Villa Crespo', price: 128000, currency: 'USD', type: 'departamento', ciudad: 'Buenos Aires Capital', barrio: 'Villa Crespo', provincia: 'Buenos Aires', ambientes: 2, dormitorios: 1, banos: 1, superficie_cubierta: 54, images: [img('departamento', 0)], featured: false, published: true },
  { slug: 'depto-caballito-3amb-contrafrente', title: 'Departamento contrafrente 3 ambientes — Caballito', price: 158000, currency: 'USD', type: 'departamento', ciudad: 'Buenos Aires Capital', barrio: 'Caballito', provincia: 'Buenos Aires', ambientes: 3, dormitorios: 2, banos: 1, superficie_cubierta: 78, images: [img('departamento', 1)], featured: false, published: true },
  { slug: 'casa-san-telmo-con-patio', title: 'Casa con patio colonial — San Telmo', price: 290000, currency: 'USD', type: 'casa', ciudad: 'Buenos Aires Capital', barrio: 'San Telmo', provincia: 'Buenos Aires', ambientes: 4, dormitorios: 3, banos: 2, superficie_cubierta: 160, images: [img('casa', 0)], featured: true, published: true },
  { slug: 'depto-nunez-vista-rio-2amb', title: 'Departamento con vista al río — Núñez', price: 198000, currency: 'USD', type: 'departamento', ciudad: 'Buenos Aires Capital', barrio: 'Núñez', provincia: 'Buenos Aires', ambientes: 2, dormitorios: 1, banos: 1, superficie_cubierta: 65, images: [img('departamento', 2)], featured: false, published: true },
  { slug: 'depto-palermo-hollywood-2amb', title: 'Departamento moderno — Palermo Hollywood', price: 185000, currency: 'USD', type: 'departamento', ciudad: 'Buenos Aires Capital', barrio: 'Palermo Hollywood', provincia: 'Buenos Aires', ambientes: 2, dormitorios: 1, banos: 1, superficie_cubierta: 62, images: [img('departamento', 3)], featured: false, published: true },
  { slug: 'depto-flores-3amb-centrico', title: 'Departamento 3 ambientes — Flores', price: 112000, currency: 'USD', type: 'departamento', ciudad: 'Buenos Aires Capital', barrio: 'Flores', provincia: 'Buenos Aires', ambientes: 3, dormitorios: 2, banos: 1, superficie_cubierta: 72, images: [img('departamento', 0)], featured: false, published: true },

  // ── ROSARIO ──────────────────────────────────────────────────────────────
  { slug: 'depto-rosario-pichincha-2amb', title: 'Departamento 2 ambientes con balcón — Pichincha', price: 118000, currency: 'USD', type: 'departamento', ciudad: 'Rosario', barrio: 'Pichincha', provincia: 'Santa Fe', ambientes: 2, dormitorios: 1, banos: 1, superficie_cubierta: 65, images: [img('departamento', 1)], featured: true, published: true },
  { slug: 'casa-fisherton-4dorm-con-piscina', title: 'Casa 4 dormitorios con piscina — Fisherton', price: 295000, currency: 'USD', type: 'casa', ciudad: 'Rosario', barrio: 'Fisherton', provincia: 'Santa Fe', ambientes: 5, dormitorios: 4, banos: 3, superficie_cubierta: 220, images: [img('casa', 1)], featured: true, published: true },
  { slug: 'depto-puerto-norte-torre-2amb', title: 'Departamento torre — Puerto Norte', price: 168000, currency: 'USD', type: 'departamento', ciudad: 'Rosario', barrio: 'Puerto Norte', provincia: 'Santa Fe', ambientes: 2, dormitorios: 1, banos: 1, superficie_cubierta: 60, images: [img('departamento', 2)], featured: true, published: true },
  { slug: 'depto-rosario-alberdi-3amb', title: 'Departamento 3 ambientes — Alberdi', price: 132000, currency: 'USD', type: 'departamento', ciudad: 'Rosario', barrio: 'Alberdi', provincia: 'Santa Fe', ambientes: 3, dormitorios: 2, banos: 1, superficie_cubierta: 80, images: [img('departamento', 3)], featured: false, published: true },
  { slug: 'casa-rosario-echesortu-con-jardin', title: 'Casa con jardín — Echesortu', price: 185000, currency: 'USD', type: 'casa', ciudad: 'Rosario', barrio: 'Echesortu', provincia: 'Santa Fe', ambientes: 4, dormitorios: 3, banos: 2, superficie_cubierta: 150, images: [img('casa', 2)], featured: false, published: true },
  { slug: 'depto-rosario-centro-monoambiente', title: 'Monoambiente a estrenar — Centro Rosario', price: 72000, currency: 'USD', type: 'departamento', ciudad: 'Rosario', barrio: 'Centro', provincia: 'Santa Fe', ambientes: 1, dormitorios: 0, banos: 1, superficie_cubierta: 36, images: [img('departamento', 0)], featured: false, published: true },
  { slug: 'depto-rosario-la-florida-2amb', title: 'Departamento frente a parque — La Florida', price: 145000, currency: 'USD', type: 'departamento', ciudad: 'Rosario', barrio: 'La Florida', provincia: 'Santa Fe', ambientes: 2, dormitorios: 1, banos: 1, superficie_cubierta: 68, images: [img('departamento', 1)], featured: false, published: true },

  // ── MENDOZA ──────────────────────────────────────────────────────────────
  { slug: 'depto-mendoza-centro-2amb-buen-estado', title: 'Departamento 2 ambientes — Centro Mendoza', price: 95000, currency: 'USD', type: 'departamento', ciudad: 'Mendoza', barrio: 'Centro', provincia: 'Mendoza', ambientes: 2, dormitorios: 1, banos: 1, superficie_cubierta: 60, images: [img('departamento', 2)], featured: false, published: true },
  { slug: 'casa-godoy-cruz-3dorm-piscina', title: 'Casa con piscina 3 dormitorios — Godoy Cruz', price: 265000, currency: 'USD', type: 'casa', ciudad: 'Mendoza', barrio: 'Godoy Cruz', provincia: 'Mendoza', ambientes: 4, dormitorios: 3, banos: 2, superficie_cubierta: 185, images: [img('casa', 3)], featured: true, published: true },
  { slug: 'finca-lujan-de-cuyo-vinedo-con-casa', title: 'Finca con viñedo y casa — Luján de Cuyo', price: 520000, currency: 'USD', type: 'casa', ciudad: 'Mendoza', barrio: 'Luján de Cuyo', provincia: 'Mendoza', ambientes: 5, dormitorios: 4, banos: 3, superficie_cubierta: 280, images: [img('terreno', 0)], featured: true, published: true },
  { slug: 'casa-maipu-bodega-con-proyecto', title: 'Casa con bodega — Maipú', price: 185000, currency: 'USD', type: 'casa', ciudad: 'Mendoza', barrio: 'Maipú', provincia: 'Mendoza', ambientes: 4, dormitorios: 3, banos: 2, superficie_cubierta: 160, images: [img('casa', 4)], featured: false, published: true },
  { slug: 'depto-mendoza-3amb-con-cochera', title: 'Departamento 3 ambientes con cochera — Mendoza', price: 135000, currency: 'USD', type: 'departamento', ciudad: 'Mendoza', barrio: 'Centro', provincia: 'Mendoza', ambientes: 3, dormitorios: 2, banos: 1, superficie_cubierta: 85, images: [img('departamento', 3)], featured: false, published: true },
  { slug: 'terreno-chacras-de-coria-1800m2', title: 'Terreno 1.800 m² — Chacras de Coria', price: 145000, currency: 'USD', type: 'terreno', ciudad: 'Mendoza', barrio: 'Chacras de Coria', provincia: 'Mendoza', ambientes: 0, dormitorios: 0, banos: 0, superficie_cubierta: 1800, images: [img('terreno', 1)], featured: false, published: true },
  { slug: 'casa-mendoza-barrio-privado-4dorm', title: 'Casa en barrio privado — Mendoza Capital', price: 320000, currency: 'USD', type: 'casa', ciudad: 'Mendoza', barrio: 'Barrio Privado', provincia: 'Mendoza', ambientes: 5, dormitorios: 4, banos: 3, superficie_cubierta: 240, images: [img('casa', 0)], featured: true, published: true },

  // ── BARILOCHE ────────────────────────────────────────────────────────────
  { slug: 'depto-bariloche-centro-vista-lago', title: 'Departamento con vista al lago — Centro Bariloche', price: 165000, currency: 'USD', type: 'departamento', ciudad: 'Bariloche', barrio: 'Centro', provincia: 'Río Negro', ambientes: 2, dormitorios: 1, banos: 1, superficie_cubierta: 60, images: [img('departamento', 0)], featured: true, published: true },
  { slug: 'chalet-bariloche-melipal-4dorm', title: 'Chalet 4 dormitorios con vista — Melipal', price: 420000, currency: 'USD', type: 'casa', ciudad: 'Bariloche', barrio: 'Melipal', provincia: 'Río Negro', ambientes: 5, dormitorios: 4, banos: 3, superficie_cubierta: 200, images: [img('casa', 3)], featured: true, published: true },
  { slug: 'cabana-bariloche-los-coihues-3dorm', title: 'Cabaña 3 dormitorios en bosque — Villa Los Coihues', price: 245000, currency: 'USD', type: 'casa', ciudad: 'Bariloche', barrio: 'Villa Los Coihues', provincia: 'Río Negro', ambientes: 4, dormitorios: 3, banos: 2, superficie_cubierta: 120, images: [img('casa', 4)], featured: true, published: true },
  { slug: 'terreno-bariloche-nahuel-huapi-800m2', title: 'Terreno 800 m² con vista al lago — Nahuel Huapi', price: 185000, currency: 'USD', type: 'terreno', ciudad: 'Bariloche', barrio: 'Nahuel Huapi', provincia: 'Río Negro', ambientes: 0, dormitorios: 0, banos: 0, superficie_cubierta: 800, images: [img('terreno', 0)], featured: false, published: true },
  { slug: 'apart-hotel-bariloche-ski-2amb', title: 'Departamento apart-hotel — Zona Ski', price: 195000, currency: 'USD', type: 'departamento', ciudad: 'Bariloche', barrio: 'Zona Ski', provincia: 'Río Negro', ambientes: 2, dormitorios: 1, banos: 1, superficie_cubierta: 55, images: [img('departamento', 1)], featured: false, published: true },
  { slug: 'casa-bariloche-mallín-2dorm', title: 'Casa en el mallín 2 dormitorios', price: 158000, currency: 'USD', type: 'casa', ciudad: 'Bariloche', barrio: 'El Mallín', provincia: 'Río Negro', ambientes: 3, dormitorios: 2, banos: 1, superficie_cubierta: 90, images: [img('casa', 0)], featured: false, published: true },

  // ── SALTA ────────────────────────────────────────────────────────────────
  { slug: 'depto-salta-tres-cerritos-2amb', title: 'Departamento 2 ambientes — Tres Cerritos', price: 115000, currency: 'USD', type: 'departamento', ciudad: 'Salta', barrio: 'Tres Cerritos', provincia: 'Salta', ambientes: 2, dormitorios: 1, banos: 1, superficie_cubierta: 62, images: [img('departamento', 2)], featured: true, published: true },
  { slug: 'casa-salta-san-lorenzo-3dorm', title: 'Casa 3 dormitorios con jardín — San Lorenzo', price: 195000, currency: 'USD', type: 'casa', ciudad: 'Salta', barrio: 'San Lorenzo', provincia: 'Salta', ambientes: 4, dormitorios: 3, banos: 2, superficie_cubierta: 155, images: [img('casa', 1)], featured: true, published: true },
  { slug: 'depto-salta-centro-historico-2amb', title: 'Departamento en centro histórico — Salta', price: 88000, currency: 'USD', type: 'departamento', ciudad: 'Salta', barrio: 'Centro Histórico', provincia: 'Salta', ambientes: 2, dormitorios: 1, banos: 1, superficie_cubierta: 55, images: [img('departamento', 3)], featured: false, published: true },
  { slug: 'finca-salta-lerma-vinedos', title: 'Finca en Valle de Lerma — Salta', price: 380000, currency: 'USD', type: 'casa', ciudad: 'Salta', barrio: 'Valle de Lerma', provincia: 'Salta', ambientes: 5, dormitorios: 4, banos: 3, superficie_cubierta: 320, images: [img('terreno', 1)], featured: true, published: true },

  // ── NEUQUÉN ──────────────────────────────────────────────────────────────
  { slug: 'depto-neuquen-confluencia-3amb', title: 'Departamento 3 ambientes — Confluencia', price: 155000, currency: 'USD', type: 'departamento', ciudad: 'Neuquén', barrio: 'Confluencia', provincia: 'Neuquén', ambientes: 3, dormitorios: 2, banos: 1, superficie_cubierta: 82, images: [img('departamento', 0)], featured: true, published: true },
  { slug: 'casa-neuquen-alta-barda-4dorm', title: 'Casa 4 dormitorios — Alta Barda', price: 285000, currency: 'USD', type: 'casa', ciudad: 'Neuquén', barrio: 'Alta Barda', provincia: 'Neuquén', ambientes: 5, dormitorios: 4, banos: 3, superficie_cubierta: 210, images: [img('casa', 2)], featured: true, published: true },
  { slug: 'depto-neuquen-centro-2amb-vaca-muerta', title: 'Departamento 2 ambientes — Centro Neuquén', price: 128000, currency: 'USD', type: 'departamento', ciudad: 'Neuquén', barrio: 'Centro', provincia: 'Neuquén', ambientes: 2, dormitorios: 1, banos: 1, superficie_cubierta: 65, images: [img('departamento', 1)], featured: false, published: true },
  { slug: 'terreno-neuquen-plottier-1200m2', title: 'Terreno 1.200 m² — Plottier', price: 95000, currency: 'USD', type: 'terreno', ciudad: 'Neuquén', barrio: 'Plottier', provincia: 'Neuquén', ambientes: 0, dormitorios: 0, banos: 0, superficie_cubierta: 1200, images: [img('terreno', 0)], featured: false, published: true },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  let inserted = 0, skipped = 0;
  for (const p of properties) {
    try {
      const full = {
        ...p,
        description: desc(p.title, p.ciudad, p.superficie_cubierta, p.dormitorios),
        operation: 'venta',
        source: 'mudate-curated',
      };
      await Property.findOneAndUpdate(
        { slug: p.slug },
        { $setOnInsert: full },
        { upsert: true, new: true }
      );
      inserted++;
    } catch (e: any) {
      if (e.code === 11000) { skipped++; } else { console.error(p.slug, e.message); }
    }
  }
  console.log(`Done: ${inserted} upserted, ${skipped} already existed`);
  await mongoose.disconnect();
}

seed().catch(console.error);
