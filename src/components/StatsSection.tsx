'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  totalProperties?: number;
  totalCities?: number;
}

export default function StatsSection({ totalProperties, totalCities }: Props) {
  const ref = useRef<HTMLElement>(null);

  const marketStats = [
    { label: 'Precio m² Córdoba Capital', value: 'USD 1.350', trend: '+8.5% YoY' },
    { label: 'Precio m² Villa Carlos Paz', value: 'USD 1.600', trend: '+12% YoY' },
    { label: 'Yield Nueva Córdoba', value: '6-7%', trend: 'anual bruto' },
    {
      label: 'Propiedades activas',
      value: totalProperties ? `+${totalProperties.toLocaleString('es-AR')}` : '+3.000',
      trend: totalCities ? `en ${totalCities} ciudades` : 'en toda Argentina',
    },
  ];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!ref.current) return;

    const items = ref.current.querySelectorAll('[data-stat]');
    gsap.from(items, {
      opacity: 0,
      y: 24,
      duration: 0.55,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  }, []);

  return (
    <section ref={ref} style={{ background: 'var(--foreground)', padding: '44px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '32px 16px',
          }}
        >
          {marketStats.map((stat) => (
            <div key={stat.label} data-stat style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontFamily: 'var(--font-heading), Cinzel, serif',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#5EEAD4', letterSpacing: '0.06em', marginBottom: 2 }}>
                {stat.trend}
              </p>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
