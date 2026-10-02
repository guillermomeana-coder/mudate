import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Database, ChevronRight } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  const path = 'tucuman/precio-m2';
  return {
    title: isEn ? 'Price per m² in Tucumán 2025 — Updated Data by Neighborhood' : 'Precio m² en Tucumán 2025 — Datos Actualizados por Barrio',
    description: isEn
      ? 'Price per square meter in Tucumán Capital 2025. USD 800–1,400/m² by neighborhood. Yerba Buena, Norte, Centro. University market and cap rate 6–8% USD.'
      : 'Precio del metro cuadrado en Tucumán Capital 2025. USD 800–1.400/m² según barrio. Yerba Buena, Norte, Centro. Mercado universitario y cap rate 6–8% USD.',
    keywords: isEn
      ? ['price per m2 Tucumán', 'square meter price Tucumán', 'apartment price Tucumán', 'real estate Tucumán Argentina 2025']
      : ['precio m2 Tucumán', 'valor metro cuadrado Tucumán', 'precio departamento Tucumán', 'precio m2 barrios Tucumán 2025'],
    alternates: {
      canonical: `${base}/${isEn ? 'en/' : ''}${path}`,
      languages: { 'es': `${base}/${path}`, 'en': `${base}/en/${path}`, 'x-default': `${base}/${path}` },
    },
    openGraph: {
      title: isEn ? 'Price per m² in Tucumán 2025' : 'Precio m² en Tucumán 2025',
      description: isEn ? 'USD 800–1,400/m² by neighborhood in Tucumán Capital, Argentina.' : 'USD 800–1.400/m² según barrio en Tucumán Capital, Argentina.',
      url: `${base}/${isEn ? 'en/' : ''}${path}`,
      siteName: 'Mudate Argentina',
      type: 'article',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: 'Precio m² Tucumán 2025' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: isEn ? 'Price per m² in Tucumán 2025' : 'Precio m² en Tucumán 2025',
      description: isEn ? 'USD 800–1,400/m² by neighborhood in Tucumán Capital, Argentina.' : 'USD 800–1.400/m² según barrio en Tucumán Capital, Argentina.',
      images: [`${base}/opengraph-image`],
    },
  };
}

export const revalidate = 3600; // ISR: revalida cada 1 hora

const barrios = [
  { barrio: 'Yerba Buena', tipo: 'Casa / Casa en barrio', min: 1100, max: 1500, tend: '+18%', nota: 'Premium residencial serrano' },
  { barrio: 'Norte (Av. Mitre y alreded.)', tipo: 'Departamento', min: 900, max: 1200, tend: '+16%', nota: 'Profesionales y universitarios' },
  { barrio: 'Centro', tipo: 'Departamento', min: 850, max: 1150, tend: '+14%', nota: 'Alta liquidez, mix comercial' },
  { barrio: 'San Cayetano / La Ranchería', tipo: 'Casa', min: 750, max: 1000, tend: '+12%', nota: 'Residencial familiar' },
  { barrio: 'Las Talitas', tipo: 'Casa / Terreno', min: 500, max: 800, tend: '+9%', nota: 'Expansión norte accesible' },
  { barrio: 'Banda del Río Salí', tipo: 'Casa', min: 450, max: 750, tend: '+8%', nota: 'Conurbano accesible' },
];

const faqs = [
  { q: '¿Cuánto vale el m² en Tucumán en 2025?', a: 'El precio promedio en Tucumán Capital es USD 850–1.200/m² para departamentos. Yerba Buena, el barrio más exclusivo (casas en countries y barrios privados al pie del cerro), supera USD 1.100–1.500/m². Es uno de los mercados con mejor relación precio-calidad de vida de Argentina.' },
  { q: '¿Cuál es el mejor barrio para invertir en Tucumán?', a: 'Yerba Buena para residencial premium (mayor apreciación, estilo de vida, demanda de ejecutivos y profesionales). Zona Norte de la capital para rentabilidad por alquiler (demanda universitaria de la UNT + UUNT, cap rate 6–8% USD). Centro para mayor liquidez en la venta.' },
  { q: '¿Qué cap rate tiene Tucumán para alquiler?', a: 'Un departamento 2 ambientes en zona universitaria (USD 55.000–70.000) genera USD 400–550/mes en alquiler permanente, equivalente a un cap rate bruto del 7–9% USD. La demanda universitaria es la más estable del mercado: la UNT tiene más de 80.000 estudiantes activos.' },
];

