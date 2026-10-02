import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, TrendingUp, Home, ArrowRight, CheckCircle } from 'lucide-react';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  const citySlug = 'tucuman';
  const cityName = 'Tucumán';
  return {
    title: isEn
      ? 'Real Estate in Tucumán — University & Agroindustrial Investment | Mudate'
      : 'Propiedades en Tucumán — Inversión Inmobiliaria en el NOA | Mudate',
    description: isEn
      ? 'Properties for sale in Tucumán Capital. Argentina\'s 4th largest city. USD 800–1,200/m², Yerba Buena, Norte, Centro. 5–7% cap rate, university and agroindustrial market.'
      : 'Propiedades en venta en Tucumán Capital. La cuarta ciudad de Argentina. USD 800–1.200/m², Yerba Buena, Norte, Centro. Cap rate 5–7%, mercado universitario y agroindustrial.',
    keywords: isEn
      ? ['real estate tucuman argentina', 'buy property tucuman', 'yerba buena real estate', 'price m2 tucuman', 'university investment tucuman', 'tucuman argentina property']
      : ['comprar casa tucumán', 'propiedades tucumán capital', 'precio m2 tucumán', 'departamentos tucumán', 'invertir tucumán NOA', 'yerba buena propiedades'],
    alternates: {
      canonical: `${base}/${isEn ? 'en/' : ''}${citySlug}`,
      languages: { 'es': `${base}/${citySlug}`, 'en': `${base}/en/${citySlug}` },
    },
    openGraph: {
      title: isEn ? `Real Estate in ${cityName} — Argentina's 4th City with Low Entry Prices` : `Propiedades en ${cityName} — 4ª Ciudad de Argentina con Precios Accesibles`,
      description: isEn
        ? 'Find properties for sale in Tucumán. One of Argentina\'s most accessible markets: USD 800–1,200/m², 120,000 university students and solid agro-industrial economy.'
        : 'Encontrá propiedades en Tucumán. Uno de los mercados más accesibles de Argentina: USD 800–1.200/m², 120.000 estudiantes universitarios y economía agroindustrial sólida.',
      url: `${base}/${isEn ? 'en/' : ''}${citySlug}`,
      type: 'website',
      siteName: 'Mudate Argentina',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: `${cityName} propiedades` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? `Real Estate in ${cityName} — University & Agroindustrial Investment | Mudate` : `Propiedades en ${cityName} — Inversión Inmobiliaria en el NOA | Mudate`,
      description: isEn
        ? 'Properties for sale in Tucumán Capital. Argentina\'s 4th largest city. USD 800–1,200/m², Yerba Buena, Norte, Centro. 5–7% cap rate, university and agroindustrial market.'
        : 'Propiedades en venta en Tucumán Capital. La cuarta ciudad de Argentina. USD 800–1.200/m², Yerba Buena, Norte, Centro. Cap rate 5–7%, mercado universitario y agroindustrial.',
      images: [`${base}/opengraph-image`],
    },
  };
}

const stats = [
  { label: 'Precio promedio', value: 'USD 950/m²' },
  { label: 'Cap rate promedio', value: '5–7%' },
  { label: 'Habitantes', value: '1.6M' },
  { label: 'Universidades', value: '6+' },
];

const porqueInvertir = [
  'Cuarta ciudad de Argentina por población — mercado inmobiliario en expansión',
  'Precios de entrada muy accesibles: USD 800–1.200/m², los más bajos del NOA',
  'Fuerte demanda universitaria: UNT y universidades privadas con 120.000 estudiantes',
  'Polo agroalimentario e industrial: azúcar, limón, soja — economía real sólida',
  'Yerba Buena: el barrio premium de mayor crecimiento del norte argentino',
  'Nuevo plan urbano y expansión de infraestructura elevan la valorización',
];

const barrios = [
  { name: 'Yerba Buena', desc: 'El barrio más exclusivo y en expansión', tipo: 'casas / barrios privados' },
  { name: 'Norte', desc: 'Zona universitaria de alta demanda', tipo: 'departamentos / PH' },
  { name: 'Centro', desc: 'Alta demanda de alquiler permanente', tipo: 'departamentos / comercial' },
  { name: 'Las Talitas', desc: 'Expansión urbana y terrenos', tipo: 'terrenos / casas' },
];

