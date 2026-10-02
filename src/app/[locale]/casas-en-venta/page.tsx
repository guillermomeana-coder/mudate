import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';
import PropertyGrid from '@/components/PropertyGrid';
import type { PropertyCardData } from '@/components/PropertyCard';

export const revalidate = 3600; // ISR: revalida cada 1 hora

const base = 'https://mudateargentina.com';
const path = 'casas-en-venta';
const pageUrl = `${base}/${path}`;

export const metadata: Metadata = {
  title: 'Casas en Venta en Argentina — Córdoba, Buenos Aires, Rosario | Mudate',
  description:
    'Casas en venta en toda Argentina. Encontrá tu próxima casa en Córdoba, Buenos Aires, Rosario, Mendoza y más de 30 ciudades. Datos reales de precios 2025–2026.',
  keywords: [
    'casas en venta argentina',
    'casas en venta córdoba',
    'casas en venta buenos aires',
    'comprar casa argentina',
    'casas barrio privado argentina',
    'casas en venta mendoza',
    'precio casa córdoba 2025',
    'casas en venta rosario',
  ],
  alternates: {
    canonical: pageUrl,
    languages: { 'es': pageUrl, 'x-default': pageUrl },
  },
  openGraph: {
    siteName: 'Mudate Argentina',
    title: 'Casas en Venta en Argentina | Mudate',
    description: 'Casas en venta en Córdoba, Buenos Aires, Rosario y más de 30 ciudades. Precios reales 2025–2026.',
    url: pageUrl,
    type: 'website',
    images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: 'Mudate Argentina — Casas en Venta' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casas en Venta en Argentina | Mudate',
    description: 'Casas en venta en Córdoba, Buenos Aires, Rosario y más de 30 ciudades. Precios reales 2025–2026.',
    images: [`${base}/opengraph-image`],
  },
};

async function getProperties(): Promise<{ items: PropertyCardData[]; total: number }> {
  try {
    await connectDB();
    const [items, total] = await Promise.all([
      Property.find({ type: new RegExp(`^Casa$`, 'i'), published: true, operation: 'venta' })
        .sort({ featured: -1, createdAt: -1 })
        .limit(48)
        .lean(),
      Property.countDocuments({ type: new RegExp(`^Casa$`, 'i'), published: true, operation: 'venta' }),
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
  } catch {
    return { items: [], total: 0 };
  }
}

const porqueComprar = [
  'Propiedades en USD: protección ante la inflación del peso',
  'Casas en barrios privados y countries: alta seguridad y valorización',
  'Córdoba: precios 50% menores que CABA con rentabilidades superiores',
  'Bariloche y Mendoza: casas de montaña para segunda residencia e inversión',
  'Mercado en expansión post-2025: precios en alza en casi todas las ciudades',
];

const ciudadesPopulares = [
  { href: '/ciudad/cordoba-capital', label: 'Córdoba Capital' },
  { href: '/buenos-aires-capital', label: 'Buenos Aires' },
  { href: '/rosario', label: 'Rosario' },
  { href: '/mendoza', label: 'Mendoza' },
  { href: '/bariloche', label: 'Bariloche' },
  { href: '/ciudad/villa-carlos-paz', label: 'Villa Carlos Paz' },
];

export default async function CasasEnVentaPage() {
  const { items, total } = await getProperties();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' },
          { '@type': 'ListItem', position: 2, name: 'Propiedades', item: 'https://mudateargentina.com/propiedades' },
          { '@type': 'ListItem', position: 3, name: 'Casas en Venta', item: 'https://mudateargentina.com/casas-en-venta' },
        ],
      },
      ...(items.length > 0
        ? [{
            '@type': 'ItemList',
            name: 'Casas en venta en Argentina',
            numberOfItems: total,
            itemListElement: items.slice(0, 5).map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `https://mudateargentina.com/propiedades/${p.slug}`,
              name: p.title,
            })),
          }]
        : []),
    ],
  };

  return (
    <div>
      {/* Hero */}
      <section
        style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 100%)' }}
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-xs" style={{ color: 'rgba(153,246,228,0.7)' }}>
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/propiedades" className="hover:text-white transition-colors">Propiedades</Link>
            <span>/</span>
            <span className="text-white">Casas</span>
          </nav>
          <div className="flex items-center gap-2 mb-4" style={{ color: 'rgba(153,246,228,0.8)' }}>
            <MapPin size={14} />
            <span className="text-xs" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>Todo el país</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Casas en Venta
          </h1>
          <p className="text-xl text-white/70 font-light max-w-xl mb-8">
            {total > 0
              ? `${total.toLocaleString('es-AR')} casas disponibles en toda Argentina.`
              : 'Casas en venta en toda Argentina.'}{' '}
            Córdoba, Buenos Aires, Rosario, Mendoza y más de 30 ciudades.
          </p>
          <Link
            href="/propiedades?type=Casa"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer"
            style={{ background: 'var(--accent)' }}
          >
            Buscar con filtros <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* PropertyGrid */}
      <section style={{ background: 'var(--background)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {total > 0 ? `${total.toLocaleString('es-AR')} resultados` : 'Propiedades'}
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
                Casas disponibles
              </h2>
            </div>
            <Link
              href="/propiedades?type=Casa"
              className="flex items-center gap-2 text-sm cursor-pointer"
              style={{ color: 'var(--primary)' }}
            >
              Ver todas <ArrowRight size={16} />
            </Link>
          </div>

          {items.length > 0 ? (
            <PropertyGrid properties={items} />
          ) : (
            <div
              className="text-center py-20 rounded-2xl"
              style={{ background: 'var(--muted)', border: '1px dashed var(--border)' }}
            >
              <p className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)', fontFamily: 'Cinzel, serif' }}>
                Cargando propiedades
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
                Conectá tu base de datos para ver las casas disponibles.
              </p>
              <Link
                href="/propiedades?type=Casa"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white"
                style={{ background: 'var(--primary)' }}
              >
                Buscar casas <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Por qué comprar */}
      <section style={{ background: 'var(--muted)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Guía de inversión</p>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
              ¿Por qué comprar una casa en Argentina?
            </h2>
            <ul className="flex flex-col gap-3">
              {porqueComprar.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'var(--foreground)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Ciudades populares */}
      <section style={{ background: 'var(--background)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Explorar por ciudad</p>
          <h2 className="text-2xl md:text-3xl font-semibold mb-8" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
            Ciudades populares
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {ciudadesPopulares.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="text-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                style={{
                  background: 'var(--muted)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section style={{ background: 'var(--muted)' }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/propiedades?type=Casa"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white cursor-pointer"
            style={{ background: 'var(--primary)' }}
          >
            Buscar casas con filtros <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
