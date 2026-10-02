import { ImageResponse } from 'next/og';

export const alt = 'Mudate — Propiedades en Argentina';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #061610 0%, #0A2218 55%, #0D3424 100%)',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Logo block */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: 'rgba(255,255,255,0.15)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: '-1px' }}>
              M
            </span>
          </div>
          <span style={{ fontSize: 52, fontWeight: 600, color: '#fff', letterSpacing: '-1px' }}>
            Mudate
          </span>
        </div>
        {/* Tagline */}
        <p
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.75)',
            fontWeight: 300,
            textAlign: 'center',
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Portal inmobiliario Argentina
        </p>
        <p
          style={{
            fontSize: 20,
            color: '#C49A3C',
            fontWeight: 500,
            marginTop: 12,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          mudateargentina.com
        </p>
      </div>
    ),
    { ...size }
  );
}
