import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PropertyCardData } from '@/components/PropertyCard';
import FilterBar from '@/components/FilterBar';
import MapWrapper from '@/components/MapWrapper';
import type { CityCount } from '@/components/PropertyMapView';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';

// Coordenadas de ciudades conocidas
const CITY_COORDS: Record<string, { lat: number; lng: number; provincia: string }> = {
  'Córdoba Capital':                     { lat: -31.4201, lng: -64.1888, provincia: 'Córdoba' },
  'Villa María':                         { lat: -32.4072, lng: -63.2389, provincia: 'Córdoba' },
  'Villa Carlos Paz':                    { lat: -31.4197, lng: -64.4969, provincia: 'Córdoba' },
  'Río Cuarto':                          { lat: -33.1307, lng: -64.3494, provincia: 'Córdoba' },
  'Merlo':                               { lat: -32.3435, lng: -65.0131, provincia: 'San Luis' },
  'Yerba Buena':                         { lat: -26.8153, lng: -65.3139, provincia: 'Tucumán' },
  'San Miguel de Tucumán':               { lat: -26.8083, lng: -65.2176, provincia: 'Tucumán' },
  'Santa Rosa':                          { lat: -36.6152, lng: -64.2922, provincia: 'La Pampa' },
  'San Salvador de Jujuy':               { lat: -24.1858, lng: -65.2995, provincia: 'Jujuy' },
  'San Fernando del Valle de Catamarca': { lat: -28.4696, lng: -65.7795, provincia: 'Catamarca' },
  'Santiago del Estero':                 { lat: -27.7834, lng: -64.2643, provincia: 'Santiago del Estero' },
  'La Rioja':                            { lat: -29.4135, lng: -66.8567, provincia: 'La Rioja' },
  'Formosa':                             { lat: -26.1775, lng: -58.1781, provincia: 'Formosa' },
  'Buenos Aires Capital':                { lat: -34.6037, lng: -58.3816, provincia: 'Buenos Aires' },
  'GBA Norte':                           { lat: -34.4600, lng: -58.5500, provincia: 'Buenos Aires' },
  'GBA Oeste':                           { lat: -34.6200, lng: -58.7800, provincia: 'Buenos Aires' },
  'GBA Sur':                             { lat: -34.8500, lng: -58.4500, provincia: 'Buenos Aires' },
  'Rosario':                             { lat: -32.9442, lng: -60.6505, provincia: 'Santa Fe' },
  'Mendoza':                             { lat: -32.8908, lng: -68.8272, provincia: 'Mendoza' },
  'Salta':                               { lat: -24.7859, lng: -65.4116, provincia: 'Salta' },
  'Neuquén':                             { lat: -38.9516, lng: -68.0591, provincia: 'Neuquén' },
  'Bariloche':                           { lat: -41.1335, lng: -71.3103, provincia: 'Río Negro' },
};

export const revalidate = 1800; // ISR: revalida cada 30 min

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.propiedades' });
  const base = 'https://mudateargentina.com';
  const isEn = locale === 'en';
  return {
    title: t('title'),
    description: t('description'),
    keywords: isEn
      ? ['properties for sale argentina', 'houses cordoba', 'apartments buenos aires', 'real estate argentina 2025']
      : ['propiedades en venta', 'casas en venta córdoba', 'departamentos argentina', 'inmuebles en venta 2025'],
    openGraph: {
      siteName: 'Mudate Argentina',
      title: t('title'),
      description: t('description'),
      url: isEn ? `${base}/en/propiedades` : `${base}/propiedades`,
      type: 'website',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: isEn ? 'Properties for sale in Argentina — Mudate' : 'Propiedades en venta en Argentina — Mudate' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: isEn ? 'Properties for Sale in Argentina | Mudate' : 'Propiedades en Venta en Argentina | Mudate',
      description: isEn ? 'Houses, apartments and lots in Argentina. Real prices 2025–2026.' : 'Casas, departamentos y terrenos en Argentina. Precios reales 2025–2026.',
      images: [`${base}/opengraph-image`],
    },
    alternates: {
      canonical: isEn ? `${base}/en/propiedades` : `${base}/propiedades`,
      languages: {
        'es': `${base}/propiedades`,
        'en': `${base}/en/propiedades`,
        'x-default': `${base}/propiedades`,
      },
    },
  };
}

const PAGE_SIZE = 48;

interface Filters {
  type?: string;
  ciudad?: string;
  provincia?: string;
  price?: string;
  q?: string;
}

function buildQuery(filters: Filters): Record<string, unknown> {
  const query: Record<string, unknown> = { published: true, operation: 'venta' };
  if (filters.type) query.type = new RegExp(`^${filters.type}$`, 'i');
  if (filters.ciudad) query.ciudad = new RegExp(`^${filters.ciudad}$`, 'i');
  if (filters.provincia) query.provincia = new RegExp(`^${filters.provincia}$`, 'i');
  if (filters.price) {
    const [min, max] = filters.price.split('-').map(Number);
    query.price = { $gte: min, $lte: max };
  }
  if (filters.q) {
    const rx = new RegExp(filters.q, 'i');
    query.$or = [{ title: rx }, { barrio: rx }, { ciudad: rx }, { description: rx }];
  }
  return query;
}

