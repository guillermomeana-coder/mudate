'use client';
import { TrendingUp } from 'lucide-react';
import KineticGrid from './KineticGrid';
import MagneticBtn from './MagneticBtn';

export default function InvestCTA() {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #0D3B37 0%, #0F766E 60%, #0369A1 100%)',
        padding: '96px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <KineticGrid />

      <div
        className="max-w-4xl mx-auto px-4"
        style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}
      >
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 18px', borderRadius: 999, marginBottom: 28,
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.15)',
            fontSize: '0.78rem', fontWeight: 500, color: '#5EEAD4',
          }}
        >
          <TrendingUp size={13} />
          Córdoba: mercado en expansión 2026
        </div>

        <h2
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          Invertí en bienes raíces<br />
          <span style={{ color: '#5EEAD4' }}>con datos reales.</span>
        </h2>

        <p
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '1rem',
            fontWeight: 300,
            maxWidth: 440,
            margin: '0 auto 36px',
            lineHeight: 1.7,
          }}
        >
          Nueva Córdoba rinde 6-7% anual. Villa Carlos Paz hasta 10% turístico.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          <MagneticBtn
            href="/invertir"
            style={{
              padding: '12px 28px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.3)',
              transition: 'background 180ms ease',
            }}
          >
            Ver guía de inversión
          </MagneticBtn>
          <MagneticBtn
            href="/propiedades"
            style={{
              padding: '12px 28px',
              borderRadius: 12,
              background: '#fff',
              color: 'var(--primary)',
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Ver propiedades
          </MagneticBtn>
        </div>
      </div>
    </section>
  );
}
