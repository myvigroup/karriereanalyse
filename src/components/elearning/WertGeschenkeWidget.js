'use client';

import { useState } from 'react';

const AUFWAND_COLORS = {
  Minimal: '#10B981',
  Gering: '#3B82F6',
  Mittel: '#F59E0B',
};

export default function WertGeschenkeWidget({ geschenke = [], onComplete }) {
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [randomPick, setRandomPick] = useState(null);
  const [copiedRandom, setCopiedRandom] = useState(false);

  const toggleFlip = (id) => {
    setFlippedCards((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const pickRandom = () => {
    if (geschenke.length === 0) return;
    const pick = geschenke[Math.floor(Math.random() * geschenke.length)];
    setRandomPick(pick);
    setCopiedRandom(false);
  };

  const copyRandom = async () => {
    if (!randomPick) return;
    const text = `Wert-Geschenk: ${randomPick.name}\n${randomPick.beschreibung}`;
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
    setCopiedRandom(true);
    setTimeout(() => setCopiedRandom(false), 2000);
  };

  const allFlipped = flippedCards.size >= geschenke.length && geschenke.length > 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>12 Wert-Geschenke die nichts kosten</h2>
      <p style={styles.subtitle}>
        Klicke auf eine Karte, um die Beschreibung zu sehen. Jedes dieser Geschenke staerkt dein Netzwerk.
      </p>

      {/* Progress */}
      <div style={styles.progressBarOuter}>
        <div style={{ ...styles.progressBarInner, width: `${(flippedCards.size / Math.max(geschenke.length, 1)) * 100}%` }} />
      </div>
      <p style={styles.progressText}>{flippedCards.size} von {geschenke.length} entdeckt</p>

      {/* Card grid */}
      <div style={styles.grid}>
        {geschenke.map((g) => {
          const isFlipped = flippedCards.has(g.id);
          const aufwandColor = AUFWAND_COLORS[g.aufwand] || '#888';
          return (
            <div
              key={g.id}
              className="card"
              style={{
                ...styles.card,
                ...(isFlipped ? styles.cardFlipped : {}),
              }}
              onClick={() => toggleFlip(g.id)}
            >
              {!isFlipped ? (
                <div style={styles.cardFront}>
                  <span style={styles.cardIcon}>{g.icon}</span>
                  <strong style={styles.cardName}>{g.name}</strong>
                  <span className="pill" style={{ ...styles.aufwandPill, background: `${aufwandColor}15`, color: aufwandColor, borderColor: `${aufwandColor}40` }}>
                    {g.aufwand}
                  </span>
                </div>
              ) : (
                <div style={styles.cardBack}>
                  <p style={styles.cardDesc}>{g.beschreibung}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Random pick */}
      <div style={styles.randomSection}>
        <button className="btn btn-primary" onClick={pickRandom} style={styles.randomBtn}>
          Sende HEUTE eines!
        </button>
        {randomPick && (
          <div className="card" style={styles.randomCard}>
            <span style={styles.randomIcon}>{randomPick.icon}</span>
            <strong style={styles.randomName}>{randomPick.name}</strong>
            <p style={styles.randomDesc}>{randomPick.beschreibung}</p>
            <button className="btn btn-secondary" onClick={copyRandom} style={styles.copyBtn}>
              {copiedRandom ? 'Kopiert!' : 'Kopieren'}
            </button>
          </div>
        )}
      </div>

      {allFlipped && (
        <div style={styles.completeSection}>
          <p style={styles.completeText}>
            Alle 12 Wert-Geschenke entdeckt! Welches sendest du heute?
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
  progressText: { fontSize: 12, color: '#aaa', marginBottom: 20 },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: 12, marginBottom: 24,
  },
  card: {
    minHeight: 140, cursor: 'pointer', padding: 16, transition: 'transform 0.3s, box-shadow 0.2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  cardFlipped: { background: 'rgba(204, 20, 38, 0.03)' },
  cardFront: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center',
  },
  cardIcon: { fontSize: '2rem' },
  cardName: { fontSize: 14, color: 'var(--ki-text, #1a1a1a)', lineHeight: 1.3 },
  aufwandPill: {
    fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 12, border: '1px solid',
  },
  cardBack: { padding: 4 },
  cardDesc: { fontSize: 13, color: 'var(--ki-text, #555)', lineHeight: 1.5, margin: 0, textAlign: 'center' },
  randomSection: { textAlign: 'center', marginBottom: 24 },
  randomBtn: { fontSize: 16, padding: '12px 32px', marginBottom: 16 },
  randomCard: { padding: 20, textAlign: 'center', maxWidth: 400, margin: '0 auto' },
  randomIcon: { fontSize: '2.5rem', display: 'block', marginBottom: 8 },
  randomName: { fontSize: 18, color: 'var(--ki-text, #1a1a1a)', display: 'block', marginBottom: 8 },
  randomDesc: { fontSize: 14, color: 'var(--ki-text, #555)', lineHeight: 1.5, marginBottom: 12 },
  copyBtn: { fontSize: 13, padding: '6px 16px' },
  completeSection: { textAlign: 'center', marginTop: 24, padding: 24, background: 'rgba(204, 20, 38, 0.03)', borderRadius: 16 },
  completeText: { fontSize: 16, color: 'var(--ki-text, #333)', marginBottom: 16, lineHeight: 1.5 },
  completeBtn: { fontSize: 18, padding: '14px 40px' },
};
