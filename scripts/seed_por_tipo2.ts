import mongoose from 'mongoose';
import * as https from 'https';

// URI directa al nodo PRIMARIO del shard (shard-00-02 verificado con isMaster).
// directConnection=true al primario permite writes sin errores de "not primary".
const MONGODB_URI =
  'mongodb://inmocultural_db_user:fIVTKcJ6PLk41elg@ac-wm9gesy-shard-00-02.8u0oikg.mongodb.net:27017/mudate?ssl=true&authSource=admin&directConnection=true';

// ── Modelo inline ─────────────────────────────────────────────────────────────
const PropertySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: String,
    description: String,
    price: Number,
    currency: String,
    operation: String,
    type: String,
    ciudad: String,
    barrio: { type: String, default: '' },
    provincia: String,
    ambientes: Number,
    dormitorios: Number,
    banos: Number,
    superficie_total: Number,
    superficie_cubierta: Number,
    images: [String],
    source: String,
    source_url: String,
    featured: Boolean,
    published: Boolean,
  },
  { timestamps: true }
);

const Property =
  (mongoose.models && mongoose.models.Property) ||
  mongoose.model('Property', PropertySchema);

// ── Parte 1: ciudades medianas × tipo × venta
// Estrategia de slug: {baseSlug}-v2-{tipo}-{mlaId}
// Diferencia del seed anterior (pág 1 genérica) que usó {baseSlug}-mla-{mlaId}.
// Las propiedades de página 1 tipo-específico pueden ser nuevas o duplicadas de
// contenido — se manejan via insertMany ordered:false.
// ─────────────────────────────────────────────────────────────────────────────
const CITIES_MEDIUM = [
  { ciudad: 'Villa María', provincia: 'Córdoba', cityUrl: 'villa-maria-cordoba' },
  { ciudad: 'Río Cuarto', provincia: 'Córdoba', cityUrl: 'rio-cuarto-cordoba' },
  { ciudad: 'Paraná', provincia: 'Entre Ríos', cityUrl: 'parana-entre-rios' },
  { ciudad: 'San Salvador de Jujuy', provincia: 'Jujuy', cityUrl: 'san-salvador-de-jujuy-jujuy' },
  { ciudad: 'San Juan', provincia: 'San Juan', cityUrl: 'san-juan-capital' },
  { ciudad: 'Resistencia', provincia: 'Chaco', cityUrl: 'resistencia-chaco' },
  { ciudad: 'Posadas', provincia: 'Misiones', cityUrl: 'posadas-misiones' },
  { ciudad: 'Santiago del Estero', provincia: 'Santiago del Estero', cityUrl: 'santiago-del-estero-capital' },
  { ciudad: 'Comodoro Rivadavia', provincia: 'Chubut', cityUrl: 'comodoro-rivadavia-chubut' },
];

const PROPERTY_TYPES = [
  { urlSegment: 'casas', typeValue: 'casa' as const },
  { urlSegment: 'departamentos', typeValue: 'departamento' as const },
  { urlSegment: 'terrenos', typeValue: 'terreno' as const },
];

// Páginas 2-5 de ML: ofsets 49, 97, 145, 193
// Páginas 1 ya cubiertas por otros seeds para estas ciudades.
const VENTA_OFFSETS = [49, 97, 145, 193];

