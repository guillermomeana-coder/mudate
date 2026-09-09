/**
 * ZonaProp scraper — extrae propiedades reales de zonaprop.com.ar
 * Parsea window.__PRELOADED_STATE__ inyectado en el HTML.
 *
 * Uso:
 *   npx tsx scripts/scrape-zonaprop.ts
 *   npx tsx scripts/scrape-zonaprop.ts --dry-run
 *   npx tsx scripts/scrape-zonaprop.ts --ciudad "Córdoba Capital" --pages 5
 *
 * Requiere: MONGODB_URI en .env.local (o hardcodeada abajo)
 */

import mongoose from 'mongoose';

// ── Config ─────────────────────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI
  || 'mongodb+srv://inmocultural_db_user:fIVTKcJ6PLk41elg@mudate.8u0oikg.mongodb.net/mudate?retryWrites=true&w=majority&appName=mudate';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const CITY_ARG = args.find((_, i) => args[i - 1] === '--ciudad');
const PAGES_ARG = parseInt(args.find((_, i) => args[i - 1] === '--pages') || '3');

// ── Targets ────────────────────────────────────────────────────────────────────
// ZonaProp URL pattern: https://www.zonaprop.com.ar/{tipo}-{operation}-{zona}.html
// Each page has ~20 listings

const TARGETS: { url: string; ciudad: string; provincia: string }[] = [
  // Córdoba Capital — venta
  { url: 'https://www.zonaprop.com.ar/propiedades-venta-cordoba-capital.html', ciudad: 'Córdoba Capital', provincia: 'Córdoba' },
  { url: 'https://www.zonaprop.com.ar/departamentos-venta-nueva-cordoba.html', ciudad: 'Córdoba Capital', provincia: 'Córdoba' },
  { url: 'https://www.zonaprop.com.ar/casas-venta-cerro-de-las-rosas.html', ciudad: 'Córdoba Capital', provincia: 'Córdoba' },
  { url: 'https://www.zonaprop.com.ar/propiedades-venta-villa-belgrano.html', ciudad: 'Córdoba Capital', provincia: 'Córdoba' },
  // Córdoba Capital — alquiler
  { url: 'https://www.zonaprop.com.ar/propiedades-alquiler-cordoba-capital.html', ciudad: 'Córdoba Capital', provincia: 'Córdoba' },
  { url: 'https://www.zonaprop.com.ar/departamentos-alquiler-nueva-cordoba.html', ciudad: 'Córdoba Capital', provincia: 'Córdoba' },
  // Villa Carlos Paz
  { url: 'https://www.zonaprop.com.ar/propiedades-venta-villa-carlos-paz.html', ciudad: 'Villa Carlos Paz', provincia: 'Córdoba' },
  { url: 'https://www.zonaprop.com.ar/propiedades-alquiler-villa-carlos-paz.html', ciudad: 'Villa Carlos Paz', provincia: 'Córdoba' },
  // Villa María
  { url: 'https://www.zonaprop.com.ar/propiedades-venta-villa-maria-cordoba.html', ciudad: 'Villa María', provincia: 'Córdoba' },
  // Río Cuarto
  { url: 'https://www.zonaprop.com.ar/propiedades-venta-rio-cuarto.html', ciudad: 'Río Cuarto', provincia: 'Córdoba' },
  // Alta Gracia
  { url: 'https://www.zonaprop.com.ar/propiedades-venta-alta-gracia.html', ciudad: 'Alta Gracia', provincia: 'Córdoba' },
  // Buenos Aires Capital
  { url: 'https://www.zonaprop.com.ar/propiedades-venta-palermo.html', ciudad: 'Buenos Aires Capital', provincia: 'Buenos Aires' },
  { url: 'https://www.zonaprop.com.ar/propiedades-venta-recoleta.html', ciudad: 'Buenos Aires Capital', provincia: 'Buenos Aires' },
  { url: 'https://www.zonaprop.com.ar/propiedades-alquiler-palermo.html', ciudad: 'Buenos Aires Capital', provincia: 'Buenos Aires' },
  // Rosario
  { url: 'https://www.zonaprop.com.ar/propiedades-venta-rosario.html', ciudad: 'Rosario', provincia: 'Santa Fe' },
  { url: 'https://www.zonaprop.com.ar/propiedades-alquiler-rosario.html', ciudad: 'Rosario', provincia: 'Santa Fe' },
  // Mendoza
  { url: 'https://www.zonaprop.com.ar/propiedades-venta-mendoza-capital.html', ciudad: 'Mendoza', provincia: 'Mendoza' },
  // Bariloche
  { url: 'https://www.zonaprop.com.ar/propiedades-venta-bariloche.html', ciudad: 'Bariloche', provincia: 'Río Negro' },
  // Salta
  { url: 'https://www.zonaprop.com.ar/propiedades-venta-salta-capital.html', ciudad: 'Salta', provincia: 'Salta' },
  // Mar del Plata
  { url: 'https://www.zonaprop.com.ar/propiedades-venta-mar-del-plata.html', ciudad: 'Mar del Plata', provincia: 'Buenos Aires' },
];

