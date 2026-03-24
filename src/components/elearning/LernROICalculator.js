'use client';

import { useState } from 'react';

export default function LernROICalculator({ onComplete }) {
  const [gehalt, setGehalt] = useState('');
  const [steigerung, setSteigerung] = useState('');
  const [lernstunden, setLernstunden] = useState('');
  const [stundensatz, setStundensatz] = useState('');
  const [calculated, setCalculated] = useState(false);

  const gehaltNum = parseFloat(gehalt) || 0;
  const steigerungNum = parseFloat(steigerung) || 0;
  const lernstundenNum = parseFloat(lernstunden) || 0;
  const stundensatzNum = parseFloat(stundensatz) || 0;

  const investition = lernstundenNum * stundensatzNum;
  const ertragProJahr = gehaltNum * (steigerungNum / 100);
  const ertrag5Jahre = ertragProJahr * 5;
  const roi = investition > 0 ? Math.round((ertrag5Jahre / investition) * 100) : 0;

  const allFilled = gehalt && steigerung && lernstunden && stundensatz;

  return (
    <div className="card" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>💰</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Lern-ROI Rechner</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
        Berechne den Return on Investment deiner Lernzeit.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 2 }}>Aktuelles Brutto-Jahresgehalt (€)</label>
          <input className="input" type="number" value={gehalt} onChange={e => setGehalt(e.target.value)} placeholder="z.B. 45000" disabled={calculated} style={{ fontSize: 13 }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 2 }}>Erwartete Gehaltssteigerung durch Skill (%)</label>
          <input className="input" type="number" value={steigerung} onChange={e => setSteigerung(e.target.value)} placeholder="z.B. 10" disabled={calculated} style={{ fontSize: 13 }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 2 }}>Lernstunden die du investierst</label>
          <input className="input" type="number" value={lernstunden} onChange={e => setLernstunden(e.target.value)} placeholder="z.B. 20" disabled={calculated} style={{ fontSize: 13 }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 2 }}>Dein Stundensatz / Opportunitätskosten (€)</label>
          <input className="input" type="number" value={stundensatz} onChange={e => setStundensatz(e.target.value)} placeholder="z.B. 50" disabled={calculated} style={{ fontSize: 13 }} />
        </div>
      </div>

      {!calculated ? (
        <button
          onClick={() => setCalculated(true)}
          className="btn btn-primary"
          disabled={!allFilled}
          style={{ marginTop: 16, opacity: allFilled ? 1 : 0.5 }}
        >
          ROI berechnen
        </button>
      ) : (
        <div style={{ marginTop: 16 }}>
          <div style={{
            padding: '20px', borderRadius: 'var(--r-md)', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.02))',
            border: '1px solid rgba(139,92,246,0.2)', marginBottom: 14,
          }}>
            <div style={{ fontSize: 42, fontWeight: 800, color: '#8b5cf6', letterSpacing: '-0.03em' }}>
              {roi.toLocaleString('de-DE')}%
            </div>
            <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>Return on Learning</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#ef4444' }}>{investition.toLocaleString('de-DE')}€</div>
                <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>Investition</div>
              </div>
              <div style={{ width: 1, background: 'var(--ki-border)' }} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#16a34a' }}>{ertrag5Jahre.toLocaleString('de-DE')}€</div>
                <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>Ertrag (5 Jahre)</div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginBottom: 14, textAlign: 'center' }}>
            {roi > 1000 ? 'Wahnsinn! Lernen ist die beste Investition die du machen kannst.' :
             roi > 500 ? 'Sehr guter ROI. Jede Lernstunde zahlt sich mehrfach aus.' :
             'Solider ROI. Je gezielter du lernst, desto höher wird er.'}
          </p>
          <button onClick={onComplete} className="btn btn-primary">✅ Als erledigt markieren</button>
        </div>
      )}
    </div>
  );
}
