'use client';

import { useState } from 'react';

export default function LinkedInTemplates({ anfragen = [], checkliste = [], onComplete }) {
  const [activeView, setActiveView] = useState('anfragen');
  const [viewedTemplates, setViewedTemplates] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [checkedItems, setCheckedItems] = useState(new Set());

  const handleCopy = async (text, id) => {
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
    setCopiedId(id);
    setViewedTemplates((prev) => new Set([...prev, id]));
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    setViewedTemplates((prev) => new Set([...prev, id]));
  };

  const toggleCheck = (id) => {
    setCheckedItems((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const score = checkedItems.size;
  const totalCheck = checkliste.length;
  const allDone = viewedTemplates.size >= anfragen.length && score >= totalCheck && totalCheck > 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>LinkedIn-Mastery</h2>
      <p style={styles.subtitle}>
        8 Vernetzungsanfragen und eine Profil-Checkliste fuer dein optimales LinkedIn-Profil.
      </p>

      {/* Tab toggle */}
      <div style={styles.tabRow}>
        <button
          className={`btn ${activeView === 'anfragen' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveView('anfragen')}
          style={styles.tabBtn}
        >
          Vernetzungs-Anfragen ({anfragen.length})
        </button>
        <button
          className={`btn ${activeView === 'checkliste' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveView('checkliste')}
          style={styles.tabBtn}
        >
          Profil-Checkliste ({score}/{totalCheck})
        </button>
      </div>

      {/* Anfragen view */}
      {activeView === 'anfragen' && (
        <div style={styles.cardList}>
          <div style={styles.progressBarOuter}>
            <div style={{ ...styles.progressBarInner, width: `${(viewedTemplates.size / Math.max(anfragen.length, 1)) * 100}%` }} />
          </div>
          <p style={styles.progressText}>{viewedTemplates.size} von {anfragen.length} angesehen</p>

          {anfragen.map((item) => (
            <div
              key={item.id} className="card"
              style={{ ...styles.templateCard, opacity: viewedTemplates.has(item.id) ? 1 : 0.85 }}
              onClick={() => toggleExpand(item.id)}
            >
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{item.titel}</h3>
                <span style={styles.expandIcon}>{expandedId === item.id ? '\u25B2' : '\u25BC'}</span>
              </div>

              {(expandedId === item.id) && (
                <>
                  <pre style={styles.templateText}>{item.text}</pre>
                  {item.tipp && (
                    <div style={styles.tippBox}>
                      <span style={styles.tippLabel}>Tipp</span>
                      <p style={styles.tippText}>{item.tipp}</p>
                    </div>
                  )}
                  <button
                    className="btn btn-secondary"
                    style={styles.copyBtn}
                    onClick={(e) => { e.stopPropagation(); handleCopy(item.text, item.id); }}
                  >
                    {copiedId === item.id ? (
                      <span style={styles.copiedText}>Kopiert!</span>
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
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Checkliste view */}
      {activeView === 'checkliste' && (
        <div style={styles.checklistSection}>
          {/* Score display */}
          <div style={styles.scoreBox}>
            <div style={{
              ...styles.scoreCircle,
              background: score === totalCheck ? '#10B981' : score >= totalCheck / 2 ? '#F59E0B' : '#EF4444',
            }}>
              {score}/{totalCheck}
            </div>
            <span style={styles.scoreText}>
              {score === totalCheck ? 'Perfekt!' : score >= totalCheck / 2 ? 'Fast da!' : 'Weiter geht\'s!'}
            </span>
          </div>

          <div style={styles.checkList}>
            {checkliste.map((item) => (
              <label key={item.id} style={styles.checkItem}>
                <input
                  type="checkbox"
                  checked={checkedItems.has(item.id)}
                  onChange={() => toggleCheck(item.id)}
                  style={styles.checkbox}
                />
                <span style={{
                  ...styles.checkText,
                  textDecoration: checkedItems.has(item.id) ? 'line-through' : 'none',
                  opacity: checkedItems.has(item.id) ? 0.6 : 1,
                }}>
                  {item.punkt}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {allDone && (
        <div style={styles.completeSection}>
          <p style={styles.completeText}>
            Alle Templates angesehen und Checkliste abgehakt! Dein LinkedIn-Profil ist jetzt optimiert.
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
  tabRow: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  tabBtn: { fontSize: 14, padding: '10px 20px' },
  cardList: { display: 'flex', flexDirection: 'column', gap: 12 },
  progressBarOuter: { height: 4, background: '#e0e0e0', borderRadius: 2, marginBottom: 6, overflow: 'hidden' },
  progressBarInner: { height: '100%', background: 'var(--ki-red, #CC1426)', borderRadius: 2, transition: 'width 0.4s ease' },
  progressText: { fontSize: 12, color: '#aaa', marginBottom: 16 },
  templateCard: { padding: 16, cursor: 'pointer', transition: 'box-shadow 0.2s' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 700, color: 'var(--ki-text, #1a1a1a)', margin: 0, flex: 1, fontFamily: 'Instrument Sans, sans-serif' },
  expandIcon: { fontSize: 12, color: '#aaa', marginLeft: 12 },
  templateText: {
    fontFamily: 'Instrument Sans, sans-serif', fontSize: 14, lineHeight: 1.7,
    color: 'var(--ki-text, #444)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
    background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 10,
    padding: 16, margin: '12px 0',
  },
  tippBox: {
    background: 'rgba(59, 130, 246, 0.04)', border: '1px solid rgba(59, 130, 246, 0.12)',
    borderRadius: 8, padding: 12, marginBottom: 12,
  },
  tippLabel: {
    fontSize: 12, fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase',
    letterSpacing: '0.05em', display: 'block', marginBottom: 4,
  },
  tippText: { fontSize: 13, color: 'var(--ki-text, #555)', lineHeight: 1.5, margin: 0 },
  copyBtn: { fontSize: 14, padding: '8px 18px', display: 'inline-flex', alignItems: 'center' },
  copiedText: { color: 'var(--ki-success, #10B981)', fontWeight: 600 },
  checklistSection: { marginBottom: 20 },
  scoreBox: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 },
  scoreCircle: {
    width: 56, height: 56, borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center', color: '#fff',
    fontWeight: 700, fontSize: 16,
  },
  scoreText: { fontSize: 18, fontWeight: 700, color: 'var(--ki-text, #1a1a1a)' },
  checkList: { display: 'flex', flexDirection: 'column', gap: 10 },
  checkItem: { display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', padding: '8px 0' },
  checkbox: { marginTop: 3, width: 18, height: 18, accentColor: 'var(--ki-red, #CC1426)', cursor: 'pointer' },
  checkText: { fontSize: 15, color: 'var(--ki-text, #333)', lineHeight: 1.4, transition: 'opacity 0.2s' },
  completeSection: { textAlign: 'center', marginTop: 32, padding: 24, background: 'rgba(204, 20, 38, 0.03)', borderRadius: 16 },
  completeText: { fontSize: 16, color: 'var(--ki-text, #333)', marginBottom: 16, lineHeight: 1.5 },
  completeBtn: { fontSize: 18, padding: '14px 40px' },
};
