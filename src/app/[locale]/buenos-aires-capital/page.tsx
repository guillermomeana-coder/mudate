import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, TrendingUp, Home, ArrowRight, CheckCircle } from 'lucide-react';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  const citySlug = 'buenos-aires-capital';
  const cityName = 'Buenos Aires Capital';
  return {
    title: isEn
      ? 'Real Estate in Buenos Aires — Palermo, Recoleta, Puerto Madero | Mudate'
      : 'Propiedades en Buenos Aires Capital — Palermo, Recoleta, Puerto Madero | Mudate',
    description: isEn
      ? 'Properties for sale in Buenos Aires Capital. Argentina\'s largest real estate market. USD 2,400–2,800/m², Palermo, Recoleta, Puerto Madero, Belgrano.'
      : 'Propiedades en venta en Buenos Aires Capital. El mayor mercado inmobiliario de Argentina. USD 2.400–2.800/m², Palermo, Recoleta, Puerto Madero, Belgrano.',
    alternates: {
      canonical: `${base}/${isEn ? 'en/' : ''}${citySlug}`,
      languages: { 'es': `${base}/${citySlug}`, 'en': `${base}/en/${citySlug}` },
    },
    openGraph: {
      title: isEn ? `Real Estate in ${cityName} — Palermo, Recoleta & Puerto Madero` : `Propiedades en ${cityName} — Palermo, Recoleta y Puerto Madero`,
      description: isEn
        ? 'Find properties for sale in Buenos Aires. Explore houses, apartments and investment opportunities in Argentina\'s most liquid real estate market.'
        : 'Encontrá propiedades en Buenos Aires Capital. Casas, departamentos y oportunidades de inversión en el mercado más líquido del país.',
      url: `${base}/${isEn ? 'en/' : ''}${citySlug}`,
      type: 'website',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: `${cityName} propiedades` }],
    },
    twitter: { card: 'summary_large_image', images: [`${base}/opengraph-image`] },
  };
}

const stats = [
  { label: 'Precio promedio', value: 'USD 2.600/m²' },
  { label: 'Depto 2 ambientes', value: 'USD 180.000' },
  { label: 'Depto 3 ambientes', value: 'USD 320.000' },
  { label: 'Habitantes', value: '3.000.000' },
];

const porqueInvertir = [
  'Mayor mercado inmobiliario de Argentina — el más líquido del país',
  'Puerto Madero: USD 4.000–6.000/m², propiedades de lujo con frente al río',
  'Palermo y Recoleta: alta demanda permanente de alquiler turístico y residencial',
  'Belgrano y Núñez: zona familiar premium con colegios internacionales',
  'Precio promedio 2x Córdoba, pero con mayor liquidez y demanda constante',
  'Excelente conectividad: 2 aeropuertos, red subte y autopistas',
];

const barrios = [
  { name: 'Palermo', desc: 'El barrio más buscado de CABA', tipo: 'departamentos / PH' },
  { name: 'Recoleta', desc: 'Elegancia y tradición porteña', tipo: 'departamentos premium' },
  { name: 'Puerto Madero', desc: 'Lujo frente al río', tipo: 'lofts / torres' },
  { name: 'Belgrano', desc: 'Zona familiar premium', tipo: 'casas / deptos' },
];

const properties: PropertyCardData[] = [
  {
    slug: 'departamento-palermo-2-ambientes',
    title: 'Departamento 2 ambientes — Palermo',
    price: 185000,
    currency: 'USD',
    operation: 'venta',
    type: 'departamento',
    ciudad: 'Buenos Aires Capital',
    barrio: 'Palermo',
    ambientes: 2,
    dormitorios: 1,
    banos: 1,
    superficie_cubierta: 65,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
  },
  {
    slug: 'ph-recoleta-3-ambientes',
    title: 'PH 3 ambientes — Recoleta',
    price: 280000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Buenos Aires Capital',
    barrio: 'Recoleta',
    ambientes: 3,
    dormitorios: 2,
    banos: 2,
    superficie_cubierta: 110,
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80'],
  },
  {
    slug: 'departamento-belgrano-monoambiente',
    title: 'Monoambiente — Belgrano',
    price: 95000,
    currency: 'USD',
    operation: 'venta',
    type: 'departamento',
    ciudad: 'Buenos Aires Capital',
    barrio: 'Belgrano',
    ambientes: 1,
    dormitorios: 0,
    banos: 1,
    superficie_cubierta: 38,
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'],
  },
];

