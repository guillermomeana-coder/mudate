import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const PropertySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, enum: ['USD', 'ARS'], default: 'USD' },
  operation: { type: String, default: 'venta' },
  type: { type: String, required: true },
  ciudad: { type: String, required: true },
  barrio: { type: String, default: '' },
  provincia: { type: String, default: 'Buenos Aires' },
  ambientes: Number,
  dormitorios: Number,
  banos: Number,
  superficie_total: Number,
  superficie_cubierta: Number,
  images: [String],
  coordinates: { lat: Number, lng: Number },
  source: { type: String, default: 'manual' },
  categoria: { type: String, default: 'standard' },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
}, { timestamps: true });

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

const luxuryProperties = [
  // ── BUENOS AIRES ──
  {
    slug: 'penthouse-puerto-madero-vista-rio-4amb',
    title: 'Penthouse en Puerto Madero con vista al río, 4 ambientes, 220 m²',
    description: 'Penthouse de lujo en el corazón de Puerto Madero con vista panorámica al Río de la Plata y la Reserva Ecológica. Piso completo con terraza privada, 3 dormitorios en suite, living-comedor de doble altura, cocina gourmet con isla, 3 cocheras. Edificio con amenities premium: piscina climatizada, gym, spa, salón de eventos, seguridad 24hs. Ideal para inversores internacionales que buscan la mejor ubicación de Buenos Aires.',
    price: 850000,
    currency: 'USD',
    type: 'departamento',
    ciudad: 'Buenos Aires',
    barrio: 'Puerto Madero',
    provincia: 'Buenos Aires',
    ambientes: 4,
    dormitorios: 3,
    banos: 3,
    superficie_total: 250,
    superficie_cubierta: 220,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    ],
    coordinates: { lat: -34.6145, lng: -58.3631 },
    categoria: 'luxury',
    featured: true,
  },
  {
    slug: 'departamento-recoleta-alvear-5amb-luxury',
    title: 'Departamento de lujo en Recoleta, Av. Alvear, 5 ambientes, 280 m²',
    description: 'Propiedad señorial sobre Avenida Alvear, la arteria más exclusiva de Buenos Aires. 4 dormitorios, 4 baños, dependencia de servicio, living de 60 m² con pisos de roble francés, molduras originales restauradas. Cochera doble. A metros del Palacio Duhau Park Hyatt y el Four Seasons. Edificio de categoría con portería 24hs.',
    price: 720000,
    currency: 'USD',
    type: 'departamento',
    ciudad: 'Buenos Aires',
    barrio: 'Recoleta',
    provincia: 'Buenos Aires',
    ambientes: 5,
    dormitorios: 4,
    banos: 4,
    superficie_total: 300,
    superficie_cubierta: 280,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18e6f4857?w=800&q=80',
    ],
    coordinates: { lat: -34.5875, lng: -58.3893 },
    categoria: 'luxury',
    featured: true,
  },
  {
    slug: 'loft-palermo-soho-premium-3amb',
    title: 'Loft premium en Palermo Soho, 3 ambientes, diseño de autor, 140 m²',
    description: 'Loft de diseño en el corazón de Palermo Soho. Doble altura, ventanales de piso a techo, terraza con parrilla y jacuzzi. Cocina integrada con electrodomésticos importados, 2 dormitorios en suite. Edificio boutique de solo 8 unidades. Zona gastronómica y comercial premium. Rentabilidad Airbnb estimada: 6.5% anual en USD.',
    price: 320000,
    currency: 'USD',
    type: 'departamento',
    ciudad: 'Buenos Aires',
    barrio: 'Palermo',
    provincia: 'Buenos Aires',
    ambientes: 3,
    dormitorios: 2,
    banos: 2,
    superficie_total: 160,
    superficie_cubierta: 140,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1600210492493-0946911f159a?w=800&q=80',
    ],
    coordinates: { lat: -34.5880, lng: -58.4307 },
    categoria: 'premium',
    featured: true,
  },
  {
    slug: 'piso-belgrano-r-torre-premium-4amb',
    title: 'Piso en torre premium Belgrano R, 4 ambientes, vista ciudad, 185 m²',
    description: 'Piso alto en torre de categoría en Belgrano R, la zona residencial más exclusiva del barrio. 3 dormitorios en suite, estar familiar, dependencia completa. Balcón terraza con vista a la ciudad. 2 cocheras. Amenities: piscina, gym, SUM, seguridad 24hs. A metros del Barrio Chino y la estación Juramento.',
    price: 410000,
    currency: 'USD',
    type: 'departamento',
    ciudad: 'Buenos Aires',
    barrio: 'Belgrano',
    provincia: 'Buenos Aires',
    ambientes: 4,
    dormitorios: 3,
    banos: 3,
    superficie_total: 200,
    superficie_cubierta: 185,
    images: [
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
    ],
    coordinates: { lat: -34.5600, lng: -58.4563 },
    categoria: 'premium',
    featured: true,
  },

  // ── MENDOZA ──
  {
    slug: 'finca-vinedo-mendoza-lujan-de-cuyo-luxury',
    title: 'Finca con viñedo propio en Luján de Cuyo, Mendoza, 5 ha',
    description: 'Finca premium con 3 hectáreas de viñedo Malbec en producción y 2 hectáreas de parque con casa principal de 400 m². 5 dormitorios, bodega privada, piscina infinity con vista a la Cordillera. Casa de huéspedes independiente de 120 m². Ideal para proyecto boutique de enoturismo o residencia exclusiva. A 20 minutos del centro de Mendoza.',
    price: 1200000,
    currency: 'USD',
    type: 'campo',
    ciudad: 'Mendoza',
    barrio: 'Luján de Cuyo',
    provincia: 'Mendoza',
    ambientes: 8,
    dormitorios: 5,
    banos: 4,
    superficie_total: 50000,
    superficie_cubierta: 520,
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    ],
    coordinates: { lat: -33.0300, lng: -68.8800 },
    categoria: 'luxury',
    featured: true,
  },
  {
    slug: 'casa-chacras-de-coria-mendoza-premium',
    title: 'Casa de categoría en Chacras de Coria, Mendoza, 350 m² con pileta',
    description: 'Casa moderna de categoría en Chacras de Coria, el barrio más exclusivo de Mendoza. 4 dormitorios en suite, living con hogar, quincho gourmet, piscina climatizada, jardín parquizado con riego automático. Doble cochera cubierta. Barrio cerrado con seguridad 24hs. Vista a la precordillera. Zona de bodegas premium (Catena Zapata, Achaval Ferrer).',
    price: 480000,
    currency: 'USD',
    type: 'casa',
    ciudad: 'Mendoza',
    barrio: 'Chacras de Coria',
    provincia: 'Mendoza',
    ambientes: 5,
    dormitorios: 4,
    banos: 4,
    superficie_total: 800,
    superficie_cubierta: 350,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80',
    ],
    coordinates: { lat: -33.0100, lng: -68.4400 },
    categoria: 'luxury',
    featured: true,
  },

  // ── BARILOCHE ──
  {
    slug: 'casa-lago-nahuel-huapi-bariloche-luxury',
    title: 'Casa frente al Lago Nahuel Huapi, Bariloche, 400 m² con muelle privado',
    description: 'Residencia exclusiva sobre la costa del Lago Nahuel Huapi con muelle privado y acceso directo al agua. 5 dormitorios, 4 baños, living con ventanales de doble altura y vista panorámica al lago y los Andes. Calefacción por losa radiante, pisos de lenga, hogar a leña doble. Terreno de 3.000 m² con bosque nativo. Ubicación privilegiada en Llao Llao. Potencial como lodge boutique premium.',
    price: 980000,
    currency: 'USD',
    type: 'casa',
    ciudad: 'Bariloche',
    barrio: 'Llao Llao',
    provincia: 'Río Negro',
    ambientes: 7,
    dormitorios: 5,
    banos: 4,
    superficie_total: 3000,
    superficie_cubierta: 400,
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    ],
    coordinates: { lat: -41.0533, lng: -71.5467 },
    categoria: 'luxury',
    featured: true,
  },
  {
    slug: 'cabana-premium-cerro-catedral-bariloche',
    title: 'Cabaña premium al pie del Cerro Catedral, Bariloche, 180 m²',
    description: 'Cabaña de montaña premium con acceso ski-in al Cerro Catedral. 3 dormitorios en suite, living con hogar y vista al cerro, deck con jacuzzi exterior. Construcción en piedra y madera nativa. Rentabilidad turística estimada: 7% anual en temporada alta (julio-septiembre, diciembre-marzo). Administración hotelera disponible.',
    price: 350000,
    currency: 'USD',
    type: 'casa',
    ciudad: 'Bariloche',
    barrio: 'Cerro Catedral',
    provincia: 'Río Negro',
    ambientes: 4,
    dormitorios: 3,
    banos: 3,
    superficie_total: 600,
    superficie_cubierta: 180,
    images: [
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    ],
    coordinates: { lat: -41.1667, lng: -71.4500 },
    categoria: 'premium',
    featured: true,
  },

  // ── CÓRDOBA ──
  {
    slug: 'penthouse-nueva-cordoba-rooftop-premium',
    title: 'Penthouse con rooftop privado en Nueva Córdoba, 3 ambientes, 130 m²',
    description: 'Penthouse de última generación en torre nueva de Nueva Córdoba. Rooftop privado de 50 m² con parrilla, jacuzzi y vista 360° a las Sierras y la ciudad. 2 dormitorios en suite, living con ventanales floor-to-ceiling. Cochera. Edificio con pileta, gym y cowork. Cap rate estimado: 5.2% en USD. La mejor relación precio/retorno de Argentina.',
    price: 185000,
    currency: 'USD',
    type: 'departamento',
    ciudad: 'Córdoba Capital',
    barrio: 'Nueva Córdoba',
    provincia: 'Córdoba',
    ambientes: 3,
    dormitorios: 2,
    banos: 2,
    superficie_total: 180,
    superficie_cubierta: 130,
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    ],
    coordinates: { lat: -31.4260, lng: -64.1900 },
    categoria: 'premium',
    featured: true,
  },
  {
    slug: 'casa-country-cordoba-premium-jardin-pileta',
    title: 'Casa en country de Córdoba, 4 dormitorios, pileta, 300 m²',
    description: 'Casa moderna en country premium de zona norte de Córdoba. 4 dormitorios en suite, playroom, estudio, quincho con parrilla, piscina climatizada, jardín de 600 m². Doble cochera. Country con cancha de golf, tenis, club house. Seguridad perimetral 24hs. A 15 minutos del centro. Ideal para familias de inversores que buscan calidad de vida y seguridad.',
    price: 290000,
    currency: 'USD',
    type: 'casa',
    ciudad: 'Córdoba Capital',
    barrio: 'Zona Norte',
    provincia: 'Córdoba',
    ambientes: 6,
    dormitorios: 4,
    banos: 4,
    superficie_total: 900,
    superficie_cubierta: 300,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    ],
    coordinates: { lat: -31.3700, lng: -64.2200 },
    categoria: 'premium',
    featured: true,
  },

  // ── SALTA ──
  {
    slug: 'estancia-salta-valles-calchaquies-luxury',
    title: 'Estancia en Valles Calchaquíes, Salta, 150 ha con bodega artesanal',
    description: 'Estancia histórica en los Valles Calchaquíes con viñedos de altura (2.200 msnm) y bodega artesanal en producción. Casa principal de 500 m² estilo colonial restaurada, 6 dormitorios, capilla histórica, corrales, galpones. 15 hectáreas de viñedo Torrontés y Malbec. Potencial como hotel boutique de enoturismo. La región de vinos de altura más exclusiva de Argentina.',
    price: 1500000,
    currency: 'USD',
    type: 'campo',
    ciudad: 'Salta',
    barrio: 'Valles Calchaquíes',
    provincia: 'Salta',
    ambientes: 10,
    dormitorios: 6,
    banos: 5,
    superficie_total: 1500000,
    superficie_cubierta: 500,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    ],
    coordinates: { lat: -26.0600, lng: -66.0300 },
    categoria: 'luxury',
    featured: true,
  },

  // ── MAR DEL PLATA ──
  {
    slug: 'departamento-playa-grande-mar-del-plata-premium',
    title: 'Departamento frente al mar en Playa Grande, Mar del Plata, 3 ambientes',
    description: 'Departamento con vista frontal al mar en Playa Grande, la zona más exclusiva de Mar del Plata. 2 dormitorios, 2 baños, balcón terraza con vista panorámica al océano. Cochera cubierta. Edificio de categoría con pileta y parrilla. Rentabilidad temporada alta (diciembre-marzo): excepcional. A metros del Golf Club y Casino Central.',
    price: 220000,
    currency: 'USD',
    type: 'departamento',
    ciudad: 'Mar del Plata',
    barrio: 'Playa Grande',
    provincia: 'Buenos Aires',
    ambientes: 3,
    dormitorios: 2,
    banos: 2,
    superficie_total: 100,
    superficie_cubierta: 85,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    ],
    coordinates: { lat: -38.0133, lng: -57.5300 },
    categoria: 'premium',
    featured: true,
  },

  // ── ROSARIO ──
  {
    slug: 'piso-costanera-rosario-vista-parana-premium',
    title: 'Piso alto en torre de la Costanera, Rosario, vista al Paraná, 160 m²',
    description: 'Piso en torre premium sobre la Costanera Central de Rosario con vista directa al río Paraná y las islas. 3 dormitorios en suite, living-comedor de 40 m², balcón terraza de 20 m². 2 cocheras. Amenities completos: pileta infinity, sky bar, gym, spa. Rosario es la tercera ciudad de Argentina con el mercado inmobiliario más dinámico del interior.',
    price: 260000,
    currency: 'USD',
    type: 'departamento',
    ciudad: 'Rosario',
    barrio: 'Costanera',
    provincia: 'Santa Fe',
    ambientes: 4,
    dormitorios: 3,
    banos: 3,
    superficie_total: 180,
    superficie_cubierta: 160,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
    ],
    coordinates: { lat: -32.9468, lng: -60.6505 },
    categoria: 'premium',
    featured: true,
  },

  // ── NEUQUÉN / VACA MUERTA ──
  {
    slug: 'terreno-premium-neuquen-vaca-muerta-barrio-privado',
    title: 'Terreno en barrio privado de Neuquén, 1.200 m², zona Vaca Muerta',
    description: 'Lote premium en barrio privado de primera categoría en Neuquén Capital, a 30 minutos de los campos de Vaca Muerta. 1.200 m² con servicios completos (gas, agua, cloacas, fibra óptica). Barrio con seguridad 24hs, club house, pileta, canchas de tenis. Zona de máxima demanda por ejecutivos petroleros. Valorización anual estimada: 15-20% en USD por boom Vaca Muerta.',
    price: 95000,
    currency: 'USD',
    type: 'terreno',
    ciudad: 'Neuquén',
    barrio: 'Barrio Privado',
    provincia: 'Neuquén',
    ambientes: 0,
    dormitorios: 0,
    banos: 0,
    superficie_total: 1200,
    superficie_cubierta: 0,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    ],
    coordinates: { lat: -38.9516, lng: -68.0591 },
    categoria: 'premium',
    featured: true,
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  let created = 0;
  let skipped = 0;

  for (const prop of luxuryProperties) {
    const exists = await Property.findOne({ slug: prop.slug });
    if (exists) {
      console.log(`  SKIP (exists): ${prop.slug}`);
      skipped++;
      continue;
    }
    await Property.create({ ...prop, operation: 'venta' });
    console.log(`  CREATED: ${prop.slug}`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

seed().catch(console.error);
