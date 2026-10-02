import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Database, ChevronRight } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  const path = 'neuquen/precio-m2';
  return {
    title: isEn ? 'Price per m² in Neuquén 2025 — Updated Data by Neighborhood' : 'Precio m² en Neuquén 2025 — Datos Actualizados por Barrio',
    description: isEn
      ? 'Price per square meter in Neuquén Capital 2025. USD 1,200–2,000/m² by neighborhood. Alta Barda, Confluencia, Centro. Market driven by Vaca Muerta.'
      : 'Precio del metro cuadrado en Neuquén Capital 2025. USD 1.200–2.000/m² según barrio. Alta Barda, Confluencia, Centro. Mercado impulsado por Vaca Muerta.',
    keywords: isEn
      ? ['price per m2 Neuquén', 'square meter price Neuquén', 'apartment price Neuquén', 'real estate Neuquén Vaca Muerta 2025']
      : ['precio m2 Neuquén', 'valor metro cuadrado Neuquén', 'precio departamento Neuquén', 'precio m2 barrios Neuquén 2025'],
    alternates: {
      canonical: `${base}/${isEn ? 'en/' : ''}${path}`,
      languages: { 'es': `${base}/${path}`, 'en': `${base}/en/${path}`, 'x-default': `${base}/${path}` },
    },
    openGraph: {
      title: isEn ? 'Price per m² in Neuquén 2025' : 'Precio m² en Neuquén 2025',
      description: isEn ? 'USD 1,200–2,000/m² by neighborhood in Neuquén Capital, Argentina.' : 'USD 1.200–2.000/m² según barrio en Neuquén Capital, Argentina.',
      url: `${base}/${isEn ? 'en/' : ''}${path}`,
      siteName: 'Mudate Argentina',
      type: 'article',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: 'Precio m² Neuquén 2025' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: isEn ? 'Price per m² in Neuquén 2025' : 'Precio m² en Neuquén 2025',
      description: isEn ? 'USD 1,200–2,000/m² by neighborhood in Neuquén Capital, Argentina.' : 'USD 1.200–2.000/m² según barrio en Neuquén Capital, Argentina.',
      images: [`${base}/opengraph-image`],
    },
  };
}

export const revalidate = 3600; // ISR: revalida cada 1 hora

const barrios = [
  { barrio: 'Alta Barda', tipo: 'Casa / Departamento', min: 1600, max: 2000, tend: '+28%', nota: 'Máxima demanda corporativa' },
  { barrio: 'Confluencia', tipo: 'Departamento', min: 1300, max: 1700, tend: '+24%', nota: 'Corazón financiero' },
  { barrio: 'Mariano Moreno', tipo: 'Departamento', min: 1200, max: 1550, tend: '+20%', nota: 'Residencial consolidado' },
  { barrio: 'Centro', tipo: 'Departamento', min: 1100, max: 1450, tend: '+18%', nota: 'Alta liquidez' },
  { barrio: 'Plottier', tipo: 'Casa', min: 900, max: 1300, tend: '+16%', nota: 'Expansión urbana activa' },
  { barrio: 'Cipolletti (R.N.)', tipo: 'Casa / Depto', min: 850, max: 1200, tend: '+14%', nota: 'Conurbano Neuquino' },
  { barrio: 'Periurbano / Quintas', tipo: 'Terreno', min: 200, max: 500, tend: '+10%', nota: 'Loteos en desarrollo' },
];

const faqs = [
  { q: '¿Cuánto vale el m² en Neuquén Capital en 2025?', a: 'El precio promedio en Neuquén Capital es USD 1.200–1.600/m² para departamentos. Alta Barda y Confluencia, los barrios más demandados por ejecutivos del sector energético, superan USD 1.600–2.000/m². El impulso de Vaca Muerta sigue siendo el principal driver del mercado.' },
  { q: '¿En qué barrio de Neuquén conviene invertir?', a: 'Alta Barda ofrece la mayor rentabilidad: demanda corporativa estable (Oil & Gas), bajo riesgo de vacancia y apreciación superior al 25% en 2 años. Para inversión de menor ticket, Confluencia ofrece un buen equilibrio entre precio de entrada y demanda de alquiler.' },
  { q: '¿Cuánto subió el m² en Neuquén en los últimos años?', a: 'Neuquén acumuló entre +18% y +28% en USD según el barrio entre 2022 y 2025. Es uno de los mercados con mayor apreciación de Argentina en términos reales, sostenido por el empleo petrolero y la escasez de oferta residencial premium.' },
];

