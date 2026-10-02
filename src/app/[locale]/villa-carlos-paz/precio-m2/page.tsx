import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Database, ChevronRight } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  const path = 'villa-carlos-paz/precio-m2';
  return {
    title: isEn ? 'Price per m² in Villa Carlos Paz 2025 — Data by Zone' : 'Precio m² en Villa Carlos Paz 2025 — Datos por Barrio',
    description: isEn
      ? 'Price per square meter in Villa Carlos Paz 2025. USD 1,400–2,000/m² by zone and lake view. Centro, coastal zone, private neighborhoods. Tourism cap rate 7–10% USD.'
      : 'Precio del metro cuadrado en Villa Carlos Paz 2025. USD 1.400–2.000/m² según zona y vista al lago. Centro, zona costera, barrios privados. Cap rate 7–10% turístico.',
    keywords: isEn
      ? ['price per m2 Villa Carlos Paz', 'square meter price Villa Carlos Paz', 'apartment price Villa Carlos Paz', 'real estate Villa Carlos Paz 2025']
      : ['precio m2 Villa Carlos Paz', 'valor metro cuadrado Villa Carlos Paz', 'precio departamento Villa Carlos Paz', 'precio m2 zona lago Córdoba 2025'],
    alternates: {
      canonical: `${base}/${isEn ? 'en/' : ''}${path}`,
      languages: { 'es': `${base}/${path}`, 'en': `${base}/en/${path}`, 'x-default': `${base}/${path}` },
    },
    openGraph: {
      title: isEn ? 'Price per m² in Villa Carlos Paz 2025' : 'Precio m² en Villa Carlos Paz 2025',
      description: isEn ? 'USD 1,400–2,000/m² by zone in Villa Carlos Paz, Córdoba, Argentina.' : 'USD 1.400–2.000/m² según zona en Villa Carlos Paz, Córdoba, Argentina.',
      url: `${base}/${isEn ? 'en/' : ''}${path}`,
      siteName: 'Mudate Argentina',
      type: 'article',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: 'Precio m² Villa Carlos Paz 2025' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: isEn ? 'Price per m² in Villa Carlos Paz 2025' : 'Precio m² en Villa Carlos Paz 2025',
      description: isEn ? 'USD 1,400–2,000/m² by zone in Villa Carlos Paz, Córdoba, Argentina.' : 'USD 1.400–2.000/m² según zona en Villa Carlos Paz, Córdoba, Argentina.',
      images: [`${base}/opengraph-image`],
    },
  };
}

export const revalidate = 3600; // ISR: revalida cada 1 hora

const barrios = [
  { barrio: 'Centro (frente al lago)', tipo: 'Departamento', min: 1700, max: 2100, tend: '+22%', demanda: 'Máxima' },
  { barrio: 'Centro', tipo: 'Departamento', min: 1400, max: 1750, tend: '+18%', demanda: 'Muy alta' },
  { barrio: 'Zona costera / balnearios', tipo: 'Departamento', min: 1500, max: 1900, tend: '+20%', demanda: 'Muy alta' },
  { barrio: 'Barrios privados', tipo: 'Casa', min: 1400, max: 1900, tend: '+16%', demanda: 'Alta' },
  { barrio: 'Zona residencial', tipo: 'Casa', min: 1100, max: 1500, tend: '+12%', demanda: 'Alta' },
  { barrio: 'Cosquín / periferia', tipo: 'Casa', min: 900, max: 1200, tend: '+10%', demanda: 'Media' },
];

const faqs = [
  { q: '¿Cuánto vale el m² en Villa Carlos Paz en 2025?', a: 'El precio promedio es USD 1.400–1.800/m². Las zonas con vista al lago o frente costero pueden superar USD 2.000/m². Los barrios residenciales alejados del centro ofrecen valores desde USD 1.100/m².' },
  { q: '¿Conviene más comprar cerca del lago en Villa Carlos Paz?', a: 'En términos de rentabilidad turística, sí: un departamento frente al lago genera entre 20% y 40% más ingresos por alquiler vacacional que uno en zona residencial. El diferencial de precio (20–30% más caro) se recupera en 2–3 temporadas.' },
  { q: '¿Cuánto rinde un departamento en Villa Carlos Paz por alquiler?', a: 'Un departamento 2 ambientes bien ubicado (USD 90.000–110.000) puede generar USD 7.000–10.000 anuales con gestión activa en plataformas. Eso equivale a un cap rate bruto del 7–10% USD, entre los más altos de Argentina.' },
];

