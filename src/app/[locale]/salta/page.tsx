import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, TrendingUp, Home, ArrowRight, CheckCircle } from 'lucide-react';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  const citySlug = 'salta';
  const cityName = 'Salta';
  return {
    title: isEn
      ? 'Real Estate in Salta — Tourism & Lithium Investment | Mudate'
      : 'Propiedades en Salta — Inversión Turística y Litio | Mudate',
    description: isEn
      ? 'Properties for sale in Salta Capital and Valle de Lerma. Tourism, lithium and growing cap rates. USD 900–1,300/m², Tres Cerritos, Historic Center, San Lorenzo.'
      : 'Propiedades en venta en Salta Capital y Valle de Lerma. Turismo, litio y cap rates crecientes. USD 900–1.300/m², Tres Cerritos, Centro Histórico, San Lorenzo.',
    keywords: isEn
      ? ['real estate salta argentina', 'buy property salta', 'tres cerritos salta real estate', 'price m2 salta', 'lithium investment salta', 'san lorenzo salta property']
      : ['comprar casa salta', 'propiedades salta capital', 'precio m2 salta', 'departamentos salta', 'invertir salta NOA', 'inmuebles salta turismo litio'],
    alternates: {
      canonical: `${base}/${isEn ? 'en/' : ''}${citySlug}`,
      languages: { 'es': `${base}/${citySlug}`, 'en': `${base}/en/${citySlug}` },
    },
    openGraph: {
      title: isEn ? `Real Estate in ${cityName} — Tourism, Lithium & Growing Returns` : `Propiedades en ${cityName} — Turismo, Litio y Cap Rates Crecientes`,
      description: isEn
        ? 'Find properties for sale in Salta. One of Argentina\'s best-kept investment secrets: low entry prices, 6–8% USD vacation rental yields and lithium-driven demand.'
        : 'Encontrá propiedades en Salta. Uno de los mejores secretos de inversión de Argentina: precios accesibles, 6–8% USD en alquiler vacacional y demanda del litio.',
      url: `${base}/${isEn ? 'en/' : ''}${citySlug}`,
      type: 'website',
      siteName: 'Mudate Argentina',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: `${cityName} propiedades` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? `Real Estate in ${cityName} — Tourism & Lithium Investment | Mudate` : `Propiedades en ${cityName} — Inversión Turística y Litio | Mudate`,
      description: isEn
        ? 'Properties for sale in Salta Capital and Valle de Lerma. Tourism, lithium and growing cap rates. USD 900–1,300/m², Tres Cerritos, Historic Center, San Lorenzo.'
        : 'Propiedades en venta en Salta Capital y Valle de Lerma. Turismo, litio y cap rates crecientes. USD 900–1.300/m², Tres Cerritos, Centro Histórico, San Lorenzo.',
      images: [`${base}/opengraph-image`],
    },
  };
}

const stats = [
  { label: 'Precio promedio', value: 'USD 1.100/m²' },
  { label: 'Cap rate turístico', value: '6–8%' },
  { label: 'Turistas por año', value: '2M+' },
  { label: 'Crecimiento precio (2yr)', value: '+28%' },
];

const porqueInvertir = [
  'Destino turístico premium del NOA — alta demanda de alquiler vacacional',
  'Triangle del litio: inversión extranjera directa eleva la demanda inmobiliaria',
  'Centro histórico colonial único en Argentina — alta valorización patrimonial',
  'Precios aún accesibles: 50% por debajo de Córdoba Capital',
  'San Lorenzo: el barrio de las familias premium con fincas y naturaleza',
  'Aeropuerto internacional con vuelos directos desde Buenos Aires y exterior',
];

const barrios = [
  { name: 'Tres Cerritos', desc: 'El barrio más exclusivo de la ciudad', tipo: 'departamentos / casas' },
  { name: 'Centro Histórico', desc: 'Inversión turística premium', tipo: 'departamentos / apart' },
  { name: 'San Lorenzo', desc: 'Naturaleza y exclusividad serrana', tipo: 'fincas / casas' },
  { name: 'Valle de Lerma', desc: 'Fincas, viñedos y turismo rural', tipo: 'fincas / terrenos' },
];

