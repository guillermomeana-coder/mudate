import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, TrendingUp, Home, ArrowRight, CheckCircle } from 'lucide-react';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  const citySlug = 'mar-del-plata';
  const cityName = 'Mar del Plata';
  return {
    title: isEn
      ? 'Real Estate in Mar del Plata — Tourism & Retirement Investment | Mudate'
      : 'Propiedades en Mar del Plata — Inversión Turística y Retiro | Mudate',
    description: isEn
      ? 'Properties for sale in Mar del Plata. Argentina\'s largest tourist city. USD 1,200–1,800/m², Centro, Punta Mogotes, Los Troncos, North. 6–9% vacation rental cap rate.'
      : 'Propiedades en venta en Mar del Plata. La ciudad turística más grande de Argentina. USD 1.200–1.800/m², Centro, Punta Mogotes, Los Troncos, North. Cap rate 6–9% vacacional.',
    keywords: isEn
      ? ['real estate mar del plata', 'buy apartment mar del plata', 'price m2 mar del plata', 'vacation rental mar del plata', 'los troncos real estate', 'punta mogotes investment']
      : ['comprar casa mar del plata', 'propiedades mar del plata', 'precio m2 mar del plata', 'departamentos mar del plata', 'alquiler vacacional mar del plata', 'invertir mar del plata'],
    alternates: {
      canonical: `${base}/${isEn ? 'en/' : ''}${citySlug}`,
      languages: { 'es': `${base}/${citySlug}`, 'en': `${base}/en/${citySlug}` },
    },
    openGraph: {
      title: isEn ? `Real Estate in ${cityName} — 8M Tourists & 6–9% Vacation Yields` : `Propiedades en ${cityName} — 8M Turistas y Rentabilidad 6–9% Vacacional`,
      description: isEn
        ? 'Find properties for sale in Mar del Plata. Argentina\'s most visited beach city with 8 million annual tourists, strong retirement demand and Los Troncos premium zone.'
        : 'Encontrá propiedades en Mar del Plata. La ciudad costera más visitada de Argentina con 8 millones de turistas, alta demanda de retiro y la zona premium de Los Troncos.',
      url: `${base}/${isEn ? 'en/' : ''}${citySlug}`,
      type: 'website',
      siteName: 'Mudate Argentina',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: `${cityName} propiedades` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? `Real Estate in ${cityName} — Tourism & Retirement Investment | Mudate` : `Propiedades en ${cityName} — Inversión Turística y Retiro | Mudate`,
      description: isEn
        ? 'Properties for sale in Mar del Plata. Argentina\'s largest tourist city. USD 1,200–1,800/m², Centro, Punta Mogotes, Los Troncos, North. 6–9% vacation rental cap rate.'
        : 'Propiedades en venta en Mar del Plata. La ciudad turística más grande de Argentina. USD 1.200–1.800/m², Centro, Punta Mogotes, Los Troncos, North. Cap rate 6–9% vacacional.',
      images: [`${base}/opengraph-image`],
    },
  };
}

const stats = [
  { label: 'Precio promedio', value: 'USD 1.500/m²' },
  { label: 'Cap rate turístico', value: '6–9%' },
  { label: 'Turistas por año', value: '8M+' },
  { label: 'Crecimiento precio (2yr)', value: '+22%' },
];

const porqueInvertir = [
  'Ciudad turística más visitada de Argentina — 8 millones de turistas anuales',
  'Alta demanda de retiro: miles de jubilados eligen Mar del Plata por su clima y servicios',
  'Mercado de alquiler vacacional muy activo con gestión simple vía Airbnb y Booking',
  'Precios 40% más bajos que los balnearios de Uruguay (Punta del Este)',
  'Conectividad: autopista desde Buenos Aires en 4 horas, aeropuerto internacional',
  'Los Troncos y North: los barrios exclusivos con mayores tasas de valorización del país',
];

const barrios = [
  { name: 'Centro', desc: 'Alta demanda de alquiler vacacional', tipo: 'departamentos / apart' },
  { name: 'Los Troncos', desc: 'El barrio más exclusivo de la ciudad', tipo: 'casas / PH' },
  { name: 'Punta Mogotes', desc: 'Zona costera de alta valorización', tipo: 'departamentos / torres' },
  { name: 'North', desc: 'Barrio privado premium en expansión', tipo: 'casas / barrios privados' },
];

