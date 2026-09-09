import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, Home, MapPin, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tasación Online de Propiedades en Córdoba — Mudate Argentina',
  description: 'Estimá el valor de tu propiedad en Córdoba, Villa María y toda Argentina. Referencia de precios por m² por zona y tipo de propiedad.',
};

const preciosPorZona = [
  { zona: 'Nueva Córdoba', tipo: 'Departamento', min: 1200, max: 1600, moneda: 'USD/m²' },
  { zona: 'Güemes', tipo: 'Departamento', min: 1000, max: 1300, moneda: 'USD/m²' },
  { zona: 'General Paz', tipo: 'Departamento', min: 1100, max: 1400, moneda: 'USD/m²' },
  { zona: 'Palermo Norte', tipo: 'Casa', min: 900, max: 1200, moneda: 'USD/m²' },
  { zona: 'Villa María Centro', tipo: 'Departamento', min: 750, max: 1000, moneda: 'USD/m²' },
  { zona: 'Villa Carlos Paz', tipo: 'Casa/Dpto', min: 1100, max: 1500, moneda: 'USD/m²' },
  { zona: 'Mendoza Capital', tipo: 'Departamento', min: 900, max: 1300, moneda: 'USD/m²' },
  { zona: 'Rosario Centro', tipo: 'Departamento', min: 1000, max: 1400, moneda: 'USD/m²' },
  { zona: 'Mar del Plata', tipo: 'Departamento', min: 1100, max: 1600, moneda: 'USD/m²' },
  { zona: 'Bariloche', tipo: 'Casa/Cabaña', min: 1500, max: 2500, moneda: 'USD/m²' },
];

const factores = [
  { icon: '📍', title: 'Ubicación', desc: 'El factor más importante. Barrio, accesibilidad, servicios cercanos.' },
  { icon: '🏗️', title: 'Antigüedad y estado', desc: 'Inmuebles nuevos o a estrenar valen 20-30% más que usados similares.' },
  { icon: '📐', title: 'Superficie', desc: 'El precio por m² baja a medida que sube la superficie (efecto lote).' },
  { icon: '🏊', title: 'Amenities', desc: 'Pileta, cochera, parrilla, seguridad suman valor en mercados competidos.' },
  { icon: '🏙️', title: 'Vista y piso', desc: 'Pisos altos con vista pueden valer 10-15% más que pisos bajos.' },
  { icon: '📈', title: 'Tendencia de la zona', desc: 'Zonas en valorización tienen mejor retorno a largo plazo.' },
];

export default function TasacionPage() {
  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #134E4A 0%, #0F766E 100%)' }} className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-light mb-2" style={{ color: 'rgba(153,246,228,0.8)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Referencia de precios 2025
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
            Tasación de propiedades
          </h1>
          <p className="text-white/70 mt-3 font-light max-w-lg mx-auto text-sm">
            Valores de referencia por m² para las principales ciudades de Argentina. Datos actualizados al cierre de 2025.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Aviso */}
        <div className="rounded-2xl p-5 mb-10 flex items-start gap-3" style={{ background: 'rgba(15,118,110,0.08)', border: '1px solid rgba(15,118,110,0.2)' }}>
          <TrendingUp size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--primary)' }}>Referencia informativa</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Estos valores son promedios de mercado basados en propiedades publicadas en Argentina durante 2025. Para una tasación precisa de tu propiedad, contactanos y te conectamos con un profesional habilitado.
            </p>
          </div>
        </div>

        {/* Tabla de precios */}
        <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
          Precios por m² por zona
        </h2>
        <div className="rounded-2xl overflow-hidden mb-12" style={{ boxShadow: 'var(--shadow-md)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead>
              <tr style={{ background: '#134E4A' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: 'white', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Zona</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: 'white', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tipo</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: 'white', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Rango</th>
              </tr>
            </thead>
            <tbody>
              {preciosPorZona.map((row, i) => (
                <tr key={row.zona} style={{ background: i % 2 === 0 ? 'white' : 'rgba(240,253,250,0.5)', borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)' }}>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} style={{ color: 'var(--primary)' }} />
                      {row.zona}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{row.tipo}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
                    USD {row.min.toLocaleString('es-AR')} – {row.max.toLocaleString('es-AR')} /m²
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Factores */}
        <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
          Factores que determinan el valor
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {factores.map((f) => (
            <div key={f.title} className="rounded-xl p-5" style={{ background: 'white', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{f.title}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)', lineHeight: '1.5' }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #134E4A 0%, #0F766E 100%)' }}>
          <Home size={28} className="mx-auto mb-3 text-white/70" />
          <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
            ¿Querés tasar tu propiedad?
          </h3>
          <p className="text-white/70 text-sm mb-5 max-w-sm mx-auto">
            Contactanos y te conectamos con un tasador habilitado en tu zona sin costo.
          </p>
          <Link href="/contacto" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', borderRadius: 12, background: 'white',
            color: 'var(--primary)', fontFamily: 'Josefin Sans, sans-serif',
            fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.05em', textDecoration: 'none',
          }}>
            Solicitar tasación <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
