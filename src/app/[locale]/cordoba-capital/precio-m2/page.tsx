import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Database, ChevronRight } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  const path = 'cordoba-capital/precio-m2';
  return {
    title: isEn ? 'Price per m² in Córdoba Capital 2025 — Data by Neighborhood' : 'Precio m² en Córdoba Capital 2025 — Datos por Barrio',
    description: isEn
      ? 'Price per square meter in Córdoba Capital 2025. USD 1,000–1,700/m² by neighborhood. Nueva Córdoba, Güemes, General Paz. Best university rental yield in Argentina.'
      : 'Precio del metro cuadrado en Córdoba Capital 2025. USD 1.000–1.700/m² según barrio. Nueva Córdoba, Güemes, General Paz. Mejor rentabilidad universitaria de Argentina.',
    keywords: isEn
      ? ['price per m2 Córdoba Capital', 'square meter price Córdoba', 'apartment price Córdoba Capital', 'real estate Córdoba 2025']
      : ['precio m2 Córdoba Capital', 'valor metro cuadrado Córdoba', 'precio departamento Córdoba Capital', 'precio m2 barrios Córdoba 2025'],
    alternates: {
      canonical: `${base}/${isEn ? 'en/' : ''}${path}`,
      languages: { 'es': `${base}/${path}`, 'en': `${base}/en/${path}`, 'x-default': `${base}/${path}` },
    },
    openGraph: {
      title: isEn ? 'Price per m² in Córdoba Capital 2025' : 'Precio m² en Córdoba Capital 2025',
      description: isEn ? 'USD 1,000–1,700/m² by neighborhood in Córdoba Capital, Argentina.' : 'USD 1.000–1.700/m² según barrio en Córdoba Capital, Argentina.',
      url: `${base}/${isEn ? 'en/' : ''}${path}`,
      siteName: 'Mudate Argentina',
      type: 'article',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: 'Precio m² Córdoba Capital 2025' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: isEn ? 'Price per m² in Córdoba Capital 2025' : 'Precio m² en Córdoba Capital 2025',
      description: isEn ? 'USD 1,000–1,700/m² by neighborhood in Córdoba Capital, Argentina.' : 'USD 1.000–1.700/m² según barrio en Córdoba Capital, Argentina.',
      images: [`${base}/opengraph-image`],
    },
  };
}

export const revalidate = 3600; // ISR: revalida cada 1 hora

const barrios = [
  { barrio: 'Nueva Córdoba', tipo: 'Departamento', min: 1300, max: 1700, tend: '+20%', nota: 'Mayor densidad estudiantil del país' },
  { barrio: 'Güemes', tipo: 'Departamento / PH', min: 1200, max: 1600, tend: '+18%', nota: 'Bohemio en plena revalorización' },
  { barrio: 'General Paz', tipo: 'Casa / PH', min: 1100, max: 1500, tend: '+16%', nota: 'Residencial consolidado' },
  { barrio: 'Cerro de las Rosas', tipo: 'Casa', min: 1300, max: 1800, tend: '+17%', nota: 'Premium familiar' },
  { barrio: 'Alto Verde', tipo: 'Departamento', min: 1000, max: 1400, tend: '+14%', nota: 'Perfil joven profesional' },
  { barrio: 'Argüello', tipo: 'Casa', min: 900, max: 1300, tend: '+12%', nota: 'Acceso a Ciudad Universitaria' },
  { barrio: 'Villa El Libertador', tipo: 'Casa', min: 700, max: 1000, tend: '+9%', nota: 'Mercado popular creciente' },
];

const faqs = [
  { q: '¿Cuánto vale el m² en Córdoba Capital en 2025?', a: 'El precio promedio en Córdoba Capital es USD 1.000–1.500/m² para departamentos. Nueva Córdoba, el barrio universitario más importante de Argentina, cotiza USD 1.300–1.700/m². Cerro de las Rosas (el barrio premium familiar) supera USD 1.800/m² en casas de mayor calidad.' },
  { q: '¿Por qué Nueva Córdoba tiene tanto cap rate?', a: 'Nueva Córdoba tiene la mayor densidad estudiantil de Argentina (más de 100.000 universitarios dentro o en los alrededores del barrio). Esta demanda es captiva, no estacional y completamente independiente del ciclo económico. Un departamento de 1 ambiente bien ubicado puede generar USD 6.000–8.000 anuales (cap rate 6–8% USD).' },
  { q: '¿Cuáles son los barrios con mayor apreciación en Córdoba?', a: 'Nueva Córdoba lidera con +20% en 2 años. Güemes es el barrio con mayor potencial a futuro: proceso de gentrificación activo (restaurantes, galerías, diseño), precios todavía un 15–20% más bajos que Nueva Córdoba con perfil similar. General Paz y Cerro de las Rosas son más estables pero también con buenos retornos.' },
];

