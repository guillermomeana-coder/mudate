import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Database, ChevronRight } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  const path = 'salta/precio-m2';
  return {
    title: isEn ? 'Price per m² in Salta 2025 — Updated Data by Neighborhood' : 'Precio m² en Salta 2025 — Datos Actualizados por Barrio',
    description: isEn
      ? 'Price per square meter in Salta Capital 2025. USD 900–1,400/m² by neighborhood. Tres Cerritos, Centro Histórico, San Lorenzo. Real property data.'
      : 'Precio del metro cuadrado en Salta Capital 2025. USD 900–1.400/m² según barrio. Tres Cerritos, Centro Histórico, San Lorenzo. Datos reales de propiedades en venta.',
    keywords: isEn
      ? ['price per m2 Salta', 'square meter price Salta', 'apartment price Salta', 'real estate Salta Argentina 2025']
      : ['precio m2 Salta', 'valor metro cuadrado Salta', 'precio departamento Salta', 'precio m2 barrios Salta 2025'],
    alternates: {
      canonical: `${base}/${isEn ? 'en/' : ''}${path}`,
      languages: { 'es': `${base}/${path}`, 'en': `${base}/en/${path}`, 'x-default': `${base}/${path}` },
    },
    openGraph: {
      title: isEn ? 'Price per m² in Salta 2025' : 'Precio m² en Salta 2025',
      description: isEn ? 'USD 900–1,400/m² by neighborhood in Salta, Argentina.' : 'USD 900–1.400/m² según barrio en Salta Capital, Argentina.',
      url: `${base}/${isEn ? 'en/' : ''}${path}`,
      siteName: 'Mudate Argentina',
      type: 'article',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: 'Precio m² Salta 2025' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: isEn ? 'Price per m² in Salta 2025' : 'Precio m² en Salta 2025',
      description: isEn ? 'USD 900–1,400/m² by neighborhood in Salta, Argentina.' : 'USD 900–1.400/m² según barrio en Salta Capital, Argentina.',
      images: [`${base}/opengraph-image`],
    },
  };
}

export const revalidate = 3600; // ISR: revalida cada 1 hora

const barrios = [
  { barrio: 'Tres Cerritos', tipo: 'Departamento', min: 1100, max: 1400, tend: '+18%', demanda: 'Muy alta' },
  { barrio: 'Tres Cerritos', tipo: 'Casa', min: 1200, max: 1600, tend: '+20%', demanda: 'Muy alta' },
  { barrio: 'Centro Histórico', tipo: 'Departamento', min: 1000, max: 1300, tend: '+15%', demanda: 'Alta (turismo)' },
  { barrio: 'San Lorenzo', tipo: 'Casa', min: 1000, max: 1350, tend: '+16%', demanda: 'Alta' },
  { barrio: 'Limache', tipo: 'Casa', min: 900, max: 1200, tend: '+12%', demanda: 'Media-alta' },
  { barrio: 'Norte / Nueva Salta', tipo: 'Departamento', min: 850, max: 1100, tend: '+10%', demanda: 'Media' },
  { barrio: 'Cerrillos', tipo: 'Terreno', min: 200, max: 400, tend: '+8%', demanda: 'Media' },
];

const faqs = [
  { q: '¿Cuánto vale el m² en Salta en 2025?', a: 'El precio promedio en Salta Capital es USD 900–1.300/m² para departamentos. En Tres Cerritos y zonas premium los valores llegan a USD 1.100–1.600/m². El Centro Histórico cotiza similar por su alta demanda turística para alquiler vacacional.' },
  { q: '¿En qué barrio de Salta es más caro el m²?', a: 'Tres Cerritos es el barrio más caro de Salta Capital, con valores entre USD 1.100 y 1.600/m². Le siguen el Centro Histórico (alta demanda turística) y San Lorenzo, el barrio serrano premium a 11 km de la ciudad.' },
  { q: '¿Subió el precio del m² en Salta en los últimos años?', a: 'Sí. Entre 2022 y 2025 el precio en USD subió entre 15% y 22% en los barrios más demandados, impulsado por el turismo creciente (+22% en 2024) y la demanda corporativa del sector litio.' },
];

