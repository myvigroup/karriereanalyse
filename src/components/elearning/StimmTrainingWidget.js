'use client';

import { useState } from 'react';
import { STIMM_TRAINING } from '@/lib/elearning/kommunikation-content';

const DEFAULT_EXERCISES = [
  {
    name: 'Atemst\u00fctze',
    icon: '\u{1F4A8}',
    sentence: 'Ich pr\u00e4sentiere heute die Quartalszahlen und bin \u00fcberzeugt von unserer Strategie.',
    steps: [
      'Stehe aufrecht, Schultern entspannt.',
      'Atme tief in den Bauch ein (4 Sekunden).',
      'Halte kurz (2 Sekunden).',
      'Sprich den Satz langsam beim Ausatmen.',
      'Wiederhole 3x â jedes Mal etwas lauter.',
    ],
    tips: 'Die Atemst\u00fctze gibt deiner Stimme Kraft und verhindert, dass sie am Satzende wegbricht.',
  },
  {
    name: 'Betonung & Pausen',
    icon: '\u{23F8}\u{FE0F}',
    sentence: 'Wir m\u00fcssen JETZT handeln â [Pause] â bevor es zu sp\u00e4t ist.',
    steps: [
      'Lies den Satz zun\u00e4chst monoton vor.',
      'Betone nun das Wort in Gro\u00dfbuchstaben.',
      'F\u00fcge an der markierten Stelle eine 2-Sekunden-Pause ein.',
      'Variiere: Betone verschiedene W\u00f6rter und beobachte die Wirkung.',
    ],
    tips: 'Pausen sind m\u00e4chtiger als W\u00f6rter. Sie geben dem Zuh\u00f6rer Zeit zum Verarbeiten.',
  },
  {
    name: 'Stimmtiefe',
    icon: '\u{1F3B5}',
    sentence: 'Guten Morgen, mein Name ist [dein Name] und ich leite das heutige Meeting.',
    steps: [
      'Summe ein tiefes "Mmmm" f\u00fcr 10 Sekunden.',
      'Sprich den Satz in deiner normalen Stimmlage.',
      'Sprich ihn erneut, etwas tiefer â stell dir vor, du sprichst "aus dem Brustkorb".',
      'Finde deine nat\u00fcrliche, resonante Stimmlage.',
    ],
    tips: 'Eine tiefere Stimme wirkt kompetenter. Aber erzwinge es nicht â finde DEINE beste Lage.',
  },
  {
    name: 'Tempo & Klarheit',
    icon: '\u{1F3C3}',
    sentence: 'Unsere drei Priorit\u00e4ten sind: Erstens Kundenservice, zweitens Innovation, drittens Effizienz.',
    steps: [
      'Sprich den Satz in normalem Tempo (nimm die Zeit).',
      'Sprich ihn 50% langsamer â betone jede Priorit\u00e4t.',
      'Sprich ihn z\u00fcgig aber deutlich â jede Silbe muss erkennbar sein.',
      'Finde das Tempo, bei dem du klar UND nat\u00fcrlich klingst.',
    ],
    tips: 'Gutes Sprechtempo: 120â150 W\u00f6rter pro Minute. Bei wichtigen Punkten: langsamer!',
  },
];

const DEFAULT_STIMMKILLER = [
  {
    problem: '\u201e\u00c4hm\u201c und F\u00fcllw\u00f6rter',
    icon: '\u{1F6AB}',
    fix: 'Ersetze \u201e\u00c4hm\u201c durch eine kurze Pause. Stille wirkt souver\u00e4ner als F\u00fcllw\u00f6rter.',
  },
  {
    problem: 'Hochtonigkeit am Satzende',
    icon: '\u{2934}\u{FE0F}',
    fix: 'Achte darauf, dass deine Stimme am Satzende sinkt. Sonst klingt jede Aussage wie eine Frage.',
  },
  {
    problem: 'Zu schnell sprechen',
    icon: '\u{26A1}',
    fix: 'Atme zwischen S\u00e4tzen. Setze bewusst Punkte. Dein Publikum braucht Zeit zum Verstehen.',
  },
  {
    problem: 'Monotone Stimme',
    icon: '\u{1F4CF}',
    fix: 'Variiere Lautst\u00e4rke, Tempo und Tonh\u00f6he. Stell dir vor, du erz\u00e4hlst eine spannende Geschichte.',
  },
];