// ── Parte 2: ciudades turísticas × alquiler
// slug: {baseSlug}-alq-{mlaId} — convención de seed_alquiler1.ts
// seed_alquiler1 cubrió: Córdoba, BA, Rosario, Mendoza, Villa María, Río Cuarto,
// Paraná, Tucumán, Neuquén, Bariloche, Salta, Jujuy (3 segmentos pág 1)
// Aquí cubrimos las turísticas NO incluidas en seed_alquiler1 + Bariloche págs 2-3
// ─────────────────────────────────────────────────────────────────────────────
const CITIES_TOURIST = [
  { ciudad: 'Villa Carlos Paz', provincia: 'Córdoba', cityUrl: 'villa-carlos-paz-cordoba' },
  { ciudad: 'Mar del Plata', provincia: 'Buenos Aires', cityUrl: 'mar-del-plata' },
  { ciudad: 'Pinamar', provincia: 'Buenos Aires', cityUrl: 'pinamar-buenos-aires' },
  { ciudad: 'Villa Gesell', provincia: 'Buenos Aires', cityUrl: 'villa-gesell-buenos-aires' },
  { ciudad: 'Cariló', provincia: 'Buenos Aires', cityUrl: 'carilo-buenos-aires' },
  { ciudad: 'San Martín de los Andes', provincia: 'Neuquén', cityUrl: 'san-martin-de-los-andes-neuquen' },
  { ciudad: 'El Calafate', provincia: 'Santa Cruz', cityUrl: 'el-calafate-santa-cruz' },
  { ciudad: 'Cafayate', provincia: 'Salta', cityUrl: 'cafayate-salta' },
  { ciudad: 'Tandil', provincia: 'Buenos Aires', cityUrl: 'tandil-buenos-aires' },
  // Bariloche: seed_alquiler1 cubrió pág 1 genérico+casas+dptos → aquí págs 2-3
  { ciudad: 'Bariloche', provincia: 'Río Negro', cityUrl: 'san-carlos-de-bariloche-rio-negro' },
];

// Segmentos por ciudad turística
function buildAlquilerSegments(cityUrl: string): Array<{ label: string; url: string }> {
  return [
    { label: 'genérico pág1', url: `https://inmuebles.mercadolibre.com.ar/alquiler/${cityUrl}/` },
    { label: 'casas pág1', url: `https://inmuebles.mercadolibre.com.ar/casas/alquiler/${cityUrl}/` },
    { label: 'dptos pág1', url: `https://inmuebles.mercadolibre.com.ar/departamentos/alquiler/${cityUrl}/` },
    { label: 'genérico pág2', url: `https://inmuebles.mercadolibre.com.ar/alquiler/${cityUrl}/_Desde_49` },
    { label: 'genérico pág3', url: `https://inmuebles.mercadolibre.com.ar/alquiler/${cityUrl}/_Desde_97` },
  ];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 60);
}

// ── Fetch con seguimiento de redirects ────────────────────────────────────────
function fetchHtml(url: string, redirectCount = 0): Promise<string> {
  return new Promise((resolve, reject) => {
    if (redirectCount > 6) return reject(new Error('Too many redirects'));
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
          'Accept-Encoding': 'identity',
          'Accept-Language': 'es-AR,es;q=0.9',
        },
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          return resolve(fetchHtml(res.headers.location, redirectCount + 1));
        }
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        res.on('error', reject);
      }
    );
    req.on('error', reject);
    req.setTimeout(25000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// ── Parser de items desde el HTML de ML ──────────────────────────────────────
interface RawItem {
  mlaId: string;
  title: string;
  price: number;
  currency: string;
  typeFromUrl: string;
  img: string | null;
  source_url: string;
}

function extractItems(html: string): RawItem[] {
  const startMarker = '_n.ctx.r=';
  const start = html.indexOf(startMarker);
  if (start < 0) return [];
  const jsonStr = html.slice(start + startMarker.length, html.indexOf('</script>', start));

  const priceData: Record<string, { currency: string; price: number }> = {};
  const priceRe = /"item_id":"(MLA\d+)"[^{}]*?"price_currency":"([^"]+)"[^{}]*?"price":(\d+)/g;
  let m: RegExpExecArray | null;
  while ((m = priceRe.exec(jsonStr)) !== null) {
    if (!priceData[m[1]]) priceData[m[1]] = { currency: m[2], price: parseInt(m[3]) };
  }

  const picData: Record<string, string> = {};
  const picRe = /"item_id":"(MLA\d+)"[^{}]*?"picture_id":"([^"]+)"/g;
  while ((m = picRe.exec(jsonStr)) !== null) {
    if (!picData[m[1]]) picData[m[1]] = m[2];
  }

  const linkRe = /href="(https?:\/\/([a-z]+)\.mercadolibre\.com\.ar\/MLA-(\d+)-([^"#&]+))/g;
  const items: RawItem[] = [];
  const seen = new Set<string>();
  while ((m = linkRe.exec(html)) !== null) {
    const mlaId = 'MLA' + m[3];
    if (seen.has(mlaId)) continue;
    seen.add(mlaId);

    const typeFromUrl = m[2];
    const slugPart = m[4].replace(/-_JM$/, '').replace(/-$/, '');
    const title = slugPart
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^(.)/, (c: string) => c.toUpperCase());

    const pd = priceData[mlaId] || { currency: 'USD', price: 0 };
    const pic = picData[mlaId];
    const img = pic ? `https://http2.mlstatic.com/D_NQ_NP_${pic}-O.jpg` : null;

    items.push({
      mlaId,
      title,
      price: pd.price,
      currency: pd.currency,
      typeFromUrl,
      img,
      source_url: m[1].split('#')[0],
    });
  }

  return items;
}

