'use client';

import { useState } from 'react';

export default function TransferPlannerWidget({ beispiele, onComplete }) {
  const [plans, setPlans] = useState([{ wenn: '', dann: '' }]);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  function updatePlan(idx, field, val) {
    setPlans(prev => prev.map((p, i) => i === idx ? { ...p, [field]: val } : p));
  }

  function addPlan() {
    if (plans.length < 5) setPlans(prev => [...prev, { wenn: '', dann: '' }]);
  }

  function removePlan(idx) {
    if (plans.length > 1) setPlans(prev => prev.filter((_, i) => i !== idx));
  }

  const allFilled = plans.every(p => p.wenn.length >= 5 && p.dann.length >= 5);

  function copyAll() {
    const text = plans.map((p, i) => `${i + 1}. WENN ${p.wenn} → DANN ${p.dann}`).join('\n');
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="card" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🔗</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>WENN-DANN Transfer-Planner</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 8, lineHeight: 1.6 }}>
        Erstelle konkrete WENN-DANN Pläne um Gelerntes in Handlung umzusetzen.
      </p>

      {/* Examples */}
      {beispiele && beispiele.length > 0 && (
        <div style={{ marginBottom: 16, padding: '10px 12px', borderRadius: 'var(--r-md)', background: 'var(--ki-bg-alt)', fontSize: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--ki-text-tertiary)' }}>Beispiele:</div>
          {beispiele.slice(0, 3).map((b, i) => (
            <div key={i} style={{ color: 'var(--ki-text-secondary)', marginBottom: 2 }}>
              WENN {b.wenn} → DANN {b.dann}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {plans.map((p, i) => (
          <div key={i} style={{
            display: 'flex', gap: 8, alignItems: 'flex-start',
            padding: '10px', borderRadius: 'var(--r-md)', background: 'var(--ki-bg-alt)',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#8b5cf6', marginBottom: 2 }}>WENN...</div>
              <input
                className="input"
                value={p.wenn}
                onChange={e => updatePlan(i, 'wenn', e.target.value)}
                placeholder="Situation beschreiben..."
                disabled={submitted}
                style={{ fontSize: 13, marginBottom: 6 }}
              />
              <div style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', marginBottom: 2 }}>DANN...</div>
              <input
                className="input"
                value={p.dann}
                onChange={e => updatePlan(i, 'dann', e.target.value)}
                placeholder="Konkrete Handlung..."
                disabled={submitted}
                style={{ fontSize: 13 }}
              />
            </div>
            {!submitted && plans.length > 1 && (
              <button onClick={() => removePlan(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--ki-text-tertiary)', padding: 4 }}>✕</button>
            )}
          </div>
        ))}
      </div>

      {!submitted && plans.length < 5 && (
        <button onClick={addPlan} className="btn btn-secondary" style={{ marginTop: 10, fontSize: 12 }}>
          + Weiteren Plan hinzufügen
        </button>
      )}

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          className="btn btn-primary"
          disabled={!allFilled}
          style={{ marginTop: 14, opacity: allFilled ? 1 : 0.5 }}
        >
          Transfer-Pläne aktivieren
        </button>
      ) : (
        <div style={{ marginTop: 14 }}>
          <div style={{
            padding: '12px 16px', borderRadius: 'var(--r-md)',
            background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)',
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#16a34a', marginBottom: 4 }}>
              ✅ {plans.length} Transfer-Plan{plans.length > 1 ? 'e' : ''} aktiviert!
            </div>
            <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>
              Studien zeigen: WENN-DANN Pläne verdoppeln die Umsetzungsrate (Gollwitzer, 1999).
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={copyAll} className="btn btn-secondary" style={{ fontSize: 12 }}>
              {copied ? '✅ Kopiert!' : '📋 Alle Pläne kopieren'}
            </button>
            <button onClick={onComplete} className="btn btn-primary">
              ✅ Als erledigt markieren (+40 XP)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
