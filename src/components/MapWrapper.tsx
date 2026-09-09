'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Map, LayoutGrid } from 'lucide-react';
import type { CityCount } from './PropertyMapView';
import type { PropertyCardData } from './PropertyCard';
import PropertyGrid from './PropertyGrid';

const PropertyMapView = dynamic(() => import('./PropertyMapView'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 560,
        borderRadius: 16,
        background: 'var(--muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--muted-foreground)',
        fontSize: '0.875rem',
      }}
    >
      Cargando mapa...
    </div>
  ),
});

interface Props {
  properties: PropertyCardData[];
  cities: CityCount[];
  pagination?: React.ReactNode;
}

export default function MapWrapper({ properties, cities, pagination }: Props) {
  const [view, setView] = useState<'grid' | 'map'>('grid');

  const btnBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 10,
    fontSize: '0.8rem',
    fontWeight: 600,
    fontFamily: 'Josefin Sans, sans-serif',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 180ms ease',
  };

  return (
    <div>
      {/* Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button
          onClick={() => setView('grid')}
          style={{
            ...btnBase,
            background: view === 'grid' ? 'var(--primary)' : 'var(--border)',
            color: view === 'grid' ? '#fff' : 'var(--foreground)',
          }}
        >
          <LayoutGrid size={14} />
          Lista
        </button>
        <button
          onClick={() => setView('map')}
          style={{
            ...btnBase,
            background: view === 'map' ? 'var(--primary)' : 'var(--border)',
            color: view === 'map' ? '#fff' : 'var(--foreground)',
          }}
        >
          <Map size={14} />
          Mapa
        </button>
      </div>

      {view === 'grid' ? (
        <>
          <PropertyGrid properties={properties} />
          {pagination}
        </>
      ) : (
        <PropertyMapView cities={cities} />
      )}
    </div>
  );
}