// ── Schema ─────────────────────────────────────────────────────────────────────

const PropertySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: String, description: String,
  price: Number, currency: { type: String, default: 'USD' },
  operation: String, type: String,
  ciudad: String, barrio: String, provincia: String,
  ambientes: Number, dormitorios: Number, banos: Number,
  superficie_total: Number, superficie_cubierta: Number,
  images: [String],
  source: String, source_url: String,
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
}, { timestamps: true });

const Property = mongoose.models?.Property || mongoose.model('Property', PropertySchema);

// ── Helpers ────────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-')
    .trim().slice(0, 100);
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-AR,es;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
};

// ── Scraper ────────────────────────────────────────────────────────────────────

function mapType(zpType: string): string {
  const t = zpType.toLowerCase();
  if (t.includes('departamento') || t.includes('flat') || t.includes('ph')) return 'departamento';
  if (t.includes('casa') || t.includes('chalet') || t.includes('duplex')) return 'casa';
  if (t.includes('terreno') || t.includes('lote')) return 'terreno';
  if (t.includes('local') || t.includes('comercial')) return 'local';
  if (t.includes('oficina')) return 'oficina';
  if (t.includes('campo') || t.includes('finca') || t.includes('chacra')) return 'campo';
  if (t.includes('galpon') || t.includes('bodega') || t.includes('depósito')) return 'galpon';
  if (t.includes('cochera') || t.includes('garaje') || t.includes('parking')) return 'cochera';
  return 'departamento';
}

