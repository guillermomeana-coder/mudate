'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, BarChart3, X } from 'lucide-react';

/* ── City data ── */
interface CityData {
  id: string;
  nombre: string;
  nameEn: string;
  precioM2: number;
  capRate: number;
  valorizacion: number;
  demandaEs: string;
  demandaEn: string;
  barriosTop: string[];
  poblacion: number;
  propiedades: number;
}

const cities: CityData[] = [
  {
    id: 'cordoba',
    nombre: 'Cordoba Capital',
    nameEn: 'Cordoba Capital',
    precioM2: 1350,
    capRate: 5.0,
    valorizacion: 8.5,
    demandaEs: 'Universitaria + familiar',
    demandaEn: 'University + family',
    barriosTop: ['Nueva Cordoba', 'Gral Paz', 'Guemes'],
    poblacion: 1536000,
    propiedades: 4200,
  },
  {
    id: 'buenosaires',
    nombre: 'Buenos Aires',
    nameEn: 'Buenos Aires',
    precioM2: 2200,
    capRate: 3.8,
    valorizacion: 5.0,
    demandaEs: 'Corporativa + turismo',
    demandaEn: 'Corporate + tourism',
    barriosTop: ['Palermo', 'Recoleta', 'Belgrano'],
    poblacion: 3075000,
    propiedades: 18500,
  },
  {
    id: 'carlospaz',
    nombre: 'Villa Carlos Paz',
    nameEn: 'Villa Carlos Paz',
    precioM2: 1600,
    capRate: 7.5,
    valorizacion: 12,
    demandaEs: 'Turismo vacacional',
    demandaEn: 'Vacation tourism',
    barriosTop: ['Centro', 'Av. San Martin'],
    poblacion: 105000,
    propiedades: 980,
  },
  {
    id: 'rosario',
    nombre: 'Rosario',
    nameEn: 'Rosario',
    precioM2: 1100,
    capRate: 5.2,
    valorizacion: 7,
    demandaEs: 'Universitaria',
    demandaEn: 'University',
    barriosTop: ['Fisherton', 'Centro', 'Pichincha'],
    poblacion: 1280000,
    propiedades: 6300,
  },
  {
    id: 'mendoza',
    nombre: 'Mendoza',
    nameEn: 'Mendoza',
    precioM2: 1200,
    capRate: 4.5,
    valorizacion: 9,
    demandaEs: 'Turismo + agroindustria',
    demandaEn: 'Tourism + agribusiness',
    barriosTop: ['Godoy Cruz', 'Lujan de Cuyo'],
    poblacion: 1170000,
    propiedades: 3100,
  },
  {
    id: 'bariloche',
    nombre: 'Bariloche',
    nameEn: 'Bariloche',
    precioM2: 2000,
    capRate: 6.0,
    valorizacion: 10,
    demandaEs: 'Turismo premium',
    demandaEn: 'Premium tourism',
    barriosTop: ['Llao Llao', 'Km 8-12'],
    poblacion: 140000,
    propiedades: 750,
  },
  {
    id: 'villamaria',
    nombre: 'Villa Maria',
    nameEn: 'Villa Maria',
    precioM2: 850,
    capRate: 6.7,
    valorizacion: 6,
    demandaEs: 'Universitaria (UNVM)',
    demandaEn: 'University (UNVM)',
    barriosTop: ['Centro', 'Palermo'],
    poblacion: 100000,
    propiedades: 520,
  },
  {
    id: 'salta',
    nombre: 'Salta',
    nameEn: 'Salta',
    precioM2: 900,
    capRate: 4.8,
    valorizacion: 5.5,
    demandaEs: 'Turismo + litio',
    demandaEn: 'Tourism + lithium',
    barriosTop: ['Tres Cerritos', 'Centro'],
    poblacion: 620000,
    propiedades: 1800,
  },
];

