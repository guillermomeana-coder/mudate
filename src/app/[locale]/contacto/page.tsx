'use client';

import { useState } from 'react';
import { Send, CheckCircle, MapPin, Mail, Phone, Clock } from 'lucide-react';

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: '', email: '', whatsapp: '', tipo: 'publicar', ciudad: '', mensaje: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          telefono: form.whatsapp,
          mensaje: form.mensaje,
          propertyTitle: form.tipo === 'publicar' ? `Publicar propiedad en ${form.ciudad || 'Argentina'}` : 'Consulta general',
          ciudad: form.ciudad || 'Argentina',
          slug: 'contacto',
        }),
      });
      if (res.ok) setStatus('ok');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #134E4A 0%, #0F766E 100%)' }} className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-light mb-2" style={{ color: 'rgba(153,246,228,0.8)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Mudate Argentina
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
            Publicá tu propiedad
          </h1>
          <p className="text-white/70 mt-3 font-light max-w-lg mx-auto text-sm">
            Llegá a compradores e inversores en toda Argentina. Gratis durante los primeros 6 meses.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-5 gap-10">
        {/* Left — info */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
              ¿Por qué publicar en Mudate?
            </h2>
            <ul className="flex flex-col gap-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {[
                'Más de 5.000 propiedades indexadas en Google',
                'Propiedades visibles en Córdoba, Buenos Aires, Mendoza y todo el país',
                'Sin comisiones por publicación',
                'Leads directos a tu email o WhatsApp',
                'Páginas optimizadas para SEO local',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: 'white', boxShadow: 'var(--shadow-md)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Contacto directo</p>
            <div className="flex flex-col gap-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <div className="flex items-center gap-2">
                <Mail size={15} style={{ color: 'var(--primary)' }} />
                <a href="mailto:hola@mudateargentina.com" style={{ color: 'inherit' }}>hola@mudateargentina.com</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={15} style={{ color: 'var(--primary)' }} />
                <span>Argentina</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} style={{ color: 'var(--primary)' }} />
                <span>Respondemos en menos de 24 horas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="md:col-span-3">
          {status === 'ok' ? (
            <div className="rounded-2xl p-10 text-center flex flex-col items-center gap-4" style={{ background: 'white', boxShadow: 'var(--shadow-lg)' }}>
              <CheckCircle size={48} style={{ color: 'var(--primary)' }} />
              <h3 className="text-xl font-semibold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
                ¡Recibido!
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Te respondemos en menos de 24 horas hábiles.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl p-8 flex flex-col gap-5" style={{ background: 'white', boxShadow: 'var(--shadow-lg)' }}>
              {/* Tipo */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--foreground)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  ¿Qué necesitás?
                </label>
                <div className="flex gap-3">
                  {[
                    { val: 'publicar', label: 'Publicar propiedad' },
                    { val: 'consulta', label: 'Consulta general' },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, tipo: val }))}
                      style={{
                        flex: 1, padding: '10px 8px', borderRadius: 10, border: '2px solid',
                        borderColor: form.tipo === val ? 'var(--primary)' : 'var(--border)',
                        background: form.tipo === val ? 'rgba(15,118,110,0.08)' : 'transparent',
                        color: form.tipo === val ? 'var(--primary)' : 'var(--muted-foreground)',
                        fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 150ms',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Nombre *</label>
                  <input required value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                    placeholder="Tu nombre"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: '0.875rem', outline: 'none', color: 'var(--foreground)', background: 'var(--background)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Email *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="tu@email.com"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: '0.875rem', outline: 'none', color: 'var(--foreground)', background: 'var(--background)' }}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>WhatsApp</label>
                  <input value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                    placeholder="+54 351 000-0000"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: '0.875rem', outline: 'none', color: 'var(--foreground)', background: 'var(--background)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Ciudad</label>
                  <input value={form.ciudad} onChange={(e) => setForm((f) => ({ ...f, ciudad: e.target.value }))}
                    placeholder="Córdoba, Rosario..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: '0.875rem', outline: 'none', color: 'var(--foreground)', background: 'var(--background)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Mensaje *</label>
                <textarea required rows={4} value={form.mensaje} onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
                  placeholder={form.tipo === 'publicar' ? 'Contame sobre tu propiedad: ubicación, tipo, precio, qué incluye...' : 'Tu consulta...'}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: '0.875rem', outline: 'none', color: 'var(--foreground)', background: 'var(--background)', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  padding: '13px 28px', borderRadius: 12, background: status === 'sending' ? 'var(--muted)' : 'var(--primary)',
                  color: 'white', fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.875rem', fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase', border: 'none', cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 200ms',
                }}
              >
                <Send size={16} />
                {status === 'sending' ? 'Enviando...' : 'Enviar consulta'}
              </button>

              {status === 'error' && (
                <p className="text-xs text-center" style={{ color: '#DC2626' }}>
                  Hubo un error. Intentá de nuevo o escribinos a hola@mudateargentina.com
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