export default function StimmTrainingWidget({ onComplete }) {
  const exercises = STIMM_TRAINING?.exercises || DEFAULT_EXERCISES;
  const stimmkiller = STIMM_TRAINING?.stimmkiller || DEFAULT_STIMMKILLER;

  const [activeTab, setActiveTab] = useState(0);
  const [checked, setChecked] = useState(new Set());

  const handleCheck = (index) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const allChecked = checked.size >= exercises.length;
  const current = exercises[activeTab];

  return (
    <div style={styles.container}>
      {/* CSS for audio wave decoration */}
      <style>{`
        @keyframes wave1 { 0%,100%{height:8px} 50%{height:24px} }
        @keyframes wave2 { 0%,100%{height:16px} 50%{height:8px} }
        @keyframes wave3 { 0%,100%{height:12px} 50%{height:28px} }
        .stimm-wave-bar { display:inline-block; width:3px; margin:0 2px; border-radius:2px; background:var(--ki-red,#CC1426); vertical-align:middle; }
        .stimm-wave-bar:nth-child(1){animation:wave1 1.2s ease-in-out infinite}
        .stimm-wave-bar:nth-child(2){animation:wave2 1s ease-in-out infinite}
        .stimm-wave-bar:nth-child(3){animation:wave3 1.4s ease-in-out infinite}
        .stimm-wave-bar:nth-child(4){animation:wave1 0.8s ease-in-out infinite}
        .stimm-wave-bar:nth-child(5){animation:wave2 1.1s ease-in-out infinite}
      `}</style>

      <h2 style={styles.heading}>
        <span style={styles.micIcon}>{'🎤'}</span> Stimmtraining
      </h2>
      <p style={styles.subtext}>
        Deine Stimme ist dein wichtigstes Werkzeug. Trainiere sie mit diesen \u00dcbungen.
      </p>

      {/* Audio wave decoration */}
      <div style={styles.waveContainer}>
        <span className="stimm-wave-bar" style={{ height: 8 }} />
        <span className="stimm-wave-bar" style={{ height: 16 }} />
        <span className="stimm-wave-bar" style={{ height: 12 }} />
        <span className="stimm-wave-bar" style={{ height: 24 }} />
        <span className="stimm-wave-bar" style={{ height: 10 }} />
      </div>

      {/* Tab navigation */}
      <div style={styles.tabs}>
        {exercises.map((ex, i) => (
          <button
            key={i}
            style={{
              ...styles.tab,
              borderBottomColor: activeTab === i ? 'var(--ki-red, #CC1426)' : 'transparent',
              color: activeTab === i ? 'var(--ki-red, #CC1426)' : '#888',
              fontWeight: activeTab === i ? 700 : 400,
            }}
            onClick={() => setActiveTab(i)}
          >
            <span style={styles.tabIcon}>{ex.icon || DEFAULT_EXERCISES[i]?.icon}</span>
            <span style={styles.tabLabel}>{ex.name || DEFAULT_EXERCISES[i]?.name}</span>
            {checked.has(i) && <span style={styles.tabCheck}>\u2713</span>}
          </button>
        ))}
      </div>

      {/* Current exercise */}
      {current && (
        <div className="card" style={styles.exerciseCard}>
          <h3 style={styles.exerciseName}>
            {current.icon || DEFAULT_EXERCISES[activeTab]?.icon} {current.name || DEFAULT_EXERCISES[activeTab]?.name}
          </h3>

          {/* Steps */}
          <div style={styles.stepsBox}>
            <div style={styles.stepsLabel}>Anleitung:</div>
            <ol style={styles.stepsList}>
              {(current.steps || DEFAULT_EXERCISES[activeTab]?.steps || []).map((step, si) => (
                <li key={si} style={styles.stepItem}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Sentence to practice */}
          <div style={styles.sentenceBox}>
            <div style={styles.sentenceLabel}>{'🎤'} Sprich diesen Satz:</div>
            <p style={styles.sentenceText}>
              &ldquo;{current.sentence || DEFAULT_EXERCISES[activeTab]?.sentence}&rdquo;
            </p>
          </div>

          {/* Tips */}
          <div style={styles.tipBox}>
            <div style={styles.tipLabel}>Tipp</div>
            <p style={styles.tipText}>{current.tips || DEFAULT_EXERCISES[activeTab]?.tips}</p>
          </div>

          {/* Checkbox */}
          <label style={styles.checkLabel}>
            <input
              type="checkbox"
              checked={checked.has(activeTab)}
              onChange={() => handleCheck(activeTab)}
              style={styles.checkbox}
            />
            <span style={styles.checkText}>Verstanden & Ge\u00fcbt</span>
          </label>
        </div>
      )}

      {/* Stimmkiller section */}
      <div style={styles.killerSection}>
        <h3 style={styles.killerTitle}>{'⚠️'} Stimmkiller vermeiden</h3>
        <div style={styles.killerGrid}>
          {stimmkiller.map((item, i) => (
            <div key={i} className="card" style={styles.killerCard}>
              <div style={styles.killerIcon}>{item.icon || DEFAULT_STIMMKILLER[i]?.icon}</div>
              <h4 style={styles.killerProblem}>{item.problem || DEFAULT_STIMMKILLER[i]?.problem}</h4>
              <p style={styles.killerFix}>{item.fix || DEFAULT_STIMMKILLER[i]?.fix}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress & completion */}
      <div style={styles.progressSection}>
        <div style={styles.progressBarOuter}>
          <div style={{ ...styles.progressBarInner, width: `${(checked.size / Math.max(exercises.length, 1)) * 100}%` }} />
        </div>
        <p style={styles.progressText}>{checked.size} von {exercises.length} \u00dcbungen absolviert</p>
      </div>

      {allChecked && (
        <div style={styles.completeSection}>
          <p style={styles.completeText}>
            Alle \u00dcbungen absolviert! Trainiere regelm\u00e4\u00dfig â deine Stimme wird st\u00e4rker.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => onComplete?.()}
            style={styles.completeBtn}
          >
            Weiter
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Instrument Sans, sans-serif',
    maxWidth: 700,
    margin: '0 auto',
    padding: '1rem',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '0.25rem',
    color: 'var(--ki-text, #1a1a1a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  micIcon: {
    fontSize: '1.3rem',
  },
  subtext: {
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#888',
    marginBottom: '0.75rem',
    lineHeight: 1.5,
  },
  waveContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    marginBottom: 20,
  },
  tabs: {
    display: 'flex',
    gap: 4,
    overflowX: 'auto',
    marginBottom: 20,
    borderBottom: '2px solid #eee',
    paddingBottom: 0,
  },
  tab: {
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '8px 12px',
    background: 'none',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: 13,
    transition: 'all 0.2s',
    position: 'relative',
  },
  tabIcon: { fontSize: '1.2rem' },
  tabLabel: { fontSize: 11, whiteSpace: 'nowrap' },
  tabCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    fontSize: 10,
    color: 'var(--ki-success, #10B981)',
    fontWeight: 700,
  },
  exerciseCard: {
    padding: 20,
    borderLeft: '4px solid var(--ki-red, #CC1426)',
    marginBottom: 24,
  },
  exerciseName: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: 'var(--ki-text, #1a1a1a)',
    margin: '0 0 16px',
  },
  stepsBox: {
    marginBottom: 16,
  },
  stepsLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 8,
  },
  stepsList: {
    margin: 0,
    paddingLeft: 20,
  },
  stepItem: {
    fontSize: '0.9rem',
    color: 'var(--ki-text, #444)',
    lineHeight: 1.6,
    marginBottom: 4,
  },
  sentenceBox: {
    background: 'var(--ki-bg, #fafafa)',
    border: '2px solid var(--ki-red, #CC1426)',
    borderRadius: 12,
    padding: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  sentenceLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--ki-red, #CC1426)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 8,
  },
  sentenceText: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--ki-text, #1a1a1a)',
    lineHeight: 1.6,
    margin: 0,
    fontStyle: 'italic',
  },
  tipBox: {
    background: 'rgba(204, 20, 38, 0.04)',
    border: '1px solid rgba(204, 20, 38, 0.12)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  tipLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--ki-red, #CC1426)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 14,
    color: 'var(--ki-text, #555)',
    lineHeight: 1.5,
    margin: 0,
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    padding: '8px 0',
  },
  checkbox: {
    width: 20,
    height: 20,
    accentColor: 'var(--ki-red, #CC1426)',
    cursor: 'pointer',
  },
  checkText: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--ki-text, #333)',
  },
  killerSection: {
    marginBottom: 24,
  },
  killerTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--ki-text, #1a1a1a)',
    marginBottom: 12,
  },
  killerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 12,
  },
  killerCard: {
    padding: 16,
    textAlign: 'center',
    borderTop: '3px solid var(--ki-warning, #F59E0B)',
  },
  killerIcon: {
    fontSize: '1.5rem',
    marginBottom: 6,
  },
  killerProblem: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--ki-text, #333)',
    margin: '0 0 6px',
  },
  killerFix: {
    fontSize: '0.82rem',
    color: 'var(--ki-text, #666)',
    lineHeight: 1.5,
    margin: 0,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressBarOuter: {
    height: 4,
    background: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    background: 'var(--ki-red, #CC1426)',
    borderRadius: 2,
    transition: 'width 0.4s ease',
  },
  progressText: {
    fontSize: 12,
    color: '#aaa',
  },
  completeSection: {
    textAlign: 'center',
    marginTop: 24,
    padding: 24,
    background: 'rgba(204, 20, 38, 0.03)',
    borderRadius: 16,
  },
  completeText: {
    fontSize: 16,
    color: 'var(--ki-text, #333)',
    marginBottom: 16,
    lineHeight: 1.5,
  },
  completeBtn: {
    fontSize: 18,
    padding: '14px 40px',
  },
};
