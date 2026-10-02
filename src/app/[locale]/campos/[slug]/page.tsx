import { Metadata } from 'next';
import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';
import PropertyGrid from '@/components/PropertyGrid';
import { PropertyCardData } from '@/components/PropertyCard';
import { PROVINCE_SLUG_MAP } from '@/lib/slugify';

export const revalidate = 3600; // ISR: revalida cada 1 hora

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
  if (!provinciaName) return { title: 'Campos | Mudate' };

  const isEn = locale === 'en';
  const title = isEn
    ? `Rural Properties in ${provinciaName} | Mudate`
    : `Campos en ${provinciaName} | Mudate`;
  const desc = isEn
    ? `Find rural land, farms and agricultural properties in ${provinciaName}, Argentina.`
    : `Encontrá campos, chacras, fincas y terrenos rurales en ${provinciaName}, Argentina.`;
  const base = 'https://mudateargentina.com';
  const path = `/campos/${slug}`;

  const canonical = isEn ? `${base}/en${path}` : `${base}${path}`;
  return {
    title,
    description: desc,
    alternates: {
      canonical,
      languages: {
        es: `${base}${path}`,
        en: `${base}/en${path}`,
        'x-default': `${base}${path}`,
      },
    },
    openGraph: {
      title,
      description: desc,
      url: canonical,
      type: 'website',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [`${base}/opengraph-image`],
    },
  };
}

const RURAL_TYPES = ['terreno', 'campo', 'chacra', 'finca'];

async function getRuralByProvince(provinciaName: string): Promise<{ items: PropertyCardData[]; total: number }> {
  try {
    await connectDB();
    const query = {
      provincia: provinciaName,
      published: true,
      type: { $in: RURAL_TYPES },
    };
    const [items, total] = await Promise.all([
      Property.find(query).sort({ featured: -1, createdAt: -1 }).limit(48).lean(),
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
    console.error('Error fetching rural properties by province:', e);
    return { items: [], total: 0 };
  }
}

export default async function CamposProvinciaPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const isEn = locale === 'en';
  const provinciaName = PROVINCE_SLUG_MAP[slug];

  if (!provinciaName) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <p>Provincia no encontrada.</p>
        <Link href="/campos">
          {isEn ? 'View all rural properties' : 'Ver todos los campos'}
        </Link>
      </div>
    );
  }

  const { items: properties, total } = await getRuralByProvince(provinciaName);

  const BASE = 'https://mudateargentina.com';
  const path = `/campos/${slug}`;
  const pageUrl = isEn ? `${BASE}/en${path}` : `${BASE}${path}`;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
      { '@type': 'ListItem', position: 2, name: isEn ? 'Rural Properties' : 'Campos', item: isEn ? `${BASE}/en/campos` : `${BASE}/campos` },
      { '@type': 'ListItem', position: 3, name: provinciaName, item: pageUrl },
    ],
  };

  const collectionPageLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isEn ? `Rural Properties in ${provinciaName}` : `Campos en ${provinciaName}`,
    description: isEn
      ? `Find rural land, farms and agricultural properties in ${provinciaName}, Argentina.`
      : `Encontrá campos, chacras, fincas y terrenos rurales en ${provinciaName}, Argentina.`,
    url: pageUrl,
    inLanguage: isEn ? 'en' : 'es',
  };

  return (
    <div style={{ background: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageLd) }} />
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
            <Link
              href="/campos"
              style={{
                color: 'rgba(153,246,228,0.75)',
                fontSize: '0.78rem',
                textDecoration: 'none',
                fontFamily: 'Josefin Sans, sans-serif',
              }}
            >
              {isEn ? 'Rural Properties' : 'Campos'}
            </Link>
            <span style={{ color: 'rgba(153,246,228,0.5)', fontSize: '0.78rem' }}>›</span>
            <span
              style={{
                color: 'rgba(153,246,228,0.85)',
                fontSize: '0.78rem',
                fontFamily: 'Josefin Sans, sans-serif',
              }}
            >
              {provinciaName}
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
            {isEn ? `Rural Properties in ${provinciaName}` : `Campos en ${provinciaName}`}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', fontWeight: 300 }}>
            {total > 0
              ? isEn
                ? `${total} rural listings available`
                : `${total} propiedades rurales disponibles`
              : isEn
              ? 'Coming soon'
              : 'Próximamente'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {properties.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 0',
              background: 'var(--card)',
              borderRadius: 16,
              border: '1px solid var(--border)',
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
                ? `Coming soon — rural properties in ${provinciaName}`
                : `Próximamente campos en ${provinciaName}`}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: 24 }}>
              {isEn
                ? 'In the meantime, explore all rural listings.'
                : 'Mientras tanto, explorá todos los campos disponibles.'}
            </p>
            <Link
              href="/campos"
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
              {isEn ? 'View all rural properties →' : 'Ver todos los campos →'}
            </Link>
          </div>
        ) : (
          <>
            <PropertyGrid properties={properties} />
            {total > 48 && (
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <Link
                  href={`/propiedades?provincia=${encodeURIComponent(provinciaName)}&type=campo`}
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
                  {isEn ? `View all ${total} rural properties` : `Ver las ${total} propiedades rurales`}
                </Link>
              </div>
            )}
          </>
        )}

        {/* Back links */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/campos"
            style={{
              fontSize: '0.85rem',
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontFamily: 'Josefin Sans, sans-serif',
            }}
          >
            ← {isEn ? 'All rural properties' : 'Todos los campos'}
          </Link>
          <Link
            href={`/provincia/${slug}`}
            style={{
              fontSize: '0.85rem',
              color: 'var(--muted-foreground)',
              textDecoration: 'none',
              fontFamily: 'Josefin Sans, sans-serif',
            }}
          >
            {isEn ? `All properties in ${provinciaName} →` : `Todas las propiedades en ${provinciaName} →`}
          </Link>
        </div>
      </div>
    </div>
  );
}