/* ── Translations ── */
const t = {
  es: {
    sectionLabel: 'Herramienta interactiva',
    heroTitle: 'Comparar Ciudades',
    heroSub: 'Selecciona hasta 3 ciudades para comparar indicadores clave del mercado inmobiliario argentino. Datos actualizados Q3 2025.',
    selectCity: 'Seleccionar ciudad',
    addCity: 'Agregar ciudad',
    precioM2: 'Precio m\u00B2 promedio',
    capRate: 'Cap rate anual',
    valorizacion: 'Valorizacion anual',
    demanda: 'Tipo de demanda',
    barriosTop: 'Mejores barrios',
    poblacion: 'Poblacion',
    propiedades: 'Propiedades disponibles',
    best: 'Mejor',
    chartTitle: 'Comparativa visual',
    ctaTitle: 'Encontra tu inversion ideal',
    ctaSub: 'Explora propiedades en la ciudad que mejor se ajuste a tu perfil de inversion.',
    ctaBtn: 'Ver propiedades',
    remove: 'Quitar',
    noSelection: 'Selecciona al menos 2 ciudades para comenzar la comparacion.',
    priceUnit: 'USD/m\u00B2',
  },
  en: {
    sectionLabel: 'Interactive tool',
    heroTitle: 'Compare Cities',
    heroSub: 'Select up to 3 cities to compare key real estate market indicators across Argentina. Data updated Q3 2025.',
    selectCity: 'Select a city',
    addCity: 'Add city',
    precioM2: 'Avg price per m\u00B2',
    capRate: 'Annual cap rate',
    valorizacion: 'Annual appreciation',
    demanda: 'Demand type',
    barriosTop: 'Top neighborhoods',
    poblacion: 'Population',
    propiedades: 'Properties available',
    best: 'Best',
    chartTitle: 'Visual comparison',
    ctaTitle: 'Find your ideal investment',
    ctaSub: 'Browse properties in the city that best fits your investment profile.',
    ctaBtn: 'View properties',
    remove: 'Remove',
    noSelection: 'Select at least 2 cities to start comparing.',
    priceUnit: 'USD/m\u00B2',
  },
};

/* ── Helpers ── */
function formatNumber(n: number): string {
  return n.toLocaleString('es-AR');
}

function getBest(selected: CityData[], key: 'precioM2' | 'capRate' | 'valorizacion' | 'poblacion' | 'propiedades', mode: 'min' | 'max'): string {
  if (selected.length < 2) return '';
  let bestId = selected[0].id;
  let bestVal = selected[0][key];
  for (const c of selected) {
    if (mode === 'max' && c[key] > bestVal) { bestVal = c[key]; bestId = c.id; }
    if (mode === 'min' && c[key] < bestVal) { bestVal = c[key]; bestId = c.id; }
  }
  return bestId;
}

