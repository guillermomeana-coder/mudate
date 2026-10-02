import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, TrendingUp, Home, ArrowRight, CheckCircle } from 'lucide-react';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  const citySlug = 'mendoza';
  const cityName = 'Mendoza';
  return {
    title: isEn
      ? 'Real Estate in Mendoza — Wine Capital & Investment Gateway | Mudate'
      : 'Propiedades en Mendoza — Capital del Vino e Inversión en los Andes | Mudate',
    description: isEn
      ? 'Properties for sale in Mendoza. Latin America\'s wine capital and gateway to the Andes. USD 1,100–1,500/m², Godoy Cruz, Luján de Cuyo, Chacras de Coria.'
      : 'Propiedades en venta en Mendoza. Capital latinoamericana del vino, puerta de los Andes. USD 1.100–1.500/m², Godoy Cruz, Luján de Cuyo, Chacras de Coria.',
    keywords: isEn
      ? ['real estate mendoza argentina', 'buy property mendoza', 'winery investment mendoza', 'price m2 mendoza', 'godoy cruz real estate', 'lujan de cuyo property']
      : ['comprar casa mendoza', 'propiedades mendoza capital', 'precio m2 mendoza', 'fincas mendoza inversión', 'inmuebles mendoza', 'invertir mendoza argentina'],
    alternates: {
      canonical: `${base}/${isEn ? 'en/' : ''}${citySlug}`,
      languages: { 'es': `${base}/${citySlug}`, 'en': `${base}/en/${citySlug}` },
    },
    openGraph: {
      title: isEn ? `Real Estate in ${cityName} — Wine, Vineyards & Investment` : `Propiedades en ${cityName} — Vino, Viñedos e Inversión`,
      description: isEn
        ? 'Find properties for sale in Mendoza. Explore apartments, wine estates and investment opportunities in Argentina\'s premier wine region.'
        : 'Encontrá propiedades en Mendoza. Departamentos, fincas y oportunidades de inversión en la capital argentina del vino.',
      url: `${base}/${isEn ? 'en/' : ''}${citySlug}`,
      type: 'website',
      siteName: 'Mudate Argentina',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: `${cityName} propiedades` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? `Real Estate in ${cityName} — Wine Capital & Investment Gateway | Mudate` : `Propiedades en ${cityName} — Capital del Vino e Inversión en los Andes | Mudate`,
      description: isEn
        ? 'Properties for sale in Mendoza. Latin America\'s wine capital and gateway to the Andes. USD 1,100–1,500/m², Godoy Cruz, Luján de Cuyo, Chacras de Coria.'
        : 'Propiedades en venta en Mendoza. Capital latinoamericana del vino, puerta de los Andes. USD 1.100–1.500/m², Godoy Cruz, Luján de Cuyo, Chacras de Coria.',
      images: [`${base}/opengraph-image`],
    },
  };
}

const stats = [
  { label: 'Precio promedio', value: 'USD 1.300/m²' },
  { label: 'Depto 2 ambientes', value: 'USD 95.000' },
  { label: 'Casa 3 dormitorios', value: 'USD 145.000' },
  { label: 'Cap rate anual', value: '5.5–6%' },
];

const porqueInvertir = [
  'Capital latinoamericana del vino — turismo internacional premium todo el año',
  'Inversión en bodegas y fincas: alta valorización en USD histórica',
  'Godoy Cruz y Chacras de Coria: las zonas residenciales más cotizadas',
  'Acceso a esquí en Las Leñas y Los Penitentes: demanda de segunda residencia',
  'Aeropuerto internacional con vuelos directos a Chile y Brasil',
  'Mercado estable en USD por ingreso de divisas del turismo enológico',
];

const barrios = [
  { name: 'Godoy Cruz', desc: 'Zona residencial premium del Gran Mendoza', tipo: 'casas / deptos' },
  { name: 'Chacras de Coria', desc: 'Exclusividad entre viñedos y sierras', tipo: 'chalets / fincas' },
  { name: 'Luján de Cuyo', desc: 'Corazón de la ruta del vino', tipo: 'fincas / casas' },
  { name: 'Maipú', desc: 'Bodegas y tradición vitivinícola', tipo: 'fincas / terrenos' },
];