const faqs = [
  { q: '¿Cuánto vale el m² en Mar del Plata en 2025?', a: 'El precio promedio en Mar del Plata es USD 1.200–1.800/m². En Los Troncos y North los valores llegan a USD 1.700–2.200/m², mientras el Centro y zonas intermedias ofrecen USD 1.100–1.500/m².' },
  { q: '¿Cuál es la rentabilidad del alquiler vacacional en Mar del Plata?', a: 'La rentabilidad bruta turística oscila entre 6% y 9% USD anual. La temporada alta (diciembre–marzo) genera picos de ocupación del 90%+, mientras la demanda de fin de semana y turistas de temporada baja sostiene ingresos todo el año.' },
  { q: '¿Conviene comprar en Mar del Plata para alquilar?', a: 'Sí, especialmente en el segmento vacacional. Un departamento 2 ambientes de USD 90.000 bien ubicado puede generar USD 7.000–9.000 anuales. La clave está en la gestión activa (Airbnb/Booking) y la ubicación cerca del mar.' },
  { q: '¿Cuáles son los mejores barrios para vivir en Mar del Plata?', a: 'Los Troncos es el barrio más exclusivo y codiciado de la ciudad. North tiene urbanizaciones privadas de alta gama. Para inversión vacacional: Punta Mogotes y Centro cerca de la costa. Para compra-vivienda accesible: Barrio Stella Maris y Alberti.' },
];

const properties: PropertyCardData[] = [
  {
    slug: 'depto-mardel-centro-2amb',
    title: 'Departamento 2 ambientes a 2 cuadras del mar — Centro',
    price: 88000,
    currency: 'USD',
    operation: 'venta',
    type: 'departamento',
    ciudad: 'Mar del Plata',
    barrio: 'Centro',
    ambientes: 2,
    dormitorios: 1,
    banos: 1,
    superficie_cubierta: 55,
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
  },
  {
    slug: 'casa-mardel-los-troncos-4dorm',
    title: 'Casa 4 dormitorios con jardín — Los Troncos',
    price: 420000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Mar del Plata',
    barrio: 'Los Troncos',
    ambientes: 5,
    dormitorios: 4,
    banos: 3,
    superficie_cubierta: 280,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'],
  },
  {
    slug: 'depto-mardel-punta-mogotes-3amb',
    title: 'Departamento 3 ambientes — Punta Mogotes',
    price: 145000,
    currency: 'USD',
    operation: 'venta',
    type: 'departamento',
    ciudad: 'Mar del Plata',
    barrio: 'Punta Mogotes',
    ambientes: 3,
    dormitorios: 2,
    banos: 2,
    superficie_cubierta: 85,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
  },
  {
    slug: 'terreno-mardel-north-800m2',
    title: 'Terreno 800 m² — North',
    price: 95000,
    currency: 'USD',
    operation: 'venta',
    type: 'terreno',
    ciudad: 'Mar del Plata',
    barrio: 'North',
    ambientes: 0,
    dormitorios: 0,
    banos: 0,
    superficie_cubierta: 800,
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
  },
];

export default function MarDelPlataPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 60%, #0D3424 100%)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4" style={{ color: 'rgba(153,246,228,0.8)' }}>
            <MapPin size={14} />
            <span className="text-xs" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>Buenos Aires, Argentina</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Mar del Plata
          </h1>
          <p className="text-xl text-white/70 font-light max-w-xl mb-8">
            La ciudad turística más grande del país. 8 millones de turistas al año, mercado de retiro consolidado y una rentabilidad vacacional difícil de igualar en Argentina.
          </p>
          <div className="flex gap-3">
            <Link href="/propiedades?ciudad=Mar+del+Plata" className="px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer" style={{ background: 'var(--accent)' }}>
              Ver propiedades
            </Link>
            <Link href="/invertir#mar-del-plata" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              Datos de inversión
            </Link>
            <Link href="/mar-del-plata/precio-m2" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
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
              <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Mar del Plata</p>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Propiedades disponibles</h2>
            </div>
            <Link href="/propiedades?ciudad=Mar+del+Plata" className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--primary)' }}>
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
                Invertir en Mar del Plata
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
          <h2 className="text-2xl font-semibold mb-8" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Preguntas frecuentes sobre propiedades en Mar del Plata</h2>
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
            <Link href="/blog/propiedades-mar-del-plata-inversion-vacacional" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              → Mar del Plata 2025: inversión vacacional en la ciudad turística de Argentina
            </Link>
            <Link href="/blog/mejor-ciudad-para-invertir-argentina-2025" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              → ¿En qué ciudad de Argentina conviene más invertir en 2025?
            </Link>
          </div>
        </div>
      </section>

      {/* Schema JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': 'https://mudateargentina.com/mar-del-plata#localbusiness', name: 'Mudate — Mar del Plata', description: 'Portal inmobiliario de Mar del Plata, Buenos Aires, Argentina', address: { '@type': 'PostalAddress', addressLocality: 'Mar del Plata', addressRegion: 'Buenos Aires', addressCountry: 'AR' }, url: 'https://mudateargentina.com/mar-del-plata', areaServed: { '@type': 'City', name: 'Mar del Plata' }, priceRange: 'USD 60.000 – USD 500.000', aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '289', bestRating: '5', worstRating: '1' } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' }, { '@type': 'ListItem', position: 2, name: 'Mar del Plata', item: 'https://mudateargentina.com/mar-del-plata' }] }) }} />
    </div>
  );
}
