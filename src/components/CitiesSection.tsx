'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { MapPin, TrendingUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ciudades = [
  {
    name: 'Córdoba Capital',
    slug: 'cordoba-capital',
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    props: '1.800+',
    desc: 'Nueva Córdoba, General Paz, Valle Escondido',
    highlight: 'Cap rate 5%',
    featured: true,
  },
  {
    name: 'Buenos Aires',
    slug: 'buenos-aires-capital',
    img: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80',
    props: '2.400+',
    desc: 'Palermo, Recoleta, Belgrano, Puerto Madero',
    highlight: 'Mayor liquidez',
    featured: true,
  },
  {
    name: 'Villa Carlos Paz',
    slug: 'villa-carlos-paz',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    props: '3.060+',
    desc: 'Yield turístico hasta 10% anual',
    highlight: 'Top rentabilidad',
    featured: true,
  },
  {
    name: 'Rosario',
    slug: 'rosario',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    props: '950+',
    desc: 'Fisherton, Centro, Pichincha',
    highlight: null,
    featured: false,
  },
  {
    name: 'Mendoza',
    slug: 'mendoza',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    props: '720+',
    desc: 'Capital, Godoy Cruz, Luján de Cuyo',
    highlight: 'Valorización USD',
    featured: false,
  },
  {
    name: 'Bariloche',
    slug: 'bariloche',
    img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80',
    props: '560+',
    desc: 'Llao Llao, Centro, Km 8-12',
    highlight: 'Turismo premium',
    featured: false,
  },
  {
    name: 'Villa María',
    slug: 'villa-maria',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    props: '178+',
    desc: 'Cap rate 6.5-7%, demanda universitaria',
    highlight: 'Mejor yield interior',
    featured: false,
  },
  {
    name: 'Salta',
    slug: 'salta',
    img: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
    props: '340+',
    desc: 'Centro, Tres Cerritos, San Lorenzo',
    highlight: null,
    featured: false,
  },
];

export default function CitiesSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!ref.current) return;

    const cards = ref.current.querySelectorAll('[data-city-card]');
    gsap.from(cards, {
      opacity: 0,
      y: 36,
      scale: 0.96,
      duration: 0.65,
      stagger: 0.1,
      ease: 'power2.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, []);

  const featured = ciudades.filter(c => c.featured);
  const rest = ciudades.filter(c => !c.featured);

  return (
    <section ref={ref} style={{ background: 'var(--muted)', padding: '80px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="section-label" style={{ marginBottom: 8 }}>Destinos</p>
          <h2
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              fontWeight: 600,
              color: 'var(--foreground)',
              letterSpacing: '-0.02em',
            }}
          >
            Explorá todo el país
          </h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', fontWeight: 300, marginTop: 8, maxWidth: 480, margin: '8px auto 0' }}>
            Desde la capital hasta la Patagonia, encontrá tu próxima inversión.
          </p>
        </div>

        {/* Featured — 3 grandes */}
        <div
          className="cities-featured-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 16,
          }}
        >
          {featured.map((c) => (
            <CityCard key={c.slug} city={c} height={280} />
          ))}
        </div>

        {/* Rest — 5 más chicas */}
        <div
          className="cities-rest-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 16,
          }}
        >
          {rest.map((c) => (
            <CityCard key={c.slug} city={c} height={200} compact />
          ))}
        </div>
      </div>
    </section>
  );
}

function CityCard({ city, height, compact }: { city: typeof ciudades[number]; height: number; compact?: boolean }) {
  return (
    <Link
      href={`/${city.slug}`}
      data-city-card
      className="group city-card-responsive"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
        height,
        display: 'block',
        textDecoration: 'none',
        boxShadow: 'var(--shadow-md)',
        transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 300ms ease',
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${city.img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 500ms ease',
        }}
        className="group-hover:scale-105"
      />
      <div
        style={{
          position: 'absolute', inset: 0,
          background: compact
            ? 'linear-gradient(to top, rgba(10,31,20,0.88) 0%, rgba(10,31,20,0.35) 60%, transparent 100%)'
            : 'linear-gradient(to top, rgba(10,31,20,0.82) 0%, rgba(10,31,20,0.2) 50%, transparent 100%)',
        }}
      />

      {/* Highlight badge */}
      {city.highlight && (
        <div
          style={{
            position: 'absolute', top: 12, right: 12,
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 20,
            background: 'rgba(196,154,60,0.9)',
            backdropFilter: 'blur(6px)',
            fontSize: '0.65rem', fontWeight: 600, color: '#fff',
            letterSpacing: '0.02em', textTransform: 'uppercase',
          }}
        >
          <TrendingUp size={10} />
          {city.highlight}
        </div>
      )}

      <div style={{ position: 'absolute', bottom: 0, left: 0, padding: compact ? '14px 16px' : '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
          <MapPin size={11} color="rgba(255,255,255,0.6)" />
          <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>
            {city.props} propiedades
          </span>
        </div>
        <h3
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: compact ? '0.95rem' : '1.2rem',
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.01em',
            marginBottom: compact ? 0 : 3,
          }}
        >
          {city.name}
        </h3>
        {!compact && (
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>{city.desc}</p>
        )}
      </div>
    </Link>
  );
}
