import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Database, ChevronRight } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const base = 'https://mudateargentina.com';
  const path = 'villa-maria/precio-m2';
  return {
    title: isEn
      ? 'Price per m² in Villa María 2025 — Data by Neighborhood'
      : 'Precio m² en Villa María 2025 — Datos por Barrio',
    description: isEn
      ? 'Price per square meter in Villa María, Córdoba 2025. USD 750–1,100/m² by neighborhood. Centro, Palermo, Residencial Norte. Best cap rates in the province at 6.5–7.5% USD.'
      : 'Precio del metro cuadrado en Villa María, Córdoba 2025. USD 750–1.100/m² según barrio. Centro, Palermo, Residencial Norte. Mejores cap rates de la provincia: 6.5–7.5% USD.',
    keywords: isEn
      ? ['price per m2 Villa María', 'square meter price Villa María Córdoba', 'apartment price Villa María', 'real estate Villa María 2025', 'invest Villa María Argentina']
      : ['precio m2 Villa María', 'valor metro cuadrado Villa María', 'precio departamento Villa María', 'precio m2 barrios Villa María 2025', 'invertir Villa María Córdoba'],
    alternates: {
      canonical: `${base}/${isEn ? 'en/' : ''}${path}`,
      languages: {
        'es': `${base}/${path}`,
        'en': `${base}/en/${path}`,
        'x-default': `${base}/${path}`,
      },
    },
    openGraph: {
      title: isEn ? 'Price per m² in Villa María 2025' : 'Precio m² en Villa María 2025',
      description: isEn
        ? 'USD 750–1,100/m² by neighborhood in Villa María, Córdoba, Argentina.'
        : 'USD 750–1.100/m² según barrio en Villa María, Córdoba, Argentina.',
      url: `${base}/${isEn ? 'en/' : ''}${path}`,
      siteName: 'Mudate Argentina',
      type: 'article',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: 'Precio m² Villa María 2025' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: isEn ? 'Price per m² in Villa María 2025' : 'Precio m² en Villa María 2025',
      description: isEn
        ? 'USD 750–1,100/m² by neighborhood in Villa María, Córdoba, Argentina.'
        : 'USD 750–1.100/m² según barrio en Villa María, Córdoba, Argentina.',
      images: [`${base}/opengraph-image`],
    },
  };
}

export const revalidate = 3600; // ISR: revalida cada 1 hora

const barrios = [
  { barrio: 'Centro', tipo: 'Departamento', min: 900, max: 1100, tend: '+15%', nota: 'Mayor demanda, vacancia mínima' },
  { barrio: 'Palermo', tipo: 'Departamento', min: 850, max: 1050, tend: '+14%', nota: 'Barrio universitario UNVM' },
  { barrio: 'Residencial Norte', tipo: 'Casa', min: 800, max: 1000, tend: '+12%', nota: 'Zona familiar consolidada' },
  { barrio: 'Barrio Nuevo', tipo: 'Casa / Terreno', min: 750, max: 950, tend: '+13%', nota: 'Desarrollo moderno en expansión' },
  { barrio: 'Villa del Parque', tipo: 'Casa', min: 700, max: 900, tend: '+10%', nota: 'Perfil residencial tranquilo' },
  { barrio: 'San Martín', tipo: 'Departamento / Casa', min: 750, max: 950, tend: '+11%', nota: 'Buena conectividad al centro' },
  { barrio: 'Zona Sur', tipo: 'Casa', min: 650, max: 850, tend: '+9%', nota: 'Mercado accesible, creciente' },
];

