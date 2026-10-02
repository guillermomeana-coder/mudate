import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, TrendingUp, Home, ArrowRight, CheckCircle } from 'lucide-react';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  const citySlug = 'rosario';
  const cityName = 'Rosario';
  return {
    title: isEn
      ? 'Real Estate in Rosario — Argentina\'s Grain Capital | Mudate'
      : 'Propiedades en Rosario — El Motor Inmobiliario del Interior | Mudate',
    description: isEn
      ? 'Properties for sale in Rosario, Santa Fe. Argentina\'s 3rd city and global grain hub. USD 1,400–1,800/m², Fisherton, Pichincha, Puerto Norte.'
      : 'Propiedades en venta en Rosario, Santa Fe. 3ª ciudad de Argentina, capital granaria mundial. USD 1.400–1.800/m², Fisherton, Pichincha, Puerto Norte.',
    keywords: isEn
      ? ['real estate rosario argentina', 'buy apartment rosario', 'price m2 rosario', 'fisherton real estate', 'puerto norte rosario investment']
      : ['comprar casa rosario', 'propiedades rosario santa fe', 'precio m2 rosario', 'departamentos rosario', 'inmuebles rosario', 'invertir rosario argentina'],
    alternates: {
      canonical: `${base}/${isEn ? 'en/' : ''}${citySlug}`,
      languages: { 'es': `${base}/${citySlug}`, 'en': `${base}/en/${citySlug}` },
    },
    openGraph: {
      title: isEn ? `Real Estate in ${cityName} — Fisherton, Pichincha & Puerto Norte` : `Propiedades en ${cityName} — Fisherton, Pichincha y Puerto Norte`,
      description: isEn
        ? 'Find properties for sale in Rosario. Explore houses, apartments and investment opportunities in Argentina\'s most dynamic inland market.'
        : 'Encontrá propiedades en Rosario. Casas, departamentos y oportunidades de inversión en el mercado más dinámico del interior.',
      url: `${base}/${isEn ? 'en/' : ''}${citySlug}`,
      type: 'website',
      siteName: 'Mudate Argentina',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: `${cityName} propiedades` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? `Real Estate in ${cityName} — Argentina's Grain Capital | Mudate` : `Propiedades en ${cityName} — El Motor Inmobiliario del Interior | Mudate`,
      description: isEn
        ? 'Properties for sale in Rosario, Santa Fe. Argentina\'s 3rd city and global grain hub. USD 1,400–1,800/m², Fisherton, Pichincha, Puerto Norte.'
        : 'Propiedades en venta en Rosario, Santa Fe. 3ª ciudad de Argentina, capital granaria mundial. USD 1.400–1.800/m², Fisherton, Pichincha, Puerto Norte.',
      images: [`${base}/opengraph-image`],
    },
  };
}

const stats = [
  { label: 'Precio promedio', value: 'USD 1.600/m²' },
  { label: 'Depto 2 ambientes', value: 'USD 110.000' },
  { label: 'Depto 3 ambientes', value: 'USD 170.000' },
  { label: 'Habitantes', value: '1.300.000' },
];

const porqueInvertir = [
  '3ª ciudad de Argentina y capital mundial de la exportación granaria',
  'Puerto Norte: reconversión urbana premium junto al río Paraná',
  'Fisherton: el barrio más exclusivo, casas y countries de alto valor',
  'Cap rate 4.5–5.5% USD anual sostenido histórico',
  'Ciudad universitaria con alta demanda de alquiler permanente',
  'Acceso privilegiado: autopista a Buenos Aires y Córdoba, aeropuerto internacional',
];

const barrios = [
  { name: 'Fisherton', desc: 'El barrio más exclusivo de Rosario', tipo: 'casas / countries' },
  { name: 'Pichincha', desc: 'Bohemio y en plena expansión', tipo: 'departamentos / lofts' },
  { name: 'Puerto Norte', desc: 'Premium junto al río Paraná', tipo: 'torres / lofts' },
  { name: 'Alberdi', desc: 'Joven y con alta demanda estudiantil', tipo: 'departamentos' },
];

