import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, TrendingUp, Home, ArrowRight, CheckCircle } from 'lucide-react';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';

export const metadata: Metadata = {
  title: 'Propiedades en Villa Carlos Paz — Casas y Departamentos con Vista al Lago',
  description:
    'Encontrá propiedades en Villa Carlos Paz. Destino turístico número 1 de Córdoba, con rentabilidades de 7-8% USD para alquiler vacacional.',
};

const stats = [
  { label: 'Casa con lago', value: 'USD 250.000' },
  { label: 'Departamento 2amb', value: 'USD 95.000' },
  { label: 'Casa sierras', value: 'USD 180.000' },
  { label: 'Visitantes/año', value: '3.000.000+' },
];

const porqueInvertir = [
  'Destino turístico número 1 de Córdoba — demanda vacacional todo el año',
  'Capital rentabilidad: alquileres turísticos 7-8% anual en USD',
  'Precios aún accesibles vs otros destinos de montaña (Bariloche 3x más caro)',
  'Lago San Roque y sierras — entorno natural inigualable',
  '3 millones de turistas/año generan demanda constante',
  'Desarrollo de complejos y cabañas de alto rendimiento',
];

const barrios = [
  { name: 'Costa del Lago', desc: 'La ubicación más buscada para alquiler', tipo: 'casas / complejos' },
  { name: 'Centro', desc: 'Comercial y con alta rotación turística', tipo: 'departamentos' },
  { name: 'Las Jarillas', desc: 'Zona residencial consolidada', tipo: 'casas' },
  { name: 'Cabalango', desc: 'Sierras exclusivas y tranquilidad', tipo: 'chalets' },
];

const properties: PropertyCardData[] = [
  { slug: 'casa-villa-carlos-paz-lago', title: 'Casa con vista al lago — Zona Centro', price: 250000, currency: 'USD', operation: 'venta', type: 'casa', ciudad: 'Villa Carlos Paz', barrio: 'Zona Centro', ambientes: 5, dormitorios: 4, banos: 3, superficie_cubierta: 220, images: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80'] },
];

export default function VillaCarlosPazPage() {
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
            Villa Carlos Paz
          </h1>
          <p className="text-xl text-white/70 font-light max-w-xl mb-8">
            El destino turístico número 1 de Córdoba. Lago San Roque, sierras y rentabilidades de 7-8% anual en USD.
          </p>
          <div className="flex gap-3">
            <Link href="/propiedades?ciudad=villa-carlos-paz" className="px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer" style={{ background: 'var(--accent)' }}>
              Ver propiedades
            </Link>
            <Link href="/invertir#villa-carlos-paz" className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
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
              <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Villa Carlos Paz</p>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>Propiedades disponibles</h2>
            </div>
            <Link href="/propiedades?ciudad=villa-carlos-paz" className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--primary)' }}>
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
                Invertir en Villa Carlos Paz
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
            name: 'Mudate — Villa Carlos Paz',
            description: 'Portal inmobiliario de Villa Carlos Paz, Córdoba Argentina',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Villa Carlos Paz',
              addressRegion: 'Córdoba',
              addressCountry: 'AR',
            },
            url: 'https://mudateargentina.com/villa-carlos-paz',
            areaServed: {
              '@type': 'City',
              name: 'Villa Carlos Paz',
            },
          }),
        }}
      />
    </div>
  );
}
