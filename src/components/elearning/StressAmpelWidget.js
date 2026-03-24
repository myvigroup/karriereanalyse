'use client';

import { useState } from 'react';

const ZONEN = [
  { id: 'gruen', label: 'Gruen — Gesunder Stress', farbe: '#22c55e', beschreibung: 'Motiviert dich, ist zeitlich begrenzt, du kannst damit umgehen.' },
  { id: 'gelb', label: 'Gelb — Warnung', farbe: '#f59e0b', beschreibung: 'Belastet dich spuerbar, du merkst koerperliche Symptome, Erholung reicht nicht immer.' },
  { id: 'rot', label: 'Rot — Gefahr', farbe: '#ef4444', beschreibung: 'Dauerstress, Schlafprobleme, koerperliche Beschwerden, Gefuehl der Ueberlastung.' },
];

const BEISPIEL_STRESSOREN = [
  'Zu viele Meetings', 'E-Mail-Flut', 'Deadline-Druck', 'Konflikte im Team',
  'Fehlende Wertschaetzung', 'Lange Arbeitszeiten', 'Staendige Erreichbarkeit',
  'Finanzielle Sorgen', 'Beziehungsprobleme', 'Gesundheitsprobleme',
];

const EMPFEHLUNGEN = {
  gruen: 'Dein Stress ist groesstenteils gesund. Halte diesen Zustand, indem du regelmaessig Pausen machst und deine Grenzen kennst.',
  gelb: 'Du bist in der Warnzone. Jetzt ist der richtige Zeitpunkt, gegenzusteuern: Grenzen setzen, Micro-Recovery einbauen, Prioritaeten klaeren.',
  rot: 'Achtung — du bist in der Gefahrenzone. Sprich mit einer Vertrauensperson und erwaege professionelle Unterstuetzung. Dein Koerper sendet klare Signale.',
};

export default function StressAmpelWidget({ onComplete }) {
  const [stressoren, setStressoren] = useState({});
  const [customInput, setCustomInput] = useState('');
  const [customItems, setCustomItems] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const allItems = [...BEISPIEL_STRESSOREN, ...customItems];

  function addCustom() {
    const v = customInput.trim();
    if (v && !customItems.includes(v)) {
      setCustomItems(prev => [...prev, v]);
      setCustomInput('');
    }
  }

  function assignZone(item, zone) {
    if (submitted) return;
    setStressoren(prev => ({ ...prev, [item]: zone }));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  const assignedCount = Object.keys(stressoren).length;

  const zoneCounts = { gruen: 0, gelb: 0, rot: 0 };
  Object.values(stressoren).forEach(z => { zoneCounts[z]++; });
  const dominant = Object.entries(zoneCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'gruen';

  return (
    <div className="card" style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🚦</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Deine Stress-Ampel</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
        Ordne deine Stressoren einer Zone zu: Gruen (gesund), Gelb (Warnung) oder Rot (Gefahr).
      </p>

      {/* Add custom stressor */}
      {!submitted && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            className="input"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom()}
            placeholder="Eigenen Stressor hinzufuegen..."
            style={{ fontSize: 13, flex: 1 }}
          />
          <button onClick={addCustom} className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }}>+</button>
        </div>
      )}

      {/* Stressor list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {allItems.map(item => (
          <div key={item} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px', borderRadius: 'var(--r-sm)',
            background: stressoren[item] ? `${ZONEN.find(z => z.id === stressoren[item])?.farbe}10` : 'var(--ki-bg-alt)',
            border: `1px solid ${stressoren[item] ? ZONEN.find(z => z.id === stressoren[item])?.farbe + '40' : 'var(--ki-border)'}`,
          }}>
            <span style={{ fontSize: 13, flex: 1 }}>{item}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {ZONEN.map(z => (
                <button
                  key={z.id}
                  onClick={() => assignZone(item, z.id)}
                  disabled={submitted}
                  title={z.label}
                  style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: stressoren[item] === z.id ? z.farbe : `${z.farbe}30`,
                    border: stressoren[item] === z.id ? `2px solid ${z.farbe}` : '1px solid transparent',
                    cursor: submitted ? 'default' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="btn btn-primary"
          disabled={assignedCount < 3}
          style={{ opacity: assignedCount >= 3 ? 1 : 0.5 }}
        >
          Stress-Ampel auswerten ({assignedCount} Stressoren zugeordnet)
        </button>
      )}

      {submitted && (
        <div style={{ marginTop: 8 }}>
          {/* Summary */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            {ZONEN.map(z => (
              <div key={z.id} style={{
                flex: 1, padding: '12px', borderRadius: 'var(--r-md)',
                background: `${z.farbe}10`, border: `1px solid ${z.farbe}30`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: z.farbe }}>{zoneCounts[z.id]}</div>
                <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>{z.id.charAt(0).toUpperCase() + z.id.slice(1)}</div>
              </div>
            ))}
          </div>

          <div style={{
            padding: '14px 16px', borderRadius: 'var(--r-md)',
            background: `${ZONEN.find(z => z.id === dominant)?.farbe}10`,
            border: `1px solid ${ZONEN.find(z => z.id === dominant)?.farbe}30`,
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
              Dein dominantes Stresslevel: {ZONEN.find(z => z.id === dominant)?.label}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ki-text-secondary)' }}>
              {EMPFEHLUNGEN[dominant]}
            </div>
          </div>

          <button onClick={() => onComplete?.()} className="btn btn-primary">
            Stress-Profil speichern (+30 XP)
          </button>
        </div>
      )}
    </div>
  );
}
