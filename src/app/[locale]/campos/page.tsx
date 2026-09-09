import { Metadata } from 'next';
import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';
import PropertyGrid from '@/components/PropertyGrid';
import { PropertyCardData } from '@/components/PropertyCard';
import { PROVINCE_SLUG_MAP } from '@/lib/slugify';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  return {
    title: isEn ? 'Rural Properties in Argentina | Mudate' : 'Campos en Argentina | Mudate',
    description: isEn
      ? 'Find rural land, farms, estancias and agricultural properties across Argentina. Invest in Argentine countryside.'
      : 'Encontrá campos, chacras, fincas y terrenos rurales en toda Argentina. Invertí en el campo argentino.',
    alternates: {
      canonical: isEn ? `${base}/en/campos` : `${base}/campos`,
      languages: {
        es: `${base}/campos`,
        en: `${base}/en/campos`,
        'x-default': `${base}/campos`,
      },
    },
  };
}

const RURAL_TYPES = ['terreno', 'campo', 'chacra', 'finca'];

const ruralQuery = {
  published: true,
  type: { $in: RURAL_TYPES },
};

async function getRuralProperties(): Promise<{ items: PropertyCardData[]; total: number }> {
  try {
    await connectDB();
    const [items, total] = await Promise.all([
      Property.find(ruralQuery).sort({ featured: -1, createdAt: -1 }).limit(24).lean(),
      Property.countDocuments(ruralQuery),
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
    console.error('Error fetching rural properties:', e);
    return { items: [], total: 0 };
  }
}

const investmentReasons = {
  es: [
    {
      title: 'Tierra escasa y demanda global',
      body: 'Argentina tiene solo el 1% de la tierra agrícola mundial pero produce el 5% de los alimentos del planeta. La tierra fértil es un activo finito con demanda internacional creciente.',
    },
    {
      title: 'Dolarización natural del campo',
      body: 'Los commodities agrícolas se cotizan en dólares a nivel global. El campo argentino opera en USD, brindando cobertura cambiaria natural a los inversores.',
    },
    {
      title: 'Rendimientos superiores al promedio',
      body: 'El alquiler de campos en la región pampeana rinde entre 3% y 5% anual en dólares más la apreciación del capital. En zonas de frontera agrícola, los retornos pueden ser mayores.',
    },
    {
      title: 'Diversificación de cartera',
      body: 'La tierra rural es un activo real, descorrelacionado de los mercados financieros y con baja volatilidad histórica. Ideal para diversificar carteras con exposición a commodities.',
    },
  ],
  en: [
    {
      title: 'Scarce land, global demand',
      body: 'Argentina holds only 1% of the world\'s agricultural land but produces 5% of the planet\'s food. Fertile land is a finite asset with growing international demand.',
    },
    {
      title: 'Natural dollarization',
      body: 'Agricultural commodities are priced in USD globally. Argentine farmland operates in USD, providing natural FX hedge for investors.',
    },
    {
      title: 'Above-average returns',
      body: 'Pampean farmland leases yield 3–5% per year in USD plus capital appreciation. In agricultural frontier zones, returns can be higher.',
    },
    {
      title: 'Portfolio diversification',
      body: 'Rural land is a real asset, uncorrelated with financial markets and with historically low volatility. Ideal to diversify portfolios with commodity exposure.',
    },
  ],
};

const TOP_PROVINCES = [
  'buenos-aires', 'cordoba', 'santa-fe', 'entre-rios',
  'mendoza', 'salta', 'tucuman', 'neuquen',
  'rio-negro', 'chubut', 'la-pampa', 'corrientes',
];

export default async function CamposPage({ params }: PageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const { items: properties, total } = await getRuralProperties();
  const reasons = isEn ? investmentReasons.en : investmentReasons.es;

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
            {isEn ? 'Rural Real Estate' : 'Inmuebles Rurales'}
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
            {isEn ? 'Rural Properties in Argentina' : 'Campos en Argentina'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', fontWeight: 300 }}>
            {total > 0
              ? isEn
                ? `${total} rural listings — campos, chacras, fincas & terrenos`
                : `${total} propiedades rurales — campos, chacras, fincas y terrenos`
              : isEn
              ? 'Campos, estancias, chacras and fincas across Argentina'
              : 'Campos, estancias, chacras y fincas en toda Argentina'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Properties */}
        {properties.length > 0 ? (
          <>
            <h2
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                fontWeight: 600,
                color: 'var(--foreground)',
                marginBottom: 24,
              }}
            >
              {isEn ? 'Available Rural Properties' : 'Propiedades Rurales Disponibles'}
            </h2>
            <PropertyGrid properties={properties} />
            {total > 24 && (
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <Link
                  href="/propiedades?type=campo"
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
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 0',
              background: 'var(--card)',
              borderRadius: 16,
              border: '1px solid var(--border)',
              marginBottom: 48,
            }}
          >
            <p
              style={{
                fontSize: '1rem',
                fontFamily: 'Cinzel, serif',
                color: 'var(--foreground)',
                marginBottom: 8,
              }}
            >
              {isEn ? 'Listings coming soon' : 'Propiedades próximamente'}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
              {isEn
                ? 'Contact us to list your rural property.'
                : 'Contactanos para publicar tu campo.'}
            </p>
          </div>
        )}

        {/* Why invest section */}
        <section style={{ marginTop: 64 }}>
          <p
            className="section-label"
            style={{ marginBottom: 12, display: 'inline-block' }}
          >
            {isEn ? 'Investment' : 'Inversión'}
          </p>
          <h2
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.3rem, 3vw, 1.9rem)',
              fontWeight: 600,
              color: 'var(--foreground)',
              marginBottom: 32,
            }}
          >
            {isEn ? 'Why invest in Argentine farmland?' : '¿Por qué invertir en el campo argentino?'}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {reasons.map((r) => (
              <div
                key={r.title}
                className="glass"
                style={{ padding: '24px 24px', borderRadius: 14 }}
              >
                <h3
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--foreground)',
                    marginBottom: 10,
                  }}
                >
                  {r.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.85rem',
                    lineHeight: 1.7,
                    color: 'var(--muted-foreground)',
                    fontFamily: 'Josefin Sans, sans-serif',
                  }}
                >
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Browse by province */}
        <section style={{ marginTop: 56 }}>
          <h2
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
              fontWeight: 600,
              color: 'var(--foreground)',
              marginBottom: 20,
            }}
          >
            {isEn ? 'Campos by province' : 'Campos por provincia'}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 12,
            }}
          >
            {TOP_PROVINCES.map((provinceSlug) => {
              const name = PROVINCE_SLUG_MAP[provinceSlug];
              if (!name) return null;
              return (
                <Link
                  key={provinceSlug}
                  href={`/campos/${provinceSlug}`}
                  className="glass"
                  style={{
                    display: 'block',
                    padding: '16px 20px',
                    borderRadius: 12,
                    textDecoration: 'none',
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
                    {name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--primary)',
                      fontFamily: 'Josefin Sans, sans-serif',
                    }}
                  >
                    {isEn ? 'View campos →' : 'Ver campos →'}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
