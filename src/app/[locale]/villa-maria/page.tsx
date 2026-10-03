import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, TrendingUp, Home, ArrowRight, CheckCircle } from 'lucide-react';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';

export const revalidate = 3600; // ISR: revalida cada 1 hora

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const base = 'https://mudateargentina.com';
  const isEn = locale === 'en';
  return {
    title: isEn
      ? 'Properties in Villa María, Córdoba — Houses and Apartments | Mudate'
      : 'Propiedades en Villa María, Córdoba — Casas y Departamentos | Mudate',
    description: isEn
      ? 'Find properties in Villa María, Córdoba. Average apartment USD 90,721. The second most important city in the province with a growing real estate market.'
      : 'Encontrá propiedades en Villa María, Córdoba. Departamento promedio USD 90.721. La segunda ciudad más importante de la provincia con mercado en crecimiento.',
    keywords: isEn
      ? ['real estate villa maria cordoba', 'buy apartment villa maria', 'price m2 villa maria', 'invest villa maria argentina']
      : ['comprar casa villa maría', 'propiedades villa maría córdoba', 'precio m2 villa maría', 'departamentos villa maría', 'inmuebles villa maría', 'invertir villa maría'],
    openGraph: {
      title: isEn ? 'Villa María Real Estate — Mudate Argentina' : 'Propiedades en Villa María — Mudate Argentina',
      description: isEn
        ? 'Houses, apartments and land in Villa María, Córdoba. 40% cheaper than Córdoba Capital with 6.5–7.5% USD cap rates.'
        : 'Casas, departamentos y terrenos en Villa María, Córdoba. 40% más barato que la capital con cap rates de 6.5–7.5% USD.',
      url: isEn ? `${base}/en/villa-maria` : `${base}/villa-maria`,
      type: 'website',
      siteName: 'Mudate Argentina',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: 'Propiedades en Villa María, Córdoba — Mudate Argentina' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? 'Properties in Villa María, Córdoba — Houses and Apartments | Mudate' : 'Propiedades en Villa María, Córdoba — Casas y Departamentos | Mudate',
      description: isEn
        ? 'Find properties in Villa María, Córdoba. Average apartment USD 90,721. The second most important city in the province with a growing real estate market.'
        : 'Encontrá propiedades en Villa María, Córdoba. Departamento promedio USD 90.721. La segunda ciudad más importante de la provincia con mercado en crecimiento.',
      images: [`${base}/opengraph-image`],
    },
    alternates: {
      canonical: isEn ? `${base}/en/villa-maria` : `${base}/villa-maria`,
      languages: { es: `${base}/villa-maria`, en: `${base}/en/villa-maria`, 'x-default': `${base}/villa-maria` },
    },
  };
}

const stats = [
  { label: 'Departamento promedio', value: 'USD 90.721' },
  { label: '2 ambientes', value: 'USD 70.889' },
  { label: '3 ambientes', value: 'USD 98.795' },
  { label: 'Habitantes', value: '100.000+' },
];

const porqueInvertir = [
  'Segunda ciudad más importante de Córdoba',
  'Fuerte polo universitario (UNVM) y comercial',
  'Precios accesibles vs Córdoba Capital (40% menos)',
  'Crecimiento sostenido del parque automotor e industria',
  'Conectividad: RN 158, tren, autopista',
  'Mercado inmobiliario en expansión 2025-2026',
];

const barrios = [
  { name: 'Centro', desc: 'El corazón comercial', tipo: 'departamentos' },
  { name: 'Residencial Norte', desc: 'Zona familiar consolidada', tipo: 'casas' },
  { name: 'Barrio Nuevo', desc: 'Desarrollo moderno', tipo: 'casas / terrenos' },
  { name: 'Palermo', desc: 'Barrio universitario', tipo: 'departamentos' },
];

async function getVillaMariaProperties(): Promise<PropertyCardData[]> {
  try {
    await connectDB();
    const props = await Property.find({
      published: true,
      ciudad: /^villa\s+maría$/i,
    })
      .sort({ featured: -1, createdAt: -1 })
      .limit(6)
      .lean();

    return props.map((p) => ({
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
    }));
  } catch {
    return [];
  }
}

const faqs = [
  { q: '¿Cuánto cuesta un departamento en Villa María?', a: 'Un departamento 2 ambientes en Villa María cuesta entre USD 65.000 y USD 75.000. El precio promedio del m² es USD 900–1.100, aproximadamente 40% más barato que Córdoba Capital.' },
  { q: '¿Por qué Villa María tiene los mejores cap rates de la provincia?', a: 'Villa María tiene una demanda universitaria estructural de 15.000 estudiantes de la UNVM. Esto genera vacancia casi nula en departamentos céntricos y alquileres que no bajan proporcionalmente al precio del inmueble.' },
  { q: '¿Vale la pena invertir en Villa María vs Córdoba Capital?', a: 'Para renta, Villa María ofrece cap rates del 6.5–7.5% USD vs 4.5–5.5% en Córdoba Capital. La brecha de precio (40% más barato) no se refleja en los alquileres, creando mayor rentabilidad. La contracara es menor liquidez al vender.' },
  { q: '¿Cuáles son las mejores zonas para invertir en Villa María?', a: 'Centro para mayor demanda y menor vacancia. Barrio Palermo para demanda universitaria y mayor rotación de inquilinos. Norte para familias y valorización a largo plazo.' },
];

