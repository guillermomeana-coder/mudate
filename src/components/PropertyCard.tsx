import Link from 'next/link';
import { MapPin, BedDouble, Bath, Square } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import FavoriteButton from './FavoriteButton';

export interface PropertyCardData {
  slug: string;
  title: string;
  price: number;
  currency: 'USD' | 'ARS';
  operation: 'venta';
  type: string;
  ciudad: string;
  barrio?: string;
  ambientes?: number;
  dormitorios?: number;
  banos?: number;
  superficie_cubierta?: number;
  images: string[];
}

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

export default function PropertyCard({ property, priority = false }: { property: PropertyCardData; priority?: boolean }) {
  return (
    <Link href={`/propiedades/${property.slug}`} className="property-card property-card-item group">

      {/* ── Image Carousel ── */}
      <div style={{ position: 'relative' }}>
        <ImageCarousel
          images={property.images}
          alt={`${property.title} en ${property.ciudad}`}
          priority={priority}
        />

        {/* Top badges + favorite */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start" style={{ zIndex: 6 }}>
          <div className="flex gap-1.5">
            <span className="badge" style={{ background: 'var(--primary)', color: '#fff' }}>
              Venta
            </span>
            <span className="badge badge-glass">
              {capitalize(property.type)}
            </span>
          </div>
          <FavoriteButton slug={property.slug} size={14} />
        </div>

        {/* Price — overlaid on image bottom */}
        <div className="absolute bottom-3 left-4" style={{ zIndex: 6 }}>
          <p
            style={{
              fontFamily: 'var(--font-heading), Cinzel, serif',
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
            fontFamily: 'var(--font-body), Josefin Sans, sans-serif',
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
