'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const EVENT_TYPES = [
  { key: 'annual_review', label: 'Jahresgespräch', icon: '📅' },
  { key: 'promotion', label: 'Beförderung', icon: '⬆' },
  { key: 'offer', label: 'Externes Angebot', icon: '✉' },
  { key: 'counter_offer', label: 'Gegenangebot', icon: '↩' },
  { key: 'raise', label: 'Gehaltserhöhung', icon: '💰' },
  { key: 'bonus', label: 'Bonus/Sonderzahlung', icon: '🎁' },
];

export default function SalaryLogClient({ entries: initial, userId }) {
  const supabase = createClient();
  const [entries, setEntries] = useState(initial || []);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ event_type: 'annual_review', company: '', my_ask: '', their_offer: '', final_result: '', notes: '', lessons_learned: '' });

  const totalGained = entries.reduce((s, e) => s + (e.final_result || 0), 0) - (entries[0]?.their_offer || 0);
  const avgSuccess = entries.length > 0 ? Math.round(entries.reduce((s, e) => {
    if (!e.my_ask || !e.final_result) return s;
    return s + (e.final_result / e.my_ask) * 100;
  }, 0) / entries.filter(e => e.my_ask && e.final_result).length) : 0;

  const handleAdd = async () => {
    const { data } = await supabase.from('salary_log').insert({
      user_id: userId, ...form, my_ask: +form.my_ask || null, their_offer: +form.their_offer || null, final_result: +form.final_result || null,
    }).select().single();
    if (data) { setEntries(p => [data, ...p]); setShowAdd(false); }
  };

  return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Gehalts-Tagebuch</h1>
          <p className="page-subtitle">Dokumentiere jedes Gespräch — dein Verhandlungs-Logbuch.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Eintrag</button>
      </div>

      {/* Stats */}
      {entries.length > 0 && (
        <div className="grid-3" style={{ marginBottom: 24 }}>
          <div className="card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{entries.length}</div>
            <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Verhandlungen</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ki-success)' }}>{avgSuccess || '—'}%</div>
            <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Ø Erfolgsquote</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ki-success)' }}>
              +€{Math.max(0, entries.reduce((s, e) => s + ((e.final_result || 0) - (e.their_offer || 0)), 0)).toLocaleString('de-DE')}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Mehr rausgeholt</div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="card" style={{ width: 480, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Verhandlung dokumentieren</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <select className="input" value={form.event_type} onChange={e => setForm(p => ({ ...p, event_type: e.target.value }))}>
                {EVENT_TYPES.map(t => <option key={t.key} value={t.key}>{t.icon} {t.label}</option>)}
              </select>
              <input className="input" placeholder="Unternehmen" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
              <div className="grid-3" style={{ gap: 8 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Meine Forderung €</label>
                  <input className="input" type="number" value={form.my_ask} onChange={e => setForm(p => ({ ...p, my_ask: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Deren Angebot €</label>
                  <input className="input" type="number" value={form.their_offer} onChange={e => setForm(p => ({ ...p, their_offer: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Ergebnis €</label>
                  <input className="input" type="number" value={form.final_result} onChange={e => setForm(p => ({ ...p, final_result: e.target.value }))} />
                </div>
              </div>
              <textarea className="input" placeholder="Wie lief das Gespräch?" rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
              <textarea className="input" placeholder="Was habe ich gelernt?" rows={2} value={form.lessons_learned} onChange={e => setForm(p => ({ ...p, lessons_learned: e.target.value }))} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary" onClick={() => setShowAdd(false)} style={{ flex: 1 }}>Abbrechen</button>
                <button className="btn btn-primary" onClick={handleAdd} style={{ flex: 1 }}>Speichern</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Entries Timeline */}
      {entries.map((e, i) => {
        const type = EVENT_TYPES.find(t => t.key === e.event_type) || EVENT_TYPES[0];
        const success = e.my_ask && e.final_result ? Math.round((e.final_result / e.my_ask) * 100) : null;
        return (
          <div key={e.id} className="card animate-in" style={{ marginBottom: 8, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>{type.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{type.label}{e.company ? ` — ${e.company}` : ''}</div>
                <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>{new Date(e.date || e.created_at).toLocaleDateString('de-DE')}</div>
              </div>
              {success && <span className={`pill ${success >= 90 ? 'pill-green' : success >= 70 ? 'pill-gold' : 'pill-red'}`}>{success}%</span>}
            </div>
            {(e.my_ask || e.their_offer || e.final_result) && (
              <div style={{ display: 'flex', gap: 16, marginTop: 10, paddingLeft: 36, fontSize: 13 }}>
                {e.my_ask && <span>Gefordert: <strong>€{(+e.my_ask).toLocaleString('de-DE')}</strong></span>}
                {e.their_offer && <span>Angebot: <strong>€{(+e.their_offer).toLocaleString('de-DE')}</strong></span>}
                {e.final_result && <span style={{ color: 'var(--ki-success)', fontWeight: 600 }}>Ergebnis: €{(+e.final_result).toLocaleString('de-DE')}</span>}
              </div>
            )}
            {e.lessons_learned && <div style={{ marginTop: 8, paddingLeft: 36, fontSize: 13, color: 'var(--ki-text-secondary)', fontStyle: 'italic' }}>💡 {e.lessons_learned}</div>}
          </div>
        );
      })}

      {entries.length === 0 && (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
          <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 16 }}>Dokumentiere deine Gehaltsverhandlungen — jedes Gespräch zählt.</p>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>Erste Verhandlung eintragen</button>
        </div>
      )}
    </div>
  );
}
