import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, TrendingUp, Home, Building2, ArrowRight, CheckCircle } from 'lucide-react';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';

export const metadata: Metadata = {
  title: 'Propiedades en Villa María, Córdoba — Casas y Departamentos',
  description:
    'Encontrá propiedades en Villa María, Córdoba. Departamento promedio USD 90.721. La segunda ciudad más importante de la provincia con mercado en crecimiento.',
};

const stats = [
  { label: 'Departamento promedio', value: 'USD 90.721' },
  { label: '2 ambientes', value: 'USD 70.889' },
  { label: '3 ambientes', value: 'USD 98.795' },
  { label: 'Habitantes', value: '100.000+' },
];

const porqueInvertir = [
  'Segunda ciudad más importante de Córdoba',
  'Fuerte polo universitario (UNVM) y comercial',
  'Precios accesibles vs Córdoba Capital (40% menos)',
  'Crecimiento sostenido del parque automotor e industria',
  'Conectividad: RN 158, tren, autopista',
  'Mercado inmobiliario en expansión 2025-2026',
];

const barrios = [
  { name: 'Centro', desc: 'El corazón comercial', tipo: 'departamentos' },
  { name: 'Residencial Norte', desc: 'Zona familiar consolidada', tipo: 'casas' },
  { name: 'Barrio Nuevo', desc: 'Desarrollo moderno', tipo: 'casas / terrenos' },
  { name: 'Palermo', desc: 'Barrio universitario', tipo: 'departamentos' },
];

const properties: PropertyCardData[] = [
  { slug: 'departamento-villa-maria-2-ambientes', title: 'Departamento 2 ambientes — Centro', price: 68000, currency: 'USD', operation: 'venta', type: 'departamento', ciudad: 'Villa María', barrio: 'Centro', ambientes: 2, dormitorios: 1, banos: 1, superficie_cubierta: 58, images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'] },
  { slug: 'casa-villa-maria-barrio-privado', title: 'Casa en barrio privado — Norte', price: 120000, currency: 'USD', operation: 'venta', type: 'casa', ciudad: 'Villa María', barrio: 'Barrio Privado Norte', ambientes: 4, dormitorios: 3, banos: 2, superficie_cubierta: 165, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'] },
  { slug: 'departamento-3-ambientes-villa-maria', title: 'Departamento 3 ambientes — Villa María', price: 98000, currency: 'USD', operation: 'venta', type: 'departamento', ciudad: 'Villa María', barrio: 'Centro', ambientes: 3, dormitorios: 2, banos: 1, superficie_cubierta: 82, images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'] },
];

export default function VillaMariaPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #134E4A 0%, #0F766E 60%, #0369A1 100%)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4" style={{ color: 'rgba(153,246,228,0.8)' }}>
            <MapPin size={14} />
            <span className="text-xs" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>Córdoba, Argentina</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Villa María
          </h1>
          <p className="text-xl text-white/70 font-light max-w-xl mb-8">
            La segunda ciudad de Córdoba. Mercado inmobiliario en crecimiento con precios 40% más accesibles que la capital.
          </p>
          <div className="flex gap-3">
            <Link href="/propiedades?ciudad=villa-maria" className="px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer" style={{ background: 'var(--accent)' }}>
              Ver propiedades
            </Link>
            <Link href="/invertir#villa-maria" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              Datos de inversión
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--foreground)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Propiedades */}
      <section style={{ background: 'var(--background)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Villa María</p>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Propiedades disponibles</h2>
            </div>
            <Link href="/propiedades?ciudad=villa-maria" className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--primary)' }}>
              Ver todas <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => <PropertyCard key={p.slug} property={p} />)}
          </div>
        </div>
      </section>

      {/* Por qué invertir */}
      <section style={{ background: 'var(--muted)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Por qué elegir</p>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
                Invertir en Villa María
              </h2>
              <ul className="flex flex-col gap-3">
                {porqueInvertir.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'var(--foreground)' }}>
                    <CheckCircle size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/invertir" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer" style={{ background: 'var(--primary)' }}>
                <TrendingUp size={16} />
                Ver análisis de inversión completo
              </Link>
            </div>
            {/* Barrios */}
            <div className="grid grid-cols-2 gap-4">
              {barrios.map((b) => (
                <div key={b.name} className="rounded-xl p-4 cursor-pointer transition-all duration-200 hover:-translate-y-1" style={{ background: 'white', boxShadow: 'var(--shadow-md)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Home size={14} style={{ color: 'var(--primary)' }} />
                    <h3 className="text-sm font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>{b.name}</h3>
                  </div>
                  <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>{b.desc}</p>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--border)', color: 'var(--primary)' }}>{b.tipo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Mudate — Villa María',
            description: 'Portal inmobiliario de Villa María, Córdoba Argentina',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Villa María',
              addressRegion: 'Córdoba',
              addressCountry: 'AR',
            },
            url: 'https://mudate.com/villa-maria',
            areaServed: {
              '@type': 'City',
              name: 'Villa María',
            },
          }),
        }}
      />
    </div>
  );
}
