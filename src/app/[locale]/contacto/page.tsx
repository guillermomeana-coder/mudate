import type { Metadata } from 'next';
import ContactoClient from './ContactoClient';

const base = 'https://mudateargentina.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const path = 'contacto';
  const url = isEn ? `${base}/en/${path}` : `${base}/${path}`;

  return {
    title: isEn
      ? 'Contact Us — List Your Property in Argentina | Mudate'
      : 'Contacto — Publicá tu Propiedad en Argentina | Mudate',
    description: isEn
      ? 'Contact Mudate Argentina to list your property for free. Reach buyers and investors across Córdoba, Buenos Aires, Rosario and all of Argentina.'
      : 'Publicá tu propiedad en Mudate Argentina de forma gratuita. Llegá a compradores e inversores en Córdoba, Buenos Aires, Rosario y todo el país.',
    keywords: isEn
      ? ['list property argentina', 'sell house argentina', 'real estate contact argentina', 'publish property free']
      : ['publicar propiedad argentina', 'vender casa argentina', 'contacto inmobiliaria', 'publicar departamento gratis argentina'],
    alternates: {
      canonical: url,
      languages: { 'es': `${base}/${path}`, 'en': `${base}/en/${path}`, 'x-default': `${base}/${path}` },
    },
    openGraph: {
      siteName: 'Mudate Argentina',
      title: isEn ? 'Contact — List Your Property | Mudate Argentina' : 'Contacto — Publicá tu Propiedad | Mudate Argentina',
      description: isEn
        ? 'List your property for free. Reach buyers and investors across Argentina.'
        : 'Publicá tu propiedad gratis. Llegá a compradores e inversores en toda Argentina.',
      url,
      type: 'website',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: 'Mudate Argentina — Contacto' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? 'Contact — List Your Property | Mudate Argentina' : 'Contacto — Publicá tu Propiedad | Mudate Argentina',
      description: isEn ? 'List your property for free. Reach buyers across Argentina.' : 'Publicá tu propiedad gratis. Llegá a compradores en toda Argentina.',
      images: [`${base}/opengraph-image`],
    },
  };
}

export default async function ContactoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const path = 'contacto';
  const url = isEn ? `${base}/en/${path}` : `${base}/${path}`;

  const contactSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        name: isEn ? 'Contact — Mudate Argentina' : 'Contacto — Mudate Argentina',
        url,
        description: isEn
          ? 'Contact Mudate Argentina to list your property or ask about real estate in Argentina.'
          : 'Contactanos para publicar tu propiedad o consultar sobre inmuebles en Argentina.',
        mainEntity: {
          '@type': 'Organization',
          name: 'Mudate Argentina',
          url: base,
          email: 'hola@mudateargentina.com',
          areaServed: 'AR',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: base },
          { '@type': 'ListItem', position: 2, name: isEn ? 'Contact' : 'Contacto', item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactoClient />
    </>
  );
}
