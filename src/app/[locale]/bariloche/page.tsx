import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, TrendingUp, Home, ArrowRight, CheckCircle } from 'lucide-react';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  const citySlug = 'bariloche';
  const cityName = 'Bariloche';
  return {
    title: isEn
      ? 'Real Estate in Bariloche — Patagonia Tourism Investment | Mudate'
      : 'Propiedades en Bariloche — Inversión Turística Patagónica | Mudate',
    description: isEn
      ? 'Properties for sale in Bariloche, Río Negro. Patagonia\'s premium destination. USD 1,800–2,500/m², ski, lakes and trekking. High-yield vacation investment.'
      : 'Propiedades en venta en Bariloche, Río Negro. El destino premium de la Patagonia. USD 1.800–2.500/m², ski, lagos y trekking. Inversión vacacional alta rentabilidad.',
    keywords: isEn
      ? ['real estate bariloche argentina', 'buy chalet bariloche', 'price m2 bariloche', 'vacation rental bariloche', 'ski investment bariloche', 'patagonia property investment']
      : ['comprar casa bariloche', 'propiedades bariloche río negro', 'precio m2 bariloche', 'alquiler vacacional bariloche', 'invertir bariloche patagonia', 'chalets bariloche'],
    alternates: {
      canonical: `${base}/${isEn ? 'en/' : ''}${citySlug}`,
      languages: { 'es': `${base}/${citySlug}`, 'en': `${base}/en/${citySlug}` },
    },
    openGraph: {
      title: isEn ? `Real Estate in ${cityName} — Ski, Lakes & 8–10% USD Returns` : `Propiedades en ${cityName} — Ski, Lagos y Rentabilidad 8–10% USD`,
      description: isEn
        ? 'Find properties for sale in Bariloche. Chalets, cabins and apartments in Patagonia\'s most exclusive 4-season destination with the highest vacation rental yields in Argentina.'
        : 'Encontrá propiedades en Bariloche. Chalets, cabañas y departamentos en el destino más exclusivo de la Patagonia con los mejores cap rates del país.',
      url: `${base}/${isEn ? 'en/' : ''}${citySlug}`,
      type: 'website',
      siteName: 'Mudate Argentina',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: `${cityName} propiedades` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? `Real Estate in ${cityName} — Patagonia Tourism Investment | Mudate` : `Propiedades en ${cityName} — Inversión Turística Patagónica | Mudate`,
      description: isEn
        ? 'Properties for sale in Bariloche, Río Negro. Patagonia\'s premium destination. USD 1,800–2,500/m², ski, lakes and trekking. High-yield vacation investment.'
        : 'Propiedades en venta en Bariloche, Río Negro. El destino premium de la Patagonia. USD 1.800–2.500/m², ski, lagos y trekking. Inversión vacacional alta rentabilidad.',
      images: [`${base}/opengraph-image`],
    },
  };
}

const stats = [
  { label: 'Precio promedio', value: 'USD 2.200/m²' },
  { label: 'Cap rate turístico', value: '8–10%' },
  { label: 'Turistas por año', value: '3M+' },
  { label: 'Temporadas', value: '4 estaciones' },
];

const porqueInvertir = [
  'Destino turístico premium 4 estaciones: ski en invierno, trekking y lagos en verano',
  'Oferta de propiedades históricamente escasa — demanda siempre superior',
  'Cap rate turístico 8–10% USD anual (alquiler temporario)',
  'Mercado 100% en USD con alta liquidez y revalorización constante',
  'Parque Nacional Nahuel Huapi: protección ambiental frena nueva oferta',
  'Turismo internacional creciente: europeos, norteamericanos y brasileños',
];

const barrios = [
  { name: 'Centro', desc: 'Máxima demanda turística y comercial', tipo: 'departamentos / apart-hoteles' },
  { name: 'Melipal', desc: 'Residencial con vista al lago', tipo: 'casas / chalets' },
  { name: 'El Mallín', desc: 'Exclusivo en la costa del Nahuel Huapi', tipo: 'chalets / lotes' },
  { name: 'Villa Los Coihues', desc: 'Bosque nativo junto al lago', tipo: 'cabañas / chalet' },
];

