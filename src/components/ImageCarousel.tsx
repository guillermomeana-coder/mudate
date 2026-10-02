'use client';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';

interface Props {
  images: string[];
  alt: string;
  priority?: boolean;
  height?: number;
}

const FALLBACK = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80';

export default function ImageCarousel({ images, alt, priority = false, height = 240 }: Props) {
  const imgs = images.length > 0 ? images : [FALLBACK];
  const [idx, setIdx] = useState(0);
  const total = imgs.length;

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i - 1 + total) % total);
  }, [total]);

  const next = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i + 1) % total);
  }, [total]);

  return (
    <div className="relative overflow-hidden" style={{ height }}>
      <Image
        src={imgs[idx]}
        alt={`${alt} — foto ${idx + 1}`}
        fill
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        className="object-cover transition-opacity duration-300"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(10,31,20,0.78) 0%, rgba(10,31,20,0.15) 45%, transparent 70%)',
        }}
      />

      {/* Navigation arrows — only if more than 1 image */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Foto anterior"
            className="carousel-nav-btn"
            style={{
              position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 200ms ease',
              zIndex: 5,
            }}
          >
            <ChevronLeft size={14} color="#fff" />
          </button>
          <button
            onClick={next}
            aria-label="Foto siguiente"
            className="carousel-nav-btn"
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 200ms ease',
              zIndex: 5,
            }}
          >
            <ChevronRight size={14} color="#fff" />
          </button>

          {/* Dots */}
          <div
            style={{
              position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 4, zIndex: 5,
            }}
          >
            {imgs.slice(0, 5).map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === idx ? 16 : 5, height: 5, borderRadius: 3,
                  background: i === idx ? '#fff' : 'rgba(255,255,255,0.45)',
                  transition: 'width 200ms ease, background 200ms ease',
                }}
              />
            ))}
            {total > 5 && (
              <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.6)', alignSelf: 'center', marginLeft: 2 }}>
                +{total - 5}
              </span>
            )}
          </div>
        </>
      )}

      {/* Photo count badge */}
      {total > 1 && (
        <div
          className="absolute top-3 right-3"
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(6px)',
            borderRadius: 20, padding: '3px 9px',
            fontSize: '0.68rem', color: '#fff', fontWeight: 500,
            zIndex: 5,
          }}
        >
          <Images size={10} />
          {idx + 1}/{total}
        </div>
      )}
    </div>
  );
}
