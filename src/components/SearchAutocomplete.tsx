'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building2, TrendingUp } from 'lucide-react';

interface Suggestion {
  type: 'city' | 'province' | 'property-type' | 'page';
  label: string;
  href: string;
  icon: React.ReactNode;
}

const SUGGESTIONS: Suggestion[] = [
  // Ciudades
  { type: 'city', label: 'Córdoba Capital', href: '/cordoba-capital', icon: <MapPin size={13} /> },
  { type: 'city', label: 'Buenos Aires', href: '/buenos-aires-capital', icon: <MapPin size={13} /> },
  { type: 'city', label: 'Rosario', href: '/rosario', icon: <MapPin size={13} /> },
  { type: 'city', label: 'Mendoza', href: '/mendoza', icon: <MapPin size={13} /> },
  { type: 'city', label: 'Bariloche', href: '/bariloche', icon: <MapPin size={13} /> },
  { type: 'city', label: 'Salta', href: '/salta', icon: <MapPin size={13} /> },
  { type: 'city', label: 'Villa Carlos Paz', href: '/villa-carlos-paz', icon: <MapPin size={13} /> },
  { type: 'city', label: 'Villa María', href: '/villa-maria', icon: <MapPin size={13} /> },
  { type: 'city', label: 'Mar del Plata', href: '/mar-del-plata', icon: <MapPin size={13} /> },
  { type: 'city', label: 'Neuquén', href: '/neuquen', icon: <MapPin size={13} /> },
  { type: 'city', label: 'Tucumán', href: '/tucuman', icon: <MapPin size={13} /> },
  // Tipos
  { type: 'property-type', label: 'Casas en venta', href: '/casas-en-venta', icon: <Building2 size={13} /> },
  { type: 'property-type', label: 'Departamentos en venta', href: '/departamentos-en-venta', icon: <Building2 size={13} /> },
  { type: 'property-type', label: 'Terrenos en venta', href: '/terrenos-en-venta', icon: <Building2 size={13} /> },
  { type: 'property-type', label: 'Campos', href: '/campos', icon: <Building2 size={13} /> },
  // Páginas
  { type: 'page', label: 'Guía de Inversión', href: '/invertir', icon: <TrendingUp size={13} /> },
  { type: 'page', label: 'Precio m² Córdoba', href: '/cordoba-capital/precio-m2', icon: <TrendingUp size={13} /> },
  { type: 'page', label: 'Precio m² Buenos Aires', href: '/buenos-aires-capital/precio-m2', icon: <TrendingUp size={13} /> },
  { type: 'page', label: 'Tasación Online', href: '/tasacion', icon: <TrendingUp size={13} /> },
];

interface Props {
  placeholder: string;
  btnLabel: string;
}

export default function SearchAutocomplete({ placeholder, btnLabel }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = query.length >= 2
    ? SUGGESTIONS.filter(s =>
        s.label.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected >= 0 && filtered[selected]) {
      router.push(filtered[selected].href);
    } else if (query.trim()) {
      router.push(`/propiedades?q=${encodeURIComponent(query.trim())}`);
    }
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', maxWidth: 560 }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          gap: 0,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: open && filtered.length > 0 ? '16px 16px 0 0' : 16,
          padding: 6,
          transition: 'border-radius 150ms ease',
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 12 }}>
          <Search size={17} color="rgba(255,255,255,0.6)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setSelected(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-body), Josefin Sans, sans-serif',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 24px',
            borderRadius: 12,
            background: 'var(--accent)',
            color: '#fff',
            fontFamily: 'var(--font-body), Josefin Sans, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            flexShrink: 0,
          }}
        >
          {btnLabel}
        </button>
      </form>

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0, right: 0,
            background: 'rgba(10,31,20,0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderTop: 'none',
            borderRadius: '0 0 16px 16px',
            overflow: 'hidden',
            zIndex: 50,
          }}
        >
          {filtered.map((s, i) => (
            <button
              key={`${s.href}-${i}`}
              onClick={() => {
                router.push(s.href);
                setOpen(false);
                setQuery('');
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 18px',
                background: i === selected ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'var(--font-body), Josefin Sans, sans-serif',
                transition: 'background 100ms ease',
              }}
              onMouseEnter={() => setSelected(i)}
            >
              <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{s.icon}</span>
              <span>{s.label}</span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '0.65rem',
                  color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {s.type === 'city' ? 'Ciudad' : s.type === 'property-type' ? 'Tipo' : 'Página'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
