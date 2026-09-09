/**
 * Seed script para poblar MongoDB con propiedades de Villa María, Córdoba.
 * Fuente: MercadoLibre Inmuebles — scrapeado 2026-09-07
 * NO limpia la colección — solo inserta nuevas propiedades (ignora duplicados por slug).
 * Ejecutar: npx tsx scripts/seed_villa_maria.ts
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://inmocultural_db_user:fIVTKcJ6PLk41elg@mudate.8u0oikg.mongodb.net/mudate?retryWrites=true&w=majority&appName=mudate';

const PropertySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, enum: ['USD', 'ARS'], default: 'USD' },
    operation: { type: String, enum: ['venta', 'alquiler'], required: true },
    type: { type: String, required: true },
    ciudad: { type: String, required: true },
    barrio: { type: String },
    provincia: { type: String, default: 'Córdoba' },
    ambientes: Number,
    dormitorios: Number,
    banos: Number,
    superficie_total: Number,
    superficie_cubierta: Number,
    images: [String],
    source: { type: String, default: 'manual' },
    source_url: { type: String },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

function slugify(str: string): string {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 60);
}

function extractMlaId(url: string): string {
  const m = url.match(/MLA-?(\d+)/);
  return m ? m[1] : Math.random().toString(36).slice(2, 8);
}

// Datos scrapeados de MercadoLibre — Villa María, Córdoba (2026-09-07)
// Fuentes: /venta/, /venta/_Desde_49, /casas/venta/, /terrenos/venta/
const rawData = [
  // --- Página 1: /venta/cordoba/villa-maria/ ---
  { title: "Departamentos En Villa María", price: 58300, currency: "USD", type: "departamento", superficie_cubierta: 29, dormitorios: null, ambientes: null, source_url: "https://departamento.mercadolibre.com.ar/MLA-2587855826-departamentos-en-villa-maria-_JM", img: "https://http2.mlstatic.com/D_NQ_NP_2X_901838-MLA98521840050_112025-E.webp" },
  { title: "Departamento A Estrenar De 2 Dormitorios Con Cochera En Villa María", price: 144086, currency: "USD", type: "departamento", superficie_cubierta: 72, dormitorios: 2, ambientes: null, source_url: "https://departamento.mercadolibre.com.ar/MLA-3527908776-departamento-a-estrenar-de-2-dormitorios-con-cochera-en-villa-maria-_JM", img: null },
  { title: "Departamento 2 Dormitorios 2 Baños Villa Maria Barrio Centro", price: 118200, currency: "USD", type: "departamento", superficie_cubierta: 82, dormitorios: 2, ambientes: null, source_url: "https://departamento.mercadolibre.com.ar/MLA-1882339507-departamento-2-dormitorios-2-banos-villa-maria-barrio-centro-_JM", img: null },
  { title: "Departamento En Venta De 2 Dormitorios Semipiso Con Balcon En El Centro De Villa Maria", price: 218400, currency: "USD", type: "departamento", superficie_cubierta: 206, dormitorios: 2, ambientes: null, source_url: "https://departamento.mercadolibre.com.ar/MLA-1901967867-departamento-en-venta-de-2-dormitorios-semipiso-con-balcon-en-el-centro-de-villa-maria-_JM", img: null },
  { title: "Departamento En Venta De 2 Dormitorios 2 Baños Con Amenities En Villa Maria", price: 120000, currency: "USD", type: "departamento", superficie_cubierta: 66, dormitorios: 2, ambientes: null, source_url: "https://departamento.mercadolibre.com.ar/MLA-3527908632-departamento-en-venta-de-2-dormitorios-2-banos-con-amenities-en-villa-maria-_JM", img: null },
  { title: "Departamento 2 Habitaciones Barrio Palermo Villa Maria", price: 93000, currency: "USD", type: "departamento", superficie_cubierta: 136, dormitorios: 2, ambientes: 4, source_url: "https://departamento.mercadolibre.com.ar/MLA-3527908548-departamento-2-habitaciones-barrio-palermo-villa-maria-_JM", img: null },
  { title: "Terreno Con Proyecto Aprobado Y Fundaciones Realizadas En Centro De Villa Maria", price: 160000, currency: "USD", type: "terreno", superficie_cubierta: 350, dormitorios: null, ambientes: null, source_url: "https://terreno.mercadolibre.com.ar/MLA-2038937401-terreno-con-proyecto-aprobado-y-fundaciones-realizadas-en-centro-de-villa-maria-_JM", img: null },
  { title: "Local En Venta Calle San Juan, Villa María Para Inversión", price: 68000, currency: "USD", type: "departamento", superficie_cubierta: 56, dormitorios: null, ambientes: null, source_url: "https://inmueble.mercadolibre.com.ar/MLA-1961458213-local-en-venta-calle-san-juanvilla-maria-para-inversion-_JM", img: null },
  { title: "Departamento En Venta 1 Dormitorio 1 Baño En Complejo Con Amenities En Villa Maria", price: 65000, currency: "USD", type: "departamento", superficie_cubierta: 37, dormitorios: 1, ambientes: null, source_url: "https://departamento.mercadolibre.com.ar/MLA-3527448542-departamento-en-venta-1-dormitorio-1-bano-en-complejo-con-amenities-en-villa-maria-_JM", img: null },
  { title: "Departamento En Venta 1 Dormitorio En Villa Maria", price: 60000, currency: "USD", type: "departamento", superficie_cubierta: 42, dormitorios: 1, ambientes: 2, source_url: "https://departamento.mercadolibre.com.ar/MLA-3537200786-departamento-en-venta-1-dormitorio-en-villa-maria-_JM", img: null },
  { title: "Departamento En Venta 1 Dormitorio Con Cochera Y Pileta Villa Maria", price: 71500, currency: "USD", type: "departamento", superficie_cubierta: 40, dormitorios: 1, ambientes: null, source_url: "https://departamento.mercadolibre.com.ar/MLA-3527449316-departamento-en-venta-1-dormitorio-con-cochera-y-pileta-villa-maria-_JM", img: null },
  { title: "Terreno Para Inversión Apto Dúplex En Barrio Solares Del Norte Villa María", price: 105000, currency: "USD", type: "terreno", superficie_cubierta: 812, dormitorios: null, ambientes: null, source_url: "https://terreno.mercadolibre.com.ar/MLA-1914220701-terreno-para-inversion-apto-duplex-en-barrio-solares-del-norte-villa-maria-_JM", img: null },
  { title: "Depto En Venta, Zona Costanera. Barrio Guemes, Villa Maria", price: 56000, currency: "USD", type: "departamento", superficie_cubierta: 63, dormitorios: null, ambientes: 4, source_url: "https://inmueble.mercadolibre.com.ar/MLA-2001888037-depto-en-venta-zona-costanera-b-guemes-v-maria-_JM", img: null },
  { title: "Campo En Venta Cordoba Villa Maria", price: 4500, currency: "USD", type: "campo", superficie_cubierta: 600, dormitorios: null, ambientes: null, source_url: "https://inmueble.mercadolibre.com.ar/MLA-1778130981-campo-en-venta-cordoba-villa-maria-_JM", img: null },
  { title: "Edificio Jacaranda 20 En Villa Maria Lisandro De La Torre 547", price: 83000, currency: "USD", type: "departamento", superficie_cubierta: 50, dormitorios: null, ambientes: 4, source_url: "https://departamento.mercadolibre.com.ar/MLA-3704736154-edificio-jacaranda-20-en-villa-maria-lisandro-de-la-torre-547-_JM", img: null },
  { title: "Departamento En Venta A Estrenar En El Centro De Villa Maria - Barrio General San Martín", price: 60600, currency: "USD", type: "departamento", superficie_cubierta: 37, dormitorios: null, ambientes: null, source_url: "https://departamento.mercadolibre.com.ar/MLA-1860524947-departamento-en-venta-a-estrenar-en-el-centro-de-villa-maria-barrio-general-san-martin-_JM", img: null },
  { title: "Duplex En Venta De 2 Dormitorios Barrio Palermo, Villa Maria", price: 175000, currency: "USD", type: "departamento", superficie_cubierta: 136, dormitorios: 2, ambientes: null, source_url: "https://casa.mercadolibre.com.ar/MLA-3527448276-duplex-en-venta-de-2-dormitorios-barrio-palermo-villa-maria-_JM", img: null },
  { title: "Quinta En Venta Area 158, Villa María - Financiación Propia", price: 80000, currency: "USD", type: "departamento", superficie_cubierta: 60, dormitorios: null, ambientes: 3, source_url: "https://inmueble.mercadolibre.com.ar/MLA-3897981680-quinta-en-venta-area-158-v-maria-financ-propia-_JM", img: null },
  { title: "Pre Venta Deptos, Locales Y Cocheras En Maria Lv", price: 25000, currency: "USD", type: "departamento", superficie_cubierta: 31, dormitorios: null, ambientes: null, source_url: "https://departamento.mercadolibre.com.ar/MLA-3912821246-pre-venta-deptos-locales-y-cocheras-en-maria-lv-_JM", img: null },
  { title: "En Venta 3 Dtos Para Renta - Barrio Pellegrini V. Maria", price: 80000, currency: "USD", type: "departamento", superficie_cubierta: 142, dormitorios: null, ambientes: null, source_url: "https://inmueble.mercadolibre.com.ar/MLA-3912821214-en-venta-3-dtos-para-renta-bcpellegrini-vmaria-_JM", img: null },
  { title: "Venta Casa 4 Dorm. Barrio San Juan Bautista C/Pileta Villa Maria", price: 230000, currency: "USD", type: "casa", superficie_cubierta: 256, dormitorios: 4, ambientes: 5, source_url: "https://casa.mercadolibre.com.ar/MLA-2063754419-venta-casa-4-dorm-b-sjuan-bautista-cpileta-vm-_JM", img: null },
  { title: "Casa En Venta Centro Sur Villa Maria Apta Credito", price: 100000, currency: "USD", type: "casa", superficie_cubierta: 124, dormitorios: null, ambientes: 6, source_url: "https://casa.mercadolibre.com.ar/MLA-2055219975-casa-en-venta-centro-sur-villa-maria-apta-credito-_JM", img: null },
  { title: "Casa En Venta 3 Dorm. Barrio P. Norte Villa María A/Credito", price: 127000, currency: "USD", type: "casa", superficie_cubierta: 157, dormitorios: 3, ambientes: 5, source_url: "https://casa.mercadolibre.com.ar/MLA-3912795672-casa-en-venta-3-dorm-b-pnorte-vmaria-acredito-_JM", img: null },
  { title: "Oportunidad Inversion En Villa Maria", price: 265000, currency: "USD", type: "departamento", superficie_cubierta: 569, dormitorios: null, ambientes: null, source_url: "https://inmueble.mercadolibre.com.ar/MLA-3908073546-oportunida-inversion-en-villa-maria-_JM", img: null },
  { title: "Costa Cinque Inversión En Villa María", price: 93000, currency: "USD", type: "departamento", superficie_cubierta: 67, dormitorios: null, ambientes: 3, source_url: "https://inmueble.mercadolibre.com.ar/MLA-3912782892-costa-cinque-inversion-en-villa-maria-_JM", img: null },
  { title: "Se Vende Depto. Ideal Zona Estudiantes A Estrenar", price: 65000, currency: "USD", type: "departamento", superficie_cubierta: 41, dormitorios: null, ambientes: 2, source_url: "https://departamento.mercadolibre.com.ar/MLA-3912795696-se-vende-depto-ideal-zona-estudiantes-a-estrenar-_JM", img: null },
  { title: "Venta Dto. Un Dorm. De Categoria Frente Al Lago Villa Maria", price: 115000, currency: "USD", type: "departamento", superficie_cubierta: 65, dormitorios: null, ambientes: 3, source_url: "https://departamento.mercadolibre.com.ar/MLA-3912782934-venta-dtoun-dormde-categoria-frente-al-lago-vm-_JM", img: null },
  { title: "Venta Dpto 1 Dorm. G. Paz 947 A Estrenar Con Ascensor", price: 69000, currency: "USD", type: "departamento", superficie_cubierta: 41, dormitorios: 1, ambientes: 2, source_url: "https://departamento.mercadolibre.com.ar/MLA-3912782932-venta-dpto-1-dormgpaz-947-a-estrenar-cascensor-_JM", img: null },
  { title: "En Venta 2 Casas Barrio Guemes Villa María Zona Esc. Trabajo", price: 100000, currency: "USD", type: "casa", superficie_cubierta: 322, dormitorios: null, ambientes: 6, source_url: "https://casa.mercadolibre.com.ar/MLA-2063344655-en-venta-2-casas-bguemes-v-maria-z-esc-trabajo-_JM", img: null },
  { title: "Depto Con Cochera A Estrenar Zona Costanera Villa Maria", price: 85000, currency: "USD", type: "departamento", superficie_cubierta: 51, dormitorios: null, ambientes: 2, source_url: "https://departamento.mercadolibre.com.ar/MLA-3912782894-depto-ccochera-a-estrenar-zona-costanera-v-maria-_JM", img: null },
  { title: "Casa Con Local Comercial En Pozo Del Molle", price: 110000, currency: "USD", type: "casa", superficie_cubierta: 400, dormitorios: null, ambientes: 9, source_url: "https://casa.mercadolibre.com.ar/MLA-2059968175-casa-con-local-comercial-en-pozo-del-molle-_JM", img: null },
  { title: "Cocheras En Venta Centro Villa Maria", price: 7500, currency: "USD", type: "departamento", superficie_cubierta: null, dormitorios: null, ambientes: null, source_url: "https://inmueble.mercadolibre.com.ar/MLA-3908162878-cocheras-en-venta-ctro-vmaria-_JM", img: null },
  { title: "Venta Cocheras En Terrazas Parking Centro Villa Maria", price: 9500, currency: "USD", type: "departamento", superficie_cubierta: null, dormitorios: null, ambientes: null, source_url: "https://inmueble.mercadolibre.com.ar/MLA-3912795688-venta-cocheras-en-terrazas-parking-centro-vmaria-_JM", img: null },
  { title: "Te94 - Terreno Pozo Del Molle", price: 80000, currency: "USD", type: "terreno", superficie_cubierta: null, dormitorios: null, ambientes: null, source_url: "https://terreno.mercadolibre.com.ar/MLA-2059996199-te94-terreno-pozo-del-molle-_JM", img: null },
  { title: "Lotes Con Gran Proyección En Villa Maria", price: 34133, currency: "USD", type: "terreno", superficie_cubierta: null, dormitorios: null, ambientes: null, source_url: "https://terreno.mercadolibre.com.ar/MLA-3912782898-nbeles-lotes-con-gran-proyeccion-en-villa-maria-_JM", img: null },
  { title: "Terreno En Venta 250 Mts Barrio Padre Mujica Villa Maria", price: 16000, currency: "USD", type: "terreno", superficie_cubierta: 250, dormitorios: null, ambientes: null, source_url: "https://terreno.mercadolibre.com.ar/MLA-3912782930-terreno-en-venta-250-mts-b-padre-mujica-v-maria-_JM", img: null },
  { title: "Casa En Venta 4 Dorm. + Dto. Barrio Rivadavia Villa Maria", price: 135000, currency: "USD", type: "casa", superficie_cubierta: 218, dormitorios: 4, ambientes: 7, source_url: "https://casa.mercadolibre.com.ar/MLA-2031746411-casa-en-venta-4-dorm-dto-b-rivadavia-v-maria-_JM", img: null },
  { title: "Venta Depto 3 Dorm. Barrio Centro Villa Maria Con Terraza", price: 140000, currency: "USD", type: "departamento", superficie_cubierta: 160, dormitorios: 3, ambientes: 5, source_url: "https://departamento.mercadolibre.com.ar/MLA-2018668875-venta-depto-3-dorm-b-centro-vmaria-con-terraza-_JM", img: null },
  { title: "Venta 3 Propiedades Para Inversión Centro Villa María", price: 280000, currency: "USD", type: "departamento", superficie_cubierta: 489, dormitorios: null, ambientes: null, source_url: "https://casa.mercadolibre.com.ar/MLA-3860012138-venta-3-propiedades-pinversion-centro-villa-maria-_JM", img: null },
  { title: "Autopista Cordoba Rosario A M Del Polo 52", price: 17000, currency: "USD", type: "terreno", superficie_cubierta: null, dormitorios: null, ambientes: null, source_url: "https://terreno.mercadolibre.com.ar/MLA-1989224257-autopista-cordoba-rosario-a-m-del-polo-52-_JM", img: null },
  { title: "Venta Casa Tipo Loft Barrio San Juan Bautista Con Pileta", price: 89000, currency: "USD", type: "casa", superficie_cubierta: 158, dormitorios: null, ambientes: 3, source_url: "https://casa.mercadolibre.com.ar/MLA-3860450890-venta-casa-tipo-loft-b-sjuan-bautista-con-pileta-_JM", img: null },
  { title: "Complejo De Departamentos A La Venta Villa Maria", price: 390000, currency: "USD", type: "departamento", superficie_cubierta: 462, dormitorios: null, ambientes: null, source_url: "https://departamento.mercadolibre.com.ar/MLA-3881683346-complejo-de-departamentos-a-la-venta-_JM", img: null },
  { title: "Venta Terreno 366 M² En Obra Barrio Padre Mujica Villa Maria", price: 29000, currency: "USD", type: "terreno", superficie_cubierta: 366, dormitorios: null, ambientes: null, source_url: "https://terreno.mercadolibre.com.ar/MLA-2042167033-venta-terreno-366mt-en-obra-bpadre-mujica-v-maria-_JM", img: null },
  { title: "En Venta Casa 2 Dorm. Y Cochera Barrio San Martin Villa Maria", price: 45000, currency: "USD", type: "casa", superficie_cubierta: 112, dormitorios: 2, ambientes: 4, source_url: "https://casa.mercadolibre.com.ar/MLA-3912821242-en-venta-casa-2-dorm-y-cochera-b-s-martin-vm-_JM", img: null },
  { title: "Se Vende Casa 4 Dorm Barrio Ameghino Villa Maria Con Escritura", price: 94000, currency: "USD", type: "casa", superficie_cubierta: 159, dormitorios: 4, ambientes: 5, source_url: "https://casa.mercadolibre.com.ar/MLA-1951926099-se-vende-casa-4-dorm-b-ameghino-vm-cescritura-_JM", img: null },
  { title: "Casa En Venta En Villa Nueva Cordoba", price: 189999, currency: "USD", type: "casa", superficie_cubierta: 180, dormitorios: null, ambientes: null, source_url: "https://casa.mercadolibre.com.ar/MLA-2007921513-casa-en-venta-en-villa-nueva-cordoba-_JM", img: null },
  { title: "Galpón En Venta En Villa María", price: 160000, currency: "USD", type: "departamento", superficie_cubierta: null, dormitorios: null, ambientes: null, source_url: "https://casa.mercadolibre.com.ar/MLA-3223336062-galpon-en-venta-en-villa-maria-_JM", img: null },
  // --- Página 2: /venta/_Desde_49 ---
  { title: "Venta Monoambiente En Villa Maria En Obra", price: 54999, currency: "USD", type: "departamento", superficie_cubierta: 33, dormitorios: null, ambientes: null, source_url: "https://departamento.mercadolibre.com.ar/MLA-1989248329-venta-monoambiente-en-villa-maria-en-obra-_JM", img: null },
  { title: "Venta Lote Con Escritura Barrio Valle Escondido Villa Maria", price: 14000, currency: "USD", type: "terreno", superficie_cubierta: 255, dormitorios: null, ambientes: null, source_url: "https://terreno.mercadolibre.com.ar/MLA-3784307082-venta-lote-con-escritura-bvalle-escondido-vmaria-_JM", img: null },
  { title: "Villa Maria 40 Hectáreas Apto Loteo", price: 80000, currency: "USD", type: "terreno", superficie_cubierta: null, dormitorios: null, ambientes: null, source_url: "https://terreno.mercadolibre.com.ar/MLA-3630829536-villa-maria-40-hectareas-apto-loteo-_JM", img: null },
  { title: "Casa En Venta 3 Dorm Barrio Santa Ana Villa Maria Apta Credito", price: 180000, currency: "USD", type: "casa", superficie_cubierta: 211, dormitorios: 3, ambientes: 5, source_url: "https://casa.mercadolibre.com.ar/MLA-3777506884-casa-en-venta-3-dorm-bsta-ana-vmaria-apta-credit-_JM", img: null },
  { title: "Oportunidad De Inversión En Villa María", price: 58300, currency: "USD", type: "departamento", superficie_cubierta: 29, dormitorios: null, ambientes: null, source_url: "https://departamento.mercadolibre.com.ar/MLA-2767411112-oportunidad-de-inversion-en-villa-maria-_JM", img: null },
  { title: "Casa En Venta 3 Dorm Barrio Belgrano Horizon A/Credito Villa Maria", price: 110000, currency: "USD", type: "casa", superficie_cubierta: 158, dormitorios: 3, ambientes: 6, source_url: "https://casa.mercadolibre.com.ar/MLA-1946230435-casa-en-venta-3-dorm-bbhorizon-acredito-vmaria-_JM", img: null },
  { title: "En Venta Dto De Categoria Altos Del Rio Villa Maria", price: 129000, currency: "USD", type: "departamento", superficie_cubierta: 76, dormitorios: null, ambientes: 3, source_url: "https://departamento.mercadolibre.com.ar/MLA-1971362065-en-venta-dto-de-categoria-altos-del-rio-vmaria-_JM", img: null },
  { title: "En Venta Duplex 1 Dorm Centro Villa Maria", price: 57000, currency: "USD", type: "departamento", superficie_cubierta: 47, dormitorios: 1, ambientes: 2, source_url: "https://departamento.mercadolibre.com.ar/MLA-3761589794-en-venta-duplex-1-dorm-centro-villa-maria-_JM", img: null },
  { title: "Locales Comerciales En Venta Sobre Ruta N° 9 Villa Maria", price: 265000, currency: "USD", type: "departamento", superficie_cubierta: 241, dormitorios: null, ambientes: null, source_url: "https://inmueble.mercadolibre.com.ar/MLA-3761003842-locales-comerciales-en-venta-sobre-ruta-n-9-vm-_JM", img: null },
  { title: "Villa Maria Lote 7 Hectareas Apto Desarrollo Inmobiliario O Industrial", price: 1200000, currency: "USD", type: "terreno", superficie_cubierta: null, dormitorios: null, ambientes: null, source_url: "https://terreno.mercadolibre.com.ar/MLA-3630821810-villa-maria-lote-7-hectareas-apto-desarrollo-inmobilario-o-industrial-_JM", img: null },
  { title: "En Venta Dto 2 Dorm. A Estrenar Copahue 7 Villa María", price: 109200, currency: "USD", type: "departamento", superficie_cubierta: 64, dormitorios: 2, ambientes: null, source_url: "https://departamento.mercadolibre.com.ar/MLA-1971361983-en-venta-dto-2-dorm-a-estrenar-copahue-7-v-maria-_JM", img: null },
  { title: "Se Vende Casa + Vivienda Interna Barrio Gral Paz Villa Maria", price: 180000, currency: "USD", type: "casa", superficie_cubierta: 279, dormitorios: null, ambientes: 7, source_url: "https://casa.mercadolibre.com.ar/MLA-3720472926-se-vende-casavivienda-interna-bgral-paz-v-maria-_JM", img: null },
  { title: "Cocheras En Venta Villa María", price: 11000, currency: "USD", type: "departamento", superficie_cubierta: 15, dormitorios: null, ambientes: null, source_url: "https://inmueble.mercadolibre.com.ar/MLA-1937408093-cocheras-en-venta-villa-maria-_JM", img: null },
  { title: "6 Hectareas En Venta Villa Maria", price: 1800000, currency: "USD", type: "terreno", superficie_cubierta: null, dormitorios: null, ambientes: null, source_url: "https://terreno.mercadolibre.com.ar/MLA-1949462313-6-hectareas-en-venta-villa-maria-_JM", img: null },
];

// Deduplica por source_url antes de procesar
const seen = new Set<string>();
const uniqueRaw = rawData.filter(r => {
  if (seen.has(r.source_url)) return false;
  seen.add(r.source_url);
  return true;
});

// Filtra precios absurdos (precio 1 = ficha incompleta, precios >5M USD = error de parsing)
const filteredRaw = uniqueRaw.filter(r => r.price > 100 && r.price < 5000000);

const properties = filteredRaw.map(r => {
  const mlaId = extractMlaId(r.source_url);
  const slug = slugify(r.title) + '-mla-' + mlaId;
  const sup = r.superficie_cubierta && r.superficie_cubierta > 0 && r.superficie_cubierta < 100000 ? r.superficie_cubierta : null;
  const dorm = r.dormitorios && r.dormitorios < 20 ? r.dormitorios : null;
  const amb = r.ambientes && r.ambientes < 30 ? r.ambientes : null;

  const description = `Propiedad en venta en Villa María, Córdoba.${sup ? ' ' + sup + ' m² cubiertos.' : ''}${dorm ? ' ' + dorm + ' dormitorios.' : ''}`;

  return {
    slug,
    title: r.title,
    description,
    price: r.price,
    currency: r.currency as 'USD' | 'ARS',
    operation: 'venta' as const,
    type: r.type,
    ciudad: 'Villa María',
    barrio: '',
    provincia: 'Córdoba',
    dormitorios: dorm,
    ambientes: amb,
    superficie_cubierta: sup,
    images: r.img ? [r.img] : [],
    source_url: r.source_url,
    source: 'mercadolibre',
    featured: r.price > 80000 && r.img ? true : false,
    published: true,
  };
});

async function main() {
  console.log(`Conectando a MongoDB...`);
  await mongoose.connect(MONGODB_URI);
  console.log(`Conectado. Procesando ${properties.length} propiedades únicas de Villa María...`);

  let inserted = 0;
  let duplicates = 0;
  let errors = 0;

  // Insertamos de a lotes para mejor control de errores
  const BATCH = 20;
  for (let i = 0; i < properties.length; i += BATCH) {
    const batch = properties.slice(i, i + BATCH);
    try {
      const result = await Property.insertMany(batch, { ordered: false });
      inserted += result.length;
    } catch (err: unknown) {
      // Con ordered:false, insertMany lanza error pero sigue insertando
      // El error contiene insertedDocs y writeErrors
      const bulkErr = err as { insertedDocs?: unknown[]; writeErrors?: Array<{ errmsg?: string }> };
      if (bulkErr.insertedDocs) {
        inserted += bulkErr.insertedDocs.length;
      }
      if (bulkErr.writeErrors) {
        for (const we of bulkErr.writeErrors) {
          if (we.errmsg && we.errmsg.includes('duplicate key')) {
            duplicates++;
          } else {
            errors++;
            console.error('Error no-duplicado:', we.errmsg);
          }
        }
      }
    }
  }

  console.log(`\n✅ ${inserted} propiedades de Villa María insertadas desde MercadoLibre`);
  console.log(`⏭️  ${duplicates} duplicados ignorados (ya existían)`);
  if (errors > 0) console.log(`❌ ${errors} errores inesperados`);

  await mongoose.disconnect();
  console.log('Desconectado de MongoDB.');
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