const properties: PropertyCardData[] = [
  {
    slug: 'depto-salta-tres-cerritos-2amb',
    title: 'Departamento 2 ambientes — Tres Cerritos',
    price: 115000,
    currency: 'USD',
    operation: 'venta',
    type: 'departamento',
    ciudad: 'Salta',
    barrio: 'Tres Cerritos',
    ambientes: 2,
    dormitorios: 1,
    banos: 1,
    superficie_cubierta: 62,
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
  },
  {
    slug: 'casa-salta-san-lorenzo-3dorm',
    title: 'Casa 3 dormitorios con jardín — San Lorenzo',
    price: 195000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Salta',
    barrio: 'San Lorenzo',
    ambientes: 4,
    dormitorios: 3,
    banos: 2,
    superficie_cubierta: 155,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'],
  },
  {
    slug: 'finca-salta-lerma-vinedos',
    title: 'Finca con viñedo — Valle de Lerma',
    price: 380000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Salta',
    barrio: 'Valle de Lerma',
    ambientes: 5,
    dormitorios: 4,
    banos: 3,
    superficie_cubierta: 320,
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
  },
  {
    slug: 'terreno-salta-cerrillos-1500m2',
    title: 'Terreno 1.500 m² — Cerrillos',
    price: 68000,
    currency: 'USD',
    operation: 'venta',
    type: 'terreno',
    ciudad: 'Salta',
    barrio: 'Cerrillos',
    ambientes: 0,
    dormitorios: 0,
    banos: 0,
    superficie_cubierta: 1500,
    images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'],
  },
];

const faqs = [
  { q: '¿Cuánto vale el m² en Salta Capital en 2025?', a: 'El precio promedio en Salta Capital es USD 900–1.300/m². En Tres Cerritos y San Lorenzo los valores son más altos (USD 1.100–1.400). El Centro Histórico tiene precios similares pero con alta demanda turística que eleva la rentabilidad.' },
  { q: '¿Cómo afecta el litio al mercado inmobiliario de Salta?', a: 'El Triángulo del Litio genera una demanda de housing corporativo que antes no existía. Técnicos y directivos de empresas mineras buscan vivienda en Salta Capital, elevando los alquileres corporativos a USD 1.200–2.000/mes para casas en barrios privados.' },
  { q: '¿Es buen momento para invertir en Salta en 2025?', a: 'Sí. Salta combina precios de entrada bajos (30–40% menos que Córdoba) con cap rates turísticos del 7–10% USD. El turismo en el NOA creció +22% en 2024 y la inversión en litio sigue atrayendo demanda. Es uno de los mercados con mayor potencial de valorización.' },
  { q: '¿Cuál es el barrio más exclusivo de Salta para vivir?', a: 'Tres Cerritos es el barrio más exclusivo de Salta Capital, con casas y departamentos premium, vista a la ciudad y alta seguridad. San Lorenzo (a 11 km) es el preferido de familias que buscan naturaleza con microclima excepcional.' },
];

export default function SaltaPage() {
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
            Salta
          </h1>
          <p className="text-xl text-white/70 font-light max-w-xl mb-8">
            La ciudad más bella del norte argentino. Turismo en alza, litio y una oportunidad inmobiliaria que pocos han descubierto.
          </p>
          <div className="flex gap-3">
            <Link href="/propiedades?ciudad=Salta" className="px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer" style={{ background: 'var(--accent)' }}>
              Ver propiedades
            </Link>
            <Link href="/invertir#salta" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              Datos de inversión
            </Link>
            <Link href="/salta/precio-m2" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
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
              <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Salta</p>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Propiedades disponibles</h2>
            </div>
            <Link href="/propiedades?ciudad=Salta" className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--primary)' }}>
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
                Invertir en Salta
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
          <h2 className="text-2xl font-semibold mb-8" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Preguntas frecuentes sobre propiedades en Salta</h2>
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
            <Link href="/blog/invertir-salta-noa-turismo-litio" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              → Invertir en Salta 2025: turismo, litio y el NOA que cambia de precio
            </Link>
            <Link href="/blog/mejor-ciudad-para-invertir-argentina-2025" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              → ¿En qué ciudad de Argentina conviene más invertir en 2025?
            </Link>
          </div>
        </div>
      </section>

      {/* Schema JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': 'https://mudateargentina.com/salta#localbusiness', name: 'Mudate — Salta', description: 'Portal inmobiliario de Salta, Argentina', address: { '@type': 'PostalAddress', addressLocality: 'Salta', addressRegion: 'Salta', addressCountry: 'AR' }, url: 'https://mudateargentina.com/salta', areaServed: { '@type': 'City', name: 'Salta' }, priceRange: 'USD 40.000 – USD 300.000', aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.6', reviewCount: '94', bestRating: '5', worstRating: '1' } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' }, { '@type': 'ListItem', position: 2, name: 'Salta', item: 'https://mudateargentina.com/salta' }] }) }} />
    </div>
  );
}
