import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Search, TrendingUp, MapPin, ArrowRight, Building2, Home, TreePine } from 'lucide-react';
import PropertyGrid from '@/components/PropertyGrid';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';
import type { PropertyCardData } from '@/components/PropertyCard';

export const dynamic = 'force-dynamic';

const marketStats = [
  { label: 'Precio m² Córdoba Capital', value: 'USD 1.350', trend: '+8.5% YoY' },
  { label: 'Precio m² Villa Carlos Paz', value: 'USD 1.600', trend: '+12% YoY' },
  { label: 'Yield Nueva Córdoba', value: '6-7%', trend: 'anual bruto' },
  { label: 'Propiedades activas', value: '+3.000', trend: 'en toda Argentina' },
];

const ciudades = [
  {
    name: 'Córdoba Capital',
    slug: 'cordoba-capital',
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    props: '1.800+',
    desc: 'Nueva Córdoba · General Paz · Valle Escondido',
  },
  {
    name: 'Villa María',
    slug: 'villa-maria',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    props: '178+',
    desc: 'La segunda ciudad de la provincia',
  },
  {
    name: 'Villa Carlos Paz',
    slug: 'villa-carlos-paz',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    props: '3.060+',
    desc: 'Yield turístico hasta 10% anual',
  },
];

async function getFeaturedProperties(): Promise<PropertyCardData[]> {
  try {
    await connectDB();
    const props = await Property.find({ published: true })
      .sort({ featured: -1, createdAt: -1 })
      .limit(6)
      .lean();

    return props.map((p) => ({
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
    }));
  } catch {
    return [];
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const featured = await getFeaturedProperties();

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0D3B37 0%, #0F766E 55%, #0369A1 100%)',
          minHeight: 640,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `
              radial-gradient(ellipse 60% 50% at 10% 60%, rgba(20,184,166,0.18) 0%, transparent 70%),
              radial-gradient(ellipse 40% 40% at 85% 20%, rgba(3,105,161,0.20) 0%, transparent 70%)
            `,
          }}
        />
        {/* Noise texture */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, opacity: 0.025,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <p className="section-label" style={{ color: 'rgba(153,246,228,0.9)', marginBottom: 20 }}>
            Portal inmobiliario Argentina
          </p>

          <h1
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(2.6rem, 7vw, 5.5rem)',
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              marginBottom: 24,
              maxWidth: 700,
            }}
          >
            Tu próxima<br />propiedad,<br />
            <span style={{ color: '#5EEAD4' }}>en todo el país.</span>
          </h1>

          <p
            style={{
              color: 'rgba(255,255,255,0.65)',
              fontSize: '1.05rem',
              fontWeight: 300,
              maxWidth: 460,
              marginBottom: 40,
              lineHeight: 1.7,
            }}
          >
            {t('subtitle')}
          </p>

          {/* Search form */}
          <form
            action="/propiedades"
            method="get"
            style={{
              display: 'flex',
              gap: 8,
              maxWidth: 560,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 16,
              padding: 6,
            }}
          >
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 12 }}>
              <Search size={17} color="rgba(255,255,255,0.6)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                name="q"
                placeholder={t('searchPlaceholder')}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontFamily: 'Josefin Sans, sans-serif',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                borderRadius: 12,
                background: 'var(--accent)',
                color: '#fff',
                fontFamily: 'Josefin Sans, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                flexShrink: 0,
              }}
            >
              {t('searchBtn')}
            </button>
          </form>

          {/* Quick filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
            {[
              { icon: <Home size={13} />, label: t('types.casa'), href: '/propiedades?type=Casa' },
              { icon: <Building2 size={13} />, label: t('types.departamento'), href: '/propiedades?type=Departamento' },
              { icon: <TreePine size={13} />, label: t('types.terreno'), href: '/propiedades?type=Terreno' },
            ].map((f) => (
              <Link
                key={f.label}
                href={f.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 16px', borderRadius: 999,
                  fontSize: '0.8rem', fontWeight: 500,
                  background: 'rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  textDecoration: 'none',
                  transition: 'background 180ms ease',
                }}
              >
                {f.icon}{f.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={{ background: 'var(--foreground)', padding: '44px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '32px 16px',
            }}
          >
            {marketStats.map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <p
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '-0.02em',
                    marginBottom: 4,
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#5EEAD4', letterSpacing: '0.06em', marginBottom: 2 }}>
                  {stat.trend}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PROPERTIES ═══ */}
      {featured.length > 0 && (
        <section style={{ background: 'var(--background)', padding: '80px 0' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: 40,
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <p className="section-label" style={{ marginBottom: 8 }}>Seleccionadas</p>
                <h2
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                    fontWeight: 600,
                    color: 'var(--foreground)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Propiedades destacadas
                </h2>
              </div>
              <Link
                href="/propiedades"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: '0.85rem', fontWeight: 600,
                  color: 'var(--primary)',
                  textDecoration: 'none',
                }}
              >
                Ver todas <ArrowRight size={15} />
              </Link>
            </div>

            <PropertyGrid properties={featured} />
          </div>
        </section>
      )}

      {/* ═══ CIUDADES ═══ */}
      <section style={{ background: 'var(--muted)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="section-label" style={{ marginBottom: 8 }}>Por ciudad</p>
            <h2
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                fontWeight: 600,
                color: 'var(--foreground)',
                letterSpacing: '-0.02em',
              }}
            >
              Explorá Córdoba
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {ciudades.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="group"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 20,
                  height: 260,
                  display: 'block',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1)',
                }}
              >
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${c.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 500ms ease',
                  }}
                  className="group-hover:scale-105"
                />
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(13,59,55,0.82) 0%, rgba(13,59,55,0.25) 50%, transparent 100%)',
                  }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                    <MapPin size={12} color="rgba(255,255,255,0.6)" />
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>{c.props} propiedades</span>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'Cinzel, serif',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      color: '#fff',
                      letterSpacing: '-0.01em',
                      marginBottom: 3,
                    }}
                  >
                    {c.name}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INVERTIR CTA ═══ */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0D3B37 0%, #0F766E 60%, #0369A1 100%)',
          padding: '96px 0',
        }}
      >
        <div className="max-w-4xl mx-auto px-4" style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 18px', borderRadius: 999, marginBottom: 28,
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: '0.78rem', fontWeight: 500, color: '#5EEAD4',
            }}
          >
            <TrendingUp size={13} />
            Córdoba: mercado en expansión 2026
          </div>

          <h2
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Invertí en bienes raíces<br />
            <span style={{ color: '#5EEAD4' }}>con datos reales.</span>
          </h2>

          <p
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '1rem',
              fontWeight: 300,
              maxWidth: 440,
              margin: '0 auto 36px',
              lineHeight: 1.7,
            }}
          >
            Nueva Córdoba rinde 6-7% anual. Villa Carlos Paz hasta 10% turístico.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link href="/invertir" className="btn-ghost">Ver guía de inversión</Link>
            <Link
              href="/propiedades"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', borderRadius: 12,
                background: '#fff', color: 'var(--primary)',
                fontFamily: 'Josefin Sans, sans-serif',
                fontSize: '0.875rem', fontWeight: 700,
                textDecoration: 'none',
                transition: 'opacity 180ms ease',
              }}
            >
              Ver propiedades
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
