'use client';

import { useState, useRef } from 'react';

export default function ShareableProgressCard({ startWPM, currentWPM, verstaendnis, tage, onComplete }) {
  const [shared, setShared] = useState(false);
  const cardRef = useRef(null);

  const steigerung = startWPM > 0 ? Math.round(((currentWPM - startWPM) / startWPM) * 100) : 0;

  const text = `Ich habe meine Lesegeschwindigkeit in ${tage || '?'} Tagen von ${startWPM || '?'} auf ${currentWPM || '?'} WPM gesteigert — bei ${verstaendnis || '?'}% Textverständnis. #KarriereInstitut #Speedreading`;

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setShared(true);
  }

  return (
    <div className="card" style={{ border: '1px solid rgba(245,158,11,0.2)', textAlign: 'center' }}>
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Deine Shareable Progress Card</div>

      {/* Card Preview */}
      <div ref={cardRef} style={{
        padding: '32px 24px', borderRadius: 16, margin: '0 auto 20px', maxWidth: 400,
        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        color: 'white', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 120, height: 120,
          borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
        }} />
        <div style={{
          position: 'absolute', bottom: -20, left: -20, width: 80, height: 80,
          borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
        }} />

        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Speedreading Fortschritt
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.03em' }}>{currentWPM || '—'}</span>
          <span style={{ fontSize: 18, fontWeight: 600 }}>WPM</span>
        </div>

        <div style={{ fontSize: 14, marginBottom: 16, opacity: 0.9 }}>
          Von {startWPM || '—'} WPM → +{steigerung}% in {tage || '—'} Tagen
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{verstaendnis || '—'}%</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Verständnis</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.3)' }} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>+{steigerung}%</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Steigerung</div>
          </div>
        </div>

        <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 600 }}>
          📖 Karriere Institut Akademie
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={handleShare} className="btn btn-primary" style={{ fontSize: 13 }}>
          {shared ? '✅ Text kopiert!' : '📋 Text kopieren & teilen'}
        </button>
      </div>

      {shared && (
        <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 12 }}>
          Teile deinen Fortschritt auf LinkedIn, Twitter oder per Nachricht!
        </p>
      )}

      {onComplete && (
        <button onClick={onComplete} className="btn btn-secondary" style={{ marginTop: 14, fontSize: 13 }}>
          ✅ Weiter
        </button>
      )}
    </div>
  );
}