const faqs = [
  { q: '¿Cuánto vale el m² en Tucumán Capital en 2025?', a: 'El precio promedio en Tucumán Capital es USD 800–1.200/m². En Yerba Buena los valores llegan a USD 1.100–1.400/m² por la alta demanda de familias premium. El Centro y zona Norte ofrecen USD 800–1.000/m² con alta rentabilidad por demanda universitaria.' },
  { q: '¿Por qué Tucumán es una buena inversión inmobiliaria?', a: 'Tucumán combina economía agroindustrial sólida (azúcar, limón, soja), 120.000 estudiantes universitarios que generan demanda constante de alquiler, y precios de entrada entre los más accesibles del país. El cap rate promedio es del 5–7% USD.' },
  { q: '¿Cuál es el mejor barrio para invertir en Tucumán?', a: 'Yerba Buena para valorización a largo plazo y demanda de familias premium. Norte y el entorno universitario para mayor cap rate (6–7%). Centro para alquiler permanente y alta rotación. Las Talitas para terrenos y desarrollo a futuro.' },
  { q: '¿Cómo está creciendo el mercado inmobiliario tucumano?', a: 'Tucumán vive un boom de construcción en Yerba Buena y barrios privados del Gran San Miguel. La expansión del aeropuerto y el plan urbano 2030 impulsan la valorización. Los precios subieron +18% en USD en los últimos 2 años.' },
];

const properties: PropertyCardData[] = [
  {
    slug: 'depto-tucuman-norte-2amb',
    title: 'Departamento 2 ambientes — Zona Norte',
    price: 72000,
    currency: 'USD',
    operation: 'venta',
    type: 'departamento',
    ciudad: 'Tucumán',
    barrio: 'Norte',
    ambientes: 2,
    dormitorios: 1,
    banos: 1,
    superficie_cubierta: 58,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
  },
  {
    slug: 'casa-tucuman-yerba-buena-3dorm',
    title: 'Casa 3 dormitorios — Yerba Buena',
    price: 215000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Tucumán',
    barrio: 'Yerba Buena',
    ambientes: 4,
    dormitorios: 3,
    banos: 2,
    superficie_cubierta: 175,
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'],
  },
  {
    slug: 'terreno-tucuman-las-talitas-1000m2',
    title: 'Terreno 1.000 m² — Las Talitas',
    price: 48000,
    currency: 'USD',
    operation: 'venta',
    type: 'terreno',
    ciudad: 'Tucumán',
    barrio: 'Las Talitas',
    ambientes: 0,
    dormitorios: 0,
    banos: 0,
    superficie_cubierta: 1000,
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
  },
];

export default function TucumanPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 60%, #0D3424 100%)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4" style={{ color: 'rgba(153,246,228,0.8)' }}>
            <MapPin size={14} />
            <span className="text-xs" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>NOA, Argentina</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Tucumán
          </h1>
          <p className="text-xl text-white/70 font-light max-w-xl mb-8">
            El jardín de la República. La cuarta ciudad de Argentina con precios accesibles, economía sólida y una demanda universitaria que sostiene los alquileres durante todo el año.
          </p>
          <div className="flex gap-3">
            <Link href="/propiedades?ciudad=Tucumán" className="px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer" style={{ background: 'var(--accent)' }}>
              Ver propiedades
            </Link>
            <Link href="/invertir#tucuman" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              Datos de inversión
            </Link>
            <Link href="/tucuman/precio-m2" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              Precio m²
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
      <section style={{ background: 'var(--background)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Tucumán</p>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Propiedades disponibles</h2>
            </div>
            <Link href="/propiedades?ciudad=Tucumán" className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--primary)' }}>
              Ver todas <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => <PropertyCard key={p.slug} property={p} />)}
          </div>
        </div>
      </section>

      {/* Por qué invertir */}
      <section style={{ background: 'var(--muted)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Por qué elegir</p>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
                Invertir en Tucumán
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
          <h2 className="text-2xl font-semibold mb-8" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Preguntas frecuentes sobre propiedades en Tucumán</h2>
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
          <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
            Artículos relacionados
          </h2>
          <div className="flex flex-col gap-3">
            <Link href="/blog/invertir-tucuman-argentina-mercado-universitario" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              → Invertir en Tucumán: el mercado universitario y agroindustrial que nadie mira
            </Link>
            <Link href="/blog/mejor-ciudad-para-invertir-argentina-2025" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              → ¿En qué ciudad de Argentina conviene más invertir en 2025?
            </Link>
          </div>
        </div>
      </section>

      {/* Schema JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': 'https://mudateargentina.com/tucuman#localbusiness', name: 'Mudate — Tucumán', description: 'Portal inmobiliario de Tucumán Capital, Argentina', address: { '@type': 'PostalAddress', addressLocality: 'San Miguel de Tucumán', addressRegion: 'Tucumán', addressCountry: 'AR' }, url: 'https://mudateargentina.com/tucuman', areaServed: { '@type': 'City', name: 'Tucumán' }, priceRange: 'USD 35.000 – USD 250.000', aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.4', reviewCount: '61', bestRating: '5', worstRating: '1' } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' }, { '@type': 'ListItem', position: 2, name: 'Tucumán', item: 'https://mudateargentina.com/tucuman' }] }) }} />
    </div>
  );
}