const properties: PropertyCardData[] = [
  {
    slug: 'departamento-mendoza-centro-2amb',
    title: 'Departamento 2 ambientes — Centro Mendoza',
    price: 98000,
    currency: 'USD',
    operation: 'venta',
    type: 'departamento',
    ciudad: 'Mendoza',
    barrio: 'Centro',
    ambientes: 2,
    dormitorios: 1,
    banos: 1,
    superficie_cubierta: 60,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],
  },
  {
    slug: 'casa-chacras-de-coria-4dorm',
    title: 'Casa con jardín — Chacras de Coria',
    price: 320000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Mendoza',
    barrio: 'Chacras de Coria',
    ambientes: 5,
    dormitorios: 4,
    banos: 3,
    superficie_cubierta: 250,
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
  },
  {
    slug: 'finca-lujan-de-cuyo-viñedo',
    title: 'Finca con viñedo — Luján de Cuyo',
    price: 480000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Mendoza',
    barrio: 'Luján de Cuyo',
    ambientes: 0,
    dormitorios: 0,
    banos: 0,
    superficie_cubierta: 5000,
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
  },
];

const faqs = [
  { q: '¿Cuánto vale el m² en Mendoza Capital en 2025?', a: 'El precio promedio en Mendoza Capital es USD 1.100–1.300/m². En Quinta sección y Godoy Cruz los valores llegan a USD 1.200–1.400, mientras zonas alejadas bajan a USD 800–1.000.' },
  { q: '¿Se puede invertir en fincas y viñedos en Mendoza?', a: 'Sí. Las fincas en Luján de Cuyo y Maipú arrancan desde USD 200.000 para pequeñas parcelas. El mercado de agroturismo ofrece cap rates del 6–8% combinando vivienda con turismo enológico.' },
  { q: '¿Por qué inversores internacionales eligen Mendoza?', a: 'Mendoza atrae inversores extranjeros por su mercado de vinos de clase mundial, proximidad a Chile, bajo precio del m² vs capitales similares de la región, y cap rates en USD del 5–7%.' },
  { q: '¿Dónde conviene comprar en Mendoza para alquiler?', a: 'Para alquiler residencial permanente: Centro y Godoy Cruz. Para inversión turística y agroturismo: Luján de Cuyo y Maipú. Para apreciación a largo plazo: Chacras de Coria y barrios privados en piedemonte.' },
];

export default function MendozaPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 60%, #0D3424 100%)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4" style={{ color: 'rgba(153,246,228,0.8)' }}>
            <MapPin size={14} />
            <span className="text-xs" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>Mendoza, Argentina</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Mendoza
          </h1>
          <p className="text-xl text-white/70 font-light max-w-xl mb-8">
            La capital del vino latinoamericano y la puerta de los Andes. Inversión inmobiliaria en el corazón de Cuyo.
          </p>
          <div className="flex gap-3">
            <Link href="/propiedades?ciudad=Mendoza" className="px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer" style={{ background: 'var(--accent)' }}>
              Ver propiedades
            </Link>
            <Link href="/invertir#mendoza" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              Datos de inversión
            </Link>
            <Link href="/mendoza/precio-m2" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
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
              <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Mendoza</p>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Propiedades disponibles</h2>
            </div>
            <Link href="/propiedades?ciudad=Mendoza" className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--primary)' }}>
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
                Invertir en Mendoza
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
          <h2 className="text-2xl font-semibold mb-8" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
            Preguntas frecuentes sobre propiedades en Mendoza
          </h2>
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
            <Link href="/blog/propiedades-mendoza-inversion-vino-andes" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              → Invertir en Mendoza: fincas, viñedos y el mercado inmobiliario del vino
            </Link>
            <Link href="/blog/mejor-ciudad-para-invertir-argentina-2025" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              → ¿En qué ciudad de Argentina conviene más invertir en 2025?
            </Link>
          </div>
        </div>
      </section>

      {/* Schema JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': 'https://mudateargentina.com/mendoza#localbusiness', name: 'Mudate — Mendoza', description: 'Portal inmobiliario de Mendoza, Argentina', address: { '@type': 'PostalAddress', addressLocality: 'Mendoza', addressRegion: 'Mendoza', addressCountry: 'AR' }, url: 'https://mudateargentina.com/mendoza', areaServed: { '@type': 'City', name: 'Mendoza' }, priceRange: 'USD 80.000 – USD 600.000', aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '156', bestRating: '5', worstRating: '1' } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' }, { '@type': 'ListItem', position: 2, name: 'Mendoza', item: 'https://mudateargentina.com/mendoza' }] }) }} />
    </div>
  );
}
