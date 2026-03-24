'use client';

import { useState } from 'react';

const SITUATION_ICONS = {
  event: '🎪',
  linkedin: '💼',
  aufzug: '🛗',
  konferenz: '🎤',
};

const SITUATION_LABELS = {
  event: 'Event',
  linkedin: 'LinkedIn',
  aufzug: 'Aufzug',
  konferenz: 'Konferenz',
};

export default function OpenerGenerator({ openerData = {}, onComplete }) {
  const [activeSituation, setActiveSituation] = useState(null);
  const [viewedSituations, setViewedSituations] = useState(new Set());
  const [copiedIdx, setCopiedIdx] = useState(null);

  const situations = Object.keys(openerData);

  const handleSituationClick = (key) => {
    setActiveSituation(key);
    setViewedSituations((prev) => new Set([...prev, key]));
    setCopiedIdx(null);
  };

  const handleCopy = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const allViewed = viewedSituations.size >= situations.length && situations.length > 0;
  const activeData = activeSituation ? openerData[activeSituation] : null;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gespraechs-Opener Generator</h2>
      <p style={styles.subtitle}>
        Waehle eine Situation und erhalte 3 sofort einsetzbare Opener mit Erklaerung.
      </p>

      {/* Progress */}
      <div style={styles.progressBarOuter}>
        <div style={{ ...styles.progressBarInner, width: `${(viewedSituations.size / Math.max(situations.length, 1)) * 100}%` }} />
      </div>
      <p style={styles.progressText}>{viewedSituations.size} von {situations.length} Situationen erkundet</p>

      {/* Situation buttons */}
      <div style={styles.situationRow}>
        {situations.map((key) => (
          <button
            key={key}
            className={`btn ${activeSituation === key ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              ...styles.situationBtn,
              ...(viewedSituations.has(key) && activeSituation !== key ? { opacity: 0.7 } : {}),
            }}
            onClick={() => handleSituationClick(key)}
          >
            <span style={styles.situationIcon}>{SITUATION_ICONS[key] || '💬'}</span>
            {SITUATION_LABELS[key] || key}
          </button>
        ))}
      </div>

      {/* Opener list */}
      {activeData && (
        <div style={styles.openerSection}>
          <h3 style={styles.sectionTitle}>{activeData.situation}</h3>
          <div style={styles.openerList}>
            {activeData.opener.map((o, idx) => (
              <div key={idx} className="card" style={styles.openerCard}>
                <div style={styles.openerNumber}>{idx + 1}</div>
                <div style={styles.openerContent}>
                  <p style={styles.openerText}>"{o.text}"</p>
                  <div style={styles.warumBox}>
                    <span style={styles.warumLabel}>Warum es funktioniert:</span>
                    <p style={styles.warumText}>{o.warum}</p>
                  </div>
                  <button
                    className="btn btn-secondary"
                    style={styles.copyBtn}
                    onClick={() => handleCopy(o.text, idx)}
                  >
                    {copiedIdx === idx ? (
                      <span style={styles.copiedText}>Kopiert!</span>
                    ) : 'Kopieren'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!activeData && situations.length > 0 && (
        <div style={styles.placeholder}>
          Waehle eine Situation, um passende Opener zu sehen.
        </div>
      )}

      {allViewed && (
        <div style={styles.completeSection}>
          <p style={styles.completeText}>
            Alle 4 Situationen erkundet! Du hast jetzt 12 Opener in deinem Repertoire.
          </p>
          <button className="btn btn-primary" onClick={() => onComplete?.()} style={styles.completeBtn}>
            Weiter
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Instrument Sans, sans-serif', maxWidth: 640, margin: '0 auto', padding: 16 },
  title: { fontSize: 24, fontWeight: 700, color: 'var(--ki-text, #1a1a1a)', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#888', marginBottom: 16, lineHeight: 1.5 },
  progressBarOuter: { height: 4, background: '#e0e0e0', borderRadius: 2, marginBottom: 6, overflow: 'hidden' },
  progressBarInner: { height: '100%', background: 'var(--ki-red, #CC1426)', borderRadius: 2, transition: 'width 0.4s ease' },
  progressText: { fontSize: 12, color: '#aaa', marginBottom: 16 },
  situationRow: { display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  situationBtn: { fontSize: 15, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8 },
  situationIcon: { fontSize: '1.2rem' },
  openerSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: 700, color: 'var(--ki-text, #1a1a1a)', marginBottom: 14, fontFamily: 'Instrument Sans, sans-serif' },
  openerList: { display: 'flex', flexDirection: 'column', gap: 14 },
  openerCard: { padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start' },
  openerNumber: {
    width: 32, height: 32, borderRadius: '50%', background: 'var(--ki-red, #CC1426)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 15, flexShrink: 0,
  },
  openerContent: { flex: 1 },
  openerText: {
    fontSize: 17, fontWeight: 600, color: 'var(--ki-text, #1a1a1a)',
    lineHeight: 1.5, margin: '0 0 10px', fontStyle: 'italic',
  },
  warumBox: {
    background: 'rgba(59, 130, 246, 0.04)', border: '1px solid rgba(59, 130, 246, 0.12)',
    borderRadius: 8, padding: 12, marginBottom: 10,
  },
  warumLabel: { fontSize: 12, fontWeight: 700, color: '#3B82F6', display: 'block', marginBottom: 4 },
  warumText: { fontSize: 13, color: 'var(--ki-text, #555)', lineHeight: 1.5, margin: 0 },
  copyBtn: { fontSize: 13, padding: '6px 14px' },
  copiedText: { color: 'var(--ki-success, #10B981)', fontWeight: 600 },
  placeholder: {
    textAlign: 'center', padding: 40, color: '#bbb', fontSize: 16,
    background: '#fafafa', borderRadius: 12, marginBottom: 20,
  },
  completeSection: { textAlign: 'center', marginTop: 24, padding: 24, background: 'rgba(204, 20, 38, 0.03)', borderRadius: 16 },
  completeText: { fontSize: 16, color: 'var(--ki-text, #333)', marginBottom: 16, lineHeight: 1.5 },
  completeBtn: { fontSize: 18, padding: '14px 40px' },
};