async function getMutadeData() {
  try {
    await connectDB();
    const result = await Property.aggregate([
      { $match: { published: true, ciudad: 'Neuquén', currency: 'USD', superficie_cubierta: { $gt: 15 } } },
      { $addFields: { precioM2: { $divide: ['$price', '$superficie_cubierta'] } } },
      { $match: { precioM2: { $gt: 200, $lt: 6000 } } },
      { $group: { _id: '$type', avgM2: { $avg: '$precioM2' }, avgPrice: { $avg: '$price' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return result as { _id: string; avgM2: number; avgPrice: number; count: number }[];
  } catch { return []; }
}

export default async function NeuquenPrecioM2Page() {
  const mudate = await getMutadeData();
  const total = mudate.reduce((s, r) => s + r.count, 0);

  return (
    <div style={{ background: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', '@id': 'https://mudateargentina.com/neuquen/precio-m2#article', headline: 'Precio m² en Neuquén 2025', datePublished: '2025-09-01', dateModified: new Date().toISOString().slice(0, 10), author: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' }, publisher: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' }, url: 'https://mudateargentina.com/neuquen/precio-m2' }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' }, { '@type': 'ListItem', position: 2, name: 'Neuquén', item: 'https://mudateargentina.com/neuquen' }, { '@type': 'ListItem', position: 3, name: 'Precio m² en Neuquén', item: 'https://mudateargentina.com/neuquen/precio-m2' }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Dataset', name: 'Precio m² Neuquén Capital 2025', description: 'Precio del metro cuadrado en USD por barrio en Neuquén Capital, Neuquén, Argentina.', creator: { '@type': 'Organization', name: 'Mudate' }, dateModified: new Date().toISOString().slice(0, 10), spatialCoverage: { '@type': 'Place', name: 'Neuquén Capital, Argentina' } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />

      <div style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 60%, #0D3424 100%)' }} className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <Link href="/neuquen" className="hover:text-white transition-colors">Neuquén</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Precio m²</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: 'var(--accent)' }}>Datos 2025</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Actualizado: {new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Precio m² en Neuquén 2025
          </h1>
          <p className="text-lg text-white/70 font-light max-w-xl">
            El mercado más dinámico de la Patagonia. Vaca Muerta impulsa precios y demanda en el mercado inmobiliario con mayor apreciación de Argentina.
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
          <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Precio m² por barrio en Neuquén</h2>
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
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Vaca Muerta y el efecto sobre los precios</h2>
          <div style={{ color: 'var(--muted-foreground)', lineHeight: 1.8, fontSize: '0.92rem' }}>
            <p className="mb-4">Neuquén tiene una economía dual que no existe en ninguna otra ciudad argentina: por un lado el estado provincial (<strong style={{ color: 'var(--foreground)' }}>el mayor empleador</strong>), por otro el sector Oil & Gas que genera una demanda de alquiler corporativo completamente independiente del ciclo político. Esta combinación hace al mercado inmobiliario neuquino extremadamente resiliente.</p>
            <p className="mb-4"><strong style={{ color: 'var(--foreground)' }}>Alta Barda</strong> es el paradigma de este fenómeno: un barrio que prácticamente no existía hace 15 años, hoy cotiza similar a Palermo en relación al ingreso local. Las empresas petroleras pagan alquileres de USD 800–1.500/mes por departamentos para sus ejecutivos, generando rentabilidades del 7–10% USD anual.</p>
            <p>El efecto Vaca Muerta no es solo demanda directa: también genera <strong style={{ color: 'var(--foreground)' }}>efecto derrame en servicios, comercio y construcción</strong> que eleva el valor de toda la ciudad. La expansión de la producción de gas para exportación (GNL) proyecta este ciclo hasta al menos 2035.</p>
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
            <Link href="/blog/neuquen-vaca-muerta-propiedades-inversion" className="flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: 'var(--primary)' }}>
              <ChevronRight size={14} /> Neuquén y Vaca Muerta: propiedades e inversión
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
            <Link href="/villa-carlos-paz/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Villa Carlos Paz</Link>
            <Link href="/mar-del-plata/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Mar del Plata</Link>
            <Link href="/tucuman/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Tucumán</Link>
          </div>
        </section>

        <div className="flex flex-wrap gap-4">
          <Link href="/propiedades?ciudad=Neuquén" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--primary)' }}>
            <TrendingUp size={16} /> Ver propiedades en Neuquén
          </Link>
          <Link href="/neuquen" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
            <ArrowLeft size={16} /> Hub Neuquén
          </Link>
        </div>
      </div>
    </div>
  );
}
