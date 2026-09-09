import mongoose from 'mongoose';
import * as https from 'https';

// URI directa a un nodo del shard con directConnection (evita querySrv que falla en Windows/IPv6)
const MONGODB_URI =
  'mongodb://inmocultural_db_user:fIVTKcJ6PLk41elg@ac-wm9gesy-shard-00-02.8u0oikg.mongodb.net:27017/mudate?ssl=true&authSource=admin&directConnection=true';

// ── Modelo inline (compatible con el schema existente) ────────────────────────
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

// ── Ciudades grandes — alquiler ───────────────────────────────────────────────
const CITIES = [
  { ciudad: 'Córdoba Capital', provincia: 'Córdoba', cityUrl: 'cordoba-capital-cordoba' },
  { ciudad: 'Buenos Aires Capital', provincia: 'Buenos Aires', cityUrl: 'capital-federal' },
  { ciudad: 'Rosario', provincia: 'Santa Fe', cityUrl: 'rosario-santa-fe' },
  { ciudad: 'Mendoza', provincia: 'Mendoza', cityUrl: 'mendoza-capital' },
  { ciudad: 'Villa María', provincia: 'Córdoba', cityUrl: 'villa-maria-cordoba' },
  { ciudad: 'Río Cuarto', provincia: 'Córdoba', cityUrl: 'rio-cuarto-cordoba' },
  { ciudad: 'Paraná', provincia: 'Entre Ríos', cityUrl: 'parana-entre-rios' },
  { ciudad: 'San Miguel de Tucumán', provincia: 'Tucumán', cityUrl: 'san-miguel-de-tucuman-tucuman' },
  { ciudad: 'Neuquén', provincia: 'Neuquén', cityUrl: 'neuquen-capital' },
  { ciudad: 'Bariloche', provincia: 'Río Negro', cityUrl: 'san-carlos-de-bariloche-rio-negro' },
  { ciudad: 'Salta', provincia: 'Salta', cityUrl: 'salta-capital' },
  { ciudad: 'San Salvador de Jujuy', provincia: 'Jujuy', cityUrl: 'san-salvador-de-jujuy-jujuy' },
];

// Por cada ciudad se scrapeará:
// 1. /alquiler/{cityUrl}/        (genérico)
// 2. /casas/alquiler/{cityUrl}/
// 3. /departamentos/alquiler/{cityUrl}/
function buildUrls(cityUrl: string): Array<{ label: string; url: string }> {
  return [
    {
      label: 'genérico',
      url: `https://inmuebles.mercadolibre.com.ar/alquiler/${cityUrl}/`,
    },
    {
      label: 'casas',
      url: `https://inmuebles.mercadolibre.com.ar/casas/alquiler/${cityUrl}/`,
    },
    {
      label: 'departamentos',
      url: `https://inmuebles.mercadolibre.com.ar/departamentos/alquiler/${cityUrl}/`,
    },
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

function mapType(
  raw: string
): 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina' | 'campo' | 'cochera' | 'galpon' {
  const t = raw.toLowerCase();
  if (t.includes('departamento') || t.includes('dpto') || t.includes('piso')) return 'departamento';
  if (t.includes('terreno') || t.includes('lote') || t.includes('tierra')) return 'terreno';
  if (t.includes('local') || t.includes('comercial')) return 'local';
  if (t.includes('oficina')) return 'oficina';
  if (t.includes('campo') || t.includes('finca') || t.includes('chacra')) return 'campo';
  if (t.includes('cochera') || t.includes('garage')) return 'cochera';
  if (t.includes('galpon') || t.includes('galpón') || t.includes('deposito')) return 'galpon';
  return 'casa';
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
    req.setTimeout(25000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// ── Parser de items desde el HTML de ML ──────────────────────────────────────
interface RawItem {
  mlaId: string;
  title: string;
  price: number;
  currency: string;
  type: string;
  img: string | null;
  source_url: string;
}

function extractItems(html: string): RawItem[] {
  const startMarker = '_n.ctx.r=';
  const start = html.indexOf(startMarker);
  if (start < 0) return [];
  const jsonStr = html.slice(start + startMarker.length, html.indexOf('</script>', start));

  // Extraer precio y moneda por item_id
  const priceData: Record<string, { currency: string; price: number }> = {};
  const priceRe = /"item_id":"(MLA\d+)"[^{}]*?"price_currency":"([^"]+)"[^{}]*?"price":(\d+)/g;
  let m: RegExpExecArray | null;
  while ((m = priceRe.exec(jsonStr)) !== null) {
    if (!priceData[m[1]]) priceData[m[1]] = { currency: m[2], price: parseInt(m[3]) };
  }

  // Extraer picture_id por item_id
  const picData: Record<string, string> = {};
  const picRe = /"item_id":"(MLA\d+)"[^{}]*?"picture_id":"([^"]+)"/g;
  while ((m = picRe.exec(jsonStr)) !== null) {
    if (!picData[m[1]]) picData[m[1]] = m[2];
  }

  // Extraer links del HTML — tienen MLA ID y slug
  const linkRe = /href="(https?:\/\/([a-z]+)\.mercadolibre\.com\.ar\/MLA-(\d+)-([^"#&]+))/g;
  const items: RawItem[] = [];
  const seen = new Set<string>();
  while ((m = linkRe.exec(html)) !== null) {
    const mlaId = 'MLA' + m[3];
    if (seen.has(mlaId)) continue;
    seen.add(mlaId);

    const typeRaw = m[2]; // casa, departamento, terreno, inmueble, etc.
    const slugPart = m[4].replace(/-_JM$/, '').replace(/-$/, '');
    const title = slugPart
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^(.)/, (c: string) => c.toUpperCase());

    const pd = priceData[mlaId] || { currency: 'ARS', price: 0 };
    const pic = picData[mlaId];
    const img = pic ? `https://http2.mlstatic.com/D_NQ_NP_${pic}-O.jpg` : null;

    items.push({
      mlaId,
      title,
      price: pd.price,
      currency: pd.currency,
      type: typeRaw,
      img,
      source_url: m[1].split('#')[0],
    });
  }

  return items;
}

