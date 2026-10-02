'use client';
import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, DollarSign, Percent } from 'lucide-react';

const CITIES = [
  { name: 'Córdoba Capital', avgPriceM2: 1350, avgRentMonth: 320000, appreciation: 8.5 },
  { name: 'Villa María', avgPriceM2: 850, avgRentMonth: 210000, appreciation: 6 },
  { name: 'Villa Carlos Paz', avgPriceM2: 1600, avgRentMonth: 380000, appreciation: 12 },
  { name: 'Buenos Aires', avgPriceM2: 2200, avgRentMonth: 450000, appreciation: 5 },
  { name: 'Rosario', avgPriceM2: 1100, avgRentMonth: 260000, appreciation: 7 },
  { name: 'Mendoza', avgPriceM2: 1200, avgRentMonth: 280000, appreciation: 9 },
  { name: 'Bariloche', avgPriceM2: 2000, avgRentMonth: 500000, appreciation: 10 },
  { name: 'Salta', avgPriceM2: 900, avgRentMonth: 200000, appreciation: 5.5 },
];

const USD_ARS = 1200; // Approximate exchange rate

export default function InvestCalculator() {
  const [cityIdx, setCityIdx] = useState(0);
  const [m2, setM2] = useState(50);
  const [downPaymentPct, setDownPaymentPct] = useState(100);

  const city = CITIES[cityIdx];

  const results = useMemo(() => {
    const totalPriceUSD = city.avgPriceM2 * m2;
    const downPaymentUSD = totalPriceUSD * (downPaymentPct / 100);
    const monthlyRentUSD = (city.avgRentMonth * m2) / 50 / USD_ARS; // Scale rent by m2, convert to USD
    const annualRentUSD = monthlyRentUSD * 12;
    const capRate = (annualRentUSD / totalPriceUSD) * 100;
    const yearsToRecover = totalPriceUSD / annualRentUSD;
    const appreciation5y = totalPriceUSD * Math.pow(1 + city.appreciation / 100, 5) - totalPriceUSD;
    const totalReturn5y = annualRentUSD * 5 + appreciation5y;
    const roiPct = (totalReturn5y / downPaymentUSD) * 100;

    return {
      totalPriceUSD,
      downPaymentUSD,
      monthlyRentUSD: Math.round(monthlyRentUSD),
      annualRentUSD: Math.round(annualRentUSD),
      capRate: capRate.toFixed(1),
      yearsToRecover: yearsToRecover.toFixed(1),
      appreciation5y: Math.round(appreciation5y),
      totalReturn5y: Math.round(totalReturn5y),
      roiPct: roiPct.toFixed(0),
    };
  }, [city, m2, downPaymentPct]);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1.5px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    fontFamily: 'var(--font-body), Josefin Sans, sans-serif',
    fontSize: '0.88rem',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.72rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 6,
    display: 'block',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  };

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #0A1F14 0%, #0D3424 50%, #065F46 100%)',
        padding: '80px 0',
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
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 999, marginBottom: 16,
              background: 'rgba(196,154,60,0.15)',
              border: '1px solid rgba(196,154,60,0.3)',
              fontSize: '0.72rem', fontWeight: 500, color: '#C49A3C',
            }}
          >
            <Calculator size={12} />
            Simulador de inversión
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading), Cinzel, serif',
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}
          >
            Calculá tu retorno
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', fontWeight: 300, marginTop: 8 }}>
            Estimación basada en datos reales del mercado 2025-2026
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 32,
          }}
          className="calc-grid"
        >
          {/* Inputs */}
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding: '32px 28px',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-heading), Cinzel, serif', fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: 24 }}>
              Parámetros
            </h3>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Ciudad</label>
              <select
                value={cityIdx}
                onChange={(e) => setCityIdx(Number(e.target.value))}
                style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
              >
                {CITIES.map((c, i) => (
                  <option key={c.name} value={i} style={{ background: '#0A1F14', color: '#fff' }}>
                    {c.name} — USD {c.avgPriceM2}/m²
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Superficie (m²): {m2}</label>
              <input
                type="range"
                min={25}
                max={200}
                step={5}
                value={m2}
                onChange={(e) => setM2(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#C49A3C', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                <span>25 m²</span>
                <span>200 m²</span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Pago inicial: {downPaymentPct}%</label>
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={downPaymentPct}
                onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#C49A3C', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                <span>20%</span>
                <span>100% (contado)</span>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(196,154,60,0.1)',
                border: '1px solid rgba(196,154,60,0.2)',
                borderRadius: 12,
                padding: '14px 18px',
                marginTop: 8,
              }}
            >
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Precio estimado del inmueble</p>
              <p style={{ fontFamily: 'var(--font-heading), Cinzel, serif', fontSize: '1.5rem', fontWeight: 700, color: '#C49A3C' }}>
                USD {results.totalPriceUSD.toLocaleString('es-AR')}
              </p>
              {downPaymentPct < 100 && (
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                  Pago inicial: USD {results.downPaymentUSD.toLocaleString('es-AR')}
                </p>
              )}
            </div>
          </div>

          {/* Results */}
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding: '32px 28px',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-heading), Cinzel, serif', fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: 24 }}>
              Resultados
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <ResultCard
                icon={<Percent size={16} />}
                label="Cap Rate anual"
                value={`${results.capRate}%`}
                sublabel="Retorno bruto"
                accent
              />
              <ResultCard
                icon={<DollarSign size={16} />}
                label="Renta mensual"
                value={`USD ${results.monthlyRentUSD}`}
                sublabel="Estimada"
              />
              <ResultCard
                icon={<TrendingUp size={16} />}
                label="Recupero"
                value={`${results.yearsToRecover} años`}
                sublabel="Sin valorización"
              />
              <ResultCard
                icon={<TrendingUp size={16} />}
                label="Valorización 5 años"
                value={`+USD ${results.appreciation5y.toLocaleString('es-AR')}`}
                sublabel={`+${city.appreciation}% anual`}
              />
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, rgba(4,120,87,0.2), rgba(3,105,161,0.2))',
                border: '1px solid rgba(4,120,87,0.3)',
                borderRadius: 16,
                padding: '20px 24px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Retorno total estimado (5 años)
              </p>
              <p style={{ fontFamily: 'var(--font-heading), Cinzel, serif', fontSize: '2rem', fontWeight: 700, color: '#5EEAD4' }}>
                USD {results.totalReturn5y.toLocaleString('es-AR')}
              </p>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
                ROI sobre inversión inicial: {results.roiPct}%
              </p>
            </div>

            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: 16, lineHeight: 1.5 }}>
              * Estimación basada en promedios de mercado. Los resultados reales pueden variar. No constituye asesoramiento financiero.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultCard({ icon, label, value, sublabel, accent }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '16px 14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: accent ? '#C49A3C' : 'rgba(255,255,255,0.4)' }}>
        {icon}
        <span style={{ fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <p style={{ fontFamily: 'var(--font-heading), Cinzel, serif', fontSize: '1.3rem', fontWeight: 700, color: accent ? '#C49A3C' : '#fff', marginBottom: 2 }}>
        {value}
      </p>
      <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>{sublabel}</p>
    </div>
  );
}