const faqs = [
  { q: '¿Cuánto cuesta un departamento en Buenos Aires en 2025?', a: 'Los precios varían por barrio. En Palermo y Recoleta un 2 ambientes cuesta USD 120.000–160.000. En Almagro y Caballito USD 85.000–110.000. El precio promedio del m² en CABA es USD 2.200–2.800.' },
  { q: '¿Cuáles son los mejores barrios de Buenos Aires para comprar?', a: 'Para vivir: Palermo (más demandado), Recoleta (premium clásico), Caballito (familiar y central). Para invertir: Almagro y Villa Crespo (en valorización). Para mayor accesibilidad: Flores y Balvanera.' },
  { q: '¿Qué rentabilidad de alquiler tiene Buenos Aires?', a: 'El cap rate en CABA es de 3.5% a 5% USD anual, más bajo que el interior del país. Sin embargo, Buenos Aires ofrece mayor liquidez, mejor valorización histórica y demanda permanente.' },
  { q: '¿Es mejor comprar en Buenos Aires o en el interior de Argentina?', a: 'Depende del objetivo. Buenos Aires ofrece mayor liquidez y valorización histórica. El interior (Córdoba, Villa Carlos Paz, Bariloche) ofrece cap rates 2–3 puntos más altos. Para renta el interior gana; para preservar capital y revender rápido, CABA.' },
];

export default function BuenosAiresCapitalPage() {
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
            Buenos Aires Capital
          </h1>
          <p className="text-xl text-white/70 font-light max-w-xl mb-8">
            El mayor mercado inmobiliario de Argentina. Palermo, Recoleta, Puerto Madero y los barrios más exclusivos del país.
          </p>
          <div className="flex gap-3">
            <Link href="/propiedades?ciudad=Buenos+Aires+Capital" className="px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer" style={{ background: 'var(--accent)' }}>
              Ver propiedades
            </Link>
            <Link href="/invertir#buenos-aires-capital" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              Datos de inversión
            </Link>
            <Link href="/buenos-aires-capital/precio-m2" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
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
              <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Buenos Aires Capital</p>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Propiedades disponibles</h2>
            </div>
            <Link href="/propiedades?ciudad=Buenos+Aires+Capital" className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--primary)' }}>
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
                Invertir en Buenos Aires Capital
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
            Preguntas frecuentes sobre propiedades en Buenos Aires
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
            <Link href="/blog/mercado-inmobiliario-buenos-aires-2025" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              → Mercado Inmobiliario Buenos Aires 2025: Palermo, Recoleta y los barrios que más suben
            </Link>
            <Link href="/blog/como-comprar-propiedad-argentina-extranjeros" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              → Cómo comprar una propiedad en Argentina siendo extranjero: guía 2025
            </Link>
          </div>
        </div>
      </section>

      {/* Schema JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': 'https://mudateargentina.com/buenos-aires-capital#localbusiness', name: 'Mudate — Buenos Aires Capital', description: 'Portal inmobiliario de Buenos Aires Capital, Argentina', address: { '@type': 'PostalAddress', addressLocality: 'Buenos Aires', addressRegion: 'Buenos Aires', addressCountry: 'AR' }, url: 'https://mudateargentina.com/buenos-aires-capital', areaServed: { '@type': 'City', name: 'Buenos Aires' }, priceRange: 'USD 50.000 – USD 500.000', aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '312', bestRating: '5', worstRating: '1' } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' }, { '@type': 'ListItem', position: 2, name: 'Buenos Aires Capital', item: 'https://mudateargentina.com/buenos-aires-capital' }] }) }} />
    </div>
  );
}
