import { Metadata } from 'next';
import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';
import PropertyGrid from '@/components/PropertyGrid';
import { PropertyCardData } from '@/components/PropertyCard';
import {
  PROVINCE_SLUG_MAP,
  PROVINCE_DESCRIPTIONS,
  PROVINCE_CITIES,
  CITY_SLUG_MAP,
} from '@/lib/slugify';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = Object.keys(PROVINCE_SLUG_MAP);
  const locales = ['es', 'en'];
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const provinciaName = PROVINCE_SLUG_MAP[slug];
  if (!provinciaName) return { title: 'Provincia | Mudate' };

  const isEn = locale === 'en';
  const title = isEn
    ? `Properties in ${provinciaName} | Mudate`
    : `Propiedades en ${provinciaName} | Mudate`;
  const desc = isEn
    ? `Find houses, apartments and land for sale and rent in ${provinciaName}, Argentina. Browse all listings on Mudate.`
    : `Encontrá casas, departamentos y terrenos en venta y alquiler en ${provinciaName}, Argentina. Explorá todas las propiedades en Mudate.`;
  const base = 'https://mudateargentina.com';
  const path = `/provincia/${slug}`;

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

async function getProvinceProperties(provinciaName: string): Promise<{ items: PropertyCardData[]; total: number }> {
  try {
    await connectDB();
    const [items, total] = await Promise.all([
      Property.find({ provincia: provinciaName, published: true })
        .sort({ featured: -1, createdAt: -1 })
        .limit(48)
        .lean(),
      Property.countDocuments({ provincia: provinciaName, published: true }),
    ]);
    return {
      total,
      items: items.map((p) => ({
        slug: p.slug,
        title: p.title,
        price: p.price,
        currency: p.currency as 'USD' | 'ARS',
        operation: p.operation as 'venta' | 'alquiler',
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
    console.error('Error fetching province properties:', e);
    return { items: [], total: 0 };
  }
}

// Build reverse lookup: city name → slug
const CITY_NAME_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(CITY_SLUG_MAP).map(([slug, name]) => [name, slug])
);

export default async function ProvinciaPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const isEn = locale === 'en';
  const provinciaName = PROVINCE_SLUG_MAP[slug];

  if (!provinciaName) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <p>Provincia no encontrada.</p>
        <Link href="/propiedades">Ver todas las propiedades</Link>
      </div>
    );
  }

  const { items: properties, total } = await getProvinceProperties(provinciaName);
  const desc = PROVINCE_DESCRIPTIONS[provinciaName];
  const citySlugsInProvince = PROVINCE_CITIES[slug] || [];

  return (
    <div style={{ background: 'var(--background)' }}>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0D3B37 0%, #0F766E 100%)',
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
          <p
            className="section-label"
            style={{ color: 'rgba(153,246,228,0.85)', marginBottom: 12 }}
          >
            {isEn ? 'Province' : 'Provincia'}
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
            {isEn ? `Properties in ${provinciaName}` : `Propiedades en ${provinciaName}`}
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats pills */}
        {desc?.stats && desc.stats.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
            {desc.stats.map((stat) => (
              <span
                key={stat}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 999,
                  padding: '4px 14px',
                  fontSize: '0.78rem',
                  color: 'var(--foreground)',
                  fontFamily: 'Josefin Sans, sans-serif',
                }}
              >
                {stat}
              </span>
            ))}
          </div>
        )}

        {/* Properties grid or empty state */}
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
                ? `Coming soon — properties in ${provinciaName}`
                : `Próximamente propiedades en ${provinciaName}`}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: 20 }}>
              {isEn
                ? 'Be the first to list your property in this province.'
                : 'Sé el primero en publicar tu propiedad en esta provincia.'}
            </p>
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
        ) : (
          <>
            <PropertyGrid properties={properties} />
            {total > 48 && (
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <Link
                  href={`/propiedades?provincia=${encodeURIComponent(provinciaName)}`}
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

        {/* Province description */}
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
              {isEn ? `Investing in ${provinciaName}` : `Invertir en ${provinciaName}`}
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
          </section>
        )}

        {/* Cities in this province */}
        {citySlugsInProvince.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <h2
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                fontWeight: 600,
                color: 'var(--foreground)',
                marginBottom: 20,
              }}
            >
              {isEn ? `Cities in ${provinciaName}` : `Ciudades en ${provinciaName}`}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 14,
              }}
            >
              {citySlugsInProvince.map((citySlug) => {
                const cityName = CITY_SLUG_MAP[citySlug];
                if (!cityName) return null;
                return (
                  <Link
                    key={citySlug}
                    href={`/ciudad/${citySlug}`}
                    className="glass"
                    style={{
                      display: 'block',
                      padding: '16px 20px',
                      borderRadius: 12,
                      textDecoration: 'none',
                      transition: 'transform 0.15s ease',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Josefin Sans, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--foreground)',
                        display: 'block',
                        marginBottom: 4,
                      }}
                    >
                      {cityName}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--primary)',
                        fontFamily: 'Josefin Sans, sans-serif',
                      }}
                    >
                      {isEn ? 'View properties →' : 'Ver propiedades →'}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Filter link */}
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
          <Link
            href={`/propiedades?provincia=${encodeURIComponent(provinciaName)}`}
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
              ? `Search all properties in ${provinciaName} with filters →`
              : `Buscar todas las propiedades en ${provinciaName} con filtros →`}
          </Link>
        </div>
      </div>
    </div>
  );
}
