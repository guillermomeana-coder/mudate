import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, TrendingUp, Home, ArrowRight, CheckCircle } from 'lucide-react';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  const citySlug = 'neuquen';
  const cityName = 'Neuquén';
  return {
    title: isEn
      ? 'Real Estate in Neuquén — Vaca Muerta Oil Boom | Mudate'
      : 'Propiedades en Neuquén — Vaca Muerta y el Boom Petrolero | Mudate',
    description: isEn
      ? 'Properties for sale in Neuquén Capital. The real estate market driven by Vaca Muerta. USD 1,200–1,700/m², Confluencia, Alta Barda, Centro.'
      : 'Propiedades en venta en Neuquén Capital. El mercado inmobiliario que crece con Vaca Muerta. USD 1.200–1.700/m², Confluencia, Alta Barda, Centro.',
    keywords: isEn
      ? ['real estate neuquen argentina', 'buy property neuquen', 'vaca muerta real estate', 'price m2 neuquen', 'alta barda property', 'neuquen oil investment']
      : ['comprar casa neuquén', 'propiedades neuquén capital', 'precio m2 neuquén', 'departamentos neuquén', 'inversión vaca muerta inmuebles', 'invertir neuquén patagonia'],
    alternates: {
      canonical: `${base}/${isEn ? 'en/' : ''}${citySlug}`,
      languages: { 'es': `${base}/${citySlug}`, 'en': `${base}/en/${citySlug}` },
    },
    openGraph: {
      title: isEn ? `Real Estate in ${cityName} — Vaca Muerta Oil & Gas Boom` : `Propiedades en ${cityName} — Boom de Vaca Muerta`,
      description: isEn
        ? 'Find properties for sale in Neuquén. Patagonia\'s fastest-growing market, fueled by 75,000+ Vaca Muerta jobs and +81% price growth in 5 years.'
        : 'Encontrá propiedades en Neuquén. El mercado de mayor crecimiento de la Patagonia, impulsado por 75.000+ empleos de Vaca Muerta y +81% de suba en 5 años.',
      url: `${base}/${isEn ? 'en/' : ''}${citySlug}`,
      type: 'website',
      siteName: 'Mudate Argentina',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: `${cityName} propiedades` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? `Real Estate in ${cityName} — Vaca Muerta Oil Boom | Mudate` : `Propiedades en ${cityName} — Vaca Muerta y el Boom Petrolero | Mudate`,
      description: isEn
        ? 'Properties for sale in Neuquén Capital. The real estate market driven by Vaca Muerta. USD 1,200–1,700/m², Confluencia, Alta Barda, Centro.'
        : 'Propiedades en venta en Neuquén Capital. El mercado inmobiliario que crece con Vaca Muerta. USD 1.200–1.700/m², Confluencia, Alta Barda, Centro.',
      images: [`${base}/opengraph-image`],
    },
  };
}

const stats = [
  { label: 'Precio promedio', value: 'USD 1.450/m²' },
  { label: 'Crecimiento (5 años)', value: '+81%' },
  { label: 'Empleos Vaca Muerta', value: '75.000+' },
  { label: 'Inversión sector 2024', value: 'USD 11.000M' },
];

const porqueInvertir = [
  'Vaca Muerta — segundo yacimiento de shale más grande del mundo a 70 km',
  'Crecimiento poblacional de +18% en 5 años por migración laboral',
  'Alta demanda de alquiler de trabajadores petroleros y sus familias',
  'Precio m² muy por debajo de las grandes capitales, con momentum al alza',
  'Infraestructura en expansión: aeropuerto, rutas y servicios urbanos',
  'Inversión extranjera directa (YPF, Petronas, TotalEnergies) asegura la demanda',
];

const barrios = [
  { name: 'Confluencia', desc: 'El corazón residencial de Neuquén', tipo: 'departamentos / PH' },
  { name: 'Alta Barda', desc: 'Zona exclusiva con vista a la ciudad', tipo: 'casas / barrios privados' },
  { name: 'Centro', desc: 'Alta rentabilidad de alquiler', tipo: 'departamentos / oficinas' },
  { name: 'Plottier', desc: 'Expansión urbana y terrenos', tipo: 'terrenos / casas' },
];

