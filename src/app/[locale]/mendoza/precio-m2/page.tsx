import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Database, ChevronRight } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  const path = 'mendoza/precio-m2';
  return {
    title: isEn ? 'Price per m² in Mendoza 2025 — Updated Data by Zone' : 'Precio m² en Mendoza 2025 — Datos Actualizados por Barrio',
    description: isEn
      ? 'Price per square meter in Mendoza 2025. USD 1,200–2,200/m² by zone. Chacras de Coria, Luján de Cuyo, Quinta Sección. Wineries, estates and premium residential.'
      : 'Precio del metro cuadrado en Mendoza 2025. USD 1.200–2.200/m² según zona. Chacras de Coria, Luján de Cuyo, Quinta Sección. Fincas, bodegas y residencial premium.',
    keywords: isEn
      ? ['price per m2 Mendoza', 'square meter price Mendoza', 'apartment price Mendoza', 'real estate Mendoza Argentina 2025']
      : ['precio m2 Mendoza', 'valor metro cuadrado Mendoza', 'precio departamento Mendoza', 'precio m2 barrios Mendoza 2025'],
    alternates: {
      canonical: `${base}/${isEn ? 'en/' : ''}${path}`,
      languages: { 'es': `${base}/${path}`, 'en': `${base}/en/${path}`, 'x-default': `${base}/${path}` },
    },
    openGraph: {
      title: isEn ? 'Price per m² in Mendoza 2025' : 'Precio m² en Mendoza 2025',
      description: isEn ? 'USD 1,200–2,200/m² by zone in Mendoza, Argentina.' : 'USD 1.200–2.200/m² según zona en Mendoza, Argentina.',
      url: `${base}/${isEn ? 'en/' : ''}${path}`,
      siteName: 'Mudate Argentina',
      type: 'article',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: 'Precio m² Mendoza 2025' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: isEn ? 'Price per m² in Mendoza 2025' : 'Precio m² en Mendoza 2025',
      description: isEn ? 'USD 1,200–2,200/m² by zone in Mendoza, Argentina.' : 'USD 1.200–2.200/m² según zona en Mendoza, Argentina.',
      images: [`${base}/opengraph-image`],
    },
  };
}

export const revalidate = 3600; // ISR: revalida cada 1 hora

const barrios = [
  { barrio: 'Chacras de Coria', tipo: 'Casa / Finca', min: 1800, max: 2500, tend: '+22%', nota: 'Lujo vitivinícola' },
  { barrio: 'Luján de Cuyo', tipo: 'Casa / Finca', min: 1500, max: 2200, tend: '+20%', nota: 'Corazón del Malbec' },
  { barrio: 'Quinta Sección', tipo: 'Departamento', min: 1400, max: 1800, tend: '+19%', nota: 'Arbolado premium' },
  { barrio: 'Godoy Cruz', tipo: 'Departamento', min: 1200, max: 1600, tend: '+16%', nota: 'Urbano consolidado' },
  { barrio: 'Guaymallén', tipo: 'Casa', min: 950, max: 1300, tend: '+12%', nota: 'Gran Mendoza accesible' },
  { barrio: 'Maipú', tipo: 'Casa / Terreno', min: 800, max: 1200, tend: '+11%', nota: 'Zona vitivinícola' },
  { barrio: 'Valle de Uco', tipo: 'Finca / Terreno', min: 500, max: 1500, tend: '+18%', nota: 'Apreciación turística' },
];

const faqs = [
  { q: '¿Cuánto vale el m² en Mendoza en 2025?', a: 'El precio en Mendoza varía considerablemente según la zona. La Quinta Sección y Godoy Cruz cotizan USD 1.200–1.800/m². Chacras de Coria y Luján de Cuyo (con fincas y bodegas) superan USD 1.800–2.500/m². El Valle de Uco es el mercado con mayor potencial de apreciación para inversión a largo plazo.' },
  { q: '¿Conviene invertir en fincas o bodegas en Mendoza?', a: 'Las fincas pequeñas (5–30 Ha) en Luján de Cuyo y Valle de Uco pueden generar rentabilidades del 6–9% USD entre agroturismo y producción vitivinícola. Son activos que atraen compradores internacionales, lo que sostiene los precios en USD incluso durante crisis locales.' },
  { q: '¿Qué barrio de Mendoza tiene mayor apreciación?', a: 'Chacras de Coria acumula la mayor apreciación histórica (+22% en 2 años), seguida por Luján de Cuyo (+20%). Ambas zonas tienen demanda creciente de compradores con perfil internacional (especialmente de EE.UU. y Europa) que buscan el estilo de vida vitivinícola.' },
];

