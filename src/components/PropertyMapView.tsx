'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export interface CityCount {
  ciudad: string;
  count: number;
  lat: number;
  lng: number;
  provincia: string;
}

// Coordenadas de cada ciudad en Argentina
const CITY_COORDS: Record<string, { lat: number; lng: number; provincia: string }> = {
  'Córdoba Capital':                  { lat: -31.4201, lng: -64.1888, provincia: 'Córdoba' },
  'Villa María':                      { lat: -32.4072, lng: -63.2389, provincia: 'Córdoba' },
  'Villa Carlos Paz':                 { lat: -31.4197, lng: -64.4969, provincia: 'Córdoba' },
  'Río Cuarto':                       { lat: -33.1307, lng: -64.3494, provincia: 'Córdoba' },
  'Alta Gracia':                      { lat: -31.6547, lng: -64.4299, provincia: 'Córdoba' },
  'Merlo':                            { lat: -32.3435, lng: -65.0131, provincia: 'San Luis' },
  'Yerba Buena':                      { lat: -26.8153, lng: -65.3139, provincia: 'Tucumán' },
  'San Miguel de Tucumán':            { lat: -26.8083, lng: -65.2176, provincia: 'Tucumán' },
  'Santa Rosa':                       { lat: -36.6152, lng: -64.2922, provincia: 'La Pampa' },
  'San Salvador de Jujuy':            { lat: -24.1858, lng: -65.2995, provincia: 'Jujuy' },
  'San Fernando del Valle de Catamarca': { lat: -28.4696, lng: -65.7795, provincia: 'Catamarca' },
  'Santiago del Estero':              { lat: -27.7834, lng: -64.2643, provincia: 'Santiago del Estero' },
  'La Rioja':                         { lat: -29.4135, lng: -66.8567, provincia: 'La Rioja' },
  'Formosa':                          { lat: -26.1775, lng: -58.1781, provincia: 'Formosa' },
  'Buenos Aires Capital':             { lat: -34.6037, lng: -58.3816, provincia: 'Buenos Aires' },
  'GBA Norte':                        { lat: -34.4600, lng: -58.5500, provincia: 'Buenos Aires' },
  'GBA Oeste':                        { lat: -34.6200, lng: -58.7800, provincia: 'Buenos Aires' },
  'GBA Sur':                          { lat: -34.8500, lng: -58.4500, provincia: 'Buenos Aires' },
  'Rosario':                          { lat: -32.9442, lng: -60.6505, provincia: 'Santa Fe' },
  'Santa Fe':                         { lat: -31.6333, lng: -60.7000, provincia: 'Santa Fe' },
  'Mendoza':                          { lat: -32.8908, lng: -68.8272, provincia: 'Mendoza' },
  'Salta':                            { lat: -24.7859, lng: -65.4116, provincia: 'Salta' },
  'Neuquén':                          { lat: -38.9516, lng: -68.0591, provincia: 'Neuquén' },
  'Bariloche':                        { lat: -41.1335, lng: -71.3103, provincia: 'Río Negro' },
  'Comodoro Rivadavia':               { lat: -45.8645, lng: -67.4840, provincia: 'Chubut' },
  'Ushuaia':                          { lat: -54.8019, lng: -68.3030, provincia: 'Tierra del Fuego' },
  'Corrientes':                       { lat: -27.4692, lng: -58.8306, provincia: 'Corrientes' },
  'Posadas':                          { lat: -27.3671, lng: -55.8960, provincia: 'Misiones' },
  'Resistencia':                      { lat: -27.4514, lng: -58.9870, provincia: 'Chaco' },
  'Paraná':                           { lat: -31.7333, lng: -60.5333, provincia: 'Entre Ríos' },
  'San Juan':                         { lat: -31.5375, lng: -68.5364, provincia: 'San Juan' },
};

interface Props {
  cities: CityCount[];
}

function getRadius(count: number) {
  if (count >= 100) return 28;
  if (count >= 50)  return 22;
  if (count >= 30)  return 17;
  if (count >= 15)  return 13;
  return 9;
}

function navigate(ciudad: string) {
  window.location.href = `/propiedades?ciudad=${encodeURIComponent(ciudad)}`;
}

export default function PropertyMapView({ cities }: Props) {
  useEffect(() => {
    // Fix leaflet icon paths on SSR environments
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  return (
    <MapContainer
      center={[-34.0, -64.5]}
      zoom={4}
      style={{ height: '560px', width: '100%', borderRadius: 16, zIndex: 0 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {cities.map((city) => (
        <CircleMarker
          key={city.ciudad}
          center={[city.lat, city.lng]}
          radius={getRadius(city.count)}
          pathOptions={{
            fillColor: '#047857',
            fillOpacity: 0.85,
            color: '#C49A3C',
            weight: 2,
          }}
        >
          <Popup>
            <div style={{ fontFamily: 'Josefin Sans, sans-serif', minWidth: 160 }}>
              <p style={{ fontFamily: 'Cinzel, serif', fontSize: '1rem', fontWeight: 600, color: '#0A1F14', marginBottom: 2 }}>
                {city.ciudad}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#6B7260', marginBottom: 8 }}>
                {city.provincia} · {city.count} propiedades
              </p>
              <button
                onClick={() => navigate(city.ciudad)}
                style={{
                  display: 'inline-block',
                  padding: '5px 12px',
                  background: '#C49A3C',
                  color: '#fff',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                Ver propiedades →
              </button>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