function getSortOrder(sort?: string): Record<string, 1 | -1> {
  switch (sort) {
    case 'price-asc': return { price: 1 };
    case 'price-desc': return { price: -1 };
    case 'newest': return { createdAt: -1 };
    default: return { featured: -1, createdAt: -1 };
  }
}

async function getProperties(filters: Filters, page: number, sort?: string): Promise<{ items: PropertyCardData[]; total: number }> {
  try {
    await connectDB();
    const query = buildQuery(filters);
    const [items, total] = await Promise.all([
      Property.find(query)
        .sort(getSortOrder(sort))
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean(),
      Property.countDocuments(query),
    ]);

    return {
      total,
      items: items.map((p) => ({
        slug: p.slug,
        title: p.title,
        price: p.price,
        currency: p.currency as 'USD' | 'ARS',
        operation: 'venta' as const,
        type: p.type,
        ciudad: p.ciudad,
        barrio: p.barrio,
        ambientes: p.ambientes,
        dormitorios: p.dormitorios,
        banos: p.banos,
        superficie_cubierta: p.superficie_cubierta,
        images: p.images || [],
      })),
    };
  } catch (e) {
    console.error('Error fetching properties:', e);
    return { items: [], total: 0 };
  }
}

async function getCityCounts(): Promise<CityCount[]> {
  try {
    await connectDB();
    const agg = await Property.aggregate([
      { $match: { published: true } },
      { $group: { _id: '$ciudad', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return agg
      .filter((c) => CITY_COORDS[c._id])
      .map((c) => ({
        ciudad: c._id,
        count: c.count,
        lat: CITY_COORDS[c._id].lat,
        lng: CITY_COORDS[c._id].lng,
        provincia: CITY_COORDS[c._id].provincia,
      }));
  } catch {
    return [];
  }
}

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    type?: string;
    ciudad?: string;
    provincia?: string;
    price?: string;
    q?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function PropiedadesPage({ params: paramsPromise, searchParams }: PageProps) {
  const { locale } = await paramsPromise;
  const t = await getTranslations({ locale, namespace: 'propiedades' });
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10));

  const filters: Filters = {
    type: params.type,
    ciudad: params.ciudad,
    provincia: params.provincia,
    price: params.price,
    q: params.q,
  };

  const [{ items: properties, total }, cities] = await Promise.all([
    getProperties(filters, page, params.sort),
    getCityCounts(),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const hasFilters = Object.values(filters).some(Boolean);
  const displayCount = hasFilters
    ? t('results', { count: total })
    : t('available', { count: total });

  // Build URL for pagination (preserve all current filters)
  const filterParams = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) filterParams.set(k, v); });
  const filterStr = filterParams.toString();
  const pageBase = filterStr ? `?${filterStr}&page=` : '?page=';

  // JSON-LD ItemList para SEO
  const BASE = 'https://mudateargentina.com';
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Propiedades en venta — Argentina',
    description: `${total} propiedades en venta en Argentina. Casas, departamentos y terrenos.`,
    numberOfItems: total,
    itemListElement: properties.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      position: (page - 1) * PAGE_SIZE + i + 1,
      url: `${BASE}/propiedades/${p.slug}`,
      name: p.title,
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
      { '@type': 'ListItem', position: 2, name: locale === 'en' ? 'Properties' : 'Propiedades', item: locale === 'en' ? `${BASE}/en/propiedades` : `${BASE}/propiedades` },
    ],
  };

  return (
    <div style={{ background: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #061610 0%, #0A2218 100%)',
          padding: '56px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(ellipse 60% 80% at 90% 50%, rgba(3,105,161,0.2) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label" style={{ color: 'rgba(153,246,228,0.85)', marginBottom: 12 }}>
            {t('label')}
          </p>
          <h1
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '-0.025em',
              marginBottom: 8,
            }}
          >
            {t('title')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', fontWeight: 300 }}>
            {displayCount}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Suspense fallback={null}>
          <FilterBar
            type={filters.type}
            ciudad={filters.ciudad}
            provincia={filters.provincia}
            price={filters.price}
            sort={params.sort}
          />
        </Suspense>

        {/* Mapa + Grid */}
        {properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', fontWeight: 300 }}>
              No hay propiedades disponibles con esos filtros.
            </p>
          </div>
        ) : (
          <MapWrapper
            properties={properties}
            cities={cities}
            pagination={
              totalPages > 1 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 48 }}>
                  {page > 1 ? (
                    <Link href={`${pageBase}${page - 1}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, background: 'var(--border)', color: 'var(--foreground)', textDecoration: 'none' }}>
                      <ChevronLeft size={15} /> Anterior
                    </Link>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 10, fontSize: '0.85rem', opacity: 0.3, color: 'var(--muted-foreground)' }}>
                      <ChevronLeft size={15} /> Anterior
                    </span>
                  )}
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
                    {page} / {totalPages}
                  </span>
                  {page < totalPages ? (
                    <Link href={`${pageBase}${page + 1}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, background: 'var(--primary)', color: '#fff', textDecoration: 'none' }}>
                      Siguiente <ChevronRight size={15} />
                    </Link>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 10, fontSize: '0.85rem', opacity: 0.3, color: 'var(--muted-foreground)' }}>
                      Siguiente <ChevronRight size={15} />
                    </span>
                  )}
                </div>
              ) : null
            }
          />
        )}
      </div>
    </div>
  );
}
