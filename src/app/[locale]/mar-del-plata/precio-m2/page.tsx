import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Database, ChevronRight } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  const path = 'mar-del-plata/precio-m2';
  return {
    title: isEn ? 'Price per m² in Mar del Plata 2025 — Data by Neighborhood' : 'Precio m² en Mar del Plata 2025 — Datos por Barrio',
    description: isEn
      ? 'Price per square meter in Mar del Plata 2025. USD 1,200–2,200/m² by neighborhood. Los Troncos, Punta Mogotes, North, Centro. Tourism cap rate 6–9% USD.'
      : 'Precio del metro cuadrado en Mar del Plata 2025. USD 1.200–2.200/m² según barrio. Los Troncos, Punta Mogotes, North, Centro. Cap rate turístico 6–9% USD.',
    keywords: isEn
      ? ['price per m2 Mar del Plata', 'square meter price Mar del Plata', 'apartment price Mar del Plata', 'real estate Mar del Plata 2025']
      : ['precio m2 Mar del Plata', 'valor metro cuadrado Mar del Plata', 'precio departamento Mar del Plata', 'precio m2 barrios Mar del Plata 2025'],
    alternates: {
      canonical: `${base}/${isEn ? 'en/' : ''}${path}`,
      languages: { 'es': `${base}/${path}`, 'en': `${base}/en/${path}`, 'x-default': `${base}/${path}` },
    },
    openGraph: {
      title: isEn ? 'Price per m² in Mar del Plata 2025' : 'Precio m² en Mar del Plata 2025',
      description: isEn ? 'USD 1,200–2,200/m² by neighborhood in Mar del Plata, Argentina.' : 'USD 1.200–2.200/m² según barrio en Mar del Plata, Argentina.',
      url: `${base}/${isEn ? 'en/' : ''}${path}`,
      siteName: 'Mudate Argentina',
      type: 'article',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: 'Precio m² Mar del Plata 2025' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: isEn ? 'Price per m² in Mar del Plata 2025' : 'Precio m² en Mar del Plata 2025',
      description: isEn ? 'USD 1,200–2,200/m² by neighborhood in Mar del Plata, Argentina.' : 'USD 1.200–2.200/m² según barrio en Mar del Plata, Argentina.',
      images: [`${base}/opengraph-image`],
    },
  };
}

export const revalidate = 3600; // ISR: revalida cada 1 hora

const barrios = [
  { barrio: 'Los Troncos', tipo: 'Casa / Chalet', min: 1800, max: 2500, tend: '+22%', nota: 'Histórico premium costero' },
  { barrio: 'Punta Mogotes', tipo: 'Departamento', min: 1500, max: 2000, tend: '+20%', nota: 'Frente al mar, balnearios' },
  { barrio: 'North / Güemes', tipo: 'Departamento', min: 1400, max: 1900, tend: '+18%', nota: 'Zona nueva en auge' },
  { barrio: 'Centro', tipo: 'Departamento', min: 1300, max: 1700, tend: '+15%', nota: 'Alta liquidez' },
  { barrio: 'Playa Grande', tipo: 'Departamento / PH', min: 1400, max: 1900, tend: '+16%', nota: 'Casino y Costa' },
  { barrio: 'Camet / Punta Iglesia', tipo: 'Casa', min: 1100, max: 1600, tend: '+14%', nota: 'Residencial norte' },
  { barrio: 'Batán / Periferia', tipo: 'Casa / Terreno', min: 500, max: 900, tend: '+8%', nota: 'Acceso económico' },
];

const faqs = [
  { q: '¿Cuánto vale el m² en Mar del Plata en 2025?', a: 'El precio promedio en Mar del Plata es USD 1.300–1.700/m² para departamentos. Los Troncos (el barrio histórico premium) supera USD 1.800–2.500/m². North y Punta Mogotes, las zonas de mayor crecimiento, cotizan USD 1.400–2.000/m².' },
  { q: '¿Conviene invertir para alquiler turístico en Mar del Plata?', a: 'Sí, especialmente en la franja costera (Punta Mogotes, Playa Grande, North). Un departamento de 2 ambientes bien ubicado (USD 80.000–100.000) puede generar USD 6.000–9.000 anuales con temporada alta de verano más fines de semana largos, equivalente a un cap rate del 6–9% USD bruto.' },
  { q: '¿Cuál es el mejor barrio para comprar en Mar del Plata?', a: 'Para apreciación a largo plazo: Los Troncos (oferta histórica limitada, demanda premium sostenida). Para cap rate turístico: Punta Mogotes y North (frente al mar, alta demanda vacacional). Para primera vivienda: Centro ofrece la mejor relación precio-servicios.' },
];

