import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Database, ChevronRight } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  const path = 'buenos-aires-capital/precio-m2';
  return {
    title: isEn ? 'Price per m² in Buenos Aires 2025 — Data by Neighborhood' : 'Precio m² en Buenos Aires 2025 — Datos por Barrio',
    description: isEn
      ? 'Price per square meter in Buenos Aires (CABA) 2025. USD 1,600–3,500/m² by neighborhood. Palermo, Recoleta, Caballito, Puerto Madero. Real property data.'
      : 'Precio del metro cuadrado en Buenos Aires (CABA) 2025. USD 1.600–3.500/m² según barrio. Palermo, Recoleta, Caballito, Puerto Madero. Datos reales de propiedades en venta.',
    alternates: {
      canonical: `${base}/${isEn ? 'en/' : ''}${path}`,
      languages: { 'es': `${base}/${path}`, 'en': `${base}/en/${path}` },
    },
    openGraph: {
      title: isEn ? 'Price per m² in Buenos Aires 2025' : 'Precio m² en Buenos Aires 2025',
      description: isEn ? 'USD 1,600–3,500/m² by neighborhood in Buenos Aires, Argentina.' : 'USD 1.600–3.500/m² según barrio en Buenos Aires Capital, Argentina.',
      url: `${base}/${isEn ? 'en/' : ''}${path}`,
      type: 'article',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: 'Precio m² Buenos Aires 2025' }],
    },
    twitter: { card: 'summary_large_image' as const, images: [`${base}/opengraph-image`] },
  };
}

export const revalidate = 3600; // ISR: revalida cada 1 hora

const barrios = [
  { barrio: 'Puerto Madero', tipo: 'Departamento', min: 3000, max: 5000, tend: '+18%', nota: 'Máxima liquidez internacional' },
  { barrio: 'Palermo / Soho / Hollywood', tipo: 'Departamento', min: 2500, max: 3400, tend: '+20%', nota: 'El barrio más demandado del país' },
  { barrio: 'Recoleta / Barrio Norte', tipo: 'Departamento', min: 2400, max: 3200, tend: '+17%', nota: 'Clásico premium consolidado' },
  { barrio: 'Núñez / Belgrano', tipo: 'Departamento / PH', min: 2000, max: 2700, tend: '+15%', nota: 'Familiar + profesional' },
  { barrio: 'Caballito / Flores', tipo: 'Departamento', min: 1700, max: 2200, tend: '+14%', nota: 'Mejor cap rate de CABA media' },
  { barrio: 'Villa Urquiza / Devoto', tipo: 'PH / Casa', min: 1600, max: 2100, tend: '+13%', nota: 'Familias y profesionales jóvenes' },
  { barrio: 'Boedo / Parque Patricios', tipo: 'PH / Departamento', min: 1400, max: 1900, tend: '+16%', nota: 'Gentrificación activa' },
  { barrio: 'Villa Lugano / Mataderos', tipo: 'PH / Casa', min: 900, max: 1400, tend: '+10%', nota: 'Valor de entrada' },
];

const faqs = [
  { q: '¿Cuánto vale el m² en Buenos Aires en 2025?', a: 'El precio en CABA varía entre USD 1.400/m² en zonas del sur (Lugano, Mataderos) y USD 5.000/m² en Puerto Madero. El promedio general de CABA es USD 2.200–2.500/m². Palermo (el barrio más demandado) cotiza USD 2.500–3.400/m².' },
  { q: '¿Es buen momento para comprar en Buenos Aires?', a: 'Sí. Después del piso de 2020–2022, los precios en dólares acumularon aumentos del 13–20% según el barrio entre 2022 y 2025. Los valores todavía están entre un 20–30% por debajo del pico histórico de 2018, lo que implica que hay recorrido alcista en los barrios más demandados.' },
  { q: '¿Qué barrio de CABA tiene mejor rentabilidad?', a: 'Para cap rate (alquiler convencional), Caballito y Flores ofrecen los mejores números: precios de entrada accesibles (USD 1.700–2.200/m²) con demanda de alquiler muy alta. Para turístico (Airbnb), Palermo y San Telmo ofrecen cap rates del 6–9% USD en departamentos bien ubicados y terminados.' },
];

