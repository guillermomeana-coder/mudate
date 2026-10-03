import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';
import PropertyGrid from '@/components/PropertyGrid';
import { PropertyCardData } from '@/components/PropertyCard';
import {
  CITY_SLUG_MAP,
  CITY_DESCRIPTIONS,
  CITY_TO_PROVINCE_SLUG,
  PROVINCE_SLUG_MAP,
  slugify,
  unslugify,
} from '@/lib/slugify';

export const revalidate = 3600; // ISR: revalida cada 1 hora

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const hardcodedSlugs = new Set(Object.keys(CITY_SLUG_MAP));

  // Also generate params for any distinct ciudad values in MongoDB
  try {
    await connectDB();
    const dbCities: string[] = await Property.distinct('ciudad', { published: true });
    for (const city of dbCities) {
      if (city) {
        hardcodedSlugs.add(slugify(city));
      }
    }
  } catch (e) {
    console.error('generateStaticParams: could not fetch DB cities:', e);
  }

  const locales = ['es', 'en'];
  return locales.flatMap((locale) =>
    Array.from(hardcodedSlugs).map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  let cityName = CITY_SLUG_MAP[slug];

  // Fallback: look up in DB if not in static map
  if (!cityName) {
    try {
      await connectDB();
      const candidate = unslugify(slug);
      const found = await Property.findOne(
        { ciudad: { $regex: `^${candidate}$`, $options: 'i' }, published: true },
        { ciudad: 1 }
      ).lean();
      if (found) cityName = found.ciudad as string;
    } catch {
      // ignore
    }
  }

  if (!cityName) return { title: 'Ciudad | Mudate' };

  const isEn = locale === 'en';
  const title = isEn
    ? `Properties in ${cityName} | Mudate`
    : `Propiedades en ${cityName} | Mudate`;
  const desc = isEn
    ? `Find houses, apartments and land for sale in ${cityName}, Argentina. Browse all listings on Mudate.`
    : `Encontrá casas, departamentos y terrenos en venta en ${cityName}, Argentina. Explorá todas las propiedades en Mudate.`;
  const base = 'https://mudateargentina.com';
  const path = `/ciudad/${slug}`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: isEn ? `${base}/en${path}` : `${base}${path}`,
      languages: {
        es: `${base}${path}`,
        en: `${base}/en${path}`,
        'x-default': `${base}${path}`,
      },
    },
  };
}

async function getCityProperties(
  cityName: string,
): Promise<{ items: PropertyCardData[]; total: number }> {
  try {
    await connectDB();
    const baseQuery: Record<string, unknown> = { ciudad: cityName, published: true, operation: 'venta' };
    const [items, total] = await Promise.all([
      Property.find(baseQuery)
        .sort({ featured: -1, createdAt: -1 })
        .limit(48)
        .lean(),
      Property.countDocuments(baseQuery),
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
        categoria: p.categoria || 'standard',
      })),
    };
  } catch (e) {
    console.error('Error fetching city properties:', e);
    return { items: [], total: 0 };
  }
}