async function getMutadeData() {
  try {
    await connectDB();
    const result = await Property.aggregate([
      { $match: { published: true, ciudad: { $in: ['Córdoba', 'Cordoba', 'Córdoba Capital'] }, currency: 'USD', superficie_cubierta: { $gt: 15 } } },
      { $addFields: { precioM2: { $divide: ['$price', '$superficie_cubierta'] } } },
      { $match: { precioM2: { $gt: 200, $lt: 7000 } } },
      { $group: { _id: '$type', avgM2: { $avg: '$precioM2' }, avgPrice: { $avg: '$price' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return result as { _id: string; avgM2: number; avgPrice: number; count: number }[];
  } catch { return []; }
}

export default async function CordobaPrecioM2Page() {
  const mudate = await getMutadeData();
  const total = mudate.reduce((s, r) => s + r.count, 0);

  return (
    <div style={{ background: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', '@id': 'https://mudateargentina.com/cordoba-capital/precio-m2#article', headline: 'Precio m² en Córdoba Capital 2025', datePublished: '2025-09-01', dateModified: new Date().toISOString().slice(0, 10), author: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' }, publisher: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' }, url: 'https://mudateargentina.com/cordoba-capital/precio-m2' }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' }, { '@type': 'ListItem', position: 2, name: 'Córdoba Capital', item: 'https://mudateargentina.com/cordoba-capital' }, { '@type': 'ListItem', position: 3, name: 'Precio m² en Córdoba Capital', item: 'https://mudateargentina.com/cordoba-capital/precio-m2' }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Dataset', name: 'Precio m² Córdoba Capital 2025', description: 'Precio del metro cuadrado en USD por barrio en Córdoba Capital, Argentina.', creator: { '@type': 'Organization', name: 'Mudate' }, dateModified: new Date().toISOString().slice(0, 10), spatialCoverage: { '@type': 'Place', name: 'Córdoba Capital, Argentina' } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />

      <div style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 60%, #0D3424 100%)' }} className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <Link href="/cordoba-capital" className="hover:text-white transition-colors">Córdoba</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Precio m²</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: 'var(--accent)' }}>Datos 2025</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Actualizado: {new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Precio m² en Córdoba Capital 2025
          </h1>
          <p className="text-lg text-white/70 font-light max-w-xl">
            La capital universitaria de Argentina. Datos de precio por barrio, cap rate estudiantil y análisis del mercado de Nueva Córdoba y Güemes.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {mudate.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Database size={16} style={{ color: 'var(--primary)' }} />
              <h2 className="text-lg font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Datos de Mudate — {total} propiedades analizadas</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {mudate.map((r) => (
                <div key={r._id} className="rounded-xl p-5 text-center" style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
                  <p className="text-xs mb-1 capitalize" style={{ color: 'var(--muted-foreground)' }}>{r._id}</p>
                  <p className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>USD {Math.round(r.avgM2).toLocaleString('es-AR')}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>por m² · {r.count} propiedades</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Precio m² por barrio en Córdoba Capital</h2>
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
                    <td className="py-3 px-4" style={{ color: 'var(--foreground)' }}>
                      <span className="font-medium">{b.barrio}</span>
                      <span className="block text-xs" style={{ color: 'var(--muted-foreground)' }}>{b.nota}</span>
                    </td>
                    <td className="py-3 px-4 capitalize" style={{ color: 'var(--muted-foreground)' }}>{b.tipo}</td>
                    <td className="py-3 px-4 text-right font-semibold" style={{ color: 'var(--foreground)' }}>USD {b.min.toLocaleString()}–{b.max.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right" style={{ color: '#16a34a', fontWeight: 600 }}>{b.tend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--muted-foreground)' }}>Fuente: datos de mercado Mudate. Valores en USD, 2025.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>La ciudad universitaria como motor del mercado</h2>
          <div style={{ color: 'var(--muted-foreground)', lineHeight: 1.8, fontSize: '0.92rem' }}>
            <p className="mb-4">Córdoba tiene más de 200.000 universitarios activos, la mayor concentración de estudiantes per cápita de Argentina. Esta demanda de alquiler es estructural, no coyuntural: crece todos los años independientemente del ciclo económico, porque la UNC y las universidades privadas siguen incorporando ingresantes.</p>
            <p className="mb-4"><strong style={{ color: 'var(--foreground)' }}>Nueva Córdoba</strong> es la zona de mayor capitalización de esta demanda. Un monoambiente de 30–35 m² bien terminado (USD 50.000–70.000) genera USD 350–500/mes en alquiler, un cap rate del 6–8% USD que supera al de Buenos Aires en condiciones equivalentes.</p>
            <p><strong style={{ color: 'var(--foreground)' }}>Güemes</strong> es la apuesta de valor: el barrio comenzó su transformación en 2020 y todavía tiene precios un 15–20% por debajo de Nueva Córdoba, con el mismo perfil de demanda. Los indicadores gastronómicos y culturales (restaurantes, galerías, espacios de coworking) señalan que la convergencia de precios está en marcha.</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Preguntas frecuentes</h2>
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
            <Link href="/blog/cap-rate-cordoba-2025" className="flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: 'var(--primary)' }}>
              <ChevronRight size={14} /> Cap Rate en Córdoba 2025
            </Link>
            <Link href="/blog/mejores-barrios-nueva-cordoba" className="flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: 'var(--primary)' }}>
              <ChevronRight size={14} /> Mejores barrios para invertir en Nueva Córdoba
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Precio m² en otras ciudades</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/buenos-aires-capital/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Buenos Aires</Link>
            <Link href="/rosario/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Rosario</Link>
            <Link href="/mendoza/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Mendoza</Link>
            <Link href="/bariloche/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Bariloche</Link>
            <Link href="/salta/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Salta</Link>
            <Link href="/neuquen/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Neuquén</Link>
            <Link href="/villa-carlos-paz/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Villa Carlos Paz</Link>
            <Link href="/mar-del-plata/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Mar del Plata</Link>
            <Link href="/tucuman/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Tucumán</Link>
          </div>
        </section>

        <div className="flex flex-wrap gap-4">
          <Link href="/propiedades?ciudad=Córdoba" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--primary)' }}>
            <TrendingUp size={16} /> Ver propiedades en Córdoba
          </Link>
          <Link href="/cordoba-capital" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
            <ArrowLeft size={16} /> Hub Córdoba
          </Link>
        </div>
      </div>
    </div>
  );
}