async function getMutadeData() {
  try {
    await connectDB();
    const result = await Property.aggregate([
      { $match: { published: true, ciudad: { $in: ['Tucumán', 'San Miguel de Tucumán', 'Tucuman'] }, currency: 'USD', superficie_cubierta: { $gt: 15 } } },
      { $addFields: { precioM2: { $divide: ['$price', '$superficie_cubierta'] } } },
      { $match: { precioM2: { $gt: 100, $lt: 4000 } } },
      { $group: { _id: '$type', avgM2: { $avg: '$precioM2' }, avgPrice: { $avg: '$price' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return result as { _id: string; avgM2: number; avgPrice: number; count: number }[];
  } catch { return []; }
}

export default async function TucumanPrecioM2Page() {
  const mudate = await getMutadeData();
  const total = mudate.reduce((s, r) => s + r.count, 0);

  return (
    <div style={{ background: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', '@id': 'https://mudateargentina.com/tucuman/precio-m2#article', headline: 'Precio m² en Tucumán 2025', datePublished: '2025-09-01', dateModified: new Date().toISOString().slice(0, 10), author: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' }, publisher: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' }, url: 'https://mudateargentina.com/tucuman/precio-m2' }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' }, { '@type': 'ListItem', position: 2, name: 'Tucumán', item: 'https://mudateargentina.com/tucuman' }, { '@type': 'ListItem', position: 3, name: 'Precio m² en Tucumán', item: 'https://mudateargentina.com/tucuman/precio-m2' }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Dataset', name: 'Precio m² Tucumán 2025', description: 'Precio del metro cuadrado en USD por barrio en Tucumán Capital, Argentina.', creator: { '@type': 'Organization', name: 'Mudate' }, dateModified: new Date().toISOString().slice(0, 10), spatialCoverage: { '@type': 'Place', name: 'San Miguel de Tucumán, Argentina' } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />

      <div style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 60%, #0D3424 100%)' }} className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <Link href="/tucuman" className="hover:text-white transition-colors">Tucumán</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Precio m²</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: 'var(--accent)' }}>Datos 2025</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Actualizado: {new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Precio m² en Tucumán 2025
          </h1>
          <p className="text-lg text-white/70 font-light max-w-xl">
            El mercado con el mejor cap rate universitario del NOA. Datos de precio por barrio en Tucumán Capital y Yerba Buena.
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
          <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Precio m² por barrio en Tucumán</h2>
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
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Tucumán: el mercado de entrada con upside real</h2>
          <div style={{ color: 'var(--muted-foreground)', lineHeight: 1.8, fontSize: '0.92rem' }}>
            <p className="mb-4">Tucumán tiene el precio de entrada más bajo de las 10 ciudades que cubre Mudate, pero también uno de los mejores cap rates. La razón es la <strong style={{ color: 'var(--foreground)' }}>densidad universitaria</strong>: la UNT, con 80.000+ estudiantes, genera una demanda de alquiler captiva que mantiene las vacantes en niveles mínimos durante todo el año.</p>
            <p className="mb-4"><strong style={{ color: 'var(--foreground)' }}>Yerba Buena</strong> es la contracara premium: un municipio autónomo contiguo a la capital con un estilo de vida completamente diferente (calles arboladas, bares, country clubs, cerro San Javier a 20 minutos). Los precios de casas en barrios privados (USD 150.000–400.000) son una fracción de lo equivalente en Pilar o Nordelta.</p>
            <p>El principal catalizador de apreciación a futuro es el <strong style={{ color: 'var(--foreground)' }}>sector tecnológico</strong>: Tucumán tiene la mayor concentración de desarrolladores de software per cápita del NOA y un parque tecnológico (PTEC) que atrae empresas y aumenta la demanda de alquiler corporativo.</p>
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
            <Link href="/blog/invertir-tucuman-argentina-mercado-universitario" className="flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: 'var(--primary)' }}>
              <ChevronRight size={14} /> Invertir en Tucumán: mercado universitario
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
            <Link href="/mar-del-plata/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Mar del Plata</Link>
          </div>
        </section>

        <div className="flex flex-wrap gap-4">
          <Link href="/propiedades?ciudad=Tucumán" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--primary)' }}>
            <TrendingUp size={16} /> Ver propiedades en Tucumán
          </Link>
          <Link href="/tucuman" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
            <ArrowLeft size={16} /> Hub Tucumán
          </Link>
        </div>
      </div>
    </div>
  );
}