const faqs = [
  {
    q: '¿Cuánto vale el m² en Villa María en 2025?',
    a: 'El precio promedio en Villa María es USD 750–1.100/m² para departamentos. El Centro y Palermo (zona universitaria UNVM) cotizan entre USD 900 y USD 1.100/m². Las zonas residenciales como Norte y Barrio Nuevo oscilan entre USD 750 y USD 1.000/m². Esto representa un 40% menos que Córdoba Capital en condiciones equivalentes.',
  },
  {
    q: '¿Por qué Villa María tiene los mejores cap rates de Córdoba provincia?',
    a: 'Villa María combina precios de inmuebles significativamente más bajos que la capital con una demanda de alquiler robusta y estructural. Los 15.000 estudiantes de la UNVM generan vacancia casi nula en el Centro y Palermo. Un departamento 2 ambientes de USD 65.000–75.000 genera USD 380–500/mes en alquiler, un cap rate de 6.5–7.5% USD que supera ampliamente al de Córdoba Capital (4.5–5.5%) y a Buenos Aires.',
  },
  {
    q: '¿Cuáles son los mejores barrios para invertir en Villa María?',
    a: 'Para renta universitaria: Centro y Palermo, con la mayor rotación y menor vacancia. Para valorización a largo plazo: Residencial Norte y Barrio Nuevo, con proyectos de infraestructura en curso. Para primera vivienda: Zona Sur y Villa del Parque, donde el metro cuadrado más accesible permite acceder al mercado con menor inversión inicial.',
  },
];

