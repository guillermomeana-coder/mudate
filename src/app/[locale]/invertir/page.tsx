import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, Building2, GraduationCap, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import InvestCalculator from '@/components/InvestCalculator';

const base = 'https://mudateargentina.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const path = 'invertir';
  const url = isEn ? `${base}/en/${path}` : `${base}/${path}`;
  return {
    title: isEn
      ? 'Invest in Argentine Real Estate — Cap Rates & ROI by Zone | Mudate'
      : 'Invertir en Propiedades en Córdoba — Cap Rates y ROI por Zona | Mudate',
    description: isEn
      ? 'Complete guide to investing in Argentine real estate. Cap rates 4–7% USD in Córdoba, Buenos Aires, Villa María and more. 2025–2026 market data.'
      : 'Análisis completo para invertir en inmuebles en Córdoba Argentina. Cap rates 4-7% USD, comparativa por ciudad y barrio, datos del mercado 2025-2026.',
    keywords: isEn
      ? ['invest argentina real estate', 'cap rate argentina', 'roi property argentina', 'cordoba investment', 'real estate returns argentina 2025']
      : ['invertir en propiedades argentina', 'cap rate córdoba', 'rentabilidad inmobiliaria argentina', 'inversión inmuebles 2025', 'retorno inversión propiedades'],
    alternates: {
      canonical: url,
      languages: { 'es': `${base}/${path}`, 'en': `${base}/en/${path}`, 'x-default': `${base}/${path}` },
    },
    openGraph: {
      siteName: 'Mudate Argentina',
      title: isEn ? 'Invest in Argentine Real Estate | Mudate' : 'Invertir en Propiedades en Córdoba | Mudate',
      description: isEn
        ? 'Cap rates 4–7% USD. Market data 2025–2026 for Córdoba and all Argentina.'
        : 'Cap rates 4-7% USD. Datos del mercado 2025-2026 en Córdoba y toda Argentina.',
      url,
      type: 'website',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: 'Mudate Argentina — Inversión Inmobiliaria' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? 'Invest in Argentine Real Estate | Mudate' : 'Invertir en Propiedades en Córdoba | Mudate',
      description: isEn ? 'Cap rates 4–7% USD. Market data 2025–2026.' : 'Cap rates 4-7% USD. Datos del mercado 2025-2026.',
      images: [`${base}/opengraph-image`],
    },
  };
}

const zonaData = [
  {
    ciudad: 'Nueva Córdoba',
    precioM2: 'USD 1.400',
    ingresoEst: '$350.000',
    capRate: 4.5,
    capRateLabel: '4.5%',
    demanda: 5,
  },
  {
    ciudad: 'General Paz',
    precioM2: 'USD 1.200',
    ingresoEst: '$300.000',
    capRate: 5.0,
    capRateLabel: '5.0%',
    demanda: 4,
  },
  {
    ciudad: 'Güemes',
    precioM2: 'USD 1.100',
    ingresoEst: '$280.000',
    capRate: 5.2,
    capRateLabel: '5.2%',
    demanda: 4,
  },
  {
    ciudad: 'Villa María — Centro',
    precioM2: 'USD 900',
    ingresoEst: '$220.000',
    capRate: 6.5,
    capRateLabel: '6.5%',
    demanda: 4,
  },
  {
    ciudad: 'Villa María — Norte',
    precioM2: 'USD 750',
    ingresoEst: '$190.000',
    capRate: 6.8,
    capRateLabel: '6.8%',
    demanda: 3,
  },
  {
    ciudad: 'Villa Carlos Paz',
    precioM2: 'USD 1.300',
    ingresoEst: '$400.000',
    capRate: 7.2,
    capRateLabel: '7.2%',
    demanda: 5,
  },
  {
    ciudad: 'Río Cuarto',
    precioM2: 'USD 800',
    ingresoEst: '$200.000',
    capRate: 6.0,
    capRateLabel: '6.0%',
    demanda: 3,
  },
];

