import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #061610 0%, #0A2218 55%, #0D3424 100%)',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(79,255,176,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79,255,176,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 10, padding: '40px 20px' }}>
        <p
          style={{
            fontFamily: 'var(--font-heading), Cinzel, serif',
            fontSize: 'clamp(5rem, 15vw, 10rem)',
            fontWeight: 700,
            color: 'rgba(196,154,60,0.15)',
            lineHeight: 1,
            marginBottom: -20,
          }}
        >
          404
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-heading), Cinzel, serif',
            fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
            fontWeight: 600,
            color: '#fff',
            marginBottom: 12,
          }}
        >
          Página no encontrada
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.9rem',
            fontWeight: 300,
            maxWidth: 400,
            margin: '0 auto 36px',
            lineHeight: 1.7,
          }}
        >
          La propiedad o página que buscás no existe o fue eliminada.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 12,
              background: 'var(--accent)', color: '#fff',
              fontFamily: 'var(--font-body), Josefin Sans, sans-serif',
              fontSize: '0.85rem', fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <Home size={15} /> Ir al inicio
          </Link>
          <Link
            href="/propiedades"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 12,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              fontFamily: 'var(--font-body), Josefin Sans, sans-serif',
              fontSize: '0.85rem', fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <Search size={15} /> Ver propiedades
          </Link>
        </div>
      </div>
    </div>
  );
}
