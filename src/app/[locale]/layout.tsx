import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Cinzel, Josefin_Sans } from 'next/font/google';
import { routing } from '@/i18n/routing';
import '../globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-cinzel',
});

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-josefin',
});

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  const isEn = locale === 'en';
  const baseUrl = 'https://mudateargentina.com';

  return {
    title: {
      default: t('title'),
      template: `%s | Mudate`,
    },
    description: t('description'),
    keywords: isEn
      ? ['Argentina real estate', 'properties Argentina', 'buy house Argentina', 'invest real estate Córdoba', 'apartments Buenos Aires']
      : ['propiedades Argentina', 'inmuebles Córdoba', 'casas en venta Argentina', 'departamentos Buenos Aires', 'invertir Córdoba Argentina'],
    openGraph: {
      type: 'website',
      locale: isEn ? 'en_US' : 'es_AR',
      alternateLocale: isEn ? 'es_AR' : 'en_US',
      url: isEn ? `${baseUrl}/en` : baseUrl,
      siteName: 'Mudate',
      title: t('title'),
      description: t('description'),
      images: [{ url: `${baseUrl}/opengraph-image`, width: 1200, height: 630, alt: 'Mudate — Propiedades en Argentina' }],
    },
    twitter: { card: 'summary_large_image', title: t('title'), description: t('description') },
    alternates: {
      canonical: isEn ? `${baseUrl}/en` : baseUrl,
      languages: {
        'es': baseUrl,
        'en': `${baseUrl}/en`,
        'x-default': baseUrl,
      },
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://mudateargentina.com/#organization',
  name: 'Mudate',
  url: 'https://mudateargentina.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://mudateargentina.com/favicon.ico',
    width: 512,
    height: 512,
  },
  foundingDate: '2024',
  areaServed: { '@type': 'Country', name: 'Argentina' },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['Spanish', 'English'],
    email: 'hola@mudateargentina.com',
  },
  sameAs: [
    'https://www.instagram.com/mudateargentina',
    'https://www.facebook.com/mudateargentina',
    'https://twitter.com/mudatearg',
    'https://www.linkedin.com/company/mudateargentina',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://mudateargentina.com/#website',
  name: 'Mudate',
  url: 'https://mudateargentina.com',
  description: 'Portal inmobiliario Argentina — Casas, departamentos y terrenos en venta en todo el país',
  inLanguage: ['es-AR', 'en'],
  publisher: { '@id': 'https://mudateargentina.com/#organization' },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://mudateargentina.com/propiedades?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale === 'en' ? 'en' : 'es-AR'} className={`${cinzel.variable} ${josefinSans.variable} h-full`}>
      <head>
        <link rel="dns-prefetch" href="//http2.mlstatic.com" />
        <link rel="preconnect" href="https://http2.mlstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat waNumber={process.env.NEXT_PUBLIC_WA_NUMBER || '5493512345678'} waText="Hola! Vi una propiedad en Mudate y quiero más información." />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
