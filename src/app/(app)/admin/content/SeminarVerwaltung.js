'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SeminarVerwaltung({ seminars: initial }) {
  const supabase = createClient();
  const [seminars, setSeminars] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  function startEdit(s) {
    setEditing(s.id);
    setForm({
      title: s.title || '',
      subtitle: s.subtitle || '',
      description: s.description || '',
      icon: s.icon || '',
      teams_link: s.teams_link || '',
      next_date: s.next_date || '',
      is_active: s.is_active !== false,
      sort_order: s.sort_order || 0,
      webinargeek_webinar_id: s.webinargeek_webinar_id || '',
    });
  }

  async function save() {
    setSaving(true);
    const updateData = {
      ...form,
      next_date: form.next_date || null,
      teams_link: form.teams_link || null,
      webinargeek_webinar_id: form.webinargeek_webinar_id || null,
      sort_order: parseInt(form.sort_order) || 0,
      updated_at: new Date().toISOString(),
    };
    await supabase.from('seminars').update(updateData).eq('id', editing);
    setSeminars(prev => prev.map(s => s.id === editing ? { ...s, ...updateData } : s));
    setEditing(null);
    setSaving(false);
  }

  async function toggleActive(s) {
    const newVal = !s.is_active;
    await supabase.from('seminars').update({ is_active: newVal }).eq('id', s.id);
    setSeminars(prev => prev.map(x => x.id === s.id ? { ...x, is_active: newVal } : x));
  }

  const formatDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-- kein Termin --';

  return (
    <div className="page-container animate-in">
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Seminarverwaltung</h1>
        <p className="page-subtitle">Termine, Teams-Links und Seminar-Daten verwalten</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {seminars.map(s => (
          <div key={s.id} className="card" style={{ padding: 0, overflow: 'hidden', opacity: s.is_active ? 1 : 0.5 }}>
            {editing === s.id ? (
              /* Edit Form */
              <div style={{ padding: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 4 }}>Icon</label>
                    <input className="input" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} style={{ textAlign: 'center', fontSize: 20 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 4 }}>Titel</label>
                    <input className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 4 }}>Untertitel</label>
                    <input className="input" value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} />
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 4 }}>Beschreibung</label>
                  <textarea className="input" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 4 }}>Teams-Link</label>
                    <input className="input" placeholder="https://teams.microsoft.com/..." value={form.teams_link} onChange={e => setForm(p => ({ ...p, teams_link: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 4 }}>Termin</label>
                    <input className="input" type="date" value={form.next_date} onChange={e => setForm(p => ({ ...p, next_date: e.target.value }))} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 4 }}>
                      WebinarGeek Webinar-ID
                      <span style={{ fontWeight: 400, marginLeft: 4, opacity: 0.6 }}>(z.B. 529467)</span>
                    </label>
                    <input className="input" placeholder="529467" value={form.webinargeek_webinar_id} onChange={e => setForm(p => ({ ...p, webinargeek_webinar_id: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 4 }}>Reihenf.</label>
                    <input className="input" type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={save} className="btn btn-primary" style={{ fontSize: 13 }} disabled={saving}>
                    {saving ? 'Speichert...' : 'Speichern'}
                  </button>
                  <button onClick={() => setEditing(null)} className="btn btn-ghost" style={{ fontSize: 13 }}>Abbrechen</button>
                </div>
              </div>
            ) : (
              /* Row View */
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px' }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{s.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>{s.subtitle}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 100 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: s.next_date ? 'var(--ki-text)' : 'var(--ki-text-tertiary)' }}>
                    {formatDate(s.next_date)}
                  </div>
                  {s.webinargeek_webinar_id ? (
                    <span style={{ fontSize: 11, color: 'var(--ki-success)', fontWeight: 500 }}>WebinarGeek #{s.webinargeek_webinar_id}</span>
                  ) : s.teams_link ? (
                    <span style={{ fontSize: 11, color: 'var(--ki-success)', fontWeight: 500 }}>Teams-Link gesetzt</span>
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--ki-red)', fontWeight: 500 }}>Kein Link</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => toggleActive(s)}
                    style={{
                      padding: '4px 10px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                      background: s.is_active ? 'rgba(45,106,79,0.08)' : 'var(--grey-6)',
                      color: s.is_active ? 'var(--ki-success)' : 'var(--ki-text-tertiary)',
                    }}
                  >
                    {s.is_active ? 'Aktiv' : 'Inaktiv'}
                  </button>
                  <button
                    onClick={() => startEdit(s)}
                    style={{
                      padding: '4px 10px', borderRadius: 6, border: '1px solid var(--ki-border)',
                      fontSize: 12, cursor: 'pointer', background: '#fff', color: 'var(--ki-text)',
                    }}
                  >
                    Bearbeiten
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