function CapRateBadge({ rate }: { rate: number }) {
  if (rate >= 6) {
    return (
      <span
        style={{
          background: 'rgba(16,185,129,0.12)',
          color: '#065F46',
          border: '1px solid rgba(16,185,129,0.3)',
          fontFamily: 'Josefin Sans, sans-serif',
          fontWeight: 600,
          fontSize: '0.8rem',
          padding: '3px 10px',
          borderRadius: '999px',
          letterSpacing: '0.04em',
        }}
      >
        {rate}%
      </span>
    );
  }
  if (rate >= 4) {
    return (
      <span
        style={{
          background: 'rgba(245,158,11,0.12)',
          color: '#92400E',
          border: '1px solid rgba(245,158,11,0.3)',
          fontFamily: 'Josefin Sans, sans-serif',
          fontWeight: 600,
          fontSize: '0.8rem',
          padding: '3px 10px',
          borderRadius: '999px',
          letterSpacing: '0.04em',
        }}
      >
        {rate}%
      </span>
    );
  }
  return (
    <span
      style={{
        fontFamily: 'Josefin Sans, sans-serif',
        fontWeight: 600,
        fontSize: '0.8rem',
        color: '#4A7C78',
      }}
    >
      {rate}%
    </span>
  );
}

function DemandaDots({ count }: { count: number }) {
  return (
    <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: i <= count ? '#0F766E' : 'rgba(15,118,110,0.18)',
            display: 'inline-block',
            transition: 'background 0.2s',
          }}
        />
      ))}
    </span>
  );
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: base },
    { '@type': 'ListItem', position: 2, name: 'Invertir en Córdoba', item: `${base}/invertir` },
  ],
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Asesoramiento en inversiones inmobiliarias — Córdoba Argentina',
  provider: {
    '@type': 'Organization',
    name: 'Mudate Argentina',
    url: base,
  },
  areaServed: { '@type': 'Place', name: 'Córdoba, Argentina' },
  description: 'Análisis de cap rates, ROI y comparativa de mercado para inversiones inmobiliarias en Córdoba y toda Argentina. Datos actualizados 2025-2026.',
  url: `${base}/invertir`,
};

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Cap rates y rentabilidad por zona — Córdoba Argentina 2025-2026',
  description: 'Datos de precio por m² en USD, ingreso mensual estimado y cap rate anual para 7 zonas de inversión inmobiliaria en la provincia de Córdoba, Argentina. Actualizado Q3 2025.',
  url: `${base}/invertir`,
  creator: {
    '@type': 'Organization',
    name: 'Mudate Argentina',
    url: base,
  },
  temporalCoverage: '2025/2026',
  spatialCoverage: {
    '@type': 'Place',
    name: 'Córdoba, Argentina',
  },
  variableMeasured: [
    { '@type': 'PropertyValue', name: 'Precio por m²', unitCode: 'USD/m²' },
    { '@type': 'PropertyValue', name: 'Cap rate anual', unitCode: 'percent' },
    { '@type': 'PropertyValue', name: 'Ingreso mensual estimado', unitCode: 'ARS' },
  ],
  distribution: {
    '@type': 'DataDownload',
    contentUrl: `${base}/invertir`,
    encodingFormat: 'text/html',
  },
};

const speakableSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://mudateargentina.com/invertir#webpage',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2', '.hero-text'],
  },
  url: 'https://mudateargentina.com/invertir',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Es buen momento para invertir en propiedades en Córdoba?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. El mercado inmobiliario de Córdoba atraviesa un ciclo expansivo con precios en USD que crecieron +35% entre 2023 y 2025. La demanda sostenida de 200.000 universitarios, el déficit habitacional de 80.000 unidades y la estabilización del tipo de cambio crean condiciones favorables para la inversión a mediano y largo plazo.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuál es el cap rate promedio en Villa María?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Villa María ofrece cap rates de 6.5% a 6.8% anual en dólares, dependiendo del barrio. El centro rinde 6.5% y la zona norte 6.8%, siendo una de las mejores relaciones precio/retorno de toda la provincia de Córdoba.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué diferencia hay entre invertir en Córdoba vs CABA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Córdoba ofrece ventajas significativas frente a CABA: el precio promedio por m² es un 57% más bajo (USD 1.200 vs USD 2.800), el cap rate es mayor (5.5% vs 3.5%) y el crecimiento de precios en 2024-2025 fue del 18% versus el 12% de CABA. El menor costo de entrada permite mayor diversificación y mejor retorno sobre el capital invertido.',
      },
    },
  ],
};

