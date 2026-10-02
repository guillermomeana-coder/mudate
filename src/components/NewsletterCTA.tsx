'use client';
import { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #0A1F14 0%, #0D3424 50%, #065F46 100%)',
        padding: '64px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(ellipse 50% 60% at 80% 40%, rgba(196,154,60,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', borderRadius: 999, marginBottom: 20,
            background: 'rgba(196,154,60,0.15)',
            border: '1px solid rgba(196,154,60,0.3)',
            fontSize: '0.72rem', fontWeight: 500, color: '#C49A3C',
          }}
        >
          <Mail size={12} />
          Newsletter semanal
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-heading), Cinzel, serif',
            fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.02em',
            marginBottom: 12,
          }}
        >
          Recibí oportunidades de inversión
        </h2>
        <p
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '0.9rem',
            fontWeight: 300,
            maxWidth: 440,
            margin: '0 auto 32px',
            lineHeight: 1.7,
          }}
        >
          Datos de mercado, nuevas propiedades y análisis de rentabilidad. Sin spam, solo valor.
        </p>

        {status === 'success' ? (
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 12,
              background: 'rgba(4,120,87,0.2)',
              border: '1px solid rgba(4,120,87,0.4)',
              color: '#5EEAD4', fontSize: '0.9rem', fontWeight: 500,
            }}
          >
            <Check size={16} />
            Te suscribiste correctamente
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              maxWidth: 480,
              margin: '0 auto',
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="newsletter-input"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                padding: '12px 24px',
                borderRadius: '0 12px 12px 0',
                background: 'var(--accent)',
                color: '#fff',
                fontFamily: 'var(--font-body), Josefin Sans, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                cursor: status === 'loading' ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                opacity: status === 'loading' ? 0.7 : 1,
                transition: 'opacity 180ms ease',
                flexShrink: 0,
              }}
            >
              {status === 'loading' ? 'Enviando...' : (
                <>Suscribirme <ArrowRight size={14} /></>
              )}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: 12 }}>
            Hubo un error. Intentá de nuevo.
          </p>
        )}

        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: 16 }}>
          +2.400 inversores ya reciben nuestro análisis semanal
        </p>
      </div>
    </section>
  );
}
