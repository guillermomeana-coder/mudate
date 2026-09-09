import Link from 'next/link';
import Image from 'next/image';
import { MapPin, BedDouble, Bath, Square } from 'lucide-react';

export interface PropertyCardData {
  slug: string;
  title: string;
  price: number;
  currency: 'USD' | 'ARS';
  operation: 'venta' | 'alquiler';
  type: string;
  ciudad: string;
  barrio?: string;
  ambientes?: number;
  dormitorios?: number;
  banos?: number;
  superficie_cubierta?: number;
  images: string[];
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80';

function formatPrice(price: number, currency: string) {
  if (currency === 'USD') {
    return (
      <>
        <span style={{ fontSize: '0.7em', fontWeight: 400, opacity: 0.8, marginRight: 3 }}>USD</span>
        {price.toLocaleString('es-AR')}
      </>
    );
  }
  return (
    <>
      <span style={{ fontSize: '0.7em', fontWeight: 400, opacity: 0.8, marginRight: 2 }}>$</span>
      {price.toLocaleString('es-AR')}
    </>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function PropertyCard({ property }: { property: PropertyCardData }) {
  const img = property.images?.[0] || FALLBACK_IMAGE;

  return (
    <Link href={`/propiedades/${property.slug}`} className="property-card property-card-item group">

      {/* ── Image ── */}
      <div className="relative overflow-hidden" style={{ height: 240 }}>
        <Image
          src={img}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient overlay — bottom */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(19,78,74,0.75) 0%, rgba(19,78,74,0.15) 45%, transparent 70%)',
          }}
        />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span
            className="badge"
            style={{
              background: property.operation === 'venta' ? 'var(--primary)' : 'var(--accent)',
              color: '#fff',
            }}
          >
            {property.operation === 'venta' ? 'Venta' : 'Alquiler'}
          </span>
          <span className="badge badge-glass">
            {capitalize(property.type)}
          </span>
        </div>

        {/* Price — overlaid on image bottom */}
        <div className="absolute bottom-3 left-4">
          <p
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '1.35rem',
              fontWeight: 600,
              color: '#fff',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}
          >
            {formatPrice(property.price, property.currency)}
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '16px 20px 18px' }}>
        <h3
          style={{
            fontFamily: 'Josefin Sans, sans-serif',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--foreground)',
            lineHeight: 1.4,
            marginBottom: 8,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {property.title}
        </h3>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontSize: '0.75rem',
            color: 'var(--muted-foreground)',
            marginBottom: 12,
          }}
        >
          <MapPin size={11} style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {property.barrio ? `${property.barrio}, ` : ''}{property.ciudad}
          </span>
        </div>

        {/* Features */}
        {(property.ambientes || property.banos || property.superficie_cubierta) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              paddingTop: 10,
              borderTop: '1px solid var(--border)',
              fontSize: '0.72rem',
              color: 'var(--foreground)',
            }}
          >
            {property.ambientes && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <BedDouble size={12} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                {property.ambientes} amb.
              </span>
            )}
            {property.banos && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Bath size={12} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                {property.banos}
              </span>
            )}
            {property.superficie_cubierta && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Square size={12} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                {property.superficie_cubierta} m²
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