async function getMutadeData() {
  try {
    await connectDB();
    const result = await Property.aggregate([
      { $match: { published: true, ciudad: { $in: ['Mar del Plata', 'Mar Del Plata'] }, currency: 'USD', superficie_cubierta: { $gt: 15 } } },
      { $addFields: { precioM2: { $divide: ['$price', '$superficie_cubierta'] } } },
      { $match: { precioM2: { $gt: 200, $lt: 8000 } } },
      { $group: { _id: '$type', avgM2: { $avg: '$precioM2' }, avgPrice: { $avg: '$price' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return result as { _id: string; avgM2: number; avgPrice: number; count: number }[];
  } catch { return []; }
}

export default async function MarDelPlataPrecioM2Page() {
  const mudate = await getMutadeData();
  const total = mudate.reduce((s, r) => s + r.count, 0);

  return (
    <div style={{ background: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', '@id': 'https://mudateargentina.com/mar-del-plata/precio-m2#article', headline: 'Precio m² en Mar del Plata 2025', datePublished: '2025-09-01', dateModified: new Date().toISOString().slice(0, 10), author: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' }, publisher: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' }, url: 'https://mudateargentina.com/mar-del-plata/precio-m2' }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' }, { '@type': 'ListItem', position: 2, name: 'Mar del Plata', item: 'https://mudateargentina.com/mar-del-plata' }, { '@type': 'ListItem', position: 3, name: 'Precio m² en Mar del Plata', item: 'https://mudateargentina.com/mar-del-plata/precio-m2' }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Dataset', name: 'Precio m² Mar del Plata 2025', description: 'Precio del metro cuadrado en USD por barrio en Mar del Plata, Buenos Aires, Argentina.', creator: { '@type': 'Organization', name: 'Mudate' }, dateModified: new Date().toISOString().slice(0, 10), spatialCoverage: { '@type': 'Place', name: 'Mar del Plata, Buenos Aires, Argentina' } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />

      <div style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 60%, #0D3424 100%)' }} className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <Link href="/mar-del-plata" className="hover:text-white transition-colors">Mar del Plata</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Precio m²</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: 'var(--accent)' }}>Datos 2025</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Actualizado: {new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Precio m² en Mar del Plata 2025
          </h1>
          <p className="text-lg text-white/70 font-light max-w-xl">
            El destino costero más importante de Argentina. Datos de precio por barrio, cap rate turístico y análisis de Los Troncos a North.
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
          <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Precio m² por barrio en Mar del Plata</h2>
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
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Por qué Mar del Plata sigue siendo el activo costero por excelencia</h2>
          <div style={{ color: 'var(--muted-foreground)', lineHeight: 1.8, fontSize: '0.92rem' }}>
            <p className="mb-4">Mar del Plata recibe más de <strong style={{ color: 'var(--foreground)' }}>8 millones de turistas anuales</strong> —más que cualquier otro destino costero de Argentina y la mayoría de los de Sudamérica. Esta masa de visitantes genera una demanda de alquiler turístico que satura la oferta cada verano, dando al propietario una posición de poder en la negociación de precios.</p>
            <p className="mb-4">La estructura de la ciudad favorece la inversión: el frente costero tiene oferta limitada y demanda infinitamente renovable. <strong style={{ color: 'var(--foreground)' }}>North y Güemes</strong> son los barrios que más crecen: desarrollos nuevos frente al mar, perfil de comprador más joven y precios todavía un 15–20% por debajo de Los Troncos.</p>
            <p>El mercado residencial permanente (estudiantes universitarios, profesionales, jubilados de CABA) es el colchón que sostiene los valores fuera de temporada. La <strong style={{ color: 'var(--foreground)' }}>distancia a Buenos Aires (400 km, vuelo 45 min)</strong> hace de Mar del Plata una segunda residencia natural para la clase media alta porteña.</p>
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
            <Link href="/blog/propiedades-mar-del-plata-inversion-vacacional" className="flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: 'var(--primary)' }}>
              <ChevronRight size={14} /> Propiedades en Mar del Plata: inversión vacacional
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
            <Link href="/villa-carlos-paz/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Villa Carlos Paz</Link>
            <Link href="/tucuman/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Tucumán</Link>
          </div>
        </section>

        <div className="flex flex-wrap gap-4">
          <Link href="/propiedades?ciudad=Mar+del+Plata" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--primary)' }}>
            <TrendingUp size={16} /> Ver propiedades en Mar del Plata
          </Link>
          <Link href="/mar-del-plata" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
            <ArrowLeft size={16} /> Hub Mar del Plata
          </Link>
        </div>
      </div>
    </div>
  );
}