async function getMutadeData() {
  try {
    await connectDB();
    const result = await Property.aggregate([
      { $match: { published: true, ciudad: 'Salta', currency: 'USD', superficie_cubierta: { $gt: 15 } } },
      { $addFields: { precioM2: { $divide: ['$price', '$superficie_cubierta'] } } },
      { $match: { precioM2: { $gt: 200, $lt: 5000 } } },
      { $group: { _id: '$type', avgM2: { $avg: '$precioM2' }, avgPrice: { $avg: '$price' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return result as { _id: string; avgM2: number; avgPrice: number; count: number }[];
  } catch { return []; }
}

export default async function SaltaPrecioM2Page() {
  const mudate = await getMutadeData();
  const total = mudate.reduce((s, r) => s + r.count, 0);

  const schemaArticle = {
    '@context': 'https://schema.org', '@type': 'Article',
    '@id': 'https://mudateargentina.com/salta/precio-m2#article',
    headline: 'Precio m² en Salta 2025 — Datos Actualizados por Barrio',
    datePublished: '2025-09-01', dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' },
    publisher: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' },
    url: 'https://mudateargentina.com/salta/precio-m2',
    description: 'Análisis actualizado del precio del metro cuadrado en Salta Capital. Datos por barrio, tendencias y análisis de inversión.',
  };
  const schemaBreadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' },
      { '@type': 'ListItem', position: 2, name: 'Salta', item: 'https://mudateargentina.com/salta' },
      { '@type': 'ListItem', position: 3, name: 'Precio m² en Salta', item: 'https://mudateargentina.com/salta/precio-m2' },
    ],
  };
  const schemaDataset = {
    '@context': 'https://schema.org', '@type': 'Dataset',
    name: 'Precio m² Salta Capital 2025',
    description: 'Precios del metro cuadrado en USD por barrio y tipo de propiedad en Salta Capital, Argentina.',
    creator: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' },
    dateModified: new Date().toISOString().slice(0, 10),
    spatialCoverage: { '@type': 'Place', name: 'Salta Capital, Argentina' },
    variableMeasured: 'Precio USD por metro cuadrado',
  };
  const schemaFAQ = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <div style={{ background: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaDataset) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 60%, #0D3424 100%)' }} className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <Link href="/salta" className="hover:text-white transition-colors">Salta</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Precio m²</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: 'var(--accent)' }}>Datos 2025</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Actualizado: {new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Precio m² en Salta 2025
          </h1>
          <p className="text-lg text-white/70 font-light max-w-xl">
            Datos actualizados del precio del metro cuadrado en Salta Capital por barrio y tipo de propiedad.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Datos de Mudate */}
        {mudate.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Database size={16} style={{ color: 'var(--primary)' }} />
              <h2 className="text-lg font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
                Datos de Mudate — {total} propiedades analizadas
              </h2>
            </div>
            <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
              Precio promedio del m² calculado sobre propiedades publicadas en Mudate con superficie declarada.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {mudate.map((r) => (
                <div key={r._id} className="rounded-xl p-5 text-center" style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
                  <p className="text-xs mb-1 capitalize" style={{ color: 'var(--muted-foreground)' }}>{r._id}</p>
                  <p className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
                    USD {Math.round(r.avgM2).toLocaleString('es-AR')}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>por m² · {r.count} propiedades</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tabla por barrio */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
            Precio m² por barrio en Salta
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--foreground)' }}>Barrio</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--foreground)' }}>Tipo</th>
                  <th className="text-right py-3 px-4 font-semibold" style={{ color: 'var(--foreground)' }}>USD/m²</th>
                  <th className="text-right py-3 px-4 font-semibold" style={{ color: 'var(--foreground)' }}>Tendencia 2yr</th>
                </tr>
              </thead>
              <tbody>
                {barrios.map((b, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--muted)' }}>
                    <td className="py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>{b.barrio}</td>
                    <td className="py-3 px-4 capitalize" style={{ color: 'var(--muted-foreground)' }}>{b.tipo}</td>
                    <td className="py-3 px-4 text-right font-semibold" style={{ color: 'var(--foreground)' }}>USD {b.min.toLocaleString()}–{b.max.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right" style={{ color: '#16a34a', fontWeight: 600 }}>{b.tend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--muted-foreground)' }}>Fuente: datos de mercado Mudate + análisis editorial. Valores en USD, septiembre 2025.</p>
        </section>

        {/* Análisis */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
            Análisis del mercado inmobiliario de Salta
          </h2>
          <div className="prose-custom" style={{ color: 'var(--muted-foreground)', lineHeight: 1.8, fontSize: '0.92rem' }}>
            <p className="mb-4">
              Salta Capital opera a dos velocidades. Por un lado, los barrios premium como <strong style={{ color: 'var(--foreground)' }}>Tres Cerritos y San Lorenzo</strong> tienen precios y demanda comparables a ciudades como Rosario o Mendoza. Por otro, sectores en desarrollo como Nueva Salta ofrecen valores de entrada muy accesibles.
            </p>
            <p className="mb-4">
              El <strong style={{ color: 'var(--foreground)' }}>Centro Histórico</strong> es la zona más particular del mercado: sus casas coloniales y departamentos cercanos a la Plaza 9 de Julio tienen una demanda turística muy activa (Airbnb/Booking), lo que genera rentabilidades del 7–10% USD anual —superiores a cualquier otra zona de la ciudad.
            </p>
            <p>
              El efecto del <strong style={{ color: 'var(--foreground)' }}>Triángulo del Litio</strong> sobre los precios es real pero moderado: genera demanda de alquiler corporativo que sostiene los valores, pero no es (todavía) el driver principal de precio/m². El turismo sigue siendo la fuerza más potente detrás de la valorización reciente.
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
            Preguntas frecuentes
          </h2>
          <div className="flex flex-col gap-4">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-xl p-6" style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold mb-2 text-sm" style={{ color: 'var(--foreground)' }}>{f.q}</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)', lineHeight: 1.7 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Artículos relacionados</h2>
          <div className="flex flex-col gap-3">
            <Link href="/blog/invertir-salta-noa-turismo-litio" className="flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: 'var(--primary)' }}>
              <ChevronRight size={14} /> Invertir en Salta: turismo y litio en el NOA
            </Link>
            <Link href="/blog/mejor-ciudad-para-invertir-argentina-2025" className="flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: 'var(--primary)' }}>
              <ChevronRight size={14} /> Mejor ciudad para invertir en Argentina 2025
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Precio m² en otras ciudades</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/cordoba-capital/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Córdoba</Link>
            <Link href="/buenos-aires-capital/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Buenos Aires</Link>
            <Link href="/rosario/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Rosario</Link>
            <Link href="/mendoza/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Mendoza</Link>
            <Link href="/bariloche/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Bariloche</Link>
            <Link href="/neuquen/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Neuquén</Link>
            <Link href="/villa-carlos-paz/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Villa Carlos Paz</Link>
            <Link href="/mar-del-plata/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Mar del Plata</Link>
            <Link href="/tucuman/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Tucumán</Link>
          </div>
        </section>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <Link href="/propiedades?ciudad=Salta" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--primary)' }}>
            <TrendingUp size={16} /> Ver propiedades en Salta
          </Link>
          <Link href="/salta" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
            <ArrowLeft size={16} /> Hub Salta
          </Link>
        </div>
      </div>
    </div>
  );
}
