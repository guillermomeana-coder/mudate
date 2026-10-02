'use client';
import { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Martín Rossi',
    role: 'Inversor, Córdoba Capital',
    text: 'Compré un departamento en Nueva Córdoba gracias a los datos de Mudate. El análisis de cap rate por barrio me ayudó a tomar una decisión informada. Hoy rindo 5.8% anual en dólares.',
    rating: 5,
    avatar: 'MR',
  },
  {
    name: 'Carolina Vega',
    role: 'Compradora, Villa Carlos Paz',
    text: 'Buscaba una propiedad para alquiler turístico y Mudate fue la única plataforma con datos reales de rentabilidad. Encontré mi casa en 3 semanas.',
    rating: 5,
    avatar: 'CV',
  },
  {
    name: 'James Mitchell',
    role: 'Foreign investor, Buenos Aires',
    text: 'As an expat buying in Argentina, the bilingual platform and the guide for foreign buyers were invaluable. The whole process was transparent.',
    rating: 5,
    avatar: 'JM',
  },
  {
    name: 'Luciana Peralta',
    role: 'Vendedora, Rosario',
    text: 'Publiqué mi departamento y en menos de un mes tenía 4 interesados serios. La exposición es muy buena y la plataforma es fácil de usar.',
    rating: 4,
    avatar: 'LP',
  },
];

export default function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!ref.current) return;

    const cards = ref.current.querySelectorAll('[data-testimonial]');
    gsap.from(cards, {
      opacity: 0,
      y: 28,
      duration: 0.55,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, []);

  return (
    <section ref={ref} style={{ background: 'var(--background)', padding: '80px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="section-label" style={{ marginBottom: 8 }}>Testimonios</p>
          <h2
            style={{
              fontFamily: 'var(--font-heading), Cinzel, serif',
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              fontWeight: 600,
              color: 'var(--foreground)',
              letterSpacing: '-0.02em',
            }}
          >
            Lo que dicen nuestros usuarios
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {testimonials.map((t) => (
            <div key={t.name} data-testimonial className="testimonial-card">
              <Quote size={20} style={{ color: 'var(--accent)', opacity: 0.4, marginBottom: 12 }} />
              <p
                style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.7,
                  color: 'var(--foreground)',
                  marginBottom: 20,
                  fontWeight: 300,
                }}
              >
                {t.text}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                    fontFamily: 'var(--font-heading), Cinzel, serif',
                    flexShrink: 0,
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--foreground)' }}>{t.name}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)' }}>{t.role}</p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={12} fill="#C49A3C" color="#C49A3C" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
