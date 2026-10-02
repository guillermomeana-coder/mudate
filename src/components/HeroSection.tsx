'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Home, Building2, TreePine } from 'lucide-react';
import gsap from 'gsap';
import KineticGrid from './KineticGrid';
import ScrambleText from './ScrambleText';
import SearchAutocomplete from './SearchAutocomplete';

interface Props {
  subtitle: string;
  searchPlaceholder: string;
  searchBtn: string;
  labelCasa: string;
  labelDepartamento: string;
  labelTerreno: string;
}

export default function HeroSection({
  subtitle,
  searchPlaceholder,
  searchBtn,
  labelCasa,
  labelDepartamento,
  labelTerreno,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-hero-in]', {
        opacity: 0,
        y: 18,
        duration: 0.55,
        stagger: 0.12,
        ease: 'power2.out',
        delay: 0.9,
      });
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #061610 0%, #0A2218 55%, #0D3424 100%)',
        minHeight: 640,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* CSS-only grid pattern — visible immediately while KineticGrid JS loads */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          backgroundImage: `
            linear-gradient(rgba(79,255,176,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79,255,176,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <KineticGrid />

      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          backgroundImage: `
            radial-gradient(ellipse 60% 50% at 10% 60%, rgba(20,184,166,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 85% 20%, rgba(3,105,161,0.20) 0%, transparent 70%)
          `,
        }}
      />

      <div
        ref={contentRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full"
        style={{ zIndex: 10 }}
      >
        <p className="section-label" style={{ color: 'rgba(153,246,228,0.9)', marginBottom: 20 }}>
          Portal inmobiliario Argentina
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-heading), Cinzel, serif',
            fontSize: 'clamp(2.6rem, 7vw, 5.5rem)',
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: 24,
            maxWidth: 700,
          }}
        >
          <ScrambleText text="Tu próxima" delay={200} />
          <br />
          <ScrambleText text="propiedad," delay={500} />
          <br />
          <ScrambleText text="en todo el país." delay={800} style={{ color: '#5EEAD4' }} />
        </h1>

        <p
          data-hero-in
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: '1.05rem',
            fontWeight: 300,
            maxWidth: 460,
            marginBottom: 40,
            lineHeight: 1.7,
            opacity: 0,
          }}
        >
          {subtitle}
        </p>

        {/* Search with autocomplete */}
        <div data-hero-in style={{ opacity: 0 }}>
          <SearchAutocomplete placeholder={searchPlaceholder} btnLabel={searchBtn} />
        </div>

        {/* Quick filters */}
        <div
          data-hero-in
          style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20, opacity: 0 }}
        >
          {[
            { icon: <Home size={13} />, label: labelCasa, href: '/propiedades?type=Casa' },
            { icon: <Building2 size={13} />, label: labelDepartamento, href: '/propiedades?type=Departamento' },
            { icon: <TreePine size={13} />, label: labelTerreno, href: '/propiedades?type=Terreno' },
          ].map((f) => (
            <Link
              key={f.label}
              href={f.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 16px', borderRadius: 999,
                fontSize: '0.8rem', fontWeight: 500,
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(255,255,255,0.15)',
                textDecoration: 'none',
                transition: 'background 180ms ease',
              }}
            >
              {f.icon}{f.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
