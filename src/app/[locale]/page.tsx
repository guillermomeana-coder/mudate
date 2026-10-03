import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PropertyGrid from '@/components/PropertyGrid';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import CitiesSection from '@/components/CitiesSection';
import InvestCTA from '@/components/InvestCTA';
import TestimonialsSection from '@/components/TestimonialsSection';
import NewsletterCTA from '@/components/NewsletterCTA';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';
import type { PropertyCardData } from '@/components/PropertyCard';
import type { Metadata } from 'next';

export const revalidate = 3600; // ISR: revalida cada 1 hora

const base = 'https://mudateargentina.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const url = isEn ? `${base}/en` : base;
  return {
    title: isEn
      ? 'Properties for Sale in Argentina — Córdoba, Buenos Aires, Rosario | Mudate'
      : 'Propiedades en Venta en Argentina — Córdoba, Buenos Aires, Rosario | Mudate',
    description: isEn
      ? 'Find houses, apartments and lots for sale in Argentina. Real prices in Córdoba, Buenos Aires, Rosario, Mendoza and 30+ cities. Updated 2025–2026 data.'
      : 'Encontrá casas, departamentos y terrenos en venta en Argentina. Precios reales en Córdoba, Buenos Aires, Rosario, Mendoza y más de 30 ciudades. Datos actualizados 2025–2026.',
    keywords: isEn
      ? ['properties for sale argentina', 'real estate argentina', 'houses cordoba', 'apartments buenos aires', 'invest argentina', 'cap rate argentina']
      : ['propiedades en venta argentina', 'inmuebles córdoba', 'casas en venta argentina', 'departamentos córdoba', 'invertir en propiedades argentina', 'precio m2 córdoba'],
    alternates: {
      canonical: url,
      languages: { 'es': base, 'en': `${base}/en`, 'x-default': base },
    },
    openGraph: {
      siteName: 'Mudate Argentina',
      title: isEn
        ? 'Properties for Sale in Argentina | Mudate'
        : 'Propiedades en Venta en Argentina | Mudate',
      description: isEn
        ? 'Houses, apartments and lots for sale in Argentina. Real prices 2025–2026.'
        : 'Casas, departamentos y terrenos en venta en Argentina. Precios reales 2025–2026.',
      url,
      type: 'website',
      locale: isEn ? 'en_US' : 'es_AR',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: 'Mudate Argentina — Portal Inmobiliario' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? 'Properties for Sale in Argentina | Mudate' : 'Propiedades en Venta en Argentina | Mudate',
      description: isEn
        ? 'Houses, apartments and lots in Argentina. Real prices 2025–2026.'
        : 'Casas, departamentos y terrenos en Argentina. Precios reales 2025–2026.',
      images: [`${base}/opengraph-image`],
    },
  };
}

// WebSite schema is in layout.tsx (global) — no duplicate here

const speakableSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://mudateargentina.com/#webpage',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2', '.hero-text'],
  },
  url: 'https://mudateargentina.com',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cómo comprar una propiedad en Argentina?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para comprar una propiedad en Argentina necesitás CUIL o CUIT, un escribano público y el precio se paga en dólares. El proceso incluye: reserva, boleto de compraventa y escritura. Los gastos de compraventa en Córdoba suman aproximadamente 5-7% del valor del inmueble.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuál es el precio por m² en Córdoba Capital?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El precio por m² en Córdoba Capital varía por barrio: Nueva Córdoba USD 1.200-1.600/m², Güemes USD 1.000-1.300/m², General Paz USD 1.100-1.400/m². El promedio de la ciudad ronda USD 1.100-1.300/m² para departamentos usados.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuál es el cap rate en Córdoba?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El cap rate en Córdoba Capital está entre 4.5% y 6% anual en USD dependiendo del barrio. Villa María ofrece cap rates de 6.5-7%, y Villa Carlos Paz para alquiler vacacional puede llegar al 8-9% USD.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Pueden los extranjeros comprar propiedades en Argentina?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí, los extranjeros pueden comprar propiedades en Argentina sin necesidad de residencia. Solo necesitan obtener un CUIL (Código Único de Identificación Laboral) en ANSES y contar con un escribano público para la escrituración.',
      },
    },
    {
      '@type': 'Question',
      name: '¿En qué ciudad de Argentina conviene invertir en inmuebles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Las mejores ciudades para invertir en Argentina en 2025 son: Córdoba Capital (mercado líquido, cap rate 5%), Villa María (cap rate 6.5-7%, demanda universitaria), Bariloche (turismo, 8-10% USD), Neuquén (boom Vaca Muerta) y Mendoza (valorización en USD).',
      },
    },
  ],
};

