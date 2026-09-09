'use client';

import { useState } from 'react';
import { X, Phone, MessageCircle, Lock, CheckCircle } from 'lucide-react';

interface Props {
  propertySlug: string;
  propertyTitle: string;
  ciudad: string;
  waNumber: string;
  waText: string;
}

type Step = 'locked' | 'form' | 'success';

export default function LeadGate({ propertySlug, propertyTitle, ciudad, waNumber, waText }: Props) {
  const [step, setStep] = useState<Step>('locked');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', mensaje: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim() || !form.telefono.trim()) {
      setError('Nombre y teléfono son obligatorios.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, propertySlug, propertyTitle, ciudad }),
      });
      if (!res.ok) throw new Error('Error al enviar');
      setStep('success');
    } catch {
      setError('Ocurrió un error. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 10,
    border: '1.5px solid rgba(15,118,110,0.2)',
    background: 'rgba(240,253,250,0.8)',
    fontFamily: 'Josefin Sans, sans-serif',
    fontSize: '0.875rem',
    color: 'var(--foreground)',
    outline: 'none',
    transition: 'border-color 180ms ease',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    color: 'var(--primary)',
    marginBottom: 5,
    fontFamily: 'Josefin Sans, sans-serif',
  };

  return (
    <>
      {/* ── CTA panel (locked state) ── */}
      <div>
        {/* Blurred contact info teaser */}
        <div
          style={{
            position: 'relative',
            marginBottom: 12,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '14px 16px',
              background: 'rgba(15,118,110,0.06)',
              borderRadius: 12,
              border: '1px solid rgba(15,118,110,0.12)',
              filter: step === 'locked' ? 'blur(4px)' : 'none',
              userSelect: step === 'locked' ? 'none' : 'auto',
              transition: 'filter 400ms ease',
              fontFamily: 'Josefin Sans, sans-serif',
            }}
          >
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 4 }}>Contacto</p>
            <p style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '0.95rem' }}>
              {step !== 'locked' ? waNumber.replace('54', '+54 ') : '+54 9 351 ███ ████'}
            </p>
          </div>
          {step === 'locked' && (
            <div
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(240,253,250,0.6)',
                backdropFilter: 'blur(2px)',
                borderRadius: 12,
              }}
            >
              <Lock size={16} style={{ color: 'var(--primary)', opacity: 0.7 }} />
            </div>
          )}
        </div>

        {step === 'success' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a
              href={`https://wa.me/${waNumber}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '13px 16px', borderRadius: 12,
                background: '#25D366', color: '#fff',
                fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.875rem', fontWeight: 700,
                textDecoration: 'none', letterSpacing: '0.02em',
              }}
            >
              <MessageCircle size={16} />
              Escribir por WhatsApp
            </a>
            <a
              href={`tel:${waNumber}`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '12px 16px', borderRadius: 12,
                background: 'rgba(15,118,110,0.08)',
                border: '1.5px solid rgba(15,118,110,0.2)',
                color: 'var(--primary)',
                fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.875rem', fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <Phone size={15} />
              Llamar ahora
            </a>
          </div>
        ) : (
          <button
            onClick={() => { setOpen(true); setStep('form'); }}
            style={{
              width: '100%', padding: '13px 16px', borderRadius: 12,
              background: 'var(--primary)', color: '#fff', border: 'none',
              fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.875rem', fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.02em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'opacity 180ms ease',
            }}
          >
            <Phone size={15} />
            Ver contacto y consultar
          </button>
        )}

        <p
          style={{
            textAlign: 'center', fontSize: '0.72rem', marginTop: 10,
            color: 'var(--muted-foreground)', fontFamily: 'Josefin Sans, sans-serif',
          }}
        >
          {step === 'success' ? '✓ Gracias. Te responderemos pronto.' : 'Respondemos en menos de 1 hora'}
        </p>
      </div>

      {/* ── Modal ── */}
      {open && step === 'form' && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(13,59,55,0.55)',
              backdropFilter: 'blur(6px)',
            }}
          />

          {/* Modal card */}
          <div
            style={{
              position: 'relative', zIndex: 1,
              background: '#fff',
              borderRadius: 24,
              padding: '32px 28px',
              maxWidth: 440, width: '100%',
              boxShadow: '0 24px 80px rgba(15,118,110,0.18)',
            }}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'linear-gradient(135deg, #0F766E, #0369A1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <Phone size={20} color="#fff" />
              </div>
              <h3
                style={{
                  fontFamily: 'Cinzel, serif', fontSize: '1.2rem',
                  fontWeight: 600, color: 'var(--foreground)',
                  letterSpacing: '-0.01em', marginBottom: 4,
                }}
              >
                Consultar propiedad
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)', fontFamily: 'Josefin Sans, sans-serif' }}>
                Dejá tus datos y te contactamos enseguida.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Nombre *</label>
                <input
                  style={inputStyle}
                  type="text"
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Teléfono / WhatsApp *</label>
                <input
                  style={inputStyle}
                  type="tel"
                  placeholder="Ej: 351 555 1234"
                  value={form.telefono}
                  onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Email (opcional)</label>
                <input
                  style={inputStyle}
                  type="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <label style={labelStyle}>Mensaje (opcional)</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
                  placeholder="¿Qué te gustaría saber sobre esta propiedad?"
                  value={form.mensaje}
                  onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
                />
              </div>

              {error && (
                <p style={{ fontSize: '0.8rem', color: '#ef4444', fontFamily: 'Josefin Sans, sans-serif' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '13px 16px', borderRadius: 12,
                  background: loading ? 'rgba(15,118,110,0.5)' : 'var(--primary)',
                  color: '#fff', border: 'none',
                  fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.875rem', fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.02em',
                  transition: 'all 180ms ease',
                }}
              >
                {loading ? 'Enviando...' : 'Ver contacto y datos'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--muted-foreground)', fontFamily: 'Josefin Sans, sans-serif' }}>
                Tu información es privada y segura.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* ── Success modal (brief) ── */}
      {open && step === 'success' && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
        >
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(13,59,55,0.55)', backdropFilter: 'blur(6px)' }}
          />
          <div
            style={{
              position: 'relative', zIndex: 1, background: '#fff', borderRadius: 24,
              padding: '40px 32px', maxWidth: 380, width: '100%', textAlign: 'center',
              boxShadow: '0 24px 80px rgba(15,118,110,0.18)',
            }}
          >
            <CheckCircle size={48} style={{ color: '#25D366', margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.2rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: 8 }}>
              ¡Consulta enviada!
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', fontFamily: 'Josefin Sans, sans-serif', marginBottom: 24 }}>
              Te contactaremos pronto. También podés escribirnos directo por WhatsApp.
            </p>
            <a
              href={`https://wa.me/${waNumber}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '13px 24px', borderRadius: 12, background: '#25D366', color: '#fff',
                fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.875rem', fontWeight: 700,
                textDecoration: 'none', marginBottom: 10,
              }}
            >
              <MessageCircle size={16} />
              Escribir por WhatsApp ahora
            </a>
            <button
              onClick={() => setOpen(false)}
              style={{
                width: '100%', padding: '11px', borderRadius: 12, border: 'none',
                background: 'rgba(0,0,0,0.05)', cursor: 'pointer',
                fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.82rem', color: 'var(--muted-foreground)',
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