// ── Mapear al modelo Property ────────────────────────────────────────────────
function mapToPropertyVenta(
  raw: RawItem,
  ciudad: string,
  provincia: string,
  forcedType: 'casa' | 'departamento' | 'terreno'
) {
  const baseSlug = slugify(raw.title);
  // Slug con sufijo -v2-{tipo} para no colisionar con el formato anterior (-mla-)
  const slug = `${baseSlug}-v2-${forcedType}-${raw.mlaId}`;

  return {
    slug,
    title: raw.title,
    description: `${raw.title} en ${ciudad}, ${provincia}. Propiedad en venta publicada en MercadoLibre.`,
    price: raw.price || 1,
    currency: raw.currency === 'ARS' ? 'ARS' : 'USD',
    operation: 'venta',
    type: forcedType,
    ciudad,
    barrio: '',
    provincia,
    ambientes: 0,
    dormitorios: 0,
    banos: 0,
    superficie_total: 0,
    superficie_cubierta: 0,
    images: raw.img ? [raw.img] : [],
    source: 'mercadolibre',
    source_url: raw.source_url,
    featured: raw.currency === 'USD' && raw.price > 80000 && !!raw.img,
    published: true,
  };
}

function mapToPropertyAlquiler(raw: RawItem, ciudad: string, provincia: string) {
  const baseSlug = slugify(raw.title);
  // Sufijo -alq- establece convención de seed_alquiler1.ts
  const slug = `${baseSlug}-alq-${raw.mlaId}`;

  // Inferir tipo desde el subdominio de la URL del ítem
  const t = raw.typeFromUrl.toLowerCase();
  let type: 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina' | 'campo' | 'cochera' | 'galpon' = 'casa';
  if (t.includes('departamento') || t.includes('piso')) type = 'departamento';
  else if (t.includes('terreno') || t.includes('lote')) type = 'terreno';
  else if (t.includes('local') || t.includes('comercial')) type = 'local';
  else if (t.includes('oficina')) type = 'oficina';
  else if (t.includes('cochera')) type = 'cochera';

  return {
    slug,
    title: raw.title,
    description: `${raw.title} en ${ciudad}, ${provincia}. Propiedad en alquiler publicada en MercadoLibre.`,
    price: raw.price || 1,
    currency: raw.currency === 'ARS' ? 'ARS' : 'USD',
    operation: 'alquiler',
    type,
    ciudad,
    barrio: '',
    provincia,
    ambientes: 0,
    dormitorios: 0,
    banos: 0,
    superficie_total: 0,
    superficie_cubierta: 0,
    images: raw.img ? [raw.img] : [],
    source: 'mercadolibre',
    source_url: raw.source_url,
    featured: raw.price > 500000 && !!raw.img,
    published: true,
  };
}

