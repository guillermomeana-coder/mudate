'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Property {
  _id: string;
  slug: string;
  title: string;
  price: number;
  currency: 'USD' | 'ARS';
  operation: 'venta' | 'alquiler';
  type: string;
  ciudad: string;
  barrio?: string;
  provincia?: string;
  ambientes?: number;
  dormitorios?: number;
  banos?: number;
  superficie_cubierta?: number;
  superficie_total?: number;
  description: string;
  images: string[];
  source_url?: string;
  source: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

const EMPTY_FORM: Omit<Property, '_id' | 'createdAt'> = {
  slug: '',
  title: '',
  price: 0,
  currency: 'USD',
  operation: 'venta',
  type: 'casa',
  ciudad: '',
  barrio: '',
  provincia: 'Córdoba',
  ambientes: undefined,
  dormitorios: undefined,
  banos: undefined,
  superficie_cubierta: undefined,
  superficie_total: undefined,
  description: '',
  images: [],
  source_url: '',
  source: 'manual',
  featured: false,
  published: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtPrice(price: number, currency: string) {
  if (currency === 'ARS') return `$${price.toLocaleString('es-AR')}`;
  return `USD ${price.toLocaleString('es-AR')}`;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [key, setKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [editProp, setEditProp] = useState<Property | null>(null);
  const [formData, setFormData] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Load key from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_key');
    if (saved) { setKey(saved); setAuthed(true); }
  }, []);

  const fetchProps = useCallback(async () => {
    if (!authed) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/propiedades?page=${page}&limit=30&q=${encodeURIComponent(search)}`, {
        headers: { 'x-admin-key': key },
      });
      if (res.status === 401) { setAuthed(false); sessionStorage.removeItem('admin_key'); return; }
      const data = await res.json();
      setProperties(data.properties || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [authed, key, page, search]);

  useEffect(() => { fetchProps(); }, [fetchProps]);

  function handleLogin() {
    if (!key.trim()) return;
    sessionStorage.setItem('admin_key', key);
    setAuthed(true);
    setLoginError('');
  }

  function openCreate() {
    setEditProp(null);
    setFormData({ ...EMPTY_FORM });
    setFormError('');
    setShowForm(true);
  }

  function openEdit(p: Property) {
    setEditProp(p);
    setFormData({
      slug: p.slug,
      title: p.title,
      price: p.price,
      currency: p.currency,
      operation: p.operation,
      type: p.type,
      ciudad: p.ciudad,
      barrio: p.barrio || '',
      provincia: p.provincia || 'Córdoba',
      ambientes: p.ambientes,
      dormitorios: p.dormitorios,
      banos: p.banos,
      superficie_cubierta: p.superficie_cubierta,
      superficie_total: p.superficie_total,
      description: p.description,
      images: p.images,
      source_url: p.source_url || '',
      source: p.source,
      featured: p.featured,
      published: p.published,
    });
    setFormError('');
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        ...formData,
        slug: formData.slug || slugify(`${formData.title}-${formData.ciudad}`),
        images: typeof formData.images === 'string'
          ? (formData.images as string).split('\n').map(s => s.trim()).filter(Boolean)
          : formData.images,
      };

      const url = editProp ? `/api/admin/propiedades/${editProp._id}` : '/api/admin/propiedades';
      const method = editProp ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || 'Error al guardar'); return; }
      setShowForm(false);
      fetchProps();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`¿Eliminar "${title}"?`)) return;
    await fetch(`/api/admin/propiedades/${id}`, { method: 'DELETE', headers: { 'x-admin-key': key } });
    fetchProps();
  }

  async function toggleField(id: string, field: 'published' | 'featured', current: boolean) {
    await fetch(`/api/admin/propiedades/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
      body: JSON.stringify({ [field]: !current }),
    });
    fetchProps();
  }

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ background: '#1e293b', borderRadius: 16, padding: 40, width: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>Admin — Mudate</h1>
          <p style={{ margin: '0 0 24px', color: '#94a3b8', fontSize: 14 }}>Ingresá tu clave de acceso</p>
          <input
            type="password"
            placeholder="ADMIN_SECRET"
            value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: 15, boxSizing: 'border-box' }}
          />
          {loginError && <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>{loginError}</p>}
          <button
            onClick={handleLogin}
            style={{ marginTop: 16, width: '100%', padding: '11px', borderRadius: 8, background: '#0d9488', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer' }}
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  // ── Main panel ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>Propiedades</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>{total} en total</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            placeholder="Buscar..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', fontSize: 14, width: 200 }}
          />
          <button
            onClick={openCreate}
            style={{ padding: '8px 18px', borderRadius: 8, background: '#0d9488', color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}
          >
            + Nueva
          </button>
          <button
            onClick={() => { setAuthed(false); sessionStorage.removeItem('admin_key'); }}
            style={{ padding: '8px 14px', borderRadius: 8, background: '#1e293b', color: '#64748b', fontSize: 14, border: '1px solid #334155', cursor: 'pointer' }}
          >
            Salir
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: '#64748b', textAlign: 'center', marginTop: 60 }}>Cargando...</p>
      ) : (
        <div style={{ background: '#1e293b', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                {['Título', 'Ciudad', 'Precio', 'Op.', 'Tipo', 'Pub.', 'Dest.', ''].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {properties.map((p, i) => (
                <tr
                  key={p._id}
                  style={{ borderBottom: i < properties.length - 1 ? '1px solid #1e293b' : 'none', background: i % 2 === 0 ? '#1e293b' : '#172033' }}
                >
                  <td style={{ padding: '10px 14px', color: '#e2e8f0', maxWidth: 280 }}>
                    <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                    <div style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>{p.slug}</div>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{p.ciudad}</td>
                  <td style={{ padding: '10px 14px', color: '#34d399', fontWeight: 600 }}>{fmtPrice(p.price, p.currency)}</td>
                  <td style={{ padding: '10px 14px', color: p.operation === 'venta' ? '#60a5fa' : '#fb923c' }}>{p.operation}</td>
                  <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{p.type}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <button
                      onClick={() => toggleField(p._id, 'published', p.published)}
                      style={{ padding: '3px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: p.published ? '#14532d' : '#450a0a', color: p.published ? '#4ade80' : '#f87171' }}
                    >
                      {p.published ? 'Sí' : 'No'}
                    </button>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <button
                      onClick={() => toggleField(p._id, 'featured', p.featured)}
                      style={{ padding: '3px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: p.featured ? '#3b1a00' : '#1e293b', color: p.featured ? '#fb923c' : '#475569' }}
                    >
                      {p.featured ? '★' : '☆'}
                    </button>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(p)} style={{ padding: '4px 10px', borderRadius: 6, background: '#1e3a5f', color: '#60a5fa', border: 'none', cursor: 'pointer', fontSize: 12 }}>Editar</button>
                      <button onClick={() => handleDelete(p._id, p.title)} style={{ padding: '4px 10px', borderRadius: 6, background: '#3b0f0f', color: '#f87171', border: 'none', cursor: 'pointer', fontSize: 12 }}>Borrar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {properties.length === 0 && (
            <p style={{ color: '#475569', textAlign: 'center', padding: '40px 0' }}>Sin resultados</p>
          )}
        </div>
      )}

      {/* Pagination */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
        {Array.from({ length: Math.ceil(total / 30) }, (_, i) => i + 1).slice(0, 10).map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: page === p ? 700 : 400, background: page === p ? '#0d9488' : '#1e293b', color: page === p ? '#fff' : '#64748b', fontSize: 13 }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Form modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '32px 16px', zIndex: 100 }}>
          <div style={{ background: '#1e293b', borderRadius: 16, padding: 32, width: '100%', maxWidth: 640, position: 'relative' }}>
            <h2 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>
              {editProp ? 'Editar propiedad' : 'Nueva propiedad'}
            </h2>

            <FormGrid>
              <Field label="Título *">
                <input value={formData.title} onChange={e => setFormData(d => ({ ...d, title: e.target.value }))} />
              </Field>
              <Field label="Slug (auto si vacío)">
                <input value={formData.slug} onChange={e => setFormData(d => ({ ...d, slug: e.target.value }))} />
              </Field>
              <Field label="Precio *">
                <input type="number" value={formData.price || ''} onChange={e => setFormData(d => ({ ...d, price: Number(e.target.value) }))} />
              </Field>
              <Field label="Moneda">
                <Select value={formData.currency} onChange={v => setFormData(d => ({ ...d, currency: v as 'USD' | 'ARS' }))}>
                  <option value="USD">USD</option>
                  <option value="ARS">ARS</option>
                </Select>
              </Field>
              <Field label="Operación *">
                <Select value={formData.operation} onChange={v => setFormData(d => ({ ...d, operation: v as 'venta' | 'alquiler' }))}>
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                </Select>
              </Field>
              <Field label="Tipo *">
                <Select value={formData.type} onChange={v => setFormData(d => ({ ...d, type: v }))}>
                  {['casa', 'departamento', 'terreno', 'local', 'oficina', 'campo', 'cochera', 'galpon'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Ciudad *">
                <input value={formData.ciudad} onChange={e => setFormData(d => ({ ...d, ciudad: e.target.value }))} />
              </Field>
              <Field label="Barrio">
                <input value={formData.barrio} onChange={e => setFormData(d => ({ ...d, barrio: e.target.value }))} />
              </Field>
              <Field label="Provincia">
                <input value={formData.provincia} onChange={e => setFormData(d => ({ ...d, provincia: e.target.value }))} />
              </Field>
              <Field label="Ambientes">
                <input type="number" value={formData.ambientes || ''} onChange={e => setFormData(d => ({ ...d, ambientes: e.target.value ? Number(e.target.value) : undefined }))} />
              </Field>
              <Field label="Dormitorios">
                <input type="number" value={formData.dormitorios || ''} onChange={e => setFormData(d => ({ ...d, dormitorios: e.target.value ? Number(e.target.value) : undefined }))} />
              </Field>
              <Field label="Baños">
                <input type="number" value={formData.banos || ''} onChange={e => setFormData(d => ({ ...d, banos: e.target.value ? Number(e.target.value) : undefined }))} />
              </Field>
              <Field label="Sup. cubierta (m²)">
                <input type="number" value={formData.superficie_cubierta || ''} onChange={e => setFormData(d => ({ ...d, superficie_cubierta: e.target.value ? Number(e.target.value) : undefined }))} />
              </Field>
              <Field label="Sup. total (m²)">
                <input type="number" value={formData.superficie_total || ''} onChange={e => setFormData(d => ({ ...d, superficie_total: e.target.value ? Number(e.target.value) : undefined }))} />
              </Field>
              <Field label="URL fuente">
                <input value={formData.source_url} onChange={e => setFormData(d => ({ ...d, source_url: e.target.value }))} />
              </Field>
              <Field label="Fuente">
                <Select value={formData.source} onChange={v => setFormData(d => ({ ...d, source: v }))}>
                  {['manual', 'zonaprop', 'argenprop', 'mercadolibre'].map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
              </Field>
            </FormGrid>

            <Field label="Descripción" fullWidth>
              <textarea
                value={formData.description}
                onChange={e => setFormData(d => ({ ...d, description: e.target.value }))}
                rows={3}
              />
            </Field>
            <Field label="Imágenes (1 URL por línea)" fullWidth>
              <textarea
                value={Array.isArray(formData.images) ? formData.images.join('\n') : formData.images}
                onChange={e => setFormData(d => ({ ...d, images: e.target.value.split('\n') }))}
                rows={3}
              />
            </Field>

            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 14, cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.published} onChange={e => setFormData(d => ({ ...d, published: e.target.checked }))} />
                Publicada
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 14, cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.featured} onChange={e => setFormData(d => ({ ...d, featured: e.target.checked }))} />
                Destacada
              </label>
            </div>

            {formError && <p style={{ color: '#f87171', fontSize: 13, marginTop: 12 }}>{formError}</p>}

            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', borderRadius: 8, background: '#0f172a', color: '#64748b', border: '1px solid #334155', cursor: 'pointer', fontSize: 14 }}>
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} style={{ padding: '10px 24px', borderRadius: 8, background: '#0d9488', color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Guardando...' : editProp ? 'Guardar cambios' : 'Crear propiedad'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        input, textarea, select {
          width: 100%; padding: 8px 12px; border-radius: 7px;
          border: 1px solid #334155; background: #0f172a;
          color: #e2e8f0; font-size: 14px; box-sizing: border-box;
          outline: none;
        }
        input:focus, textarea:focus, select:focus { border-color: #0d9488; }
        textarea { resize: vertical; font-family: inherit; }
      `}</style>
    </div>
  );
}

// ─── Mini components ──────────────────────────────────────────────────────────
function FormGrid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px', marginBottom: 12 }}>{children}</div>;
}

function Field({ label, children, fullWidth }: { label: string; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <div style={{ gridColumn: fullWidth ? '1 / -1' : undefined, marginBottom: fullWidth ? 12 : 0 }}>
      <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      {children}
    </div>
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return <select value={value} onChange={e => onChange(e.target.value)}>{children}</select>;
}
