import Link from 'next/link';
import { Home, MapPin, Mail } from 'lucide-react';

const ciudades = [
  { href: '/ciudad/cordoba-capital', label: 'Córdoba Capital' },
  { href: '/ciudad/rosario', label: 'Rosario' },
  { href: '/ciudad/buenos-aires-capital', label: 'Buenos Aires' },
  { href: '/ciudad/villa-carlos-paz', label: 'Villa Carlos Paz' },
  { href: '/ciudad/bariloche', label: 'Bariloche' },
  { href: '/ciudad/mendoza', label: 'Mendoza' },
];

const provincias = [
  { href: '/provincia/buenos-aires', label: 'Buenos Aires' },
  { href: '/provincia/cordoba', label: 'Córdoba' },
  { href: '/provincia/mendoza', label: 'Mendoza' },
  { href: '/provincia/santa-fe', label: 'Santa Fe' },
  { href: '/provincia/salta', label: 'Salta' },
  { href: '/provincia/tucuman', label: 'Tucumán' },
  { href: '/provincia/neuquen', label: 'Neuquén' },
  { href: '/provincia/rio-negro', label: 'Río Negro' },
];

const recursos = [
  { href: '/invertir', label: 'Guía de Inversión' },
  { href: '/campos', label: 'Campos & Rurales' },
  { href: '/blog', label: 'Blog Inmobiliario' },
  { href: '/tasacion', label: 'Tasación Online' },
  { href: '/contacto', label: 'Contacto' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--foreground)', color: 'rgba(255,255,255,0.85)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--secondary)' }}
              >
                <Home size={16} color="white" />
              </div>
              <span
                className="text-xl font-semibold text-white"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                Mudate
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ opacity: 0.7 }}>
              Tu próxima propiedad en Argentina. Conectamos compradores, vendedores e inversores
              con las mejores oportunidades del mercado.
            </p>
            <div className="flex flex-col gap-2 text-sm" style={{ opacity: 0.7 }}>
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>Argentina</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <a href="mailto:hola@mudateargentina.com" style={{ color: 'inherit', textDecoration: 'none' }}>hola@mudateargentina.com</a>
              </div>
            </div>
          </div>

          {/* Provincias */}
          <div>
            <h4
              className="text-white font-semibold mb-4 text-sm"
              style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Provincias
            </h4>
            <ul className="flex flex-col gap-2">
              {provincias.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="text-sm transition-colors duration-150 cursor-pointer hover:text-white"
                    style={{ opacity: 0.7 }}
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ciudades */}
          <div>
            <h4
              className="text-white font-semibold mb-4 text-sm"
              style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Ciudades
            </h4>
            <ul className="flex flex-col gap-2">
              {ciudades.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-sm transition-colors duration-150 cursor-pointer hover:text-white"
                    style={{ opacity: 0.7 }}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4
              className="text-white font-semibold mb-4 text-sm"
              style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Recursos
            </h4>
            <ul className="flex flex-col gap-2">
              {recursos.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="text-sm transition-colors duration-150 cursor-pointer hover:text-white"
                    style={{ opacity: 0.7 }}
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4
              className="text-white font-semibold mb-4 text-sm"
              style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Publicá tu propiedad
            </h4>
            <p className="text-sm mb-4" style={{ opacity: 0.7 }}>
              Llegá a miles de compradores e inversores en toda Córdoba.
            </p>
            <Link
              href="/contacto"
              className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer transition-all duration-200 hover:opacity-90"
              style={{ background: 'var(--primary)' }}
            >
              Publicar gratis
            </Link>
          </div>
        </div>

        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)', opacity: 0.5 }}
        >
          <span>© {new Date().getFullYear()} Mudate. Todos los derechos reservados.</span>
          <div className="flex gap-4">
            <Link href="/privacidad" className="hover:opacity-100 cursor-pointer">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:opacity-100 cursor-pointer">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
