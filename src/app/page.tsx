import Link from 'next/link';
import { Search, TrendingUp, MapPin, ArrowRight, Building2, Home, TreePine } from 'lucide-react';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';

const marketStats = [
  { label: 'Precio m² Córdoba Capital', value: 'USD 1.350', trend: '+8.5% YoY' },
  { label: 'Precio m² Villa Carlos Paz', value: 'USD 1.600', trend: '+12% YoY' },
  { label: 'Yield Nueva Córdoba', value: '6-7%', trend: 'anual bruto' },
  { label: 'Propiedades activas', value: '+3.000', trend: 'en toda la provincia' },
];

const ciudades = [
  {
    name: 'Córdoba Capital',
    slug: 'cordoba-capital',
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80',
    props: '1.800+',
    desc: 'Nueva Córdoba, General Paz, Valle Escondido',
  },
  {
    name: 'Villa María',
    slug: 'villa-maria',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    props: '178+',
    desc: 'La segunda ciudad de la provincia',
  },
  {
    name: 'Villa Carlos Paz',
    slug: 'villa-carlos-paz',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    props: '3.060+',
    desc: 'Yield turístico hasta 10% anual',
  },
];

const featuredProperties: PropertyCardData[] = [
  {
    slug: 'casa-nueva-cordoba-3-dormitorios',
    title: 'Casa moderna 3 dormitorios — Nueva Córdoba',
    price: 185000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Córdoba Capital',
    barrio: 'Nueva Córdoba',
    ambientes: 4,
    dormitorios: 3,
    banos: 2,
    superficie_cubierta: 145,
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80'],
  },
  {
    slug: 'departamento-villa-maria-2-ambientes',
    title: 'Departamento 2 ambientes — Centro Villa María',
    price: 68000,
    currency: 'USD',
    operation: 'venta',
    type: 'departamento',
    ciudad: 'Villa María',
    barrio: 'Centro',
    ambientes: 2,
    dormitorios: 1,
    banos: 1,
    superficie_cubierta: 58,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
  },
  {
    slug: 'casa-villa-carlos-paz-lago',
    title: 'Casa con vista al lago — Villa Carlos Paz',
    price: 250000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Villa Carlos Paz',
    barrio: 'Zona Centro',
    ambientes: 5,
    dormitorios: 4,
    banos: 3,
    superficie_cubierta: 220,
    images: ['https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&q=80'],
  },
  {
    slug: 'terreno-cordoba-noroeste',
    title: 'Terreno 600 m² — Corredor Noroeste',
    price: 45000,
    currency: 'USD',
    operation: 'venta',
    type: 'terreno',
    ciudad: 'Córdoba Capital',
    barrio: 'Noroeste',
    superficie_cubierta: 600,
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
  },
  {
    slug: 'departamento-alquiler-nueva-cordoba',
    title: 'Departamento en alquiler — Nueva Córdoba',
    price: 280000,
    currency: 'ARS',
    operation: 'alquiler',
    type: 'departamento',
    ciudad: 'Córdoba Capital',
    barrio: 'Nueva Córdoba',
    ambientes: 2,
    dormitorios: 1,
    banos: 1,
    superficie_cubierta: 48,
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'],
  },
  {
    slug: 'casa-villa-maria-barrio-privado',
    title: 'Casa en barrio privado — Villa María',
    price: 120000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Villa María',
    barrio: 'Barrio Privado Norte',
    ambientes: 4,
    dormitorios: 3,
    banos: 2,
    superficie_cubierta: 165,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section
        className="relative min-h-[580px] flex items-center"
        style={{ background: 'linear-gradient(135deg, #134E4A 0%, #0F766E 50%, #0369A1 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, #14B8A6 0%, transparent 60%), radial-gradient(circle at 80% 20%, #0369A1 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center w-full">
          <p className="text-xs font-light mb-4" style={{ color: 'rgba(153,246,228,0.8)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Portal inmobiliario Córdoba Argentina
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold text-white mb-6 leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
            Tu próxima propiedad
            <br />
            en Córdoba
          </h1>
          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto font-light">
            Encontrá casas, departamentos y terrenos en venta y alquiler en toda la provincia.
          </p>

          {/* Search */}
          <div className="glass rounded-2xl p-3 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-white">
              <Search size={18} style={{ color: 'var(--primary)' }} />
              <input
                type="text"
                placeholder="Ciudad, barrio o dirección..."
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: 'var(--foreground)', fontFamily: 'Josefin Sans, sans-serif' }}
              />
            </div>
            <Link href="/propiedades" className="px-6 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-200 hover:opacity-90 text-center" style={{ background: 'var(--accent)' }}>
              Buscar
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {[
              { icon: <Home size={14} />, label: 'Casas', href: '/propiedades?tipo=casa' },
              { icon: <Building2 size={14} />, label: 'Departamentos', href: '/propiedades?tipo=departamento' },
              { icon: <TreePine size={14} />, label: 'Terrenos', href: '/propiedades?tipo=terreno' },
            ].map((f) => (
              <Link key={f.label} href={f.href} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-white/20" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                {f.icon}{f.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12" style={{ background: 'var(--foreground)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {marketStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>{stat.value}</p>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--secondary)', letterSpacing: '0.05em' }}>{stat.trend}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="py-20" style={{ background: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Destacadas</p>
              <h2 className="text-3xl md:text-4xl font-semibold" style={{ color: 'var(--foreground)', fontFamily: 'Cinzel, serif' }}>
                Propiedades seleccionadas
              </h2>
            </div>
            <Link href="/propiedades" className="hidden md:flex items-center gap-2 text-sm font-medium cursor-pointer" style={{ color: 'var(--primary)' }}>
              Ver todas <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((p) => (
              <PropertyCard key={p.slug} property={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CIUDADES */}
      <section className="py-20" style={{ background: 'var(--muted)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-light mb-2" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Por ciudad</p>
            <h2 className="text-3xl md:text-4xl font-semibold" style={{ color: 'var(--foreground)', fontFamily: 'Cinzel, serif' }}>Explorá Córdoba</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ciudades.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="relative group overflow-hidden rounded-2xl h-64 cursor-pointer block" style={{ boxShadow: 'var(--shadow-lg)' }}>
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${c.img})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-1"><MapPin size={14} /><span className="text-xs opacity-70">{c.props} propiedades</span></div>
                  <h3 className="text-xl font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>{c.name}</h3>
                  <p className="text-xs opacity-70 mt-1">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INVERTIR CTA */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0369A1 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            <TrendingUp size={14} />
            <span>Córdoba: mercado en expansión 2026</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
            Invertí en bienes raíces<br />en Córdoba
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto font-light">
            Nueva Córdoba rinde 6-7% anual. Villa Carlos Paz hasta 10% turístico. Datos reales por zona.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/invertir" className="px-8 py-4 rounded-xl font-semibold text-white cursor-pointer transition-all duration-200 hover:opacity-90" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
              Ver guía de inversión
            </Link>
            <Link href="/propiedades" className="px-8 py-4 rounded-xl font-semibold cursor-pointer transition-all duration-200 hover:opacity-90" style={{ background: 'white', color: 'var(--primary)' }}>
              Ver propiedades en venta
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