const properties: PropertyCardData[] = [
  {
    slug: 'departamento-rosario-pichincha-2amb',
    title: 'Departamento 2 ambientes — Pichincha',
    price: 112000,
    currency: 'USD',
    operation: 'venta',
    type: 'departamento',
    ciudad: 'Rosario',
    barrio: 'Pichincha',
    ambientes: 2,
    dormitorios: 1,
    banos: 1,
    superficie_cubierta: 62,
    images: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80'],
  },
  {
    slug: 'casa-fisherton-4-dormitorios',
    title: 'Casa 4 dormitorios — Fisherton',
    price: 285000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Rosario',
    barrio: 'Fisherton',
    ambientes: 5,
    dormitorios: 4,
    banos: 3,
    superficie_cubierta: 210,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'],
  },
  {
    slug: 'departamento-rosario-puerto-norte',
    title: 'Departamento torre — Puerto Norte',
    price: 165000,
    currency: 'USD',
    operation: 'venta',
    type: 'departamento',
    ciudad: 'Rosario',
    barrio: 'Puerto Norte',
    ambientes: 2,
    dormitorios: 1,
    banos: 1,
    superficie_cubierta: 58,
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'],
  },
];

const faqs = [
  { q: '¿Cuánto vale el m² en Rosario en 2025?', a: 'El precio promedio es USD 1.400–1.800/m². Puerto Norte y Fisherton (zonas premium) llegan a USD 1.900–2.100/m², mientras barrios como Alberdi ofrecen USD 1.000–1.300/m².' },
  { q: '¿Es Rosario una buena inversión inmobiliaria en 2025?', a: 'Sí. Rosario ofrece cap rates del 5.5–7% USD, superiores a Buenos Aires Capital (3.5–4.5%). Puerto Norte continúa su desarrollo como el barrio más valorizado, con +17% de apreciación en 2 años.' },
  { q: '¿Qué barrio de Rosario es mejor para invertir?', a: 'Puerto Norte para máxima liquidez y valorización. Pichincha para mayor cap rate (5.5–7%) a precios accesibles. Fisherton para demanda familiar premium. Alberdi para precio bajo con potencial de valorización.' },
  { q: '¿Por qué Rosario tiene mejor cap rate que Buenos Aires?', a: 'Precio por m² más bajo + alquiler sostenido por alta demanda = mayor rentabilidad. El m² en Rosario promedia USD 1.500 vs USD 2.200 en CABA, pero los alquileres no caen proporcionalmente.' },
];

export default function RosarioPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 60%, #0D3424 100%)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4" style={{ color: 'rgba(153,246,228,0.8)' }}>
            <MapPin size={14} />
            <span className="text-xs" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>Santa Fe, Argentina</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Rosario
          </h1>
          <p className="text-xl text-white/70 font-light max-w-xl mb-8">
            La ciudad del vino, el fútbol y la exportación granaria. El mercado inmobiliario más dinámico del interior después de Córdoba.
          </p>
          <div className="flex gap-3">
            <Link href="/propiedades?ciudad=Rosario" className="px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer" style={{ background: 'var(--accent)' }}>
              Ver propiedades
            </Link>
            <Link href="/invertir#rosario" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              Datos de inversión
            </Link>
            <Link href="/rosario/precio-m2" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
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
              <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Rosario</p>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Propiedades disponibles</h2>
            </div>
            <Link href="/propiedades?ciudad=Rosario" className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--primary)' }}>
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
                Invertir en Rosario
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
          <h2 className="text-2xl font-semibold mb-8" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Preguntas frecuentes sobre propiedades en Rosario</h2>
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
            <Link href="/blog/mercado-inmobiliario-rosario-2025" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              → Rosario 2025: el mercado inmobiliario de la tercera ciudad argentina
            </Link>
            <Link href="/blog/mejor-ciudad-para-invertir-argentina-2025" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              → ¿En qué ciudad de Argentina conviene más invertir en 2025?
            </Link>
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
            '@id': 'https://mudateargentina.com/rosario#localbusiness',
            name: 'Mudate — Rosario',
            description: 'Portal inmobiliario de Rosario, Santa Fe, Argentina',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Rosario',
              addressRegion: 'Santa Fe',
              addressCountry: 'AR',
            },
            url: 'https://mudateargentina.com/rosario',
            areaServed: {
              '@type': 'City',
              name: 'Rosario',
            },
            priceRange: 'USD 50.000 – USD 500.000',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.6',
              reviewCount: '89',
              bestRating: '5',
              worstRating: '1',
            },
          }),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' }, { '@type': 'ListItem', position: 2, name: 'Rosario', item: 'https://mudateargentina.com/rosario' }] }) }} />
    </div>
  );
}
