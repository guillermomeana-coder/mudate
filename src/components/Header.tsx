'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const navLinks = [
  { href: '/propiedades', label: 'Propiedades' },
  { href: '/villa-maria', label: 'Villa María' },
  { href: '/invertir', label: 'Invertir' },
  { href: '/comparar', label: 'Comparar' },
  { href: '/blog', label: 'Blog' },
];

function LogoMark() {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: '#0A1F14',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 8L9 1L17 8" stroke="#C49A3C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 7V14H15V7" stroke="#C49A3C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.5 14V10.5H11.5V14" stroke="#C49A3C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const path = pathname.replace(/^\/(en|es)/, '') || '/';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(253, 252, 247, 0.92)',
        backdropFilter: 'blur(20px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        borderBottom: '1px solid rgba(196,154,60,0.18)',
      }}
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}
      >
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoMark />
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', fontWeight: 600, color: 'var(--foreground)', letterSpacing: '0.02em' }}>
            Mudate
          </span>
        </Link>

        <nav className="hidden md:flex" style={{ alignItems: 'center', gap: 36 }}>
          {navLinks.map((link) => {
            const active = path === link.href || (link.href !== '/' && path.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href} style={{ position: 'relative', fontSize: '0.82rem', fontWeight: active ? 600 : 500, color: active ? 'var(--primary)' : 'var(--foreground)', textDecoration: 'none', letterSpacing: '0.03em', opacity: active ? 1 : 0.72, transition: 'opacity 180ms ease, color 180ms ease', padding: '4px 0' }}>
                {link.label}
                {active && (
                  <span style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 2, borderRadius: 99, background: 'var(--accent)' }} />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 10 }}>
          <LanguageSwitcher />
          <Link href="/contacto"
            style={{ padding: '9px 20px', borderRadius: 10, background: 'var(--accent)', color: '#fff', fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.02em' }}
          >
            Publicar propiedad
          </Link>
        </div>

        <button
          style={{ cursor: 'pointer', padding: 8, borderRadius: 8, background: 'transparent', border: 'none', color: 'var(--foreground)' }}
          className="flex md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid rgba(196,154,60,0.15)', padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 4, background: 'rgba(253,252,247,0.97)' }} className="md:hidden">
          {navLinks.map((link) => {
            const mobileActive = path === link.href || (link.href !== '/' && path.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href}
                style={{ fontSize: '0.95rem', fontWeight: mobileActive ? 600 : 500, color: mobileActive ? 'var(--primary)' : 'var(--foreground)', textDecoration: 'none', padding: '10px 12px', borderBottom: '1px solid rgba(196,154,60,0.1)', borderRadius: 8, background: mobileActive ? 'rgba(4,120,87,0.06)' : 'transparent' }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
            <LanguageSwitcher />
            <Link href="/contacto"
              style={{ flex: 1, padding: '12px 20px', borderRadius: 10, background: 'var(--accent)', color: '#fff', fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}
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
