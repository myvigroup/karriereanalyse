'use client';

import { useState } from 'react';

export default function EmailTemplates({ templates = [], onComplete }) {
  const [viewedCards, setViewedCards] = useState(new Set());
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleCopy = async (text, index) => {
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
    setCopiedIndex(index);
    setViewedCards((prev) => new Set([...prev, index]));
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
    setViewedCards((prev) => new Set([...prev, index]));
  };

  const allViewed = viewedCards.size >= templates.length && templates.length > 0;

  // Extract first sentence as BLUF highlight
  const getBluf = (template) => {
    const firstLine = template.split('\n').find((l) => l.trim().length > 0) || '';
    const rest = template.split('\n').slice(
      template.split('\n').findIndex((l) => l.trim().length > 0) + 1
    ).join('\n');
    return { bluf: firstLine, rest };
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>BLUF-E-Mail-Vorlagen</h2>
      <p style={styles.subtitle}>
        Bottom Line Up Front &mdash; das Wichtigste zuerst. Professionelle E-Mail-Vorlagen zum Kopieren.
      </p>

      {/* BLUF principle box */}
      <div style={styles.principleBox}>
        <div style={styles.principleIcon}>{'\u{1F4E7}'}</div>
        <div>
          <strong style={styles.principleTitle}>BLUF-Prinzip</strong>
          <p style={styles.principleText}>
            Schreibe die Kernaussage in den ersten Satz. Der Empfänger weiß sofort, worum es geht.
          </p>
        </div>
      </div>

      <div style={styles.progressBarOuter}>
        <div style={{ ...styles.progressBarInner, width: `${(viewedCards.size / Math.max(templates.length, 1)) * 100}%` }} />
      </div>
      <p style={styles.progressText}>{viewedCards.size} von {templates.length} angesehen</p>

      <div style={styles.cardList}>
        {templates.map((item, index) => {
          const { bluf, rest } = getBluf(item.template);
          return (
            <div
              key={index}
              className="card"
              style={{
                ...styles.card,
                opacity: viewedCards.has(index) ? 1 : 0.85,
              }}
              onClick={() => toggleExpand(index)}
            >
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>
                  <span style={styles.emailIcon}>{'\u{1F4E7}'}</span> {item.title}
                </h3>
                <span style={styles.expandIcon}>
                  {expandedIndex === index ? '\u25B2' : '\u25BC'}
                </span>
              </div>

              {(expandedIndex === index || templates.length <= 3) && (
                <>
                  {/* Email layout */}
                  <div style={styles.emailFrame}>
                    <div style={styles.emailHeader}>
                      <div style={styles.emailRow}>
                        <span style={styles.emailLabel}>An:</span>
                        <span style={styles.emailValue}>[Empfänger]</span>
                      </div>
                      <div style={styles.emailRow}>
                        <span style={styles.emailLabel}>Betreff:</span>
                        <span style={styles.emailSubject}>{item.betreff}</span>
                      </div>
                    </div>
                    <div style={styles.emailBody}>
                      {/* BLUF first line highlighted */}
                      <p style={styles.blufLine}>{bluf}</p>
                      <pre style={styles.emailText}>{rest}</pre>
                    </div>
                  </div>

                  {/* Copy button */}
                  <button
                    className="btn btn-secondary"
                    style={styles.copyBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      const fullText = `Betreff: ${item.betreff}\n\n${item.template}`;
                      handleCopy(fullText, index);
                    }}
                  >
                    {copiedIndex === index ? (
                      <span style={styles.copiedText}>Kopiert! ✓</span>
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

                  {/* Tip */}
                  {item.tipp && (
                    <div style={styles.tippBox}>
                      <div style={styles.tippLabel}>{'\u{1F4A1}'} Wann verwenden?</div>
                      <p style={styles.tippText}>{item.tipp}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {allViewed && (
        <div style={styles.completeSection}>
          <p style={styles.completeText}>
            Alle Vorlagen angesehen! Denke daran: BLUF spart deinen Empfängern Zeit.
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
    maxWidth: 640,
    margin: '0 auto',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--ki-text, #1a1a1a)',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    marginBottom: 16,
    lineHeight: 1.5,
  },
  principleBox: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    background: '#f0f4ff',
    border: '1px solid #d0d8f0',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  principleIcon: {
    fontSize: '1.6rem',
    flexShrink: 0,
  },
  principleTitle: {
    fontSize: 14,
    color: '#3B82F6',
    display: 'block',
    marginBottom: 4,
  },
  principleText: {
    fontSize: 13,
    color: 'var(--ki-text, #555)',
    lineHeight: 1.5,
    margin: 0,
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
    marginBottom: 20,
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  card: {
    padding: 0,
    cursor: 'pointer',
    transition: 'box-shadow 0.2s',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    background: '#fafafa',
    borderBottom: '1px solid #eee',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: 'var(--ki-text, #1a1a1a)',
    margin: 0,
    flex: 1,
    fontFamily: 'Instrument Sans, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  emailIcon: {
    fontSize: '1.1rem',
  },
  expandIcon: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 12,
  },
  emailFrame: {
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    margin: '16px 20px',
    overflow: 'hidden',
  },
  emailHeader: {
    background: '#f5f5f5',
    padding: '10px 14px',
    borderBottom: '1px solid #e0e0e0',
  },
  emailRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    marginBottom: 4,
  },
  emailLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#999',
    minWidth: 50,
  },
  emailValue: {
    fontSize: 13,
    color: 'var(--ki-text, #555)',
  },
  emailSubject: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--ki-text, #333)',
  },
  emailBody: {
    padding: 16,
  },
  blufLine: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--ki-text, #1a1a1a)',
    lineHeight: 1.5,
    margin: '0 0 8px',
    padding: '8px 12px',
    background: 'rgba(59, 130, 246, 0.08)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: 6,
  },
  emailText: {
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: 14,
    lineHeight: 1.7,
    color: 'var(--ki-text, #444)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    margin: 0,
  },
  copyBtn: {
    fontSize: 14,
    padding: '8px 18px',
    margin: '0 20px 16px',
    display: 'inline-flex',
    alignItems: 'center',
  },
  copiedText: {
    color: 'var(--ki-success, #10B981)',
    fontWeight: 600,
  },
  tippBox: {
    background: 'rgba(59, 130, 246, 0.04)',
    border: '1px solid rgba(59, 130, 246, 0.12)',
    borderRadius: 10,
    padding: 14,
    margin: '0 20px 20px',
  },
  tippLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#3B82F6',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 6,
  },
  tippText: {
    fontSize: 14,
    color: 'var(--ki-text, #555)',
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
    color: 'var(--ki-text, #333)',
    marginBottom: 16,
    lineHeight: 1.5,
  },
  completeBtn: {
    fontSize: 18,
    padding: '14px 40px',
  },
};
