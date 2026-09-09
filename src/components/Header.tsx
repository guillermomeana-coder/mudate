'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const navLinks = [
  { href: '/propiedades', label: 'Propiedades' },
  { href: '/villa-maria', label: 'Villa María' },
  { href: '/invertir', label: 'Invertir' },
  { href: '/blog', label: 'Blog' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(240, 253, 250, 0.85)',
        backdropFilter: 'blur(20px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        borderBottom: '1px solid rgba(153,246,228,0.3)',
      }}
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}
      >
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #0F766E, #0369A1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.8rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>M</span>
          </div>
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)', letterSpacing: '-0.01em' }}>
            Mudate
          </span>
        </Link>

        <nav className="hidden md:flex" style={{ alignItems: 'center', gap: 36 }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--foreground)', textDecoration: 'none', letterSpacing: '0.03em', opacity: 0.85, transition: 'opacity 180ms ease', padding: '4px 0' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 10 }}>
          <LanguageSwitcher />
          <Link href="/contacto"
            style={{ padding: '9px 20px', borderRadius: 10, background: 'var(--primary)', color: '#fff', fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.02em' }}
          >
            Publicar propiedad
          </Link>
        </div>

        <button
          style={{ display: 'none', cursor: 'pointer', padding: 8, borderRadius: 8, background: 'transparent', border: 'none', color: 'var(--foreground)' }}
          className="md:hidden flex"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid rgba(153,246,228,0.25)', padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 4 }} className="md:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--foreground)', textDecoration: 'none', padding: '10px 4px', borderBottom: '1px solid rgba(153,246,228,0.2)' }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
            <LanguageSwitcher />
            <Link href="/contacto"
              style={{ flex: 1, padding: '12px 20px', borderRadius: 10, background: 'var(--primary)', color: '#fff', fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}
              onClick={() => setOpen(false)}
            >
              Publicar propiedad
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
