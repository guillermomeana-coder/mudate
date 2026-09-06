import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Mudate — Propiedades en Córdoba Argentina',
    template: '%s | Mudate',
  },
  description:
    'Portal inmobiliario de Córdoba Argentina. Casas, departamentos y terrenos en venta y alquiler en Córdoba Capital, Villa María, Villa Carlos Paz y más.',
  keywords: [
    'propiedades Córdoba',
    'inmuebles Córdoba Argentina',
    'casas en venta Córdoba',
    'departamentos Villa María',
    'real estate Córdoba',
    'invertir Córdoba Argentina',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://mudate.com',
    siteName: 'Mudate',
    title: 'Mudate — Propiedades en Córdoba Argentina',
    description:
      'Portal inmobiliario de Córdoba Argentina. Encontrá tu próxima propiedad.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://mudate.com' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
