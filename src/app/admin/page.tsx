'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Building2, Users, UserCheck,
  TrendingUp, Star, Eye, EyeOff, Pencil, Trash2,
  Plus, Search, X, ChevronLeft, ChevronRight,
  LogOut, Phone, Mail, MapPin, MessageSquare,
  Check, Clock, AlertCircle, XCircle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Property {
  _id: string; slug: string; title: string; price: number;
  currency: 'USD' | 'ARS'; operation: 'venta'; type: string;
  ciudad: string; barrio?: string; provincia?: string;
  ambientes?: number; dormitorios?: number; banos?: number;
  superficie_cubierta?: number; superficie_total?: number;
  description: string; images: string[]; source_url?: string;
  source: string; featured: boolean; published: boolean; createdAt: string;
}

interface Lead {
  _id: string; nombre: string; telefono: string; email?: string;
  mensaje?: string; propertySlug: string; propertyTitle?: string;
  ciudad?: string; source: string;
  status: 'nuevo' | 'contactado' | 'calificado' | 'en_tratativa' | 'cerrado' | 'perdido';
  assignedTo?: string; assignedName?: string; assignedAt?: string;
  notes?: string; createdAt: string;
}

interface Setter {
  _id: string; nombre: string; email: string; telefono?: string;
  active: boolean; assignedCount: number; createdAt: string;
}

interface Stats {
  props: { total: number; published: number; featured: number };
  leads: {
    total: number; hoy: number; semana: number; mes: number;
    byStatus: { _id: string; count: number }[];
    byCiudad: { _id: string; count: number }[];
  };
  recentLeads: Lead[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_PROP: Omit<Property, '_id' | 'createdAt'> = {
  slug: '', title: '', price: 0, currency: 'USD', operation: 'venta',
  type: 'casa', ciudad: '', barrio: '', provincia: 'Córdoba',
  ambientes: undefined, dormitorios: undefined, banos: undefined,
  superficie_cubierta: undefined, superficie_total: undefined,
  description: '', images: [], source_url: '', source: 'manual',
  featured: false, published: true,
};

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  nuevo:       { label: 'Nuevo',       color: '#60a5fa', bg: '#1e3a5f', icon: <AlertCircle size={11} /> },
  contactado:  { label: 'Contactado',  color: '#34d399', bg: '#14532d', icon: <Phone size={11} /> },
  calificado:  { label: 'Calificado',  color: '#fbbf24', bg: '#451a03', icon: <Star size={11} /> },
  en_tratativa:{ label: 'En tratativa',color: '#a78bfa', bg: '#2e1065', icon: <MessageSquare size={11} /> },
  cerrado:     { label: 'Cerrado ✓',   color: '#4ade80', bg: '#052e16', icon: <Check size={11} /> },
  perdido:     { label: 'Perdido',     color: '#f87171', bg: '#450a0a', icon: <XCircle size={11} /> },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtPrice(price: number, currency: string) {
  return currency === 'ARS'
    ? `$${price.toLocaleString('es-AR')}`
    : `USD ${price.toLocaleString('es-AR')}`;
}

function slugify(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] ?? { label: status, color: '#94a3b8', bg: '#1e293b', icon: <Clock size={11} /> };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: m.bg, color: m.color }}>
      {m.icon}{m.label}
    </span>
  );
}

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div style={{ background: '#1e293b', borderRadius: 12, padding: '20px 24px', border: '1px solid #334155' }}>
      <p style={{ margin: '0 0 4px', fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
      <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: accent ?? '#f1f5f9', letterSpacing: '-0.02em' }}>{value}</p>
      {sub && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#475569' }}>{sub}</p>}
    </div>
  );
}

function Btn({ children, onClick, variant = 'primary', size = 'md', disabled }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; size?: 'sm' | 'md'; disabled?: boolean;
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary:   { background: '#0d9488', color: '#fff', border: 'none' },
    secondary: { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' },
    danger:    { background: '#3b0f0f', color: '#f87171', border: 'none' },
    ghost:     { background: 'transparent', color: '#64748b', border: '1px solid #334155' },
  };
  const pad = size === 'sm' ? '4px 10px' : '8px 18px';
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{ ...styles[variant], padding: pad, borderRadius: 8, fontSize: size === 'sm' ? 12 : 14, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1, display: 'inline-flex', alignItems: 'center', gap: 5 }}
    >
      {children}
    </button>
  );
}