function mapOperation(zpOp: string): 'venta' | 'alquiler' {
  return zpOp?.toLowerCase().includes('alquiler') || zpOp?.toLowerCase().includes('rent')
    ? 'alquiler' : 'venta';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseListings(data: any, fallbackCiudad: string, fallbackProvincia: string): ParsedProp[] {
  const results: ParsedProp[] = [];

  // ZonaProp stores listings under different keys depending on version
  const listingsList =
    data?.listPostings ||
    data?.searchResults?.postings ||
    data?.search?.listPostings ||
    data?.postings ||
    [];

  for (const item of listingsList) {
    try {
      const posting = item.posting || item;
      if (!posting?.id) continue;

      const price = posting.priceOperationTypes?.[0]?.prices?.[0]?.amount
        || posting.price?.amount
        || posting.prices?.[0]?.amount;

      if (!price || price <= 0) continue;

      const currency = posting.priceOperationTypes?.[0]?.prices?.[0]?.currency
        || posting.price?.currency
        || 'USD';

      const operation = mapOperation(
        posting.priceOperationTypes?.[0]?.operationType?.name
        || posting.operationType
        || ''
      );

      const zpType = posting.realEstateType?.name || posting.type || 'Departamento';
      const propType = mapType(zpType);

      const barrio = posting.address?.neighborhood?.name || posting.address?.district || '';
      const ciudad = posting.address?.city?.name || fallbackCiudad;
      const provincia = posting.address?.state?.name || fallbackProvincia;

      const images: string[] = (posting.photos || posting.mainPhoto ? [posting.mainPhoto, ...(posting.photos || [])] : [])
        .filter(Boolean)
        .map((p: { url?: string; value?: string } | string) => (typeof p === 'string' ? p : p?.url || p?.value || ''))
        .filter((u: string) => u && u.startsWith('http'))
        .slice(0, 6);

      const attrs = posting.mainFeatures || posting.featuresChecked || {};
      const getAttr = (keys: string[]): number | undefined => {
        for (const k of keys) {
          const val = attrs[k]?.value || attrs[k];
          if (val && !isNaN(Number(val))) return Number(val);
        }
        return undefined;
      };

      const ambientes = getAttr(['ambientes', 'rooms', 'totalRooms', 'AMBIENTES']);
      const dormitorios = getAttr(['dormitorios', 'bedrooms', 'suites', 'DORMITORIOS']);
      const banos = getAttr(['banos', 'bathrooms', 'BANOS']);
      const sup_cubierta = getAttr(['superficieCubierta', 'coveredSurface', 'SUPERFICIE_CUBIERTA', 'superficie_cubierta']);
      const sup_total = getAttr(['superficieTotal', 'totalSurface', 'SUPERFICIE_TOTAL', 'superficie_total', 'superficie']);

      const titleRaw = posting.title
        || `${zpType} en ${operation} — ${barrio || ciudad}`;

      const description = posting.description
        || `${zpType} en ${ciudad}${barrio ? ', ' + barrio : ''}.${sup_cubierta ? ' ' + sup_cubierta + ' m² cubiertos.' : ''}${dormitorios ? ' ' + dormitorios + ' dormitorios.' : ''}`;

      const sourceId = String(posting.id);
      const slug = slugify(`${titleRaw}-${ciudad}-${sourceId}`);

      results.push({
        slug,
        title: titleRaw.slice(0, 200),
        description: description.slice(0, 1000),
        price: Number(price),
        currency: currency === 'USD' || currency === '$u' ? 'USD' : 'ARS',
        operation,
        type: propType,
        ciudad,
        barrio,
        provincia,
        ambientes,
        dormitorios,
        banos,
        superficie_cubierta: sup_cubierta,
        superficie_total: sup_total,
        images,
        source: 'zonaprop',
        source_url: `https://www.zonaprop.com.ar${posting.url || ''}`,
        featured: false,
        published: true,
      });
    } catch { /* skip malformed */ }
  }

  return results;
}

interface ParsedProp {
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  operation: string;
  type: string;
  ciudad: string;
  barrio: string;
  provincia: string;
  ambientes?: number;
  dormitorios?: number;
  banos?: number;
  superficie_cubierta?: number;
  superficie_total?: number;
  images: string[];
  source: string;
  source_url: string;
  featured: boolean;
  published: boolean;
}

async function scrapeUrl(baseUrl: string, ciudad: string, provincia: string, pages: number): Promise<ParsedProp[]> {
  const all: ParsedProp[] = [];

  for (let page = 1; page <= pages; page++) {
    const url = page === 1 ? baseUrl : baseUrl.replace('.html', `-pagina-${page}.html`);
    console.log(`  Fetching: ${url}`);

    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) {
        console.log(`    HTTP ${res.status} — skip`);
        break;
      }

      const html = await res.text();

      // Extract __PRELOADED_STATE__
      const match = html.match(/window\.__PRELOADED_STATE__\s*=\s*(\{[\s\S]*?\});\s*(?:window\.|<\/script>)/);
      if (!match) {
        // Try alternative patterns
        const match2 = html.match(/window\.__PRELOADED_STATE__\s*=\s*(\{[\s\S]+\})/);
        if (!match2) {
          console.log('    No __PRELOADED_STATE__ found — trying JSON-LD');
          // Fallback: try JSON-LD
          const ldMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
          for (const m of ldMatches) {
            try {
              const data = JSON.parse(m[1]);
              if (data['@type'] === 'ItemList') {
                const items = data.itemListElement || [];
                for (const item of items) {
                  const el = item.item;
                  if (!el) continue;
                  const price = el.offers?.price;
                  if (!price) continue;
                  const slug = slugify(`${el.name || 'propiedad'}-${ciudad}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`);
                  all.push({
                    slug,
                    title: el.name || `Propiedad en ${ciudad}`,
                    description: el.description || `Propiedad en ${ciudad}.`,
                    price: Number(price),
                    currency: el.offers?.priceCurrency === 'USD' ? 'USD' : 'ARS',
                    operation: baseUrl.includes('alquiler') ? 'alquiler' : 'venta',
                    type: 'departamento',
                    ciudad, barrio: '', provincia,
                    images: el.image ? [el.image] : [],
                    source: 'zonaprop',
                    source_url: el.url || url,
                    featured: false, published: true,
                  });
                }
              }
            } catch { /* ignore */ }
          }
          break;
        }

        try {
          const data = JSON.parse(match2[1]);
          const listings = parseListings(data, ciudad, provincia);
          console.log(`    Page ${page}: ${listings.length} propiedades`);
          all.push(...listings);
        } catch { break; }
      } else {
        try {
          const data = JSON.parse(match[1]);
          const listings = parseListings(data, ciudad, provincia);
          console.log(`    Page ${page}: ${listings.length} propiedades`);
          all.push(...listings);
          if (listings.length < 5) break; // last page
        } catch { break; }
      }

      // Respectful delay between requests
      await sleep(1500 + Math.random() * 1000);
    } catch (err) {
      console.error(`    Error fetching ${url}:`, err);
      break;
    }
  }

  return all;
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n=== ZonaProp Scraper${DRY_RUN ? ' [DRY RUN]' : ''} ===\n`);
  console.log(`Páginas por URL: ${PAGES_ARG}`);
  if (CITY_ARG) console.log(`Filtro ciudad: ${CITY_ARG}`);

  const targets = CITY_ARG
    ? TARGETS.filter(t => t.ciudad.toLowerCase().includes(CITY_ARG.toLowerCase()))
    : TARGETS;

  console.log(`URLs a procesar: ${targets.length}\n`);

  const allProps: ParsedProp[] = [];

  for (const target of targets) {
    console.log(`\n[${target.ciudad}] ${target.url}`);
    const props = await scrapeUrl(target.url, target.ciudad, target.provincia, PAGES_ARG);
    allProps.push(...props);
    await sleep(2000);
  }

  // Deduplicate by slug
  const seen = new Set<string>();
  const unique = allProps.filter(p => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  console.log(`\n=== Resultados ===`);
  console.log(`Total scrapeadas: ${allProps.length}`);
  console.log(`Únicas (sin duplicados): ${unique.length}`);

  if (DRY_RUN) {
    console.log('\n--- Sample (primeras 3) ---');
    unique.slice(0, 3).forEach(p => console.log(JSON.stringify(p, null, 2)));
    console.log('\n[DRY RUN] No se guardó nada.');
    return;
  }

  if (unique.length === 0) {
    console.log('Nada que guardar.');
    return;
  }

  // Connect to MongoDB and upsert
  console.log('\nConectando a MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Conectado. Insertando...');

  let inserted = 0, updated = 0, errors = 0;

  for (const prop of unique) {
    try {
      const result = await Property.updateOne(
        { $or: [{ slug: prop.slug }, { source_url: prop.source_url }] },
        { $set: prop },
        { upsert: true }
      );
      if (result.upsertedCount > 0) inserted++;
      else if (result.modifiedCount > 0) updated++;
    } catch {
      errors++;
    }
  }

  console.log(`\n✅ Insertas: ${inserted} | Actualizadas: ${updated} | Errores: ${errors}`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
