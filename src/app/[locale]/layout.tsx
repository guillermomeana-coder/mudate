import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import '../globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
      images: [{ url: `${baseUrl}/og-image.jpg`, width: 1200, height: 630, alt: 'Mudate — Propiedades en Argentina' }],
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
  name: 'Mudate',
  url: 'https://mudateargentina.com',
  logo: 'https://mudateargentina.com/og-image.jpg',
  sameAs: ['https://mudateargentina.com'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['Spanish', 'English'],
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Mudate',
  url: 'https://mudateargentina.com',
  description: 'Portal inmobiliario Argentina — Casas, departamentos y terrenos en venta y alquiler',
  inLanguage: ['es-AR', 'en'],
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
    <html lang={locale === 'en' ? 'en' : 'es-AR'} className="h-full">
      <head>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