/* ── Component ── */
export default function CompararClient({ locale }: { locale: string }) {
  const isEn = locale === 'en';
  const l = isEn ? t.en : t.es;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selected = useMemo(
    () => selectedIds.map((id) => cities.find((c) => c.id === id)!).filter(Boolean),
    [selectedIds],
  );

  const available = useMemo(
    () => cities.filter((c) => !selectedIds.includes(c.id)),
    [selectedIds],
  );

  function addCity(id: string) {
    if (selectedIds.length >= 3 || selectedIds.includes(id)) return;
    setSelectedIds((prev) => [...prev, id]);
  }

  function removeCity(id: string) {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }

  // Best values
  const bestPrecio = getBest(selected, 'precioM2', 'min');
  const bestCap = getBest(selected, 'capRate', 'max');
  const bestVal = getBest(selected, 'valorizacion', 'max');
  const bestPob = getBest(selected, 'poblacion', 'max');
  const bestProp = getBest(selected, 'propiedades', 'max');

  // Max values for bar chart scaling
  const maxPrecio = Math.max(...cities.map((c) => c.precioM2));
  const maxCap = Math.max(...cities.map((c) => c.capRate));
  const maxValorizacion = Math.max(...cities.map((c) => c.valorizacion));

  return (
    <>
      {/* ── HERO ── */}
      <section
        style={{
          background: 'var(--gradient-hero)',
          padding: '100px 24px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative orbs */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(196,154,60,0.06)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(4,120,87,0.12)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <p className="section-label" style={{ marginBottom: 20 }}>
            {l.sectionLabel}
          </p>
          <h1
            style={{
              fontFamily: 'Cinzel, serif',
              color: '#FFFFFF',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: 28,
              textShadow: '0 2px 20px rgba(0,0,0,0.25)',
            }}
          >
            {l.heroTitle}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body, Josefin Sans, sans-serif)',
              color: 'rgba(240,253,250,0.88)',
              fontSize: 'clamp(1rem, 2.2vw, 1.22rem)',
              lineHeight: 1.7,
              maxWidth: 680,
              margin: '0 auto',
              fontWeight: 300,
            }}
          >
            {l.heroSub}
          </p>
        </div>
      </section>

      {/* ── SELECTOR SECTION ── */}
      <section style={{ padding: '48px 24px 24px', background: 'var(--background)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Selected city pills */}
            {selected.map((city) => (
              <div
                key={city.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 12,
                  background: 'var(--primary)',
                  color: '#fff',
                  fontFamily: 'var(--font-body, Josefin Sans, sans-serif)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                {city.nombre}
                <button
                  onClick={() => removeCity(city.id)}
                  aria-label={`${l.remove} ${city.nombre}`}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 22,
                    height: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#fff',
                    padding: 0,
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {/* Dropdown to add cities */}
            {selectedIds.length < 3 && (
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <select
                    onChange={(e) => {
                      if (e.target.value) addCity(e.target.value);
                      e.target.value = '';
                    }}
                    defaultValue=""
                    aria-label={l.addCity}
                    style={{
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      padding: '10px 42px 10px 18px',
                      borderRadius: 12,
                      border: '1.5px solid var(--border)',
                      background: '#fff',
                      fontFamily: 'var(--font-body, Josefin Sans, sans-serif)',
                      fontSize: '0.9rem',
                      color: 'var(--foreground)',
                      cursor: 'pointer',
                      minWidth: 220,
                    }}
                  >
                    <option value="" disabled>
                      {selectedIds.length === 0 ? l.selectCity : `+ ${l.addCity}`}
                    </option>
                    {available.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    style={{
                      position: 'absolute',
                      right: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: 'var(--muted-foreground)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section style={{ padding: '24px 24px 64px', background: 'var(--background)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {selected.length < 2 ? (
            <div
              className="glass"
              style={{
                borderRadius: 20,
                padding: '64px 32px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <BarChart3 size={48} style={{ color: 'var(--muted-foreground)', margin: '0 auto 20px', display: 'block' }} />
              <p
                style={{
                  fontFamily: 'var(--font-body, Josefin Sans, sans-serif)',
                  color: 'var(--muted-foreground)',
                  fontSize: '1.05rem',
                  fontWeight: 400,
                  maxWidth: 400,
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}
              >
                {l.noSelection}
              </p>
            </div>
          ) : (
            <>
              {/* ── Desktop table ── */}
              <div className="hidden md:block">
                <div
                  className="glass"
                  style={{
                    borderRadius: 20,
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                >
                  {/* Table header */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `1.6fr ${selected.map(() => '1fr').join(' ')}`,
                      background: 'var(--gradient-hero)',
                      padding: '16px 28px',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-body, Josefin Sans, sans-serif)',
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: 500,
                        fontSize: '0.78rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    />
                    {selected.map((city) => (
                      <div
                        key={city.id}
                        style={{
                          fontFamily: 'Cinzel, serif',
                          color: '#FFFFFF',
                          fontWeight: 600,
                          fontSize: '1rem',
                          textAlign: 'center',
                        }}
                      >
                        {city.nombre}
                      </div>
                    ))}
                  </div>

                  {/* Rows */}
                  {([
                    {
                      label: l.precioM2,
                      render: (c: CityData) => `USD ${formatNumber(c.precioM2)}`,
                      bestId: bestPrecio,
                    },
                    {
                      label: l.capRate,
                      render: (c: CityData) => `${c.capRate}%`,
                      bestId: bestCap,
                    },
                    {
                      label: l.valorizacion,
                      render: (c: CityData) => `${c.valorizacion}%`,
                      bestId: bestVal,
                    },
                    {
                      label: l.demanda,
                      render: (c: CityData) => (isEn ? c.demandaEn : c.demandaEs),
                      bestId: '',
                    },
                    {
                      label: l.barriosTop,
                      render: (c: CityData) => c.barriosTop.join(', '),
                      bestId: '',
                    },
                    {
                      label: l.poblacion,
                      render: (c: CityData) => formatNumber(c.poblacion),
                      bestId: bestPob,
                    },
                    {
                      label: l.propiedades,
                      render: (c: CityData) => formatNumber(c.propiedades),
                      bestId: bestProp,
                    },
                  ] as const).map((row, i) => (
                    <div
                      key={row.label}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `1.6fr ${selected.map(() => '1fr').join(' ')}`,
                        padding: '18px 28px',
                        gap: 8,
                        background: i % 2 === 0 ? 'rgba(253,252,247,0.6)' : 'rgba(255,255,255,0.85)',
                        borderBottom: '1px solid rgba(196,154,60,0.12)',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-body, Josefin Sans, sans-serif)',
                          color: 'var(--foreground)',
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {row.label}
                      </div>
                      {selected.map((city) => {
                        const isBest = row.bestId === city.id && selected.length >= 2;
                        return (
                          <div
                            key={city.id}
                            style={{
                              fontFamily: 'var(--font-body, Josefin Sans, sans-serif)',
                              color: isBest ? 'var(--accent)' : 'var(--foreground)',
                              fontWeight: isBest ? 700 : 400,
                              fontSize: '0.9rem',
                              textAlign: 'center',
                              position: 'relative',
                            }}
                          >
                            {row.render(city)}
                            {isBest && (
                              <span
                                style={{
                                  display: 'block',
                                  fontFamily: 'var(--font-body, Josefin Sans, sans-serif)',
                                  fontSize: '0.62rem',
                                  fontWeight: 600,
                                  color: 'var(--accent)',
                                  letterSpacing: '0.1em',
                                  textTransform: 'uppercase',
                                  marginTop: 2,
                                }}
                              >
                                {l.best}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Mobile cards (stacked) ── */}
              <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {selected.map((city) => (
                  <div
                    key={city.id}
                    className="glass"
                    style={{
                      borderRadius: 20,
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  >
                    {/* Card header */}
                    <div
                      style={{
                        background: 'var(--gradient-hero)',
                        padding: '20px 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: 'Cinzel, serif',
                          color: '#fff',
                          fontSize: '1.15rem',
                          fontWeight: 600,
                          margin: 0,
                        }}
                      >
                        {city.nombre}
                      </h3>
                      <button
                        onClick={() => removeCity(city.id)}
                        aria-label={`${l.remove} ${city.nombre}`}
                        style={{
                          background: 'rgba(255,255,255,0.15)',
                          border: 'none',
                          borderRadius: 8,
                          width: 30,
                          height: 30,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#fff',
                          padding: 0,
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Card rows */}
                    {([
                      { label: l.precioM2, value: `USD ${formatNumber(city.precioM2)}`, isBest: bestPrecio === city.id },
                      { label: l.capRate, value: `${city.capRate}%`, isBest: bestCap === city.id },
                      { label: l.valorizacion, value: `${city.valorizacion}%`, isBest: bestVal === city.id },
                      { label: l.demanda, value: isEn ? city.demandaEn : city.demandaEs, isBest: false },
                      { label: l.barriosTop, value: city.barriosTop.join(', '), isBest: false },
                      { label: l.poblacion, value: formatNumber(city.poblacion), isBest: bestPob === city.id },
                      { label: l.propiedades, value: formatNumber(city.propiedades), isBest: bestProp === city.id },
                    ]).map((row, i) => (
                      <div
                        key={row.label}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '14px 24px',
                          background: i % 2 === 0 ? 'rgba(253,252,247,0.6)' : 'rgba(255,255,255,0.85)',
                          borderBottom: '1px solid rgba(196,154,60,0.1)',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-body, Josefin Sans, sans-serif)',
                            color: 'var(--muted-foreground)',
                            fontSize: '0.82rem',
                            fontWeight: 500,
                          }}
                        >
                          {row.label}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-body, Josefin Sans, sans-serif)',
                            color: row.isBest ? 'var(--accent)' : 'var(--foreground)',
                            fontWeight: row.isBest ? 700 : 500,
                            fontSize: '0.9rem',
                            textAlign: 'right',
                          }}
                        >
                          {row.value}
                          {row.isBest && (
                            <span
                              style={{
                                marginLeft: 6,
                                fontSize: '0.62rem',
                                fontWeight: 600,
                                color: 'var(--accent)',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                              }}
                            >
                              {l.best}
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* ── BAR CHART ── */}
              <div style={{ marginTop: 48 }}>
                <h2
                  style={{
                    fontFamily: 'Cinzel, serif',
                    color: 'var(--foreground)',
                    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                    fontWeight: 700,
                    textAlign: 'center',
                    marginBottom: 36,
                  }}
                >
                  {l.chartTitle}
                </h2>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 28,
                  }}
                >
                  {/* Price per m2 chart */}
                  <ChartCard
                    title={l.precioM2}
                    unit={l.priceUnit}
                    data={selected.map((c) => ({
                      label: c.nombre,
                      value: c.precioM2,
                      pct: (c.precioM2 / maxPrecio) * 100,
                      isBest: c.id === bestPrecio,
                    }))}
                    accentColor="var(--primary)"
                    bestColor="var(--accent)"
                  />

                  {/* Cap Rate chart */}
                  <ChartCard
                    title={l.capRate}
                    unit="%"
                    data={selected.map((c) => ({
                      label: c.nombre,
                      value: c.capRate,
                      pct: (c.capRate / maxCap) * 100,
                      isBest: c.id === bestCap,
                    }))}
                    accentColor="var(--primary)"
                    bestColor="var(--accent)"
                  />

                  {/* Valorizacion chart */}
                  <ChartCard
                    title={l.valorizacion}
                    unit="%"
                    data={selected.map((c) => ({
                      label: c.nombre,
                      value: c.valorizacion,
                      pct: (c.valorizacion / maxValorizacion) * 100,
                      isBest: c.id === bestVal,
                    }))}
                    accentColor="var(--primary)"
                    bestColor="var(--accent)"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      {selected.length >= 2 && (
        <section style={{ padding: '64px 24px 80px', background: 'var(--muted)' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <h2
              style={{
                fontFamily: 'Cinzel, serif',
                color: 'var(--foreground)',
                fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              {l.ctaTitle}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body, Josefin Sans, sans-serif)',
                color: 'var(--muted-foreground)',
                fontSize: '1.05rem',
                lineHeight: 1.7,
                marginBottom: 32,
                fontWeight: 300,
              }}
            >
              {l.ctaSub}
            </p>
            <Link
              href="/propiedades"
              className="btn-primary"
              style={{ display: 'inline-flex' }}
            >
              {l.ctaBtn} <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

/* ── Chart Card sub-component ── */
interface BarData {
  label: string;
  value: number;
  pct: number;
  isBest: boolean;
}

function ChartCard({
  title,
  unit,
  data,
  accentColor,
  bestColor,
}: {
  title: string;
  unit: string;
  data: BarData[];
  accentColor: string;
  bestColor: string;
}) {
  return (
    <div
      className="glass"
      style={{
        borderRadius: 20,
        padding: '28px 24px',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <h3
        style={{
          fontFamily: 'Cinzel, serif',
          color: 'var(--foreground)',
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: 24,
        }}
      >
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {data.map((d) => (
          <div key={d.label}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-body, Josefin Sans, sans-serif)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  color: d.isBest ? bestColor : 'var(--foreground)',
                }}
              >
                {d.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body, Josefin Sans, sans-serif)',
                  fontSize: '0.82rem',
                  fontWeight: d.isBest ? 700 : 500,
                  color: d.isBest ? bestColor : 'var(--muted-foreground)',
                }}
              >
                {typeof d.value === 'number' && d.value >= 100
                  ? formatNumber(d.value)
                  : d.value}
                {unit === '%' ? '%' : ` ${unit}`}
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: 10,
                borderRadius: 99,
                background: 'rgba(10,31,20,0.06)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.max(d.pct, 5)}%`,
                  height: '100%',
                  borderRadius: 99,
                  background: d.isBest ? bestColor : accentColor,
                  transition: 'width 600ms cubic-bezier(0.34,1.56,0.64,1)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
