import { Metadata } from 'next';
import { SlidersHorizontal } from 'lucide-react';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';

export const metadata: Metadata = {
  title: 'Propiedades en Córdoba — Casas, Departamentos y Terrenos',
  description:
    'Encontrá propiedades en venta y alquiler en toda la provincia de Córdoba. Casas, departamentos, terrenos y más en Córdoba Capital, Villa María, Villa Carlos Paz.',
};

const TIPOS = ['Todos', 'Casa', 'Departamento', 'Terreno', 'Local', 'Oficina', 'Campo'];
const CIUDADES = ['Todas', 'Córdoba Capital', 'Villa María', 'Villa Carlos Paz', 'Río Cuarto'];

const mockProperties: PropertyCardData[] = [
  { slug: 'casa-nueva-cordoba-3-dormitorios', title: 'Casa moderna 3 dormitorios — Nueva Córdoba', price: 185000, currency: 'USD', operation: 'venta', type: 'casa', ciudad: 'Córdoba Capital', barrio: 'Nueva Córdoba', ambientes: 4, dormitorios: 3, banos: 2, superficie_cubierta: 145, images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80'] },
  { slug: 'departamento-villa-maria-2-ambientes', title: 'Departamento 2 ambientes — Centro Villa María', price: 68000, currency: 'USD', operation: 'venta', type: 'departamento', ciudad: 'Villa María', barrio: 'Centro', ambientes: 2, dormitorios: 1, banos: 1, superficie_cubierta: 58, images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'] },
  { slug: 'casa-villa-carlos-paz-lago', title: 'Casa con vista al lago — Villa Carlos Paz', price: 250000, currency: 'USD', operation: 'venta', type: 'casa', ciudad: 'Villa Carlos Paz', barrio: 'Zona Centro', ambientes: 5, dormitorios: 4, banos: 3, superficie_cubierta: 220, images: ['https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&q=80'] },
  { slug: 'terreno-cordoba-noroeste', title: 'Terreno 600 m² — Corredor Noroeste', price: 45000, currency: 'USD', operation: 'venta', type: 'terreno', ciudad: 'Córdoba Capital', barrio: 'Noroeste', superficie_cubierta: 600, images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'] },
  { slug: 'departamento-alquiler-nueva-cordoba', title: 'Departamento en alquiler — Nueva Córdoba', price: 280000, currency: 'ARS', operation: 'alquiler', type: 'departamento', ciudad: 'Córdoba Capital', barrio: 'Nueva Córdoba', ambientes: 2, dormitorios: 1, banos: 1, superficie_cubierta: 48, images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'] },
  { slug: 'casa-villa-maria-barrio-privado', title: 'Casa en barrio privado — Villa María', price: 120000, currency: 'USD', operation: 'venta', type: 'casa', ciudad: 'Villa María', barrio: 'Barrio Privado Norte', ambientes: 4, dormitorios: 3, banos: 2, superficie_cubierta: 165, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'] },
  { slug: 'campo-cordoba-sierras', title: 'Campo 5 hectáreas — Sierras de Córdoba', price: 320000, currency: 'USD', operation: 'venta', type: 'campo', ciudad: 'Córdoba Capital', barrio: 'Sierras', superficie_cubierta: 50000, images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'] },
  { slug: 'departamento-3-ambientes-general-paz', title: 'Departamento 3 ambientes — General Paz', price: 95000, currency: 'USD', operation: 'venta', type: 'departamento', ciudad: 'Córdoba Capital', barrio: 'General Paz', ambientes: 3, dormitorios: 2, banos: 1, superficie_cubierta: 78, images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'] },
  { slug: 'casa-rio-cuarto-3-dorm', title: 'Casa 3 dormitorios — Río Cuarto', price: 98000, currency: 'USD', operation: 'venta', type: 'casa', ciudad: 'Río Cuarto', barrio: 'Centro', ambientes: 4, dormitorios: 3, banos: 2, superficie_cubierta: 130, images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'] },
];

export default function PropiedadesPage() {
  return (
    <div style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #134E4A 0%, #0F766E 100%)' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-light mb-2" style={{ color: 'rgba(153,246,228,0.8)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Córdoba Argentina</p>
          <h1 className="text-3xl md:text-5xl font-semibold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
            Propiedades en Córdoba
          </h1>
          <p className="text-white/70 mt-3 font-light">{mockProperties.length} propiedades disponibles</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="glass rounded-2xl p-5 mb-8 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2" style={{ color: 'var(--primary)' }}>
            <SlidersHorizontal size={16} />
            <span className="text-sm font-semibold">Filtros</span>
          </div>

          <select className="px-3 py-2 rounded-lg text-sm border cursor-pointer outline-none" style={{ borderColor: 'var(--border)', color: 'var(--foreground)', fontFamily: 'Josefin Sans, sans-serif' }}>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>

          <select className="px-3 py-2 rounded-lg text-sm border cursor-pointer outline-none" style={{ borderColor: 'var(--border)', color: 'var(--foreground)', fontFamily: 'Josefin Sans, sans-serif' }}>
            {TIPOS.map((t) => <option key={t} value={t.toLowerCase()}>{t}</option>)}
          </select>

          <select className="px-3 py-2 rounded-lg text-sm border cursor-pointer outline-none" style={{ borderColor: 'var(--border)', color: 'var(--foreground)', fontFamily: 'Josefin Sans, sans-serif' }}>
            {CIUDADES.map((c) => <option key={c}>{c}</option>)}
          </select>

          <select className="px-3 py-2 rounded-lg text-sm border cursor-pointer outline-none" style={{ borderColor: 'var(--border)', color: 'var(--foreground)', fontFamily: 'Josefin Sans, sans-serif' }}>
            <option>Precio: cualquiera</option>
            <option>Hasta USD 50.000</option>
            <option>USD 50.000 – 100.000</option>
            <option>USD 100.000 – 200.000</option>
            <option>Más de USD 200.000</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProperties.map((p) => (
            <PropertyCard key={p.slug} property={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