const relatedPosts = [
  { slug: 'mercado-inmobiliario-villa-maria-2025', title: 'Mercado inmobiliario Villa María 2025: precios, tendencias y oportunidades', readTime: 7 },
  { slug: 'comprar-departamento-villa-maria', title: 'Cómo comprar un departamento en Villa María: guía paso a paso', readTime: 10 },
  { slug: 'barrios-villa-maria-donde-invertir', title: 'Barrios de Villa María: ¿dónde conviene invertir según tu perfil?', readTime: 6 },
];

export default async function VillaMariaPage() {
  const properties = await getVillaMariaProperties();

  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 60%, #0D3424 100%)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4" style={{ color: 'rgba(153,246,228,0.8)' }}>
            <MapPin size={14} />
            <span className="text-xs" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>Córdoba, Argentina</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Villa María
          </h1>
          <p className="text-xl text-white/70 font-light max-w-xl mb-8">
            La segunda ciudad de Córdoba. Mercado inmobiliario en crecimiento con precios 40% más accesibles que la capital.
          </p>
          <div className="flex gap-3">
            <Link href="/propiedades?ciudad=Villa+Mar%C3%ADa" className="px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer" style={{ background: 'var(--accent)' }}>
              Ver propiedades
            </Link>
            <Link href="/invertir#villa-maria" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              Datos de inversión
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--foreground)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Propiedades */}
      {properties.length > 0 && (
        <section style={{ background: 'var(--background)' }} className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Villa María</p>
                <h2 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
                  Propiedades disponibles
                </h2>
              </div>
              <Link href="/propiedades?ciudad=Villa+Mar%C3%ADa" className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--primary)' }}>
                Ver todas <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p) => <PropertyCard key={p.slug} property={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Por qué invertir */}
      <section style={{ background: 'var(--muted)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Por qué elegir</p>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
                Invertir en Villa María
              </h2>
              <ul className="flex flex-col gap-3">
                {porqueInvertir.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'var(--foreground)' }}>
                    <CheckCircle size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/invertir" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer" style={{ background: 'var(--primary)' }}>
                <TrendingUp size={16} />
                Ver análisis de inversión completo
              </Link>
            </div>
            {/* Barrios */}
            <div className="grid grid-cols-2 gap-4">
              {barrios.map((b) => (
                <div key={b.name} className="rounded-xl p-4 cursor-pointer transition-all duration-200 hover:-translate-y-1" style={{ background: 'white', boxShadow: 'var(--shadow-md)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Home size={14} style={{ color: 'var(--primary)' }} />
                    <h3 className="text-sm font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>{b.name}</h3>
                  </div>
                  <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>{b.desc}</p>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--border)', color: 'var(--primary)' }}>{b.tipo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section style={{ background: 'var(--background)' }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold mb-8" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Preguntas frecuentes sobre propiedades en Villa María</h2>
          <div className="flex flex-col gap-4 max-w-3xl">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-xl p-6" style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold mb-2 text-sm" style={{ color: 'var(--foreground)' }}>{f.q}</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)', lineHeight: 1.7 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artículos relacionados */}
      <section style={{ background: 'var(--muted)' }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Artículos sobre Villa María</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {relatedPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-xl p-5 cursor-pointer hover:-translate-y-1 transition-all duration-200" style={{ background: 'white', boxShadow: 'var(--shadow-md)' }}>
                <h3 className="text-sm font-semibold mb-2 leading-snug" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>{post.title}</h3>
                <p className="text-xs flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                  {post.readTime} min de lectura <ArrowRight size={12} />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': 'https://mudateargentina.com/villa-maria#localbusiness',
            name: 'Mudate — Villa María',
            description: 'Portal inmobiliario de Villa María, Córdoba Argentina',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Villa María',
              addressRegion: 'Córdoba',
              addressCountry: 'AR',
            },
            url: 'https://mudateargentina.com/villa-maria',
            areaServed: {
              '@type': 'City',
              name: 'Villa María',
            },
            priceRange: 'USD 40.000 – USD 200.000',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.6',
              reviewCount: '112',
              bestRating: '5',
              worstRating: '1',
            },
          }),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' }, { '@type': 'ListItem', position: 2, name: 'Villa María', item: 'https://mudateargentina.com/villa-maria' }] }) }} />
    </div>
  );
}
