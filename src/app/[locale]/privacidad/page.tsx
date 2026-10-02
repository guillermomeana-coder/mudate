import { Metadata } from 'next';
import Link from 'next/link';

const BASE = 'https://mudateargentina.com';

export const metadata: Metadata = {
  title: 'Política de Privacidad — Mudate Argentina',
  description: 'Cómo recopilamos, usamos y protegemos tu información personal en Mudate Argentina, portal inmobiliario de Córdoba y Argentina.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: `${BASE}/privacidad`,
    languages: { es: `${BASE}/privacidad`, en: `${BASE}/en/privacidad`, 'x-default': `${BASE}/privacidad` },
  },
  openGraph: {
    title: 'Política de Privacidad — Mudate Argentina',
    description: 'Cómo recopilamos, usamos y protegemos tu información personal en Mudate Argentina.',
    url: `${BASE}/privacidad`,
    type: 'website',
    images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: 'Mudate Argentina — Portal Inmobiliario' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`${BASE}/opengraph-image`],
  },
};

export default function PrivacidadPage() {
  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 100%)' }} className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
            Política de Privacidad
          </h1>
          <p className="text-white/60 mt-2 text-sm">Última actualización: septiembre 2025</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-sm max-w-none" style={{ color: 'var(--foreground)', lineHeight: '1.75' }}>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.15rem', marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--foreground)' }}>
            1. Información que recopilamos
          </h2>
          <p>Cuando completás un formulario en Mudate Argentina, recopilamos:</p>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <li>Nombre y apellido</li>
            <li>Dirección de email</li>
            <li>Número de teléfono / WhatsApp (opcional)</li>
            <li>Mensaje o consulta</li>
          </ul>
          <p>También recopilamos datos de navegación anónimos mediante cookies de análisis (Google Analytics) para mejorar la experiencia de uso.</p>

          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.15rem', marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--foreground)' }}>
            2. Uso de la información
          </h2>
          <p>Usamos tu información exclusivamente para:</p>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <li>Responder consultas sobre propiedades</li>
            <li>Conectarte con el propietario o inmobiliaria correspondiente</li>
            <li>Enviarte información relevante si lo solicitaste</li>
          </ul>
          <p>No vendemos, alquilamos ni compartimos tu información con terceros fuera del contexto de la consulta realizada.</p>

          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.15rem', marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--foreground)' }}>
            3. Almacenamiento y seguridad
          </h2>
          <p>Los datos se almacenan en servidores seguros (MongoDB Atlas) con cifrado en tránsito y en reposo. Acceso restringido solo al equipo de Mudate Argentina.</p>

          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.15rem', marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--foreground)' }}>
            4. Tus derechos
          </h2>
          <p>Tenés derecho a solicitar:</p>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <li>Acceso a los datos que tenemos sobre vos</li>
            <li>Corrección de datos incorrectos</li>
            <li>Eliminación de tus datos</li>
          </ul>
          <p>Para ejercer estos derechos escribinos a <a href="mailto:hola@mudateargentina.com" style={{ color: 'var(--primary)' }}>hola@mudateargentina.com</a>.</p>

          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.15rem', marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--foreground)' }}>
            5. Cookies
          </h2>
          <p>Usamos cookies de análisis anónimas para entender cómo se usa el sitio. Podés desactivarlas desde la configuración de tu navegador.</p>

          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.15rem', marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--foreground)' }}>
            6. Cambios a esta política
          </h2>
          <p>Podemos actualizar esta política ocasionalmente. La fecha de última actualización aparece al inicio de este documento.</p>

          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.15rem', marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--foreground)' }}>
            7. Contacto
          </h2>
          <p>Para cualquier consulta sobre privacidad contactanos en <a href="mailto:hola@mudateargentina.com" style={{ color: 'var(--primary)' }}>hola@mudateargentina.com</a>.</p>
        </div>

        <div className="mt-10">
          <Link href="/" style={{ color: 'var(--primary)', fontSize: '0.875rem', textDecoration: 'none' }}>← Volver al inicio</Link>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Política de Privacidad — Mudate Argentina', description: 'Cómo recopilamos, usamos y protegemos tu información personal en Mudate Argentina.', url: `${BASE}/privacidad`, inLanguage: 'es-AR', isPartOf: { '@type': 'WebSite', url: BASE, name: 'Mudate Argentina' } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE }, { '@type': 'ListItem', position: 2, name: 'Privacidad', item: `${BASE}/privacidad` }] }) }} />
    </div>
  );
}