// ── Insertar lote con manejo de duplicados ────────────────────────────────────
async function insertBatch(props: object[]): Promise<{ inserted: number; skipped: number }> {
  if (props.length === 0) return { inserted: 0, skipped: 0 };
  try {
    const result = await Property.insertMany(props, { ordered: false });
    console.log(`     OK: ${result.length} insertadas`);
    return { inserted: result.length, skipped: 0 };
  } catch (bulkErr: any) {
    // Mongoose >= 7: err.result.insertedCount (err.result.nInserted es undefined en esta versión)
    const inserted =
      bulkErr.result?.insertedCount ?? bulkErr.result?.nInserted ?? bulkErr.insertedCount ?? 0;
    const skipped = props.length - inserted;
    console.log(`     OK: ${inserted} insertadas, ${skipped} duplicados`);
    return { inserted, skipped };
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('Conectando a MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Conectado.\n');

  let totalInserted = 0;
  let totalSkipped = 0;
  const summary: Record<string, { inserted: number; skipped: number }> = {};

  // ══════════════════════════════════════════════════════════════════════════
  // PARTE 1 — Venta por tipo en ciudades medianas (págs 2-5)
  // URL: /{tipo}/venta/{cityUrl}/_Desde_{offset}
  // Slug: {baseSlug}-v2-{tipo}-{mlaId}  ← no colisiona con slugs existentes
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  PARTE 1 — Venta por tipo · Ciudades medianas págs 2-5  ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  for (const city of CITIES_MEDIUM) {
    console.log(`\n═══ ${city.ciudad} (${city.provincia}) ═══`);
    summary[city.ciudad] = { inserted: 0, skipped: 0 };

    for (const tipo of PROPERTY_TYPES) {
      console.log(`  ── [${tipo.urlSegment}] ──`);

      for (const offset of VENTA_OFFSETS) {
        const pageNum = VENTA_OFFSETS.indexOf(offset) + 2;
        const mlUrl = `https://inmuebles.mercadolibre.com.ar/${tipo.urlSegment}/venta/${city.cityUrl}/_Desde_${offset}`;
        console.log(`    → Pág ${pageNum}: ${mlUrl}`);

        try {
          const html = await fetchHtml(mlUrl);
          const raw = extractItems(html);
          console.log(`       ${raw.length} items`);

          if (raw.length === 0) {
            console.log(`       Sin items — cortando paginación para ${tipo.urlSegment}`);
            break;
          }

          const props = raw.map((r) => mapToPropertyVenta(r, city.ciudad, city.provincia, tipo.typeValue));
          const { inserted, skipped } = await insertBatch(props);
          summary[city.ciudad].inserted += inserted;
          summary[city.ciudad].skipped += skipped;
          totalInserted += inserted;
          totalSkipped += skipped;
        } catch (e: any) {
          console.error(`       Error: ${e.message}`);
        }

        await sleep(900);
      }

      await sleep(600);
    }

    await sleep(1200);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PARTE 2 — Alquiler en ciudades turísticas (múltiples segmentos)
  // URL: /alquiler/{cityUrl}/ + /casas/alquiler/ + /departamentos/alquiler/ + págs 2-3
  // Slug: {baseSlug}-alq-{mlaId}  ← no colisiona con slugs de venta
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  PARTE 2 — Alquiler · Ciudades turísticas (5 segmentos) ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  for (const city of CITIES_TOURIST) {
    console.log(`\n═══ ${city.ciudad} (${city.provincia}) ═══`);
    const key = `${city.ciudad}_alq`;
    summary[key] = { inserted: 0, skipped: 0 };

    const segments = buildAlquilerSegments(city.cityUrl);

    for (const seg of segments) {
      console.log(`  → [${seg.label}]: ${seg.url}`);

      try {
        const html = await fetchHtml(seg.url);
        const raw = extractItems(html);
        console.log(`     ${raw.length} items`);

        if (raw.length === 0) {
          console.log(`     Sin items — saltando segmento`);
          await sleep(600);
          continue;
        }

        const props = raw.map((r) => mapToPropertyAlquiler(r, city.ciudad, city.provincia));
        const { inserted, skipped } = await insertBatch(props);
        summary[key].inserted += inserted;
        summary[key].skipped += skipped;
        totalInserted += inserted;
        totalSkipped += skipped;
      } catch (e: any) {
        console.error(`     Error: ${e.message}`);
      }

      await sleep(900);
    }

    await sleep(1200);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RESUMEN FINAL
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('RESUMEN FINAL');
  console.log('═══════════════════════════════════════════════════════════════');
  for (const [label, s] of Object.entries(summary)) {
    console.log(
      `  ${label.padEnd(40)} insertadas: ${String(s.inserted).padStart(4)}  duplicados: ${s.skipped}`
    );
  }
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`  TOTAL nuevas insertadas: ${totalInserted}`);
  console.log(`  TOTAL duplicados:        ${totalSkipped}`);
  console.log('═══════════════════════════════════════════════════════════════');

  await mongoose.disconnect();
  console.log('Desconectado. Listo.');
}

seed().catch(console.error);