const properties: PropertyCardData[] = [
  {
    slug: 'depto-neuquen-confluencia-3amb',
    title: 'Departamento 3 ambientes — Confluencia',
    price: 155000,
    currency: 'USD',
    operation: 'venta',
    type: 'departamento',
    ciudad: 'Neuquén',
    barrio: 'Confluencia',
    ambientes: 3,
    dormitorios: 2,
    banos: 1,
    superficie_cubierta: 82,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
  },
  {
    slug: 'casa-neuquen-alta-barda-4dorm',
    title: 'Casa 4 dormitorios — Alta Barda',
    price: 285000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Neuquén',
    barrio: 'Alta Barda',
    ambientes: 5,
    dormitorios: 4,
    banos: 3,
    superficie_cubierta: 210,
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80'],
  },
  {
    slug: 'terreno-neuquen-plottier-1200m2',
    title: 'Terreno 1.200 m² — Plottier',
    price: 95000,
    currency: 'USD',
    operation: 'venta',
    type: 'terreno',
    ciudad: 'Neuquén',
    barrio: 'Plottier',
    ambientes: 0,
    dormitorios: 0,
    banos: 0,
    superficie_cubierta: 1200,
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
  },
];

const faqs = [
  { q: '¿Cuánto vale el m² en Neuquén Capital en 2025?', a: 'El precio promedio en Neuquén Capital es USD 1.200–1.700/m². Alta Barda (zona premium) alcanza USD 1.600–1.900/m², mientras Confluencia y el Centro ofrecen USD 1.300–1.600/m².' },
  { q: '¿Por qué Vaca Muerta impulsa el mercado inmobiliario de Neuquén?', a: 'Vaca Muerta genera 75.000 empleos directos e indirectos y atrae constante migración laboral. Neuquén creció +18% poblacional en 5 años, lo que mantiene la demanda habitacional por encima de la oferta de forma estructural.' },
  { q: '¿Qué cap rate ofrecen los departamentos en Neuquén?', a: 'El cap rate para alquiler residencial en Neuquén es del 5–7% USD anual, impulsado por la demanda de trabajadores petroleros y sus familias. Los contratos de alquiler corporativo pueden alcanzar el 8% para casas bien ubicadas.' },
  { q: '¿Sigue creciendo el mercado inmobiliario en Neuquén?', a: 'Sí. El precio del m² subió +81% en 5 años en USD. YPF, TotalEnergies y Petronas tienen operaciones permanentes que aseguran demanda estructural. Neuquén es el mercado de mayor crecimiento sostenido de la Patagonia.' },
];

export default function NeuquenPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 60%, #0D3424 100%)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4" style={{ color: 'rgba(153,246,228,0.8)' }}>
            <MapPin size={14} />
            <span className="text-xs" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>Patagonia, Argentina</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Neuquén
          </h1>
          <p className="text-xl text-white/70 font-light max-w-xl mb-8">
            Donde el petróleo mueve los ladrillos. El mercado inmobiliario de mayor crecimiento de la Patagonia, impulsado por Vaca Muerta.
          </p>
          <div className="flex gap-3">
            <Link href="/propiedades?ciudad=Neuquén" className="px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer" style={{ background: 'var(--accent)' }}>
              Ver propiedades
            </Link>
            <Link href="/invertir#neuquen" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              Datos de inversión
            </Link>
            <Link href="/neuquen/precio-m2" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
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
              <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Neuquén</p>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Propiedades disponibles</h2>
            </div>
            <Link href="/propiedades?ciudad=Neuquén" className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--primary)' }}>
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
                Invertir en Neuquén
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
          <h2 className="text-2xl font-semibold mb-8" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Preguntas frecuentes sobre propiedades en Neuquén</h2>
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
            <Link href="/blog/neuquen-vaca-muerta-propiedades-inversion" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              → Neuquén y Vaca Muerta: el boom inmobiliario del petróleo y el gas
            </Link>
            <Link href="/blog/mejor-ciudad-para-invertir-argentina-2025" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              → ¿En qué ciudad de Argentina conviene más invertir en 2025?
            </Link>
          </div>
        </div>
      </section>

      {/* Schema JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': 'https://mudateargentina.com/neuquen#localbusiness', name: 'Mudate — Neuquén', description: 'Portal inmobiliario de Neuquén, Patagonia, Argentina', address: { '@type': 'PostalAddress', addressLocality: 'Neuquén', addressRegion: 'Neuquén', addressCountry: 'AR' }, url: 'https://mudateargentina.com/neuquen', areaServed: { '@type': 'City', name: 'Neuquén' }, priceRange: 'USD 60.000 – USD 450.000', aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.5', reviewCount: '78', bestRating: '5', worstRating: '1' } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' }, { '@type': 'ListItem', position: 2, name: 'Neuquén', item: 'https://mudateargentina.com/neuquen' }] }) }} />
    </div>
  );
}
