import mongoose from 'mongoose';
import * as https from 'https';

const MONGODB_URI =
  'mongodb+srv://inmocultural_db_user:fIVTKcJ6PLk41elg@mudate.8u0oikg.mongodb.net/mudate?retryWrites=true&w=majority&appName=mudate';

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

// ── Ciudades a scrapear ───────────────────────────────────────────────────────
const CITIES = [
  // Buenos Aires Interior
  { ciudad: 'Mar del Plata', provincia: 'Buenos Aires', url: 'mar-del-plata-buenos-aires' },
  { ciudad: 'Bahía Blanca', provincia: 'Buenos Aires', url: 'bahia-blanca-buenos-aires' },
  { ciudad: 'La Plata', provincia: 'Buenos Aires', url: 'la-plata-buenos-aires' },
  { ciudad: 'Luján', provincia: 'Buenos Aires', url: 'lujan-buenos-aires' },
  { ciudad: 'Necochea', provincia: 'Buenos Aires', url: 'necochea-buenos-aires' },
  // Santa Fe
  { ciudad: 'Rafaela', provincia: 'Santa Fe', url: 'rafaela-santa-fe' },
  { ciudad: 'Venado Tuerto', provincia: 'Santa Fe', url: 'venado-tuerto-santa-fe' },
  // Entre Ríos
  { ciudad: 'Concordia', provincia: 'Entre Ríos', url: 'concordia-entre-rios' },
  { ciudad: 'Gualeguaychú', provincia: 'Entre Ríos', url: 'gualeguaychu-entre-rios' },
  // Mendoza
  { ciudad: 'San Rafael', provincia: 'Mendoza', url: 'san-rafael-mendoza' },
  { ciudad: 'Godoy Cruz', provincia: 'Mendoza', url: 'godoy-cruz-mendoza' },
  // Misiones / NEA
  { ciudad: 'Oberá', provincia: 'Misiones', url: 'obera-misiones' },
  // Córdoba
  { ciudad: 'Jesús María', provincia: 'Córdoba', url: 'jesus-maria-cordoba' },
  { ciudad: 'Villa Allende', provincia: 'Córdoba', url: 'villa-allende-cordoba' },
  { ciudad: 'Unquillo', provincia: 'Córdoba', url: 'unquillo-cordoba' },
  // Salta
  { ciudad: 'San Ramón de la Nueva Orán', provincia: 'Salta', url: 'san-ramon-de-la-nueva-oran-salta' },
  // Neuquén
  { ciudad: 'Zapala', provincia: 'Neuquén', url: 'zapala-neuquen' },
  { ciudad: 'Plottier', provincia: 'Neuquén', url: 'plottier-neuquen' },
  // Río Negro
  { ciudad: 'General Roca', provincia: 'Río Negro', url: 'general-roca-rio-negro' },
  { ciudad: 'Cipolletti', provincia: 'Río Negro', url: 'cipolletti-rio-negro' },
];

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

    const pd = priceData[mlaId] || { currency: 'USD', price: 0 };
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
  const slug = `${baseSlug}-mla-${raw.mlaId}`;
  const type = mapType(raw.type);

  return {
    slug,
    title: raw.title,
    description: `${raw.title} en ${ciudad}, ${provincia}. Propiedad en venta publicada en MercadoLibre.`,
    price: raw.price || 1,
    currency: raw.currency === 'ARS' ? 'ARS' : 'USD',
    operation: 'venta',
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
    featured: raw.currency === 'USD' && raw.price > 80000 && !!raw.img,
    published: true,
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('Conectando a MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Conectado.\n');

  const summary: Record<string, { inserted: number; skipped: number; found: number }> = {};
  let totalInserted = 0;
  let totalSkipped = 0;

  for (const city of CITIES) {
    const mlUrl = `https://inmuebles.mercadolibre.com.ar/venta/${city.url}/`;
    console.log(`\n→ Scrapeando: ${city.ciudad} (${mlUrl})`);
    summary[city.ciudad] = { inserted: 0, skipped: 0, found: 0 };

    try {
      const html = await fetchHtml(mlUrl);
      const raw = extractItems(html);
      summary[city.ciudad].found = raw.length;
      console.log(`  ${raw.length} items encontrados en HTML`);

      if (raw.length === 0) {
        console.log('  Sin items, saltando.');
        await sleep(800);
        continue;
      }

      const props = raw.map((r) => mapToProperty(r, city.ciudad, city.provincia));

      // insertMany con ordered: false para ignorar duplicados (slug unique)
      try {
        const result = await Property.insertMany(props, { ordered: false });
        summary[city.ciudad].inserted = result.length;
        totalInserted += result.length;
      } catch (bulkErr: any) {
        // BulkWriteError: algunos insertados, algunos duplicados
        const inserted = bulkErr.result?.nInserted ?? bulkErr.insertedCount ?? 0;
        const skipped = props.length - inserted;
        summary[city.ciudad].inserted = inserted;
        summary[city.ciudad].skipped = skipped;
        totalInserted += inserted;
        totalSkipped += skipped;
      }

      console.log(
        `  OK: ${summary[city.ciudad].inserted} insertadas, ${summary[city.ciudad].skipped} duplicados`
      );
    } catch (e: any) {
      console.error(`  Error en ${city.ciudad}: ${e.message}`);
    }

    await sleep(800);
  }

  console.log('\n═══════════════════════════════════════');
  console.log('RESUMEN FINAL — Ciudades 2');
  console.log('═══════════════════════════════════════');
  for (const [label, s] of Object.entries(summary)) {
    console.log(`  ${label.padEnd(35)} encontradas: ${String(s.found).padStart(3)}  insertadas: ${String(s.inserted).padStart(3)}  duplicados: ${s.skipped}`);
  }
  console.log('───────────────────────────────────────');
  console.log(`  TOTAL insertadas: ${totalInserted}`);
  console.log(`  TOTAL duplicados: ${totalSkipped}`);
  console.log('═══════════════════════════════════════');

  await mongoose.disconnect();
  console.log('Desconectado. Listo.');
}

seed().catch(console.error);