async function getMutadeData() {
  try {
    await connectDB();
    const result = await Property.aggregate([
      {
        $match: {
          published: true,
          ciudad: { $in: ['Villa María', 'Villa Maria', 'villa maría', 'villa maria'] },
          currency: 'USD',
          superficie_cubierta: { $gt: 15 },
        },
      },
      { $addFields: { precioM2: { $divide: ['$price', '$superficie_cubierta'] } } },
      { $match: { precioM2: { $gt: 200, $lt: 5000 } } },
      {
        $group: {
          _id: '$type',
          avgM2: { $avg: '$precioM2' },
          avgPrice: { $avg: '$price' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    return result as { _id: string; avgM2: number; avgPrice: number; count: number }[];
  } catch {
    return [];
  }
}

export default async function VillaMaríaPrecioM2Page() {
  const mudate = await getMutadeData();
  const total = mudate.reduce((s, r) => s + r.count, 0);

  return (
    <div style={{ background: 'var(--background)' }}>
      {/* Article schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            '@id': 'https://mudateargentina.com/villa-maria/precio-m2#article',
            headline: 'Precio m² en Villa María 2025',
            datePublished: '2025-09-01',
            dateModified: new Date().toISOString().slice(0, 10),
            author: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' },
            publisher: { '@type': 'Organization', name: 'Mudate', url: 'https://mudateargentina.com' },
            url: 'https://mudateargentina.com/villa-maria/precio-m2',
          }),
        }}
      />
      {/* BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://mudateargentina.com' },
              { '@type': 'ListItem', position: 2, name: 'Villa María', item: 'https://mudateargentina.com/villa-maria' },
              { '@type': 'ListItem', position: 3, name: 'Precio m² en Villa María', item: 'https://mudateargentina.com/villa-maria/precio-m2' },
            ],
          }),
        }}
      />
      {/* Dataset schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: 'Precio m² Villa María 2025',
            description: 'Precio del metro cuadrado en USD por barrio en Villa María, Córdoba, Argentina.',
            creator: { '@type': 'Organization', name: 'Mudate' },
            dateModified: new Date().toISOString().slice(0, 10),
            spatialCoverage: { '@type': 'Place', name: 'Villa María, Córdoba, Argentina' },
          }),
        }}
      />
      {/* FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 60%, #0D3424 100%)' }} className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <Link href="/villa-maria" className="hover:text-white transition-colors">Villa María</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Precio m²</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: 'var(--accent)' }}>
              Datos 2025
            </span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Actualizado: {new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Precio m² en Villa María 2025
          </h1>
          <p className="text-lg text-white/70 font-light max-w-xl">
            La segunda ciudad de Córdoba. Cap rates del 6.5–7.5% USD, precios 40% más bajos que la capital y demanda universitaria estructural de la UNVM.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Live data from Mudate DB */}
        {mudate.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Database size={16} style={{ color: 'var(--primary)' }} />
              <h2 className="text-lg font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
                Datos de Mudate — {total} propiedades analizadas
              </h2>
            </div>
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

        {/* Price table by neighborhood */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
            Precio m² por barrio en Villa María
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
                    <td className="py-3 px-4" style={{ color: 'var(--foreground)' }}>
                      <span className="font-medium">{b.barrio}</span>
                      <span className="block text-xs" style={{ color: 'var(--muted-foreground)' }}>{b.nota}</span>
                    </td>
                    <td className="py-3 px-4 capitalize" style={{ color: 'var(--muted-foreground)' }}>{b.tipo}</td>
                    <td className="py-3 px-4 text-right font-semibold" style={{ color: 'var(--foreground)' }}>
                      USD {b.min.toLocaleString()}–{b.max.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right" style={{ color: '#16a34a', fontWeight: 600 }}>{b.tend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--muted-foreground)' }}>
            Fuente: datos de mercado Mudate. Valores en USD, 2025.
          </p>
        </section>

        {/* Market analysis */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
            La brecha de precio como motor de rentabilidad
          </h2>
          <div style={{ color: 'var(--muted-foreground)', lineHeight: 1.8, fontSize: '0.92rem' }}>
            <p className="mb-4">
              Villa María es la segunda ciudad más importante de Córdoba, con más de 100.000 habitantes, polo universitario (UNVM), nodo comercial e industrial, y conectividad directa con Córdoba Capital por la RN 158. Sin embargo, su precio por m² es entre un 35% y un 45% menor al de la capital, mientras que los alquileres no siguen esa misma brecha.
            </p>
            <p className="mb-4">
              <strong style={{ color: 'var(--foreground)' }}>El Centro y Palermo</strong> concentran la mayor demanda de alquiler. Un departamento 2 ambientes de 55–65 m² en estas zonas (USD 65.000–75.000) genera USD 380–500/mes, equivalente a un cap rate del 6.5–7.5% en USD, superior al de cualquier ciudad grande de Argentina.
            </p>
            <p>
              <strong style={{ color: 'var(--foreground)' }}>Barrio Nuevo y Residencial Norte</strong> son las apuestas de valorización: proyectos de infraestructura vial, nuevos colegios y desarrollos privados están consolidando estas zonas como alternativas premium. El precio todavía es accesible, pero la tendencia es alcista sostenida.
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

        {/* Internal links to blog */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
            Artículos relacionados
          </h2>
          <div className="flex flex-col gap-3">
            <Link
              href="/blog/mercado-inmobiliario-villa-maria-2025"
              className="flex items-center gap-2 text-sm font-medium hover:underline"
              style={{ color: 'var(--primary)' }}
            >
              <ChevronRight size={14} /> Mercado inmobiliario Villa María 2025: precios, tendencias y oportunidades
            </Link>
            <Link
              href="/blog/barrios-villa-maria-donde-invertir"
              className="flex items-center gap-2 text-sm font-medium hover:underline"
              style={{ color: 'var(--primary)' }}
            >
              <ChevronRight size={14} /> Barrios de Villa María: ¿dónde conviene invertir según tu perfil?
            </Link>
            <Link
              href="/blog/comprar-departamento-villa-maria"
              className="flex items-center gap-2 text-sm font-medium hover:underline"
              style={{ color: 'var(--primary)' }}
            >
              <ChevronRight size={14} /> Cómo comprar un departamento en Villa María: guía paso a paso
            </Link>
          </div>
        </section>

        {/* Cross-links to other precio-m2 pages */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
            Precio m² en otras ciudades
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/cordoba-capital/precio-m2" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Córdoba Capital</Link>
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

        {/* CTA */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/propiedades?ciudad=Villa+Mar%C3%ADa"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'var(--primary)' }}
          >
            <TrendingUp size={16} /> Ver propiedades en Villa María
          </Link>
          <Link
            href="/villa-maria"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold"
            style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
          >
            <ArrowLeft size={16} /> Hub Villa María
          </Link>
        </div>
      </div>
    </div>
  );
}
