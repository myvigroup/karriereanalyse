'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const DEFAULT_CHECKLIST = [
  { id: 'c1', label: 'Kündigungsfrist im Vertrag geprüft', category: 'legal', done: false },
  { id: 'c2', label: 'Resturlaub berechnet', category: 'legal', done: false },
  { id: 'c3', label: 'Arbeitszeugnis angefordert (Zwischenzeugnis)', category: 'documents', done: false },
  { id: 'c4', label: 'Referenzen gesichert (2-3 Personen)', category: 'network', done: false },
  { id: 'c5', label: 'LinkedIn-Profil aktualisiert', category: 'network', done: false },
  { id: 'c6', label: 'Persönliche Dateien vom Firmen-Laptop gesichert', category: 'documents', done: false },
  { id: 'c7', label: 'Sperrzeit-Risiko bei ALG geprüft', category: 'finance', done: false },
  { id: 'c8', label: 'Finanzpuffer für 3-6 Monate berechnet', category: 'finance', done: false },
  { id: 'c9', label: 'Abfindungsverhandlung vorbereitet', category: 'finance', done: false },
  { id: 'c10', label: 'Neuen Lebenslauf erstellt', category: 'documents', done: false },
  { id: 'c11', label: 'Mentoren/Vertrauenspersonen informiert', category: 'mental', done: false },
  { id: 'c12', label: 'Kündigungsschreiben formuliert', category: 'legal', done: false },
];

export default function ExitPlannerClient({ userId, existingPlan }) {
  const supabase = createClient();
  const [plan, setPlan] = useState(existingPlan || { checklist: DEFAULT_CHECKLIST, annual_salary: 0, years_employed: 0, notice_period_months: 3 });
  const [saving, setSaving] = useState(false);

  const severance = plan.annual_salary && plan.years_employed ? Math.round((plan.annual_salary / 12) * 0.5 * plan.years_employed) : 0;
  const checkDone = (plan.checklist || []).filter(c => c.done).length;
  const checkTotal = (plan.checklist || []).length;

  const toggleCheck = (id) => {
    setPlan(p => ({ ...p, checklist: p.checklist.map(c => c.id === id ? { ...c, done: !c.done } : c) }));
  };

  const savePlan = async () => {
    setSaving(true);
    await supabase.from('exit_plans').upsert({
      user_id: userId, ...plan, estimated_severance: severance, updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
    setSaving(false);
  };

  const categories = [
    { key: 'legal', label: '⚖️ Rechtliches', color: 'var(--ki-red)' },
    { key: 'documents', label: '📄 Dokumente', color: 'var(--ki-warning)' },
    { key: 'finance', label: '💰 Finanzen', color: 'var(--ki-success)' },
    { key: 'network', label: '🤝 Netzwerk', color: '#5856D6' },
    { key: 'mental', label: '🧠 Mindset', color: 'var(--ki-text-secondary)' },
  ];

  return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      <h1 className="page-title">Exit-Strategie</h1>
      <p className="page-subtitle" style={{ marginBottom: 32 }}>Dein strukturierter Plan für den Wechsel — kein Detail vergessen.</p>

      {/* Abfindungs-Rechner */}
      <div className="card animate-in" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>💰 Abfindungs-Simulator</h3>
        <div className="grid-2" style={{ gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 4, display: 'block' }}>Jahresgehalt (brutto)</label>
            <input className="input" type="number" value={plan.annual_salary || ''} onChange={e => setPlan(p => ({ ...p, annual_salary: +e.target.value }))} placeholder="80000" />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 4, display: 'block' }}>Jahre im Unternehmen</label>
            <input className="input" type="number" step="0.5" value={plan.years_employed || ''} onChange={e => setPlan(p => ({ ...p, years_employed: +e.target.value }))} placeholder="5" />
          </div>
        </div>
        {severance > 0 && (
          <div style={{ padding: 16, background: 'rgba(45,106,79,0.06)', borderRadius: 'var(--r-md)', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 4 }}>Geschätzte Abfindung (Faustformel: 0.5 Monatsgehälter × Jahre)</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--ki-success)' }}>€{severance.toLocaleString('de-DE')}</div>
          </div>
        )}
        <div className="grid-2" style={{ gap: 12, marginTop: 12 }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 4, display: 'block' }}>Kündigungsfrist (Monate)</label>
            <input className="input" type="number" value={plan.notice_period_months || 3} onChange={e => setPlan(p => ({ ...p, notice_period_months: +e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 4, display: 'block' }}>Aktueller Arbeitgeber</label>
            <input className="input" value={plan.current_employer || ''} onChange={e => setPlan(p => ({ ...p, current_employer: e.target.value }))} />
          </div>
        </div>
      </div>

      {/* Checkliste */}
      <div className="card animate-in" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>✅ Exit-Checkliste</h3>
          <span className="pill pill-grey">{checkDone} / {checkTotal}</span>
        </div>
        <div className="progress-bar" style={{ marginBottom: 16 }}>
          <div className="progress-bar-fill" style={{ width: `${checkTotal > 0 ? (checkDone / checkTotal) * 100 : 0}%`, background: checkDone === checkTotal ? 'var(--ki-success)' : 'var(--ki-red)' }} />
        </div>
        {categories.map(cat => {
          const items = (plan.checklist || []).filter(c => c.category === cat.key);
          if (items.length === 0) return null;
          return (
            <div key={cat.key} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: cat.color, marginBottom: 8 }}>{cat.label}</div>
              {items.map(item => (
                <div key={item.id} onClick={() => toggleCheck(item.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer',
                  borderBottom: '1px solid var(--ki-border)',
                }}>
                  <span style={{ fontSize: 18, color: item.done ? 'var(--ki-success)' : 'var(--grey-4)' }}>{item.done ? '✓' : '○'}</span>
                  <span style={{ fontSize: 14, textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--ki-text-tertiary)' : 'var(--ki-text)' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <button className="btn btn-primary" onClick={savePlan} disabled={saving} style={{ width: '100%' }}>
        {saving ? 'Speichern...' : '💾 Plan speichern'}
      </button>
    </div>
  );
}