export default async function CiudadPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const isEn = locale === 'en';

  // Primary: try hardcoded map (unchanged behavior)
  let cityName = CITY_SLUG_MAP[slug];

  // Fallback: if not in map, try to find the city in MongoDB via unslugify
  if (!cityName) {
    try {
      await connectDB();
      const candidate = unslugify(slug);
      // Case-insensitive search for the ciudad field
      const found = await Property.findOne(
        { ciudad: { $regex: `^${candidate}$`, $options: 'i' }, published: true },
        { ciudad: 1 }
      ).lean();
      if (found) {
        cityName = found.ciudad as string;
      }
    } catch (e) {
      console.error('CiudadPage fallback DB lookup failed:', e);
    }
  }

  if (!cityName) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <p>Ciudad no encontrada.</p>
        <Link href="/propiedades">Ver todas las propiedades</Link>
      </div>
    );
  }

  const { items: properties, total } = await getCityProperties(cityName);
  const desc = CITY_DESCRIPTIONS[cityName];
  const provinceSlug = CITY_TO_PROVINCE_SLUG[slug];
  const provinceName = provinceSlug ? PROVINCE_SLUG_MAP[provinceSlug] : undefined;

  // GBA note
  const isGBA = slug.startsWith('gba-');
  const gbaLabel = isEn ? 'Greater Buenos Aires' : 'Gran Buenos Aires';

  const BASE = 'https://mudateargentina.com';
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Propiedades', item: `${BASE}/propiedades` },
      ...(provinceName ? [{ '@type': 'ListItem', position: 3, name: provinceName, item: `${BASE}/provincia/${provinceSlug}` }] : []),
      { '@type': 'ListItem', position: provinceName ? 4 : 3, name: cityName, item: `${BASE}/ciudad/${slug}` },
    ],
  };

  const itemListLd = properties.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Propiedades en venta en ${cityName}`,
    numberOfItems: total,
    itemListElement: properties.slice(0, 5).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}/propiedades/${p.slug}`,
      name: p.title,
    })),
  } : null;

  return (
    <div style={{ background: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {itemListLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />}
      {/* Hero */}
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
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage:
              'radial-gradient(ellipse 60% 80% at 90% 50%, rgba(3,105,161,0.2) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            {provinceName && (
              <>
                <Link
                  href={`/provincia/${provinceSlug}`}
                  style={{
                    color: 'rgba(153,246,228,0.75)',
                    fontSize: '0.78rem',
                    textDecoration: 'none',
                    fontFamily: 'Josefin Sans, sans-serif',
                  }}
                >
                  {provinceName}
                </Link>
                <span style={{ color: 'rgba(153,246,228,0.5)', fontSize: '0.78rem' }}>›</span>
              </>
            )}
            <span
              style={{
                color: 'rgba(153,246,228,0.85)',
                fontSize: '0.78rem',
                fontFamily: 'Josefin Sans, sans-serif',
              }}
            >
              {isGBA ? gbaLabel : isEn ? 'City' : 'Ciudad'}
            </span>
          </div>

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
            {isEn ? `Properties in ${cityName}` : `Propiedades en ${cityName}`}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', fontWeight: 300 }}>
            {total > 0
              ? isEn
                ? `${total} properties available`
                : `${total} propiedades disponibles`
              : isEn
              ? 'Coming soon'
              : 'Próximamente'}
          </p>

          {isGBA && (
            <p
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: '0.78rem',
                marginTop: 6,
                fontFamily: 'Josefin Sans, sans-serif',
              }}
            >
              {isEn
                ? `Part of Greater Buenos Aires (GBA) — Buenos Aires Province`
                : `Zona del Gran Buenos Aires (GBA) — Provincia de Buenos Aires`}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Properties or empty state */}
        {properties.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 0',
              background: 'var(--card)',
              borderRadius: 16,
              border: '1px solid var(--border)',
              marginBottom: 48,
            }}
          >
            <p
              style={{
                fontSize: '1.1rem',
                fontFamily: 'Cinzel, serif',
                color: 'var(--foreground)',
                marginBottom: 8,
              }}
            >
              {isEn
                ? `Coming soon — properties in ${cityName}`
                : `Próximamente propiedades en ${cityName}`}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: 20 }}>
              {isEn
                ? 'Be the first to list your property here.'
                : 'Sé el primero en publicar tu propiedad acá.'}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {provinceName && provinceSlug && (
                <Link
                  href={`/provincia/${provinceSlug}`}
                  style={{
                    display: 'inline-block',
                    padding: '10px 24px',
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                    borderRadius: 10,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {isEn ? `See ${provinceName}` : `Ver ${provinceName}`}
                </Link>
              )}
              <Link
                href="/propiedades"
                style={{
                  display: 'inline-block',
                  padding: '10px 24px',
                  background: 'var(--primary)',
                  color: '#fff',
                  borderRadius: 10,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {isEn ? 'View all properties' : 'Ver todas las propiedades'}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <PropertyGrid properties={properties} />
            {total > 48 && (
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <Link
                  href={`/propiedades?ciudad=${encodeURIComponent(cityName)}`}
                  style={{
                    display: 'inline-block',
                    padding: '10px 28px',
                    background: 'var(--primary)',
                    color: '#fff',
                    borderRadius: 10,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {isEn ? `View all ${total} properties` : `Ver las ${total} propiedades`}
                </Link>
              </div>
            )}
          </>
        )}

        {/* City description */}
        {desc && (
          <section style={{ marginTop: 56 }}>
            <h2
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                fontWeight: 600,
                color: 'var(--foreground)',
                marginBottom: 16,
              }}
            >
              {isEn ? `About ${cityName}` : `Sobre ${cityName}`}
            </h2>
            <p
              style={{
                fontSize: '0.95rem',
                lineHeight: 1.8,
                color: 'var(--muted-foreground)',
                maxWidth: 760,
                fontFamily: 'Josefin Sans, sans-serif',
              }}
            >
              {isEn ? desc.en : desc.es}
            </p>

            {/* Barrios */}
            {desc.barrios && desc.barrios.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <h3
                  style={{
                    fontFamily: 'Josefin Sans, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--foreground)',
                    marginBottom: 14,
                  }}
                >
                  {isEn ? 'Main neighborhoods' : 'Barrios principales'}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {desc.barrios.map((barrio) => (
                    <Link
                      key={barrio}
                      href={`/propiedades?ciudad=${encodeURIComponent(cityName)}&q=${encodeURIComponent(barrio)}`}
                      style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 999,
                        padding: '5px 16px',
                        fontSize: '0.8rem',
                        color: 'var(--foreground)',
                        textDecoration: 'none',
                        fontFamily: 'Josefin Sans, sans-serif',
                        transition: 'border-color 0.15s',
                      }}
                    >
                      {barrio}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Filter link */}
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
          <Link
            href={`/propiedades?ciudad=${encodeURIComponent(cityName)}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.85rem',
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontFamily: 'Josefin Sans, sans-serif',
            }}
          >
            {isEn
              ? `Search all properties in ${cityName} with filters →`
              : `Buscar todas las propiedades en ${cityName} con filtros →`}
          </Link>
        </div>
      </div>
    </div>
  );
}