async function getMutadeData() {
  try {
    await connectDB();
    const result = await Property.aggregate([
      { $match: { published: true, ciudad: 'Mendoza', currency: 'USD', superficie_cubierta: { $gt: 15 } } },
      { $addFields: { precioM2: { $divide: ['$price', '$superficie_cubierta'] } } },
      { $match: { precioM2: { $gt: 200, $lt: 8000 } } },
      { $group: { _id: '$type', avgM2: { $avg: '$precioM2' }, avgPrice: { $avg: '$price' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return result as { _id: string; avgM2: number; avgPrice: number; count: number }[];
  } catch { return []; }
}

export default async function MendozaPrecioM2Page() {
  const mudate = await getMutadeData();
  const total = mudate.reduce((s, r) => s + r.count, 0);

  return (
    <div style={{ background: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', '@id': 'https://mudateargentina.com/mendoza/precio-m2#article', headline: 'Precio m² en Mendoza 2025', datePublished: '2025-09-01', dateModified: new Date().toISOString().slice(0, 10), author: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' }, publisher: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' }, url: 'https://mudateargentina.com/mendoza/precio-m2' }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' }, { '@type': 'ListItem', position: 2, name: 'Mendoza', item: 'https://mudateargentina.com/mendoza' }, { '@type': 'ListItem', position: 3, name: 'Precio m² en Mendoza', item: 'https://mudateargentina.com/mendoza/precio-m2' }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Dataset', name: 'Precio m² Mendoza 2025', description: 'Precio del metro cuadrado en USD por barrio en Mendoza, Argentina.', creator: { '@type': 'Organization', name: 'Mudate' }, dateModified: new Date().toISOString().slice(0, 10), spatialCoverage: { '@type': 'Place', name: 'Mendoza, Argentina' } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />

      <div style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 60%, #0D3424 100%)' }} className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <Link href="/mendoza" className="hover:text-white transition-colors">Mendoza</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Precio m²</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: 'var(--accent)' }}>Datos 2025</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Actualizado: {new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Precio m² en Mendoza 2025
          </h1>
          <p className="text-lg text-white/70 font-light max-w-xl">
            Fincas, bodegas y residencial premium. Datos de precio por barrio en la capital del Malbec argentino.
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
          <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Precio m² por zona en Mendoza</h2>
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
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Por qué el m² de Mendoza atrae compradores internacionales</h2>
          <div style={{ color: 'var(--muted-foreground)', lineHeight: 1.8, fontSize: '0.92rem' }}>
            <p className="mb-4">Mendoza es el único mercado inmobiliario argentino que compite directamente con destinos como Napa Valley (EE.UU.) o la Toscana (Italia) en el segmento de <strong style={{ color: 'var(--foreground)' }}>lifestyle vitivinícola premium</strong>. Una finca con viñedo en Luján de Cuyo a USD 800.000–2.000.000 es una fracción del precio de una propiedad comparable en California o el sur de Francia.</p>
            <p className="mb-4">El <strong style={{ color: 'var(--foreground)' }}>Valle de Uco</strong> (Tupungato, Tunuyán, San Carlos) es la zona con mayor proyección: altitudes de 900–1.200 msnm, condiciones excepcionales para el Malbec de alta gama, y precios de suelo todavía accesibles comparados con Luján de Cuyo. Los grandes grupos vitivinícolas (Zuccardi, Catena, Pulenta) consolidaron la zona y atrajeron turismo enológico de primer nivel.</p>
            <p>Para residencial urbano, la <strong style={{ color: 'var(--foreground)' }}>Quinta Sección</strong> de la ciudad capital es el Palermo mendocino: arbolado histórico, cafeterías, gastronomía y alta densidad de alquiler turístico que sostiene rentabilidades del 6–8% USD anual.</p>
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
            <Link href="/blog/propiedades-mendoza-inversion-vino-andes" className="flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: 'var(--primary)' }}>
              <ChevronRight size={14} /> Propiedades en Mendoza: inversión, vino y Andes
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
            <Link href="/bariloche/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Bariloche</Link>
            <Link href="/salta/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Salta</Link>
            <Link href="/neuquen/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Neuquén</Link>
            <Link href="/villa-carlos-paz/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Villa Carlos Paz</Link>
            <Link href="/mar-del-plata/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Mar del Plata</Link>
            <Link href="/tucuman/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Tucumán</Link>
          </div>
        </section>

        <div className="flex flex-wrap gap-4">
          <Link href="/propiedades?ciudad=Mendoza" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--primary)' }}>
            <TrendingUp size={16} /> Ver propiedades en Mendoza
          </Link>
          <Link href="/mendoza" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
            <ArrowLeft size={16} /> Hub Mendoza
          </Link>
        </div>
      </div>
    </div>
  );
}
