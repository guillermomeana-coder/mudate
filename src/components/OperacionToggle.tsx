'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface Props {
  operation?: string;
  labelAll?: string;
  labelVenta?: string;
  labelAlquiler?: string;
}

type OperacionValue = '' | 'venta' | 'alquiler';

const OPTIONS: OperacionValue[] = ['', 'venta', 'alquiler'];

export default function OperacionToggle({
  operation,
  labelAll = 'Todo',
  labelVenta = 'Venta',
  labelAlquiler = 'Alquiler',
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const labels: Record<OperacionValue, string> = {
    '': labelAll,
    venta: labelVenta,
    alquiler: labelAlquiler,
  };

  const active = (operation ?? '') as OperacionValue;

  const handleClick = useCallback(
    (value: OperacionValue) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === '') {
        params.delete('operation');
      } else {
        params.set('operation', value);
      }
      // Reset to page 1 when changing operation
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        marginBottom: 24,
      }}
    >
      {OPTIONS.map((value) => {
        const isActive = active === value;
        return (
          <button
            key={value === '' ? '__todo__' : value}
            onClick={() => handleClick(value)}
            style={{
              padding: '8px 22px',
              borderRadius: 999,
              fontSize: '0.82rem',
              fontWeight: 600,
              fontFamily: 'Josefin Sans, sans-serif',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              border: isActive ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
              background: isActive ? 'var(--primary)' : 'var(--card)',
              color: isActive ? '#fff' : 'var(--foreground)',
              transition: 'background 160ms ease, color 160ms ease, border-color 160ms ease',
              outline: 'none',
            }}
          >
            {labels[value]}
          </button>
        );
      })}
    </div>
  );
}
