'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { useCallback } from 'react';

const TIPOS = ['Todos', 'Casa', 'Departamento', 'Terreno', 'Local', 'Oficina', 'Campo'];
const PROVINCIAS = [
  'Todas',
  'Córdoba',
  'Buenos Aires',
  'Santa Fe',
  'Mendoza',
  'Tucumán',
  'Salta',
  'Entre Ríos',
  'Misiones',
  'Chaco',
  'Corrientes',
  'Santiago del Estero',
  'San Juan',
  'Jujuy',
  'Río Negro',
  'Neuquén',
  'Formosa',
  'Chubut',
  'San Luis',
  'La Pampa',
  'Catamarca',
  'La Rioja',
  'Santa Cruz',
  'Tierra del Fuego',
];
const CIUDADES_POR_PROV: Record<string, string[]> = {
  Córdoba: ['Córdoba Capital', 'Villa María', 'Villa Carlos Paz', 'Río Cuarto', 'Alta Gracia', 'Jesús María', 'Carlos Paz'],
  'Buenos Aires': ['Buenos Aires Capital', 'La Plata', 'Mar del Plata', 'Bahía Blanca', 'San Isidro', 'Tigre', 'Vicente López'],
  'Santa Fe': ['Rosario', 'Santa Fe Capital', 'Rafaela', 'Venado Tuerto'],
  Mendoza: ['Mendoza Capital', 'San Rafael', 'Godoy Cruz', 'Luján de Cuyo'],
  Tucumán: ['San Miguel de Tucumán', 'Yerba Buena', 'Tafí Viejo'],
  Salta: ['Salta Capital', 'Orán', 'San Ramón de la Nueva Orán'],
};

const selectStyle: React.CSSProperties = {
  border: '1.5px solid var(--border)',
  color: 'var(--foreground)',
  background: '#fff',
  fontFamily: 'Josefin Sans, sans-serif',
  fontSize: '0.82rem',
  fontWeight: 500,
  borderRadius: 10,
  padding: '8px 12px',
  cursor: 'pointer',
  outline: 'none',
  transition: 'border-color 180ms ease, box-shadow 180ms ease',
  appearance: 'auto',
};

interface Props {
  operation?: string;
  type?: string;
  ciudad?: string;
  provincia?: string;
  price?: string;
}

export default function FilterBar({ operation, type, ciudad, provincia, price }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string, resetKeys?: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === 'todas' || value === 'todos' || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      resetKeys?.forEach((k) => params.delete(k));
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const ciudadesDisponibles = provincia && CIUDADES_POR_PROV[provincia]
    ? CIUDADES_POR_PROV[provincia]
    : Object.values(CIUDADES_POR_PROV).flat().sort();

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(153,246,228,0.4)',
        borderRadius: 16,
        padding: '14px 20px',
        marginBottom: 32,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--primary)', marginRight: 4 }}>
        <SlidersHorizontal size={15} />
        <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Filtros
        </span>
      </div>

      <select style={selectStyle} value={operation || 'venta'} onChange={(e) => updateParam('operation', e.target.value)}>
        <option value="venta">Venta</option>
        <option value="alquiler">Alquiler</option>
        <option value="">Venta y Alquiler</option>
      </select>

      <select style={selectStyle} value={type || ''} onChange={(e) => updateParam('type', e.target.value)}>
        {TIPOS.map((t) => (
          <option key={t} value={t === 'Todos' ? '' : t}>{t}</option>
        ))}
      </select>

      <select style={selectStyle} value={provincia || ''} onChange={(e) => updateParam('provincia', e.target.value, ['ciudad'])}>
        {PROVINCIAS.map((p) => (
          <option key={p} value={p === 'Todas' ? '' : p}>{p}</option>
        ))}
      </select>

      <select style={selectStyle} value={ciudad || ''} onChange={(e) => updateParam('ciudad', e.target.value)}>
        <option value="">Ciudad: todas</option>
        {ciudadesDisponibles.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select style={selectStyle} value={price || ''} onChange={(e) => updateParam('price', e.target.value)}>
        <option value="">Precio: cualquiera</option>
        <option value="0-50000">Hasta USD 50.000</option>
        <option value="50000-100000">USD 50.000 – 100.000</option>
        <option value="100000-200000">USD 100.000 – 200.000</option>
        <option value="200000-99999999">Más de USD 200.000</option>
      </select>
    </div>
  );
}
