'use client';

import { useState } from 'react';

const SBI_COLORS = {
  S: '#3B82F6',
  B: '#10B981',
  I: '#F59E0B',
};

export default function FeedbackTemplates({ templates = [], onComplete }) {
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

  const formatSBI = (template) => {
    // Try to highlight S, B, I sections within the template text
    const parts = [];
    const lines = template.split('\n');
    lines.forEach((line, i) => {
      if (line.match(/^(Situation|S:)/i)) {
        parts.push({ type: 'S', text: line });
      } else if (line.match(/^(Beobachtung|Behaviour|Verhalten|B:)/i)) {
        parts.push({ type: 'B', text: line });
      } else if (line.match(/^(Impact|Ich-Botschaft|Wirkung|I:)/i)) {
        parts.push({ type: 'I', text: line });
      } else {
        parts.push({ type: null, text: line });
      }
    });
    return parts;
  };

  const tipps = [
    'Gib Feedback zeitnah â je frischer die Situation, desto wirksamer.',
    'Fokussiere auf beobachtbares Verhalten, nicht auf Interpretationen.',
    'Beschreibe die Wirkung aus deiner Perspektive mit Ich-Botschaften.',
    'Frage nach: "Wie siehst du das?" â Feedback ist ein Dialog.',
    'Positives Feedback ist genauso wichtig wie kritisches.',
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>SBI-Feedback-Vorlagen</h2>
      <p style={styles.subtitle}>
        Situation &mdash; Beobachtung &mdash; Impact: Fertige Vorlagen f\u00fcr konstruktives Feedback.
      </p>

      {/* SBI legend */}
      <div style={styles.legend}>
        {[
          { key: 'S', label: 'Situation', color: SBI_COLORS.S },
          { key: 'B', label: 'Beobachtung', color: SBI_COLORS.B },
          { key: 'I', label: 'Impact', color: SBI_COLORS.I },
        ].map((item) => (
          <span key={item.key} className="pill" style={{ ...styles.legendPill, background: `${item.color}15`, color: item.color, borderColor: `${item.color}40` }}>
            {item.key} = {item.label}
          </span>
        ))}
      </div>

      <div style={styles.progressBarOuter}>
        <div style={{ ...styles.progressBarInner, width: `${(viewedCards.size / Math.max(templates.length, 1)) * 100}%` }} />
      </div>
      <p style={styles.progressText}>{viewedCards.size} von {templates.length} angesehen</p>

      <div style={styles.cardList}>
        {templates.map((item, index) => {
          const sbiParts = formatSBI(item.template);
          return (
            <div
              key={index}
              className="card"
              style={{
                ...styles.card,
                borderLeft: '4px solid var(--ki-red, #CC1426)',
                opacity: viewedCards.has(index) ? 1 : 0.85,
              }}
              onClick={() => toggleExpand(index)}
            >
              {/* Colored header */}
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <span style={styles.expandIcon}>
                  {expandedIndex === index ? '\u25B2' : '\u25BC'}
                </span>
              </div>

              {(expandedIndex === index || templates.length <= 3) && (
                <>
                  {/* Situation context */}
                  <div style={styles.situationBox}>
                    <span style={styles.situationLabel}>Kontext:</span> {item.situation}
                  </div>

                  {/* SBI template */}
                  <div style={styles.templateBlock}>
                    {sbiParts.map((part, pi) => (
                      <div key={pi} style={{
                        ...styles.templateLine,
                        ...(part.type ? {
                          borderLeft: `3px solid ${SBI_COLORS[part.type]}`,
                          paddingLeft: 12,
                          background: `${SBI_COLORS[part.type]}08`,
                          marginBottom: 4,
                          borderRadius: 4,
                        } : {}),
                      }}>
                        {part.type && (
                          <span style={{ ...styles.sbiTag, background: SBI_COLORS[part.type] }}>
                            {part.type}
                          </span>
                        )}
                        <span style={styles.templateText}>{part.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Copy button */}
                  <button
                    className="btn btn-secondary"
                    style={styles.copyBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(item.template, index);
                    }}
                  >
                    {copiedIndex === index ? (
                      <span style={styles.copiedText}>Kopiert! \u2713</span>
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
                  <div style={styles.tippBox}>
                    <div style={styles.tippLabel}>Anpassungstipp</div>
                    <p style={styles.tippText}>{tipps[index % tipps.length]}</p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {allViewed && (
        <div style={styles.completeSection}>
          <p style={styles.completeText}>
            Du hast alle Feedback-Vorlagen gesehen. Nutze sie als Ausgangspunkt f\u00fcr dein n\u00e4chstes Gespr\u00e4ch!
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
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  legendPill: {
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 20,
    border: '1px solid',
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
    padding: 20,
    cursor: 'pointer',
    transition: 'box-shadow 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: 'var(--ki-text, #1a1a1a)',
    margin: 0,
    flex: 1,
    fontFamily: 'Instrument Sans, sans-serif',
  },
  expandIcon: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 12,
  },
  situationBox: {
    background: '#f8f9fa',
    border: '1px solid #e8e8e8',
    borderRadius: 8,
    padding: '10px 14px',
    marginTop: 12,
    fontSize: 14,
    color: 'var(--ki-text, #555)',
    lineHeight: 1.5,
  },
  situationLabel: {
    fontWeight: 700,
    color: 'var(--ki-text, #333)',
  },
  templateBlock: {
    background: '#fafafa',
    border: '1px solid #e8e8e8',
    borderRadius: 10,
    padding: 16,
    marginTop: 14,
    marginBottom: 12,
  },
  templateLine: {
    padding: '6px 0',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
  },
  sbiTag: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: 4,
    flexShrink: 0,
    marginTop: 2,
  },
  templateText: {
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: 15,
    lineHeight: 1.6,
    color: 'var(--ki-text, #333)',
  },
  copyBtn: {
    fontSize: 14,
    padding: '8px 18px',
    marginBottom: 12,
    display: 'inline-flex',
    alignItems: 'center',
  },
  copiedText: {
    color: 'var(--ki-success, #10B981)',
    fontWeight: 600,
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
    color: 'var(--ki-red, #CC1426)',
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
