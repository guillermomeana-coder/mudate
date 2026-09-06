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

function formatPrice(price: number, currency: string) {
  if (currency === 'USD') {
    return `USD ${price.toLocaleString('es-AR')}`;
  }
  return `$ ${price.toLocaleString('es-AR')}`;
}

export default function PropertyCard({ property }: { property: PropertyCardData }) {
  const img = property.images[0] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80';

  return (
    <Link href={`/propiedades/${property.slug}`} className="block property-card group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={img}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className="px-2.5 py-1 rounded-md text-xs font-semibold text-white"
            style={{ background: property.operation === 'venta' ? 'var(--primary)' : 'var(--accent)' }}
          >
            {property.operation === 'venta' ? 'Venta' : 'Alquiler'}
          </span>
          <span
            className="px-2.5 py-1 rounded-md text-xs font-semibold capitalize"
            style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--foreground)' }}
          >
            {property.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p
          className="text-xl font-bold mb-1"
          style={{ fontFamily: 'Cinzel, serif', color: 'var(--primary)' }}
        >
          {formatPrice(property.price, property.currency)}
        </p>

        <h3
          className="text-sm font-medium mb-2 line-clamp-2"
          style={{ color: 'var(--foreground)' }}
        >
          {property.title}
        </h3>

        <div
          className="flex items-center gap-1 text-xs mb-3"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <MapPin size={12} />
          <span>
            {property.barrio ? `${property.barrio}, ` : ''}
            {property.ciudad}
          </span>
        </div>

        {/* Features */}
        <div
          className="flex items-center gap-4 text-xs pt-3"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--foreground)' }}
        >
          {property.ambientes && (
            <div className="flex items-center gap-1">
              <BedDouble size={13} />
              <span>{property.ambientes} amb.</span>
            </div>
          )}
          {property.banos && (
            <div className="flex items-center gap-1">
              <Bath size={13} />
              <span>{property.banos}</span>
            </div>
          )}
          {property.superficie_cubierta && (
            <div className="flex items-center gap-1">
              <Square size={13} />
              <span>{property.superficie_cubierta} m²</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