function Input({ value, onChange, placeholder, type = 'text', style: extraStyle }: {
  value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string; style?: React.CSSProperties;
}) {
  return (
    <input
      type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={{ padding: '8px 12px', borderRadius: 7, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: 14, width: '100%', boxSizing: 'border-box', outline: 'none', ...extraStyle }}
    />
  );
}

function SelInput({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value} onChange={e => onChange(e.target.value)}
      style={{ padding: '8px 12px', borderRadius: 7, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: 14, width: '100%', boxSizing: 'border-box', outline: 'none' }}
    >
      {children}
    </select>
  );
}

function FieldWrap({ label, children, half }: { label: string; children: React.ReactNode; half?: boolean }) {
  return (
    <div style={{ gridColumn: half ? undefined : '1/-1', marginBottom: 4 }}>
      <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '32px 16px', zIndex: 200 }}>
      <div style={{ background: '#1e293b', borderRadius: 16, padding: 32, width: '100%', maxWidth: wide ? 720 : 560, position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 4 }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 16, alignItems: 'center' }}>
      <button onClick={() => onChange(page - 1)} disabled={page === 1} style={{ padding: '5px 10px', borderRadius: 6, background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}><ChevronLeft size={14} /></button>
      {Array.from({ length: Math.min(pages, 8) }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onChange(p)} style={{ padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: p === page ? 700 : 400, background: p === page ? '#0d9488' : '#1e293b', color: p === page ? '#fff' : '#64748b', fontSize: 13 }}>{p}</button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page === pages} style={{ padding: '5px 10px', borderRadius: 6, background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', cursor: page === pages ? 'not-allowed' : 'pointer', opacity: page === pages ? 0.4 : 1 }}><ChevronRight size={14} /></button>
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────

function DashboardTab({ stats, loading }: { stats: Stats | null; loading: boolean }) {
  if (loading || !stats) return <p style={{ color: '#64748b', textAlign: 'center', marginTop: 60 }}>Cargando...</p>;
  return (
    <div>
      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        <StatCard label="Total leads" value={stats.leads.total} />
        <StatCard label="Hoy" value={stats.leads.hoy} accent="#34d399" />
        <StatCard label="Esta semana" value={stats.leads.semana} accent="#60a5fa" />
        <StatCard label="Este mes" value={stats.leads.mes} accent="#a78bfa" />
        <StatCard label="Propiedades" value={stats.props.published} sub={`${stats.props.total} total`} />
        <StatCard label="Destacadas" value={stats.props.featured} accent="#fbbf24" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Status funnel */}
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid #334155' }}>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pipeline de leads</p>
          {stats.leads.byStatus.map(s => (
            <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <StatusBadge status={s._id} />
              <div style={{ flex: 1, height: 6, borderRadius: 99, background: '#0f172a', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: STATUS_META[s._id]?.color ?? '#64748b', width: `${Math.min((s.count / stats.leads.total) * 100, 100)}%`, borderRadius: 99 }} />
              </div>
              <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600, minWidth: 24, textAlign: 'right' }}>{s.count}</span>
            </div>
          ))}
          {!stats.leads.byStatus.length && <p style={{ color: '#475569', fontSize: 13 }}>Sin datos aún</p>}
        </div>

        {/* Top cities */}
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid #334155' }}>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Top ciudades (leads)</p>
          {stats.leads.byCiudad.map((c, i) => (
            <div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: '#475569', minWidth: 16, textAlign: 'right' }}>{i + 1}</span>
              <span style={{ flex: 1, fontSize: 13, color: '#e2e8f0' }}>{c._id || 'Sin ciudad'}</span>
              <div style={{ height: 6, borderRadius: 99, background: '#0f172a', width: 80, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#0d9488', width: `${(c.count / stats.leads.byCiudad[0].count) * 100}%`, borderRadius: 99 }} />
              </div>
              <span style={{ fontSize: 13, color: '#0d9488', fontWeight: 600, minWidth: 24, textAlign: 'right' }}>{c.count}</span>
            </div>
          ))}
          {!stats.leads.byCiudad.length && <p style={{ color: '#475569', fontSize: 13 }}>Sin datos aún</p>}
        </div>
      </div>

      {/* Recent leads */}
      <div style={{ background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid #334155' }}>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Últimos leads</p>
        {stats.recentLeads.map(lead => (
          <div key={lead._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #0f172a' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>{lead.nombre}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#475569' }}>{lead.propertyTitle ?? lead.propertySlug} · {lead.ciudad}</p>
            </div>
            <StatusBadge status={lead.status} />
            <span style={{ fontSize: 11, color: '#475569', whiteSpace: 'nowrap' }}>{timeAgo(lead.createdAt)}</span>
          </div>
        ))}
        {!stats.recentLeads.length && <p style={{ color: '#475569', fontSize: 13 }}>Sin leads aún</p>}
      </div>
    </div>
  );
}

// ─── Propiedades Tab ───────────────────────────────────────────────────────────

function PropiedadesTab({ adminKey }: { adminKey: string }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editProp, setEditProp] = useState<Property | null>(null);
  const [formData, setFormData] = useState<typeof EMPTY_PROP>({ ...EMPTY_PROP });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchProps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/propiedades?page=${page}&limit=30&q=${encodeURIComponent(search)}`, { headers: { 'x-admin-key': adminKey } });
      const data = await res.json();
      setProperties(data.properties || []);
      setTotal(data.total || 0);
    } finally { setLoading(false); }
  }, [adminKey, page, search]);

  useEffect(() => { fetchProps(); }, [fetchProps]);

  function openCreate() { setEditProp(null); setFormData({ ...EMPTY_PROP }); setFormError(''); setShowForm(true); }

  function openEdit(p: Property) {
    setEditProp(p);
    setFormData({ slug: p.slug, title: p.title, price: p.price, currency: p.currency, operation: p.operation, type: p.type, ciudad: p.ciudad, barrio: p.barrio || '', provincia: p.provincia || 'Córdoba', ambientes: p.ambientes, dormitorios: p.dormitorios, banos: p.banos, superficie_cubierta: p.superficie_cubierta, superficie_total: p.superficie_total, description: p.description, images: p.images, source_url: p.source_url || '', source: p.source, featured: p.featured, published: p.published });
    setFormError(''); setShowForm(true);
  }

  async function handleSave() {
    setSaving(true); setFormError('');
    try {
      const payload = { ...formData, slug: formData.slug || slugify(`${formData.title}-${formData.ciudad}`), images: typeof formData.images === 'string' ? (formData.images as string).split('\n').map(s => s.trim()).filter(Boolean) : formData.images };
      const url = editProp ? `/api/admin/propiedades/${editProp._id}` : '/api/admin/propiedades';
      const res = await fetch(url, { method: editProp ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || 'Error al guardar'); return; }
      setShowForm(false); fetchProps();
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`¿Eliminar "${title}"?`)) return;
    await fetch(`/api/admin/propiedades/${id}`, { method: 'DELETE', headers: { 'x-admin-key': adminKey } });
    fetchProps();
  }

  async function toggle(id: string, field: 'published' | 'featured', current: boolean) {
    await fetch(`/api/admin/propiedades/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey }, body: JSON.stringify({ [field]: !current }) });
    fetchProps();
  }

  function setF<K extends keyof typeof EMPTY_PROP>(k: K, v: typeof EMPTY_PROP[K]) { setFormData(d => ({ ...d, [k]: v })); }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar por título, ciudad, slug..." style={{ paddingLeft: 32, padding: '8px 12px 8px 32px', borderRadius: 8, border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', fontSize: 14, width: '100%', boxSizing: 'border-box', outline: 'none' }} />
        </div>
        <Btn onClick={openCreate}><Plus size={15} />Nueva</Btn>
      </div>

      {loading ? <p style={{ color: '#64748b', textAlign: 'center', marginTop: 40 }}>Cargando...</p> : (
        <div style={{ background: '#1e293b', borderRadius: 12, overflow: 'auto', border: '1px solid #334155' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                {['Propiedad', 'Ciudad', 'Precio', 'Tipo', 'Pub.', 'Dest.', ''].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {properties.map((p, i) => (
                <tr key={p._id} style={{ borderBottom: i < properties.length - 1 ? '1px solid #0f172a' : 'none' }}>
                  <td style={{ padding: '10px 14px', maxWidth: 260 }}>
                    <div style={{ fontWeight: 500, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                    <div style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>{p.slug}</div>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{p.ciudad}</td>
                  <td style={{ padding: '10px 14px', color: '#34d399', fontWeight: 600, whiteSpace: 'nowrap' }}>{fmtPrice(p.price, p.currency)}</td>
                  <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{p.type}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <button onClick={() => toggle(p._id, 'published', p.published)} style={{ padding: '3px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: p.published ? '#14532d' : '#450a0a', color: p.published ? '#4ade80' : '#f87171', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {p.published ? <><Eye size={10} />Sí</> : <><EyeOff size={10} />No</>}
                    </button>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <button onClick={() => toggle(p._id, 'featured', p.featured)} style={{ padding: '3px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: p.featured ? '#3b1a00' : '#1e293b', color: p.featured ? '#fbbf24' : '#475569', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Star size={10} />{p.featured ? 'Sí' : 'No'}
                    </button>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(p)} style={{ padding: '4px 10px', borderRadius: 6, background: '#1e3a5f', color: '#60a5fa', border: 'none', cursor: 'pointer', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Pencil size={11} />Editar</button>
                      <button onClick={() => handleDelete(p._id, p.title)} style={{ padding: '4px 10px', borderRadius: 6, background: '#3b0f0f', color: '#f87171', border: 'none', cursor: 'pointer', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Trash2 size={11} />Borrar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!properties.length && <p style={{ color: '#475569', textAlign: 'center', padding: '32px 0', fontSize: 14 }}>Sin resultados</p>}
        </div>
      )}

      <Pagination page={page} total={total} perPage={30} onChange={setPage} />
      <p style={{ color: '#475569', textAlign: 'center', marginTop: 8, fontSize: 12 }}>{total} propiedades</p>

      {showForm && (
        <Modal title={editProp ? 'Editar propiedad' : 'Nueva propiedad'} onClose={() => setShowForm(false)} wide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px' }}>
            <FieldWrap label="Título *"><Input value={formData.title} onChange={v => setF('title', v)} /></FieldWrap>
            <FieldWrap label="Slug (auto si vacío)"><Input value={formData.slug} onChange={v => setF('slug', v)} /></FieldWrap>
            <FieldWrap label="Precio *" half><Input type="number" value={formData.price || ''} onChange={v => setF('price', Number(v))} /></FieldWrap>
            <FieldWrap label="Moneda" half><SelInput value={formData.currency} onChange={v => setF('currency', v as 'USD' | 'ARS')}><option value="USD">USD</option><option value="ARS">ARS</option></SelInput></FieldWrap>
            <FieldWrap label="Tipo *" half><SelInput value={formData.type} onChange={v => setF('type', v)}>{['casa','departamento','terreno','local','oficina','campo','cochera','galpon'].map(t => <option key={t} value={t}>{t}</option>)}</SelInput></FieldWrap>
            <FieldWrap label="Ciudad *" half><Input value={formData.ciudad} onChange={v => setF('ciudad', v)} /></FieldWrap>
            <FieldWrap label="Barrio" half><Input value={formData.barrio ?? ''} onChange={v => setF('barrio', v)} /></FieldWrap>
            <FieldWrap label="Provincia" half><Input value={formData.provincia ?? ''} onChange={v => setF('provincia', v)} /></FieldWrap>
            <FieldWrap label="Ambientes" half><Input type="number" value={formData.ambientes ?? ''} onChange={v => setF('ambientes', v ? Number(v) : undefined)} /></FieldWrap>
            <FieldWrap label="Dormitorios" half><Input type="number" value={formData.dormitorios ?? ''} onChange={v => setF('dormitorios', v ? Number(v) : undefined)} /></FieldWrap>
            <FieldWrap label="Sup. cubierta m²" half><Input type="number" value={formData.superficie_cubierta ?? ''} onChange={v => setF('superficie_cubierta', v ? Number(v) : undefined)} /></FieldWrap>
            <FieldWrap label="Sup. total m²" half><Input type="number" value={formData.superficie_total ?? ''} onChange={v => setF('superficie_total', v ? Number(v) : undefined)} /></FieldWrap>
            <FieldWrap label="Fuente" half><SelInput value={formData.source} onChange={v => setF('source', v)}>{['manual','zonaprop','argenprop','mercadolibre'].map(s => <option key={s} value={s}>{s}</option>)}</SelInput></FieldWrap>
            <FieldWrap label="URL fuente" half><Input value={formData.source_url ?? ''} onChange={v => setF('source_url', v)} /></FieldWrap>
            <FieldWrap label="Descripción"><textarea value={formData.description} onChange={e => setF('description', e.target.value)} rows={3} style={{ padding: '8px 12px', borderRadius: 7, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: 14, width: '100%', boxSizing: 'border-box', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} /></FieldWrap>
            <FieldWrap label="Imágenes (1 URL por línea)"><textarea value={Array.isArray(formData.images) ? formData.images.join('\n') : formData.images} onChange={e => setF('images', e.target.value.split('\n'))} rows={3} style={{ padding: '8px 12px', borderRadius: 7, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: 14, width: '100%', boxSizing: 'border-box', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} /></FieldWrap>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 14, cursor: 'pointer' }}><input type="checkbox" checked={formData.published} onChange={e => setF('published', e.target.checked)} /> Publicada</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 14, cursor: 'pointer' }}><input type="checkbox" checked={formData.featured} onChange={e => setF('featured', e.target.checked)} /> Destacada</label>
          </div>
          {formError && <p style={{ color: '#f87171', fontSize: 13, marginTop: 10 }}>{formError}</p>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <Btn variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Btn>
            <Btn onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : editProp ? 'Guardar cambios' : 'Crear propiedad'}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Leads Tab ────────────────────────────────────────────────────────────────

function LeadsTab({ adminKey, setters }: { adminKey: string; setters: Setter[] }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [assignId, setAssignId] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '25', q: search });
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/leads?${params}`, { headers: { 'x-admin-key': adminKey } });
      const data = await res.json();
      setLeads(data.leads || []);
      setTotal(data.total || 0);
    } finally { setLoading(false); }
  }, [adminKey, page, search, statusFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  function openDetail(lead: Lead) {
    setActiveLead(lead);
    setAssignId(lead.assignedTo || '');
    setNotes(lead.notes || '');
    setStatus(lead.status);
  }

  async function saveLead() {
    if (!activeLead) return;
    setSaving(true);
    try {
      const body: Record<string, unknown> = { status, notes };
      if (assignId !== activeLead.assignedTo) body.assignedTo = assignId || null;
      await fetch(`/api/admin/leads/${activeLead._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey }, body: JSON.stringify(body) });
      setActiveLead(null);
      fetchLeads();
    } finally { setSaving(false); }
  }

  async function deleteLead(id: string) {
    if (!confirm('¿Eliminar este lead?')) return;
    await fetch(`/api/admin/leads/${id}`, { method: 'DELETE', headers: { 'x-admin-key': adminKey } });
    fetchLeads();
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar por nombre, ciudad, propiedad..." style={{ paddingLeft: 32, padding: '8px 12px 8px 32px', borderRadius: 8, border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', fontSize: 14, width: '100%', boxSizing: 'border-box', outline: 'none' }} />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #334155', background: '#1e293b', color: statusFilter ? '#f1f5f9' : '#64748b', fontSize: 14, outline: 'none' }}>
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {loading ? <p style={{ color: '#64748b', textAlign: 'center', marginTop: 40 }}>Cargando...</p> : (
        <div style={{ background: '#1e293b', borderRadius: 12, overflow: 'auto', border: '1px solid #334155' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                {['Contacto', 'Propiedad', 'Setter', 'Estado', 'Recibido', ''].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <tr key={lead._id} style={{ borderBottom: i < leads.length - 1 ? '1px solid #0f172a' : 'none', cursor: 'pointer' }} onClick={() => openDetail(lead)}>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ fontWeight: 500, color: '#e2e8f0' }}>{lead.nombre}</div>
                    <div style={{ fontSize: 11, color: '#475569', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                      <Phone size={9} />{lead.telefono}
                      {lead.ciudad && <><MapPin size={9} />{lead.ciudad}</>}
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#94a3b8', maxWidth: 200 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.propertyTitle ?? lead.propertySlug}</div>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {lead.assignedName
                      ? <span style={{ fontSize: 12, color: '#a78bfa', background: '#2e1065', padding: '3px 9px', borderRadius: 20, fontWeight: 600 }}>{lead.assignedName}</span>
                      : <span style={{ fontSize: 12, color: '#475569' }}>Sin asignar</span>
                    }
                  </td>
                  <td style={{ padding: '10px 14px' }}><StatusBadge status={lead.status} /></td>
                  <td style={{ padding: '10px 14px', color: '#475569', whiteSpace: 'nowrap', fontSize: 11 }}>{timeAgo(lead.createdAt)}</td>
                  <td style={{ padding: '10px 14px' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => deleteLead(lead._id)} style={{ padding: '4px 10px', borderRadius: 6, background: '#3b0f0f', color: '#f87171', border: 'none', cursor: 'pointer', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Trash2 size={11} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!leads.length && <p style={{ color: '#475569', textAlign: 'center', padding: '32px 0', fontSize: 14 }}>Sin leads</p>}
        </div>
      )}

      <Pagination page={page} total={total} perPage={25} onChange={setPage} />
      <p style={{ color: '#475569', textAlign: 'center', marginTop: 8, fontSize: 12 }}>{total} leads</p>

      {activeLead && (
        <Modal title="Gestionar lead" onClose={() => setActiveLead(null)}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 600, color: '#f1f5f9' }}>{activeLead.nombre}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
              <a href={`tel:${activeLead.telefono}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#34d399', textDecoration: 'none', background: '#14532d', padding: '5px 12px', borderRadius: 8 }}><Phone size={12} />{activeLead.telefono}</a>
              <a href={`https://wa.me/${activeLead.telefono.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#4ade80', textDecoration: 'none', background: '#052e16', padding: '5px 12px', borderRadius: 8 }}>WhatsApp →</a>
              {activeLead.email && <a href={`mailto:${activeLead.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#60a5fa', textDecoration: 'none', background: '#1e3a5f', padding: '5px 12px', borderRadius: 8 }}><Mail size={12} />{activeLead.email}</a>}
            </div>
            {activeLead.mensaje && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#0f172a', borderRadius: 8, borderLeft: '3px solid #334155' }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Mensaje</p>
                <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>{activeLead.mensaje}</p>
              </div>
            )}
            <div style={{ marginTop: 10, fontSize: 12, color: '#475569' }}>
              <span><strong style={{ color: '#64748b' }}>Propiedad:</strong> {activeLead.propertyTitle ?? activeLead.propertySlug}</span>
              {activeLead.ciudad && <span style={{ marginLeft: 12 }}><strong style={{ color: '#64748b' }}>Ciudad:</strong> {activeLead.ciudad}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <FieldWrap label="Asignar setter">
              <SelInput value={assignId} onChange={setAssignId}>
                <option value="">Sin asignar</option>
                {setters.filter(s => s.active).map(s => <option key={s._id} value={s._id}>{s.nombre} ({s.assignedCount} leads)</option>)}
              </SelInput>
            </FieldWrap>
            <FieldWrap label="Estado">
              <SelInput value={status} onChange={setStatus}>
                {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </SelInput>
            </FieldWrap>
          </div>

          <FieldWrap label="Notas internas">
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Observaciones del setter, seguimiento, próximos pasos..." style={{ padding: '8px 12px', borderRadius: 7, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: 14, width: '100%', boxSizing: 'border-box', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
          </FieldWrap>

          {assignId && assignId !== activeLead.assignedTo && (
            <div style={{ marginTop: 8, padding: '8px 12px', background: '#172033', borderRadius: 8, border: '1px solid #1e3a5f', fontSize: 12, color: '#60a5fa' }}>
              Se enviará email de notificación a {setters.find(s => s._id === assignId)?.email}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <Btn variant="ghost" onClick={() => setActiveLead(null)}>Cancelar</Btn>
            <Btn onClick={saveLead} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Setters Tab ──────────────────────────────────────────────────────────────

function SettersTab({ adminKey, setters, refetch, onMount }: { adminKey: string; setters: Setter[]; refetch: () => void; onMount?: () => void }) {
  useEffect(() => { onMount?.(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [showForm, setShowForm] = useState(false);
  const [editSetter, setEditSetter] = useState<Setter | null>(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  function openCreate() { setEditSetter(null); setNombre(''); setEmail(''); setTelefono(''); setErr(''); setShowForm(true); }
  function openEdit(s: Setter) { setEditSetter(s); setNombre(s.nombre); setEmail(s.email); setTelefono(s.telefono || ''); setErr(''); setShowForm(true); }

  async function save() {
    if (!nombre.trim() || !email.trim()) { setErr('Nombre y email son requeridos'); return; }
    setSaving(true); setErr('');
    try {
      const body = { nombre: nombre.trim(), email: email.trim(), telefono: telefono.trim() || undefined };
      const res = editSetter
        ? await fetch(`/api/admin/setters/${editSetter._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey }, body: JSON.stringify(body) })
        : await fetch('/api/admin/setters', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || 'Error'); return; }
      setShowForm(false); refetch();
    } finally { setSaving(false); }
  }

  async function toggleActive(s: Setter) {
    await fetch(`/api/admin/setters/${s._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey }, body: JSON.stringify({ active: !s.active }) });
    refetch();
  }

  async function deleteSetter(s: Setter) {
    if (!confirm(`¿Eliminar a ${s.nombre}?`)) return;
    await fetch(`/api/admin/setters/${s._id}`, { method: 'DELETE', headers: { 'x-admin-key': adminKey } });
    refetch();
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Btn onClick={openCreate}><Plus size={15} />Nuevo setter</Btn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {setters.map(s => (
          <div key={s._id} style={{ background: '#1e293b', borderRadius: 12, padding: 20, border: `1px solid ${s.active ? '#334155' : '#1e293b'}`, opacity: s.active ? 1 : 0.55 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 600, color: '#f1f5f9' }}>{s.nombre}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                  <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={10} />{s.email}</span>
                  {s.telefono && <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={10} />{s.telefono}</span>}
                </div>
              </div>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#a78bfa' }}>{s.assignedCount}</span>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: 11, color: '#475569' }}>leads asignados</p>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => openEdit(s)} style={{ padding: '5px 12px', borderRadius: 6, background: '#1e3a5f', color: '#60a5fa', border: 'none', cursor: 'pointer', fontSize: 12, flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Pencil size={11} />Editar</button>
              <button onClick={() => toggleActive(s)} style={{ padding: '5px 12px', borderRadius: 6, background: s.active ? '#14532d' : '#450a0a', color: s.active ? '#4ade80' : '#f87171', border: 'none', cursor: 'pointer', fontSize: 12, flex: 1 }}>
                {s.active ? 'Activo' : 'Inactivo'}
              </button>
              <button onClick={() => deleteSetter(s)} style={{ padding: '5px 10px', borderRadius: 6, background: '#3b0f0f', color: '#f87171', border: 'none', cursor: 'pointer' }}><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
        {!setters.length && <p style={{ color: '#475569', fontSize: 14 }}>No hay setters. Creá uno para empezar a asignar leads.</p>}
      </div>

      {showForm && (
        <Modal title={editSetter ? 'Editar setter' : 'Nuevo setter'} onClose={() => setShowForm(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <FieldWrap label="Nombre *"><Input value={nombre} onChange={setNombre} placeholder="Nombre completo" /></FieldWrap>
            <FieldWrap label="Email *"><Input value={email} onChange={setEmail} type="email" placeholder="setter@mudate.com" /></FieldWrap>
            <FieldWrap label="Teléfono"><Input value={telefono} onChange={setTelefono} placeholder="+54 351..." /></FieldWrap>
          </div>
          {err && <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>{err}</p>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <Btn variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Btn>
            <Btn onClick={save} disabled={saving}>{saving ? 'Guardando...' : editSetter ? 'Guardar' : 'Crear'}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Main Admin ───────────────────────────────────────────────────────────────

type Tab = 'dashboard' | 'propiedades' | 'leads' | 'setters';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',   label: 'Dashboard',   icon: <LayoutDashboard size={16} /> },
  { id: 'propiedades', label: 'Propiedades', icon: <Building2 size={16} /> },
  { id: 'leads',       label: 'Leads',       icon: <Users size={16} /> },
  { id: 'setters',     label: 'Setters',     icon: <UserCheck size={16} /> },
];

export default function AdminPage() {
  const [key, setKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [setters, setSetters] = useState<Setter[]>([]);

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_key');
    if (saved) { setKey(saved); setAuthed(true); }
  }, []);

  const fetchStats = useCallback(async (k: string) => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/admin/stats', { headers: { 'x-admin-key': k } });
      if (res.ok) setStats(await res.json());
    } finally { setStatsLoading(false); }
  }, []);

  const fetchSetters = useCallback(async (k: string) => {
    const res = await fetch('/api/admin/setters', { headers: { 'x-admin-key': k } });
    if (res.ok) { const d = await res.json(); setSetters(d.setters || []); }
  }, []);

  useEffect(() => {
    if (!authed || !key) return;
    fetchStats(key);
    fetchSetters(key);
  }, [authed, key, fetchStats, fetchSetters]);

  function handleLogin() {
    if (!key.trim()) return;
    sessionStorage.setItem('admin_key', key);
    setAuthed(true); setLoginError('');
  }

  function logout() { setAuthed(false); sessionStorage.removeItem('admin_key'); setKey(''); }

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ background: '#1e293b', borderRadius: 16, padding: '40px 36px', width: 380, boxShadow: '0 24px 80px rgba(0,0,0,0.6)', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} color="#fff" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>Mudate Admin</p>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Portal de gestión</p>
            </div>
          </div>
          <input
            type="password" placeholder="Clave de acceso" value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: 15, boxSizing: 'border-box', outline: 'none', marginBottom: 4 }}
          />
          {loginError && <p style={{ color: '#f87171', fontSize: 13, margin: '4px 0 0' }}>{loginError}</p>}
          <button onClick={handleLogin} style={{ marginTop: 14, width: '100%', padding: 12, borderRadius: 8, background: '#0d9488', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' }}>
            Entrar
          </button>
        </div>
      </div>
    );
  }

  // ── Main ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      {/* Sidebar */}
      <div style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 220, background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 6, background: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={14} color="#fff" /></div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Mudate</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {TABS.map(t => (
            <button
              key={t.id} onClick={() => setTab(t.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 2, textAlign: 'left', fontSize: 13, fontWeight: tab === t.id ? 600 : 400, background: tab === t.id ? 'rgba(13,148,136,0.15)' : 'transparent', color: tab === t.id ? '#0d9488' : '#64748b' }}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '12px 8px', borderTop: '1px solid #334155' }}>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#475569', fontSize: 13 }}>
            <LogOut size={14} />Salir
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 220, padding: '28px 28px 60px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>
            {TABS.find(t => t.id === tab)?.label}
          </h1>
          {tab === 'dashboard' && stats && (
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              {stats.leads.hoy} lead{stats.leads.hoy !== 1 ? 's' : ''} hoy · {stats.props.published} propiedades activas
            </p>
          )}
          {tab === 'leads' && (
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Hacé clic en un lead para asignarlo o cambiar su estado
            </p>
          )}
        </div>

        {tab === 'dashboard'   && <DashboardTab stats={stats} loading={statsLoading} />}
        {tab === 'propiedades' && <PropiedadesTab adminKey={key} />}
        {tab === 'leads'       && <LeadsTab adminKey={key} setters={setters} />}
        {tab === 'setters'     && <SettersTab adminKey={key} setters={setters} refetch={() => fetchSetters(key)} onMount={() => fetchSetters(key)} />}
      </div>
    </div>
  );
}
