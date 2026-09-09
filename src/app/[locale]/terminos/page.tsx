import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones — Mudate Argentina',
  description: 'Términos y condiciones de uso de Mudate Argentina, portal inmobiliario.',
  robots: 'noindex',
};

export default function TerminosPage() {
  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #134E4A 0%, #0F766E 100%)' }} className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
            Términos y Condiciones
          </h1>
          <p className="text-white/60 mt-2 text-sm">Última actualización: septiembre 2025</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div style={{ color: 'var(--foreground)', lineHeight: '1.75', fontSize: '0.9rem' }}>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
            Al usar Mudate Argentina (mudateargentina.com) aceptás estos términos. Si no estás de acuerdo, no uses el sitio.
          </p>

          {[
            {
              title: '1. Naturaleza del servicio',
              body: 'Mudate Argentina es un portal informativo que indexa propiedades inmobiliarias publicadas en plataformas de terceros (como MercadoLibre). No somos una inmobiliaria ni intermediamos en operaciones de compraventa o alquiler. No somos parte en ninguna transacción entre compradores y vendedores.',
            },
            {
              title: '2. Exactitud de la información',
              body: 'Los datos de propiedades (precios, superficies, disponibilidad) son obtenidos de fuentes públicas y pueden estar desactualizados. Mudate Argentina no garantiza la exactitud ni vigencia de la información. Siempre verificá directamente con el vendedor o inmobiliaria.',
            },
            {
              title: '3. Uso permitido',
              body: 'Podés usar este sitio para buscar propiedades, comparar mercados y obtener información general. Está prohibido: scraping automatizado del sitio, reproducción masiva del contenido, uso del sitio para actividades fraudulentas o ilegales.',
            },
            {
              title: '4. Publicación de propiedades',
              body: 'Si publicás una propiedad a través de nuestro formulario de contacto, garantizás que tenés autorización para hacerlo y que la información provista es verídica. Podemos rechazar o eliminar publicaciones sin previo aviso.',
            },
            {
              title: '5. Responsabilidad',
              body: 'Mudate Argentina no se responsabiliza por pérdidas económicas, decisiones tomadas basándose en la información del sitio, o problemas derivados de transacciones entre usuarios. El uso del sitio es bajo tu propia responsabilidad.',
            },
            {
              title: '6. Propiedad intelectual',
              body: 'El diseño, código y contenido editorial del sitio es propiedad de Mudate Argentina. Las fotografías de propiedades pertenecen a sus respectivos propietarios o fuentes originales.',
            },
            {
              title: '7. Modificaciones',
              body: 'Podemos modificar estos términos en cualquier momento. Cambios importantes serán notificados en el sitio. El uso continuado implica aceptación de los términos vigentes.',
            },
            {
              title: '8. Legislación aplicable',
              body: 'Estos términos se rigen por la legislación argentina. Cualquier disputa se someterá a los tribunales ordinarios de la ciudad de Córdoba, Argentina.',
            },
          ].map(({ title, body }) => (
            <div key={title} style={{ marginBottom: '1.75rem' }}>
              <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>
                {title}
              </h2>
              <p style={{ color: 'var(--muted-foreground)' }}>{body}</p>
            </div>
          ))}

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
              Consultas: <a href="mailto:hola@mudateargentina.com" style={{ color: 'var(--primary)' }}>hola@mudateargentina.com</a>
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/" style={{ color: 'var(--primary)', fontSize: '0.875rem', textDecoration: 'none' }}>← Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
