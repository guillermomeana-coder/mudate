import { Metadata } from 'next';
import CompararClient from './CompararClient';

const base = 'https://mudateargentina.com';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const path = 'comparar';
  const url = isEn ? `${base}/en/${path}` : `${base}/${path}`;

  return {
    title: isEn
      ? 'Compare Cities — Real Estate Market Data by City | Mudate'
      : 'Comparar Ciudades — Datos del Mercado Inmobiliario por Ciudad | Mudate',
    description: isEn
      ? 'Interactive comparison tool for Argentine real estate markets. Compare price per m², cap rates, annual appreciation and more across 8 cities.'
      : 'Herramienta interactiva para comparar mercados inmobiliarios en Argentina. Precio por m², cap rates, valorizacion y mas en 8 ciudades.',
    keywords: isEn
      ? ['compare argentina real estate', 'city comparison argentina', 'cap rate comparison', 'property investment argentina', 'real estate data argentina']
      : ['comparar ciudades argentina', 'comparativa inmobiliaria', 'cap rate por ciudad', 'inversion inmobiliaria argentina', 'datos mercado inmobiliario'],
    alternates: {
      canonical: url,
      languages: { 'es': `${base}/${path}`, 'en': `${base}/en/${path}`, 'x-default': `${base}/${path}` },
    },
    openGraph: {
      siteName: 'Mudate Argentina',
      title: isEn ? 'Compare Cities — Real Estate Data | Mudate' : 'Comparar Ciudades — Mercado Inmobiliario | Mudate',
      description: isEn
        ? 'Side-by-side city comparison: price/m², cap rates, appreciation, demand type. 8 Argentine cities.'
        : 'Comparativa lado a lado: precio/m², cap rates, valorizacion, tipo de demanda. 8 ciudades argentinas.',
      url,
      type: 'website',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: 'Mudate Argentina — Comparar Ciudades' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? 'Compare Cities — Real Estate Data | Mudate' : 'Comparar Ciudades — Mercado Inmobiliario | Mudate',
      description: isEn
        ? 'Compare 8 Argentine cities side by side. Price, cap rate, appreciation.'
        : 'Compara 8 ciudades argentinas. Precio, cap rate, valorizacion.',
      images: [`${base}/opengraph-image`],
    },
  };
}

function getBreadcrumbSchema(locale: string) {
  const isEn = locale === 'en';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isEn ? 'Home' : 'Inicio',
        item: isEn ? `${base}/en` : base,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isEn ? 'Compare Cities' : 'Comparar Ciudades',
        item: isEn ? `${base}/en/comparar` : `${base}/comparar`,
      },
    ],
  };
}

export default async function CompararPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const breadcrumbSchema = getBreadcrumbSchema(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CompararClient locale={locale} />
    </>
  );
}