async function getMutadeData() {
  try {
    await connectDB();
    const result = await Property.aggregate([
      { $match: { published: true, ciudad: { $in: ['Buenos Aires', 'CABA', 'Capital Federal', 'Ciudad Autónoma de Buenos Aires'] }, currency: 'USD', superficie_cubierta: { $gt: 15 } } },
      { $addFields: { precioM2: { $divide: ['$price', '$superficie_cubierta'] } } },
      { $match: { precioM2: { $gt: 500, $lt: 15000 } } },
      { $group: { _id: '$type', avgM2: { $avg: '$precioM2' }, avgPrice: { $avg: '$price' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return result as { _id: string; avgM2: number; avgPrice: number; count: number }[];
  } catch { return []; }
}

export default async function BuenosAiresPrecioM2Page() {
  const mudate = await getMutadeData();
  const total = mudate.reduce((s, r) => s + r.count, 0);

  return (
    <div style={{ background: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', '@id': 'https://mudateargentina.com/buenos-aires-capital/precio-m2#article', headline: 'Precio m² en Buenos Aires (CABA) 2025', datePublished: '2025-09-01', dateModified: new Date().toISOString().slice(0, 10), author: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' }, publisher: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' }, url: 'https://mudateargentina.com/buenos-aires-capital/precio-m2' }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' }, { '@type': 'ListItem', position: 2, name: 'Buenos Aires Capital', item: 'https://mudateargentina.com/buenos-aires-capital' }, { '@type': 'ListItem', position: 3, name: 'Precio m² en Buenos Aires', item: 'https://mudateargentina.com/buenos-aires-capital/precio-m2' }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Dataset', name: 'Precio m² Buenos Aires CABA 2025', description: 'Precio del metro cuadrado en USD por barrio en Buenos Aires (CABA), Argentina.', creator: { '@type': 'Organization', name: 'Mudate' }, dateModified: new Date().toISOString().slice(0, 10), spatialCoverage: { '@type': 'Place', name: 'Buenos Aires, CABA, Argentina' } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />

      <div style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 60%, #0D3424 100%)' }} className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <Link href="/buenos-aires-capital" className="hover:text-white transition-colors">Buenos Aires</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Precio m²</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: 'var(--accent)' }}>Datos 2025</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Actualizado: {new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Precio m² en Buenos Aires 2025
          </h1>
          <p className="text-lg text-white/70 font-light max-w-xl">
            El mercado inmobiliario más líquido de Argentina. Datos reales de precio por barrio en CABA, desde Palermo hasta Puerto Madero.
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
          <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Precio m² por barrio en Buenos Aires (CABA)</h2>
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
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>CABA vs. el interior: ¿dónde comprar en 2025?</h2>
          <div style={{ color: 'var(--muted-foreground)', lineHeight: 1.8, fontSize: '0.92rem' }}>
            <p className="mb-4">Buenos Aires sigue siendo el mercado más líquido de Argentina —las propiedades bien ubicadas en Palermo, Recoleta o Belgrano se venden en semanas, no meses. Esta liquidez tiene un precio: el cap rate de alquiler en CABA (3–5% USD) es el más bajo del país porque los valores de entrada son muy altos.</p>
            <p className="mb-4">La estrategia que más popularidad ganó entre 2022 y 2025 es <strong style={{ color: 'var(--foreground)' }}>vender en CABA y comprar en el interior</strong>: con lo que vale un departamento 3 ambientes en Palermo (USD 200.000–250.000) se pueden comprar 2–3 departamentos en Rosario, Córdoba o Mendoza, generando una renta total muy superior. La diferencia de liquidez se compensó con la mejora en cap rate.</p>
            <p><strong style={{ color: 'var(--foreground)' }}>Boedo y Parque Patricios</strong> son las zonas con mayor potencial de apreciación dentro de CABA: precios todavía por debajo del promedio porteño, cercanía al polo tecnológico de Parque Patricios (Mercado Libre, Google, Despegar tienen oficinas allí) y proceso de gentrificación en curso. El diferencial con Caballito, que ya está consolidado, debería cerrarse en los próximos años.</p>
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
            <Link href="/blog/mercado-inmobiliario-buenos-aires-2025" className="flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: 'var(--primary)' }}>
              <ChevronRight size={14} /> Mercado inmobiliario de Buenos Aires 2025
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
          <Link href="/propiedades?ciudad=Buenos+Aires" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--primary)' }}>
            <TrendingUp size={16} /> Ver propiedades en Buenos Aires
          </Link>
          <Link href="/buenos-aires-capital" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
            <ArrowLeft size={16} /> Hub Buenos Aires
          </Link>
        </div>
      </div>
    </div>
  );
}
