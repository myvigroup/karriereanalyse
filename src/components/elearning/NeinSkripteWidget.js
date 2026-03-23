'use client';

import { useState } from 'react';

export default function NeinSkripteWidget({ skripte = [], onComplete }) {
  const [viewedCards, setViewedCards] = useState(new Set());
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedIndex(index);
    setViewedCards(prev => new Set([...prev, index]));
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
    setViewedCards(prev => new Set([...prev, index]));
  };

  const allViewed = viewedCards.size >= skripte.length && skripte.length > 0;

  const tipps = [
    'Passe den Ton an deine Beziehung zur Person an — formeller bei Vorgesetzten, direkter bei Kollegen.',
    'Biete eine Alternative an, wenn möglich. Das zeigt Kooperationsbereitschaft.',
    'Übe das Skript laut vor einem Spiegel. So wird es natürlicher.',
    'Beginne mit einem Verständnis-Signal: "Ich verstehe, dass..." bevor du Nein sagst.',
    'Setze eine klare Grenze, nicht eine Entschuldigung. "Ich kann nicht" statt "Es tut mir leid, aber..."',
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Nein-Skripte</h2>
      <p style={styles.subtitle}>
        Fertige Vorlagen zum Kopieren &mdash; für jede Situation das passende Nein.
      </p>

      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${(viewedCards.size / Math.max(skripte.length, 1)) * 100}%` }} />
      </div>
      <p style={styles.progressText}>{viewedCards.size} von {skripte.length} angesehen</p>

      <div style={styles.cardList}>
        {skripte.map((item, index) => (
          <div
            key={index}
            className="card"
            style={{
              ...styles.card,
              borderLeft: '4px solid var(--ki-red)',
              opacity: viewedCards.has(index) ? 1 : 0.85,
            }}
            onClick={() => toggleExpand(index)}
          >
            <div style={styles.cardHeader}>
              <h3 style={styles.situationTitle}>{item.situation}</h3>
              <span style={styles.expandIcon}>
                {expandedIndex === index ? '\u25B2' : '\u25BC'}
              </span>
            </div>

            {(expandedIndex === index || skripte.length <= 3) && (
              <>
                <div style={styles.skriptBlock}>
                  <pre style={styles.skriptText}>{item.skript}</pre>
                </div>

                <button
                  className="btn btn-secondary"
                  style={styles.copyBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(item.skript, index);
                  }}
                >
                  {copiedIndex === index ? (
                    <span style={styles.copiedText}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6, verticalAlign: 'middle' }}>
                        <path d="M5 13l4 4L19 7" stroke="var(--ki-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Kopiert!
                    </span>
                  ) : (
                    <span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6, verticalAlign: 'middle' }}>
                        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Kopieren
                    </span>
                  )}
                </button>

                <div style={styles.tippBox}>
                  <div style={styles.tippLabel}>Tipp</div>
                  <p style={styles.tippText}>
                    {tipps[index % tipps.length]}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {allViewed && (
        <div style={styles.completeSection}>
          <p style={styles.completeText}>
            Du hast alle Skripte gesehen. Speichere sie dir ab und nutze sie bei Bedarf!
          </p>
          <button
            className="btn btn-primary"
            onClick={() => onComplete?.()}
            style={styles.completeBtn}
          >
            Verstanden
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Instrument Sans, sans-serif',
    maxWidth: 640,
    margin: '0 auto',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--ki-text)',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    marginBottom: 20,
    lineHeight: 1.5,
  },
  progressBar: {
    height: 4,
    background: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'var(--ki-red)',
    borderRadius: 2,
    transition: 'width 0.4s ease',
  },
  progressText: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 20,
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  card: {
    padding: 20,
    cursor: 'pointer',
    transition: 'box-shadow 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  situationTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: 'var(--ki-text)',
    margin: 0,
    flex: 1,
    fontFamily: 'Instrument Sans, sans-serif',
  },
  expandIcon: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 12,
  },
  skriptBlock: {
    background: '#f8f8f8',
    border: '1px solid #e8e8e8',
    borderRadius: 10,
    padding: 16,
    marginTop: 14,
    marginBottom: 12,
  },
  skriptText: {
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: 15,
    lineHeight: 1.7,
    color: 'var(--ki-text)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    margin: 0,
  },
  copyBtn: {
    fontSize: 14,
    padding: '8px 18px',
    marginBottom: 12,
    display: 'inline-flex',
    alignItems: 'center',
  },
  copiedText: {
    color: 'var(--ki-success)',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
  },
  tippBox: {
    background: 'rgba(204, 20, 38, 0.04)',
    border: '1px solid rgba(204, 20, 38, 0.12)',
    borderRadius: 10,
    padding: 14,
    marginTop: 4,
  },
  tippLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--ki-red)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 6,
  },
  tippText: {
    fontSize: 14,
    color: 'var(--ki-text)',
    lineHeight: 1.5,
    margin: 0,
  },
  completeSection: {
    textAlign: 'center',
    marginTop: 32,
    padding: 24,
    background: 'rgba(204, 20, 38, 0.03)',
    borderRadius: 16,
  },
  completeText: {
    fontSize: 16,
    color: 'var(--ki-text)',
    marginBottom: 16,
    lineHeight: 1.5,
  },
  completeBtn: {
    fontSize: 18,
    padding: '14px 40px',
  },
};