async function getFeaturedProperties(): Promise<PropertyCardData[]> {
  try {
    await connectDB();
    const props = await Property.find({ published: true, operation: 'venta' })
      .sort({ featured: -1, createdAt: -1 })
      .limit(6)
      .lean();

    return props.map((p) => ({
      slug: p.slug,
      title: p.title,
      price: p.price,
      currency: p.currency as 'USD' | 'ARS',
      operation: 'venta' as const,
      type: p.type,
      ciudad: p.ciudad,
      barrio: p.barrio,
      ambientes: p.ambientes,
      dormitorios: p.dormitorios,
      banos: p.banos,
      superficie_cubierta: p.superficie_cubierta,
      images: p.images || [],
      categoria: p.categoria || 'standard',
    }));
  } catch {
    return [];
  }
}

async function getPropertyStats(): Promise<{ total: number; cities: number }> {
  try {
    await connectDB();
    const [total, citiesAgg] = await Promise.all([
      Property.countDocuments({ published: true }),
      Property.distinct('ciudad', { published: true }),
    ]);
    return { total, cities: citiesAgg.length };
  } catch {
    return { total: 3000, cities: 30 };
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const [featured, stats] = await Promise.all([
    getFeaturedProperties(),
    getPropertyStats(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* ═══ HERO — KineticGrid + ScrambleText ═══ */}
      <HeroSection
        subtitle={t('subtitle')}
        searchPlaceholder={t('searchPlaceholder')}
        searchBtn={t('searchBtn')}
        labelCasa={t('types.casa')}
        labelDepartamento={t('types.departamento')}
        labelTerreno={t('types.terreno')}
      />

      {/* ═══ DEFINITION BLOCK — AI citability ═══ */}
      <section style={{ background: 'var(--background)', padding: '32px 0 0', borderBottom: 'none' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p style={{ fontSize: '0.88rem', lineHeight: 1.8, color: 'var(--muted-foreground)', fontWeight: 300, textAlign: 'center' }}>
            Mudate es el portal inmobiliario de Argentina con más de {stats.total.toLocaleString('es-AR')} propiedades en venta en {stats.cities} ciudades. Ofrecemos precios reales por metro cuadrado, análisis de cap rate por barrio y guías paso a paso para compradores nacionales y extranjeros. Operamos exclusivamente en venta de inmuebles residenciales y comerciales, con datos actualizados del mercado 2025-2026. Cap rates promedios: Córdoba Capital 5%, Villa María 6.7%, Villa Carlos Paz 7.5% turístico. Datos de mercado basados en relevamiento de Colegio de Corredores Inmobiliarios, INDEC y portales ZonaProp/Argenprop.
          </p>
        </div>
      </section>

      {/* ═══ STATS — ScrollTrigger reveal ═══ */}
      <StatsSection totalProperties={stats.total} totalCities={stats.cities} />

      {/* ═══ FEATURED PROPERTIES — PropertyGrid con ScrollTrigger ═══ */}
      {featured.length > 0 && (
        <section style={{ background: 'var(--background)', padding: '80px 0' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: 40,
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <p className="section-label" style={{ marginBottom: 8 }}>Seleccionadas</p>
                <h2
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                    fontWeight: 600,
                    color: 'var(--foreground)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Propiedades destacadas
                </h2>
              </div>
              <Link
                href="/propiedades"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: '0.85rem', fontWeight: 600,
                  color: 'var(--primary)',
                  textDecoration: 'none',
                }}
              >
                Ver todas <ArrowRight size={15} />
              </Link>
            </div>

            <PropertyGrid properties={featured} />
          </div>
        </section>
      )}

      {/* ═══ CIUDADES — stagger scroll reveal ═══ */}
      <CitiesSection />

      {/* ═══ BLOG CTA ═══ */}
      <section style={{ background: 'var(--muted)', padding: '60px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p className="section-label" style={{ marginBottom: 8 }}>Editorial</p>
              <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 600, color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
                Guías e inversión
              </h2>
            </div>
            <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>
              Ver todos los artículos <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                href: '/blog/cap-rate-cordoba-2025',
                title: 'Cap Rate en Córdoba 2025: análisis por barrio y ciudad',
                excerpt: 'Calculamos el retorno real en dólares para los principales barrios de Córdoba. Nueva Córdoba, General Paz, Villa María y más.',
                label: 'Inversión',
                coverImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80',
              },
              {
                href: '/blog/invertir-departamentos-cordoba-vs-caba',
                title: 'Invertir en departamentos: Córdoba vs CABA — quién gana en 2025',
                excerpt: 'Comparamos precio del m², rentabilidades y perspectivas de valorización entre Córdoba Capital y Buenos Aires.',
                label: 'Inversión',
                coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
              },
              {
                href: '/blog/mejor-ciudad-para-invertir-argentina-2025',
                title: '¿En qué ciudad de Argentina conviene más invertir en 2025?',
                excerpt: 'Comparamos 10 ciudades argentinas por precio/m², cap rate, liquidez y potencial de valorización.',
                label: 'Inversión',
                coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
              },
              {
                href: '/blog/mercado-inmobiliario-villa-maria-2025',
                title: 'Mercado inmobiliario Villa María 2025: precios, tendencias y oportunidades',
                excerpt: 'Villa María consolida su posición como el mejor mercado alternativo a Córdoba Capital con cap rates sobre el 6%.',
                label: 'Mercado',
                coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
              },
              {
                href: '/blog/rentabilidad-villa-carlos-paz',
                title: 'Inversión en Villa Carlos Paz: rentabilidad turística y cap rates',
                excerpt: 'Con 3 millones de turistas por año, Villa Carlos Paz ofrece cap rates de 7-8% USD para quien sabe dónde comprar.',
                label: 'Turismo',
                coverImage: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
              },
              {
                href: '/blog/como-comprar-propiedad-argentina-extranjeros',
                title: 'Cómo comprar una propiedad en Argentina siendo extranjero: guía 2025',
                excerpt: 'Extranjeros pueden comprar propiedades en Argentina sin residencia. CDI, escritura, impuestos y costos: todo lo que necesitás saber.',
                label: 'Guía',
                coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
              },
            ].map((post) => (
              <Link
                key={post.href}
                href={post.href}
                className="rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-200"
                style={{ background: 'white', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    loading="lazy"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '16px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white inline-block w-fit" style={{ background: 'var(--primary)' }}>{post.label}</span>
                  <p className="text-sm font-semibold leading-snug" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>{post.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIOS — trust signals ═══ */}
      <TestimonialsSection />

      {/* ═══ NEWSLETTER — conversión ═══ */}
      <NewsletterCTA />

      {/* ═══ CIUDADES NACIONALES — internal links SEO ═══ */}
      <section style={{ background: 'var(--background)', padding: '40px 0', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label" style={{ marginBottom: 16 }}>Propiedades por ciudad</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 12px' }}>
            {[
              { href: '/cordoba-capital', label: 'Córdoba Capital' },
              { href: '/buenos-aires-capital', label: 'Buenos Aires' },
              { href: '/rosario', label: 'Rosario' },
              { href: '/mendoza', label: 'Mendoza' },
              { href: '/bariloche', label: 'Bariloche' },
              { href: '/salta', label: 'Salta' },
              { href: '/neuquen', label: 'Neuquén' },
              { href: '/mar-del-plata', label: 'Mar del Plata' },
              { href: '/tucuman', label: 'Tucumán' },
              { href: '/villa-maria', label: 'Villa María' },
              { href: '/villa-carlos-paz', label: 'Villa Carlos Paz' },
            ].map((city) => (
              <Link
                key={city.href}
                href={city.href}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: 'var(--muted-foreground)',
                  textDecoration: 'none',
                  padding: '4px 10px',
                  borderRadius: 20,
                  border: '1px solid var(--border)',
                  transition: 'color 150ms, border-color 150ms',
                }}
                className="hover:text-primary hover:border-primary"
              >
                {city.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INVERTIR CTA — KineticGrid + MagneticBtn ═══ */}
      <InvestCTA />
    </>
  );
}