const properties: PropertyCardData[] = [
  {
    slug: 'departamento-bariloche-centro-2amb',
    title: 'Departamento 2 ambientes — Centro Bariloche',
    price: 145000,
    currency: 'USD',
    operation: 'venta',
    type: 'departamento',
    ciudad: 'Bariloche',
    barrio: 'Centro',
    ambientes: 2,
    dormitorios: 1,
    banos: 1,
    superficie_cubierta: 58,
    images: ['https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&q=80'],
  },
  {
    slug: 'chalet-bariloche-melipal-vista-lago',
    title: 'Chalet con vista al lago — Melipal',
    price: 380000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Bariloche',
    barrio: 'Melipal',
    ambientes: 4,
    dormitorios: 3,
    banos: 2,
    superficie_cubierta: 180,
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
  },
  {
    slug: 'cabana-bariloche-nahuel-huapi',
    title: 'Cabaña — Villa Los Coihues',
    price: 220000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Bariloche',
    barrio: 'Villa Los Coihues',
    ambientes: 3,
    dormitorios: 2,
    banos: 1,
    superficie_cubierta: 90,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
  },
];

const faqs = [
  { q: '¿Cuánto vale el m² en Bariloche?', a: 'El precio varía según zona y vista. Centro: USD 2.000–2.500/m². Melipal (vista al lago): USD 2.200–3.000/m². Villa Los Coihues: USD 1.800–2.400/m². Bariloche tiene precios altos compensados por alta rentabilidad turística.' },
  { q: '¿Cuál es la rentabilidad del alquiler vacacional en Bariloche?', a: 'La rentabilidad bruta turística es del 8–10% USD anual. La ocupación supera el 75% anual gracias a 4 temporadas activas: ski en invierno, verano en el lago, otoño patagónico y primavera.' },
  { q: '¿Por qué los precios de Bariloche siguen subiendo?', a: 'El Parque Nacional Nahuel Huapi rodea la ciudad, impidiendo la expansión urbana. Esta escasez estructural de suelo genera presión alcista permanente. Es el único destino turístico de la Patagonia con demanda de 4 estaciones.' },
  { q: '¿Cuál es el mejor barrio para invertir en Bariloche?', a: 'Centro para máxima liquidez (cap rate 8–9%). Melipal para premium con vista al lago (7–9%). Villa Los Coihues para mayor rentabilidad en nicho naturaleza (9–10%).' },
];

export default function BarilocherPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 60%, #0D3424 100%)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4" style={{ color: 'rgba(153,246,228,0.8)' }}>
            <MapPin size={14} />
            <span className="text-xs" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>Río Negro, Argentina</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Bariloche
          </h1>
          <p className="text-xl text-white/70 font-light max-w-xl mb-8">
            El destino premium de la Patagonia argentina. Ski, lagos, bosques nativos y una de las mejores rentabilidades turísticas del país.
          </p>
          <div className="flex gap-3">
            <Link href="/propiedades?ciudad=Bariloche" className="px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer" style={{ background: 'var(--accent)' }}>
              Ver propiedades
            </Link>
            <Link href="/invertir#bariloche" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              Datos de inversión
            </Link>
            <Link href="/bariloche/precio-m2" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
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
              <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Bariloche</p>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Propiedades disponibles</h2>
            </div>
            <Link href="/propiedades?ciudad=Bariloche" className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--primary)' }}>
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
                Invertir en Bariloche
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
            Preguntas frecuentes sobre propiedades en Bariloche
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
            <Link href="/blog/invertir-bariloche-patagonia-rental-vacacional" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              → Invertir en Bariloche: rental vacacional 8-10% USD y escasez de oferta
            </Link>
            <Link href="/blog/mejor-ciudad-para-invertir-argentina-2025" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              → ¿En qué ciudad de Argentina conviene más invertir en 2025?
            </Link>
          </div>
        </div>
      </section>

      {/* Schema JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': 'https://mudateargentina.com/bariloche#localbusiness', name: 'Mudate — Bariloche', description: 'Portal inmobiliario de Bariloche, Río Negro, Argentina', address: { '@type': 'PostalAddress', addressLocality: 'Bariloche', addressRegion: 'Río Negro', addressCountry: 'AR' }, url: 'https://mudateargentina.com/bariloche', areaServed: { '@type': 'City', name: 'Bariloche' }, priceRange: 'USD 90.000 – USD 800.000', aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '203', bestRating: '5', worstRating: '1' } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' }, { '@type': 'ListItem', position: 2, name: 'Bariloche', item: 'https://mudateargentina.com/bariloche' }] }) }} />
    </div>
  );
}