export default function InvertirPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />

      {/* ── HERO ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0F766E 0%, #0369A1 60%, #134E4A 100%)',
          padding: '100px 24px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative orbs */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(20,184,166,0.12)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <p
            className="section-subtitle"
            style={{ color: 'rgba(153,246,228,0.9)', marginBottom: 20, fontSize: '0.8rem' }}
          >
            Hub de Inversión Inmobiliaria
          </p>
          <h1
            style={{
              fontFamily: 'Cinzel, serif',
              color: '#FFFFFF',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: 28,
              textShadow: '0 2px 20px rgba(0,0,0,0.25)',
            }}
          >
            Invertir en Córdoba
          </h1>
          <p
            style={{
              fontFamily: 'Josefin Sans, sans-serif',
              color: 'rgba(240,253,250,0.88)',
              fontSize: 'clamp(1rem, 2.2vw, 1.22rem)',
              lineHeight: 1.7,
              maxWidth: 680,
              margin: '0 auto 44px',
              fontWeight: 300,
            }}
          >
            El mercado inmobiliario de Córdoba ofrece cap rates de{' '}
            <strong style={{ color: '#99F6E4', fontWeight: 600 }}>4-7% anual en dólares</strong>,
            con alta demanda de vivienda impulsada por{' '}
            <strong style={{ color: '#99F6E4', fontWeight: 600 }}>200.000 universitarios</strong>.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/propiedades"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#FFFFFF',
                color: '#0F766E',
                fontFamily: 'Josefin Sans, sans-serif',
                fontWeight: 600,
                fontSize: '0.95rem',
                letterSpacing: '0.04em',
                padding: '14px 28px',
                borderRadius: 12,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              Ver propiedades <ArrowRight size={16} />
            </Link>
            <a
              href="#villa-maria"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.12)',
                color: '#FFFFFF',
                fontFamily: 'Josefin Sans, sans-serif',
                fontWeight: 500,
                fontSize: '0.95rem',
                letterSpacing: '0.04em',
                padding: '14px 28px',
                borderRadius: 12,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <MapPin size={16} /> Villa María
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section
        style={{
          background: '#0D3330',
          padding: '36px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 0,
          }}
        >
          {[
            { label: 'Cap rate promedio', value: '4–7% USD', icon: <TrendingUp size={22} color="#14B8A6" /> },
            { label: 'Valorización 2023–2025', value: '+35%', icon: <TrendingUp size={22} color="#14B8A6" /> },
            { label: 'Universitarios en la provincia', value: '200.000', icon: <GraduationCap size={22} color="#14B8A6" /> },
            { label: 'Déficit habitacional', value: '80.000 unidades', icon: <Building2 size={22} color="#14B8A6" /> },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                padding: '24px 20px',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                {stat.icon}
              </div>
              <div
                style={{
                  fontFamily: 'Cinzel, serif',
                  color: '#99F6E4',
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  marginBottom: 6,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: 'Josefin Sans, sans-serif',
                  color: 'rgba(240,253,250,0.6)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 300,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.6rem', color: 'rgba(240,253,250,0.3)', textAlign: 'center', marginTop: 12 }}>
          Fuentes: Colegio de Corredores Inmobiliarios de Córdoba, INDEC, Secretaría de Políticas Universitarias (SPU), relevamiento Mudate H1 2025
        </p>
      </section>

      {/* ── TABLA ROI POR ZONA ── */}
      <section style={{ padding: '80px 24px', background: '#F0FDFA' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: 12 }}>
            Datos del mercado 2025–2026
          </p>
          <h2
            style={{
              fontFamily: 'Cinzel, serif',
              color: '#134E4A',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            Rentabilidad por Zona
          </h2>
          <p
            style={{
              fontFamily: 'Josefin Sans, sans-serif',
              color: '#4A7C78',
              textAlign: 'center',
              fontSize: '1rem',
              marginBottom: 48,
              fontWeight: 300,
            }}
          >
            Cap rate estimado sobre ingreso mensual proyectado en pesos. Precios en USD actualizados a Q3 2025.
          </p>

          <div
            className="glass"
            style={{
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(15,118,110,0.10)',
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.2fr 1.3fr 1.1fr 1.1fr',
                background: 'linear-gradient(90deg, #0F766E, #0369A1)',
                padding: '16px 28px',
                gap: 8,
              }}
            >
              {['Ciudad / Barrio', 'Precio m²', 'Ingreso estimado', 'Cap rate', 'Demanda'].map((h) => (
                <div
                  key={h}
                  style={{
                    fontFamily: 'Josefin Sans, sans-serif',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Table rows */}
            {zonaData.map((zona, i) => (
              <div
                key={zona.ciudad}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.2fr 1.3fr 1.1fr 1.1fr',
                  padding: '18px 28px',
                  gap: 8,
                  background: i % 2 === 0 ? 'rgba(240,253,250,0.6)' : 'rgba(255,255,255,0.85)',
                  borderBottom: '1px solid rgba(153,246,228,0.25)',
                  alignItems: 'center',
                  transition: 'background 0.15s',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Josefin Sans, sans-serif',
                    color: '#134E4A',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  {zona.ciudad}
                </div>
                <div
                  style={{
                    fontFamily: 'Josefin Sans, sans-serif',
                    color: '#0F766E',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  {zona.precioM2}
                </div>
                <div
                  style={{
                    fontFamily: 'Josefin Sans, sans-serif',
                    color: '#134E4A',
                    fontSize: '0.9rem',
                    fontWeight: 400,
                  }}
                >
                  {zona.ingresoEst}
                </div>
                <div>
                  <CapRateBadge rate={zona.capRate} />
                </div>
                <div>
                  <DemandaDots count={zona.demanda} />
                </div>
              </div>
            ))}

            {/* Source attribution */}
            <p style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)', marginTop: 8, fontStyle: 'italic', padding: '0 28px' }}>
              Fuente: Colegio de Corredores Inmobiliarios de Córdoba, relevamiento Mudate H1 2025
            </p>

            {/* Legend */}
            <div
              style={{
                padding: '14px 28px',
                background: 'rgba(240,253,250,0.4)',
                display: 'flex',
                gap: 24,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'Josefin Sans, sans-serif',
                  fontSize: '0.72rem',
                  color: '#4A7C78',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                Cap rate:
              </span>
              <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span
                  style={{
                    background: 'rgba(16,185,129,0.12)',
                    color: '#065F46',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: 999,
                    padding: '2px 10px',
                    fontSize: '0.72rem',
                    fontFamily: 'Josefin Sans, sans-serif',
                    fontWeight: 600,
                  }}
                >
                  ≥ 6% excelente
                </span>
                <span
                  style={{
                    background: 'rgba(245,158,11,0.12)',
                    color: '#92400E',
                    border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: 999,
                    padding: '2px 10px',
                    fontSize: '0.72rem',
                    fontFamily: 'Josefin Sans, sans-serif',
                    fontWeight: 600,
                  }}
                >
                  4–6% bueno
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── POR QUÉ CÓRDOBA ── */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: 12 }}>
            Fundamentos del mercado
          </p>
          <h2
            style={{
              fontFamily: 'Cinzel, serif',
              color: '#134E4A',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: 52,
            }}
          >
            ¿Por qué invertir en Córdoba?
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 28,
            }}
          >
            {[
              {
                icon: <TrendingUp size={32} color="#0F766E" />,
                title: 'Economía robusta',
                body: 'Segunda provincia de Argentina por PBI. Motor industrial, agrícola y de servicios con crecimiento sostenido que protege el valor de los activos inmobiliarios.',
              },
              {
                icon: <GraduationCap size={32} color="#0F766E" />,
                title: 'Polo universitario',
                body: 'UNC, UTN, UCC, UCCuyo: 200.000 estudiantes activos generan demanda permanente y predecible de vivienda. Valorización sostenida en barrios universitarios.',
              },
              {
                icon: <Building2 size={32} color="#0F766E" />,
                title: 'Mercado en expansión',
                body: 'Precios en USD históricamente más bajos que CABA (50%) y Mar del Plata (30%). Mayor potencial de apreciación con rentabilidad superior en el corto plazo.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="glass"
                style={{
                  borderRadius: 18,
                  padding: '36px 28px',
                  boxShadow: '0 4px 24px rgba(15,118,110,0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, rgba(15,118,110,0.1), rgba(3,105,161,0.08))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    border: '1px solid rgba(15,118,110,0.15)',
                  }}
                >
                  {card.icon}
                </div>
                <h3
                  style={{
                    fontFamily: 'Cinzel, serif',
                    color: '#134E4A',
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'Josefin Sans, sans-serif',
                    color: '#4A7C78',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    fontWeight: 300,
                  }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARATIVA CABA vs CÓRDOBA ── */}
      <section style={{ padding: '80px 24px', background: '#F0FDFA' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: 12 }}>
            Análisis comparativo
          </p>
          <h2
            style={{
              fontFamily: 'Cinzel, serif',
              color: '#134E4A',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: 48,
            }}
          >
            Córdoba vs CABA
          </h2>

          <div
            className="glass"
            style={{
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(15,118,110,0.10)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.8fr 1fr 1fr 1.4fr',
                background: 'linear-gradient(90deg, #134E4A, #0F766E)',
                padding: '16px 28px',
                gap: 8,
              }}
            >
              {['Indicador', 'CABA', 'Córdoba', 'Ventaja'].map((h) => (
                <div
                  key={h}
                  style={{
                    fontFamily: 'Josefin Sans, sans-serif',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {[
              {
                indicador: 'Precio m² promedio',
                caba: 'USD 2.800',
                cordoba: 'USD 1.200',
                ventaja: 'Córdoba 57% más barato',
              },
              {
                indicador: 'Cap rate promedio',
                caba: '3.5%',
                cordoba: '5.5%',
                ventaja: 'Córdoba +2pp',
              },
              {
                indicador: 'Crecimiento 2024–2025',
                caba: '+12%',
                cordoba: '+18%',
                ventaja: 'Córdoba más dinámico',
              },
            ].map((row, i) => (
              <div
                key={row.indicador}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.8fr 1fr 1fr 1.4fr',
                  padding: '18px 28px',
                  gap: 8,
                  background: i % 2 === 0 ? 'rgba(240,253,250,0.6)' : 'rgba(255,255,255,0.85)',
                  borderBottom: '1px solid rgba(153,246,228,0.25)',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Josefin Sans, sans-serif',
                    color: '#134E4A',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  {row.indicador}
                </div>
                <div
                  style={{
                    fontFamily: 'Josefin Sans, sans-serif',
                    color: '#6B7280',
                    fontSize: '0.9rem',
                    fontWeight: 400,
                  }}
                >
                  {row.caba}
                </div>
                <div
                  style={{
                    fontFamily: 'Josefin Sans, sans-serif',
                    color: '#0F766E',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  }}
                >
                  {row.cordoba}
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'Josefin Sans, sans-serif',
                    color: '#065F46',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                  }}
                >
                  <CheckCircle size={14} color="#10B981" />
                  {row.ventaja}
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)', marginTop: 8, fontStyle: 'italic' }}>
            Fuente: Colegio de Corredores Inmobiliarios de Córdoba, relevamiento Mudate H1 2025
          </p>
        </div>
      </section>

      {/* ── SECCIÓN VILLA MARÍA ── */}
      <section
        id="villa-maria"
        style={{
          padding: '80px 24px',
          background: 'linear-gradient(135deg, #134E4A 0%, #0F766E 50%, #0369A1 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '50%',
            right: -100,
            transform: 'translateY(-50%)',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 20,
              justifyContent: 'center',
            }}
          >
            <MapPin size={20} color="#99F6E4" />
            <p
              className="section-subtitle"
              style={{ color: 'rgba(153,246,228,0.9)', margin: 0, fontSize: '0.78rem' }}
            >
              Oportunidad destacada
            </p>
          </div>

          <h2
            style={{
              fontFamily: 'Cinzel, serif',
              color: '#FFFFFF',
              fontSize: 'clamp(1.7rem, 3.8vw, 2.8rem)',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: 24,
              textShadow: '0 2px 16px rgba(0,0,0,0.2)',
            }}
          >
            Villa María: la mejor relación precio/retorno
          </h2>

          <p
            style={{
              fontFamily: 'Josefin Sans, sans-serif',
              color: 'rgba(240,253,250,0.85)',
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              lineHeight: 1.75,
              textAlign: 'center',
              maxWidth: 700,
              margin: '0 auto 44px',
              fontWeight: 300,
            }}
          >
            Villa María consolida su posición como la ciudad con mejor relación inversión/retorno de
            la provincia. Con precios de entre{' '}
            <strong style={{ color: '#99F6E4', fontWeight: 600 }}>USD 750 y USD 900 por m²</strong>{' '}
            y cap rates de <strong style={{ color: '#99F6E4', fontWeight: 600 }}>6.5% a 6.8% anual</strong>,
            supera ampliamente a Córdoba Capital y está a la par de los mejores mercados turísticos
            como Villa Carlos Paz — sin la estacionalidad.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 20,
              marginBottom: 44,
            }}
          >
            {[
              { label: 'Cap rate zona norte', value: '6.8%' },
              { label: 'Cap rate zona centro', value: '6.5%' },
              { label: 'Precio m² mín.', value: 'USD 750' },
              { label: 'Demanda vivienda', value: 'Alta y estable' },
            ].map((kpi) => (
              <div
                key={kpi.label}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 14,
                  padding: '24px 20px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Cinzel, serif',
                    color: '#99F6E4',
                    fontSize: '1.7rem',
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  {kpi.value}
                </div>
                <div
                  style={{
                    fontFamily: 'Josefin Sans, sans-serif',
                    color: 'rgba(240,253,250,0.65)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontWeight: 300,
                  }}
                >
                  {kpi.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link
              href="/propiedades?ciudad=villa-maria"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#FFFFFF',
                color: '#0F766E',
                fontFamily: 'Josefin Sans, sans-serif',
                fontWeight: 700,
                fontSize: '0.95rem',
                letterSpacing: '0.05em',
                padding: '14px 32px',
                borderRadius: 12,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              Ver propiedades en Villa María <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CALCULADORA DE INVERSIÓN ── */}
      <InvestCalculator />

      {/* ── CTA FINAL ── */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #0F766E, #0369A1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 28px',
              boxShadow: '0 8px 24px rgba(15,118,110,0.25)',
            }}
          >
            <TrendingUp size={28} color="#FFFFFF" />
          </div>

          <h2
            style={{
              fontFamily: 'Cinzel, serif',
              color: '#134E4A',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            ¿Listo para invertir?
          </h2>

          <p
            style={{
              fontFamily: 'Josefin Sans, sans-serif',
              color: '#4A7C78',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              marginBottom: 36,
              fontWeight: 300,
            }}
          >
            Consultá con nuestros especialistas y encontrá la propiedad que mejor se ajuste a tu
            perfil de inversión. Acceso a más de 3.000 propiedades en toda la provincia de Córdoba.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/propiedades"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'linear-gradient(135deg, #0F766E, #0369A1)',
                color: '#FFFFFF',
                fontFamily: 'Josefin Sans, sans-serif',
                fontWeight: 600,
                fontSize: '0.95rem',
                letterSpacing: '0.04em',
                padding: '15px 32px',
                borderRadius: 12,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(15,118,110,0.3)',
              }}
            >
              Ver propiedades disponibles <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