async function getMutadeData() {
  try {
    await connectDB();
    const result = await Property.aggregate([
      { $match: { published: true, ciudad: 'Villa Carlos Paz', currency: 'USD', superficie_cubierta: { $gt: 15 } } },
      { $addFields: { precioM2: { $divide: ['$price', '$superficie_cubierta'] } } },
      { $match: { precioM2: { $gt: 200, $lt: 8000 } } },
      { $group: { _id: '$type', avgM2: { $avg: '$precioM2' }, avgPrice: { $avg: '$price' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return result as { _id: string; avgM2: number; avgPrice: number; count: number }[];
  } catch { return []; }
}

export default async function VillaCarlosPazPrecioM2Page() {
  const mudate = await getMutadeData();
  const total = mudate.reduce((s, r) => s + r.count, 0);

  return (
    <div style={{ background: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', '@id': 'https://mudateargentina.com/villa-carlos-paz/precio-m2#article', headline: 'Precio m² en Villa Carlos Paz 2025', datePublished: '2025-09-01', dateModified: new Date().toISOString().slice(0, 10), author: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' }, publisher: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' }, url: 'https://mudateargentina.com/villa-carlos-paz/precio-m2' }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' }, { '@type': 'ListItem', position: 2, name: 'Villa Carlos Paz', item: 'https://mudateargentina.com/villa-carlos-paz' }, { '@type': 'ListItem', position: 3, name: 'Precio m² en Villa Carlos Paz', item: 'https://mudateargentina.com/villa-carlos-paz/precio-m2' }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Dataset', name: 'Precio m² Villa Carlos Paz 2025', description: 'Precio del metro cuadrado en USD por zona en Villa Carlos Paz, Córdoba, Argentina.', creator: { '@type': 'Organization', name: 'Mudate' }, dateModified: new Date().toISOString().slice(0, 10), spatialCoverage: { '@type': 'Place', name: 'Villa Carlos Paz, Córdoba, Argentina' } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />

      <div style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 60%, #0D3424 100%)' }} className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <Link href="/villa-carlos-paz" className="hover:text-white transition-colors">Villa Carlos Paz</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Precio m²</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: 'var(--accent)' }}>Datos 2025</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Actualizado: {new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Precio m² en Villa Carlos Paz 2025
          </h1>
          <p className="text-lg text-white/70 font-light max-w-xl">
            El destino turístico más visitado de Córdoba. Datos de precio por zona, análisis de cap rate vacacional y tendencias del mercado.
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
          <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Precio m² por zona en Villa Carlos Paz</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--foreground)' }}>Zona / Barrio</th>
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
          <p className="text-xs mt-3" style={{ color: 'var(--muted-foreground)' }}>Fuente: datos de mercado Mudate. Valores en USD, 2025.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Análisis: por qué el m² en VCP sube más rápido</h2>
          <div style={{ color: 'var(--muted-foreground)', lineHeight: 1.8, fontSize: '0.92rem' }}>
            <p className="mb-4">Villa Carlos Paz tiene una <strong style={{ color: 'var(--foreground)' }}>geografía que actúa como límite natural</strong> de la oferta: el lago, las sierras y el casco urbano consolidado dejan poco suelo disponible para nueva construcción cerca del agua. Esta escasez estructural, combinada con 3 millones de turistas anuales, genera una presión alcista que se sostiene independientemente del ciclo económico nacional.</p>
            <p className="mb-4">El diferencial de precio entre <strong style={{ color: 'var(--foreground)' }}>zona lago vs. zona residencial</strong> es del 30–40% en promedio. Ese diferencial se paga solo con la mayor rentabilidad turística: un departamento frente al lago genera 20–40% más ingresos por alquiler que uno en zona residencial.</p>
            <p>La <strong style={{ color: 'var(--foreground)' }}>distancia desde Córdoba Capital (36 km, 40 minutos)</strong> asegura una demanda de fin de semana permanente durante todo el año, que sostiene la rentabilidad fuera de la temporada alta veraniega.</p>
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
            <Link href="/blog/rentabilidad-villa-carlos-paz" className="flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: 'var(--primary)' }}>
              <ChevronRight size={14} /> Rentabilidad en Villa Carlos Paz
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
            <Link href="/salta/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Salta</Link>
            <Link href="/neuquen/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Neuquén</Link>
            <Link href="/mar-del-plata/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Mar del Plata</Link>
            <Link href="/tucuman/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Tucumán</Link>
          </div>
        </section>

        <div className="flex flex-wrap gap-4">
          <Link href="/propiedades?ciudad=Villa+Carlos+Paz" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--primary)' }}>
            <TrendingUp size={16} /> Ver propiedades en Villa Carlos Paz
          </Link>
          <Link href="/villa-carlos-paz" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
            <ArrowLeft size={16} /> Hub Villa Carlos Paz
          </Link>
        </div>
      </div>
    </div>
  );
}
