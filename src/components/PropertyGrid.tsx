'use client';

import { useEffect, useRef } from 'react';
import type { PropertyCardData } from './PropertyCard';
import PropertyCard from './PropertyCard';

interface Props {
  properties: PropertyCardData[];
}

export default function PropertyGrid({ properties }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !properties.length) return;

    // Respeta prefers-reduced-motion
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any = null;

    import('gsap').then(({ gsap }) => {
      if (!ref.current) return;
      ctx = gsap.context(() => {
        gsap.from('.property-card-item', {
          opacity: 0,
          scale: 0.92,
          y: 24,
          duration: 0.45,
          stagger: { each: 0.06, from: 'start', grid: 'auto' },
          ease: 'back.out(1.4)',
          clearProps: 'all',
        });
      }, ref);
    });

    return () => { if (ctx) ctx.revert(); };
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
      {properties.map((p) => (
        <PropertyCard key={p.slug} property={p} />
      ))}
    </div>
  );
}