// ── Mapear al modelo Property ────────────────────────────────────────────────
function mapToProperty(raw: RawItem, ciudad: string, provincia: string) {
  const baseSlug = slugify(raw.title);
  // Sufijo -alq- para distinguir slugs de alquiler vs venta del mismo MLA ID
  const slug = `${baseSlug}-alq-${raw.mlaId}`;
  const type = mapType(raw.type);

  return {
    slug,
    title: raw.title,
    description: `${raw.title} en ${ciudad}, ${provincia}. Propiedad en alquiler publicada en MercadoLibre.`,
    price: raw.price || 1,
    currency: raw.currency === 'USD' ? 'USD' : 'ARS',
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
    featured: raw.price > 500000 && !!raw.img, // ARS alquiler: destacar > 500k/mes
    published: true,
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('Conectando a MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Conectado.\n');

  const summary: Record<string, { inserted: number; skipped: number; segments: number }> = {};
  let totalInserted = 0;
  let totalSkipped = 0;

  for (const city of CITIES) {
    summary[city.ciudad] = { inserted: 0, skipped: 0, segments: 0 };
    console.log(`\n═══ ${city.ciudad} (${city.provincia}) ═══`);

    const segments = buildUrls(city.cityUrl);

    for (const seg of segments) {
      console.log(`  → [${seg.label}]: ${seg.url}`);

      try {
        const html = await fetchHtml(seg.url);
        const raw = extractItems(html);
        console.log(`     ${raw.length} items encontrados`);

        if (raw.length === 0) {
          console.log(`     Sin items en segmento "${seg.label}" — saltando`);
          await sleep(600);
          continue;
        }

        summary[city.ciudad].segments += 1;
        const props = raw.map((r) => mapToProperty(r, city.ciudad, city.provincia));

        try {
          const result = await Property.insertMany(props, { ordered: false });
          summary[city.ciudad].inserted += result.length;
          totalInserted += result.length;
          console.log(`     OK: ${result.length} insertadas`);
        } catch (bulkErr: any) {
          const inserted = bulkErr.result?.nInserted ?? bulkErr.insertedCount ?? 0;
          const skipped = props.length - inserted;
          summary[city.ciudad].inserted += inserted;
          summary[city.ciudad].skipped += skipped;
          totalInserted += inserted;
          totalSkipped += skipped;
          console.log(`     OK: ${inserted} insertadas, ${skipped} duplicados`);
        }
      } catch (e: any) {
        console.error(`     Error en "${seg.label}": ${e.message}`);
      }

      await sleep(900); // pausa entre segmentos
    }

    await sleep(1200); // pausa extra entre ciudades
  }

  console.log('\n═══════════════════════════════════════════════');
  console.log('RESUMEN FINAL — Alquiler ciudades grandes (3 segmentos/ciudad)');
  console.log('═══════════════════════════════════════════════');
  for (const [label, s] of Object.entries(summary)) {
    console.log(
      `  ${label.padEnd(30)} segmentos: ${String(s.segments).padStart(2)}  insertadas: ${String(s.inserted).padStart(4)}  duplicados: ${s.skipped}`
    );
  }
  console.log('───────────────────────────────────────────────');
  console.log(`  TOTAL insertadas: ${totalInserted}`);
  console.log(`  TOTAL duplicados: ${totalSkipped}`);
  console.log('═══════════════════════════════════════════════');

  await mongoose.disconnect();
  console.log('Desconectado. Listo.');
}

seed().catch(console.error);
