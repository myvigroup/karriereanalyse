'use client';

import { useState } from 'react';

const SPALTEN = [
  { id: 'P', name: 'Projekte', color: '#16a34a', desc: 'Direkte Wertschöpfung — SOFORT lesen' },
  { id: 'A1', name: 'Areas', color: '#3b82f6', desc: '1x/Woche scannen' },
  { id: 'R', name: 'Ressourcen', color: '#f59e0b', desc: '"Irgendwann lesen" Liste' },
  { id: 'A2', name: 'Archiv', color: '#dc2626', desc: 'NICHT LESEN — Abbestellen' },
];

const DEFAULT_QUELLEN = [
  'Branchen-Newsletter', 'Tägliche Nachrichtenmails', 'Team-Chat/Slack', 'LinkedIn Feed',
  'Twitter/X Timeline', 'Projekt-Updates', 'Fach-Zeitschrift', 'Allgemeine Newsletter',
  'News-Aggregator', 'Interne Reports', 'Wettbewerber-Blog', 'Podcast-Transkripte',
];

export default function RelevanzFilterBuilder({ config, onComplete }) {
  const [quellen, setQuellen] = useState(DEFAULT_QUELLEN);
  const [assignments, setAssignments] = useState({});
  const [newQuelle, setNewQuelle] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function assign(idx, spalteId) {
    if (submitted) return;
    setAssignments(prev => ({ ...prev, [idx]: spalteId }));
  }

  function addQuelle() {
    if (newQuelle.trim()) {
      setQuellen(prev => [...prev, newQuelle.trim()]);
      setNewQuelle('');
    }
  }

  const archivCount = Object.values(assignments).filter(v => v === 'A2').length;
  const allAssigned = quellen.every((_, i) => assignments[i]);

  return (
    <div className="card" style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>📊</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>PARA Relevanz-Filter</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 6, lineHeight: 1.6 }}>
        Ordne jede deiner Lese-Quellen einer PARA-Kategorie zu. Ziel: Mindestens 50% in "Archiv" (= nicht mehr lesen).
      </p>

      {/* PARA Legend */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
        {SPALTEN.map(s => (
          <span key={s.id} style={{
            padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
            background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30`,
          }}>
            {s.name}: {s.desc}
          </span>
        ))}
      </div>

      {/* Sources */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {quellen.map((q, i) => {
          const sel = assignments[i];
          const spalte = SPALTEN.find(s => s.id === sel);
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
              borderRadius: 'var(--r-md)', background: 'var(--ki-bg-alt)',
              border: spalte ? `1px solid ${spalte.color}30` : '1px solid var(--ki-border)',
            }}>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{q}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {SPALTEN.map(s => (
                  <button
                    key={s.id}
                    onClick={() => assign(i, s.id)}
                    disabled={submitted}
                    title={s.name}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', border: 'none',
                      background: sel === s.id ? s.color : `${s.color}15`,
                      color: sel === s.id ? 'white' : s.color,
                      fontSize: 11, fontWeight: 700, cursor: submitted ? 'default' : 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {s.id === 'A1' ? 'A' : s.id === 'A2' ? '✕' : s.id}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add custom source */}
      {!submitted && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input
            className="input"
            value={newQuelle}
            onChange={e => setNewQuelle(e.target.value)}
            placeholder="Eigene Quelle hinzufügen..."
            onKeyDown={e => e.key === 'Enter' && addQuelle()}
            style={{ flex: 1, fontSize: 13 }}
          />
          <button onClick={addQuelle} className="btn btn-secondary" style={{ fontSize: 13 }}>+ Hinzufügen</button>
        </div>
      )}

      {/* Stats */}
      <div style={{
        marginTop: 16, padding: '12px 16px', borderRadius: 'var(--r-md)',
        background: archivCount >= quellen.length * 0.5 ? 'rgba(34,197,94,0.06)' : 'rgba(245,158,11,0.06)',
        border: archivCount >= quellen.length * 0.5 ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(245,158,11,0.2)',
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
          {archivCount} von {quellen.length} Quellen eliminiert ({quellen.length > 0 ? Math.round((archivCount / quellen.length) * 100) : 0}%)
        </div>
        <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>
          {archivCount >= quellen.length * 0.5
            ? '🎯 Sehr gut! Du wirst viel weniger lesen und trotzdem besser informiert sein.'
            : 'Tipp: Sei mutiger beim Streichen. Wenn du einen Newsletter 3x nicht gelesen hast → Archiv.'}
        </div>
      </div>

      {!submitted && allAssigned && (
        <button onClick={() => setSubmitted(true)} className="btn btn-primary" style={{ marginTop: 14 }}>
          Lese-Diät abschließen
        </button>
      )}

      {submitted && (
        <button onClick={onComplete} className="btn btn-primary" style={{ marginTop: 14 }}>
          ✅ Als erledigt markieren (+40 XP)
        </button>
      )}
    </div>
  );
}
