'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home } from 'lucide-react';

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
      className="sticky top-0 z-50 glass border-b"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--primary)' }}
            >
              <Home size={16} color="white" />
            </div>
            <span
              className="text-xl font-semibold"
              style={{ fontFamily: 'Cinzel, serif', color: 'var(--primary)' }}
            >
              Mudate
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200 cursor-pointer hover:opacity-70"
                style={{ color: 'var(--foreground)', letterSpacing: '0.05em' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/tasacion"
              className="text-sm font-medium cursor-pointer"
              style={{ color: 'var(--primary)' }}
            >
              Tasación gratis
            </Link>
            <Link
              href="/contacto"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer transition-all duration-200 hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Publicar propiedad
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden cursor-pointer p-2 rounded-lg"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
            style={{ color: 'var(--foreground)' }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {open && (
          <div className="md:hidden pb-4 pt-2 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium py-2 cursor-pointer"
                style={{ color: 'var(--foreground)' }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contacto"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white text-center cursor-pointer"
              style={{ background: 'var(--accent)' }}
              onClick={() => setOpen(false)}
            >
              Publicar propiedad
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
