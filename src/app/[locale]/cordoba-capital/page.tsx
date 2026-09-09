import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, TrendingUp, Home, ArrowRight, CheckCircle } from 'lucide-react';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';

export const metadata: Metadata = {
  title: 'Propiedades en Córdoba Capital — Casas y Departamentos',
  description:
    'Encontrá propiedades en Córdoba Capital. Departamento promedio USD 125.000. El mercado inmobiliario más grande del interior argentino.',
};

const stats = [
  { label: 'Departamento promedio', value: 'USD 125.000' },
  { label: '2 ambientes', value: 'USD 90.000' },
  { label: '3 ambientes', value: 'USD 140.000' },
  { label: 'Habitantes', value: '1.500.000+' },
];

const porqueInvertir = [
  'Capital de la provincia de Córdoba — centro económico y financiero',
  'Mayor polo universitario del interior (UNC, UTN, UCC): 200.000 estudiantes',
  'Mercado inmobiliario consolidado con demanda permanente',
  'Precio promedio 50% menor que CABA con rentabilidades superiores',
  'Hub de conectividad: aeropuerto internacional, rutas y autopistas',
  'Desarrollos nuevos en corredores norte y noroeste (2025-2026)',
];

const barrios = [
  { name: 'Nueva Córdoba', desc: 'El barrio universitario más buscado', tipo: 'departamentos' },
  { name: 'Güemes', desc: 'Bohemio y en plena consolidación', tipo: 'departamentos / lofts' },
  { name: 'Palermo Norte', desc: 'Zona familiar de alta demanda', tipo: 'casas' },
  { name: 'General Paz', desc: 'Residencial tradicional y central', tipo: 'casas / deptos' },
];

const properties: PropertyCardData[] = [
  { slug: 'casa-nueva-cordoba-3-dormitorios', title: 'Casa 3 dormitorios — Nueva Córdoba', price: 185000, currency: 'USD', operation: 'venta', type: 'casa', ciudad: 'Córdoba Capital', barrio: 'Nueva Córdoba', ambientes: 4, dormitorios: 3, banos: 2, superficie_cubierta: 145, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'] },
  { slug: 'terreno-cordoba-noroeste', title: 'Terreno — Corredor Noroeste', price: 45000, currency: 'USD', operation: 'venta', type: 'terreno', ciudad: 'Córdoba Capital', barrio: 'Noroeste', ambientes: 0, dormitorios: 0, banos: 0, superficie_cubierta: 600, images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'] },
  { slug: 'departamento-3-ambientes-general-paz', title: 'Departamento 3 ambientes — General Paz', price: 95000, currency: 'USD', operation: 'venta', type: 'departamento', ciudad: 'Córdoba Capital', barrio: 'General Paz', ambientes: 3, dormitorios: 2, banos: 1, superficie_cubierta: 78, images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'] },
];

export default function CordobaCapitalPage() {
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
            Córdoba Capital
          </h1>
          <p className="text-xl text-white/70 font-light max-w-xl mb-8">
            El mercado inmobiliario más grande del interior argentino. Precios 50% por debajo de CABA con rentabilidades superiores.
          </p>
          <div className="flex gap-3">
            <Link href="/propiedades?ciudad=cordoba-capital" className="px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer" style={{ background: 'var(--accent)' }}>
              Ver propiedades
            </Link>
            <Link href="/invertir#cordoba-capital" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
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
              <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Córdoba Capital</p>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Propiedades disponibles</h2>
            </div>
            <Link href="/propiedades?ciudad=cordoba-capital" className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--primary)' }}>
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
                Invertir en Córdoba Capital
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
            name: 'Mudate — Córdoba Capital',
            description: 'Portal inmobiliario de Córdoba Capital, Argentina',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Córdoba',
              addressRegion: 'Córdoba',
              addressCountry: 'AR',
            },
            url: 'https://mudateargentina.com/cordoba-capital',
            areaServed: {
              '@type': 'City',
              name: 'Córdoba',
            },
          }),
        }}
      />
    </div>
  );
}
