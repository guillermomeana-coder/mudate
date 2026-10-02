'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PropertyCardData } from './PropertyCard';
import PropertyCard from './PropertyCard';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  properties: PropertyCardData[];
}

export default function PropertyGrid({ properties }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !properties.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.property-card-item', {
        opacity: 0,
        scale: 0.92,
        y: 24,
        duration: 0.5,
        stagger: { each: 0.06, from: 'start', grid: 'auto' },
        ease: 'back.out(1.4)',
        clearProps: 'all',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [properties]);

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 24,
      }}
    >
      {properties.map((p, i) => (
        <PropertyCard key={p.slug} property={p} priority={i < 3} />
      ))}
    </div>
  );
}
