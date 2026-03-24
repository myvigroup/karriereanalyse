'use client';

import { useState } from 'react';

const TAB_ICONS = {
  event: '🎪',
  linkedin: '💼',
  intro: '🤝',
  reaktivierung: '🔄',
  danke: '🙏',
  touchpoint: '📩',
  geburtstag: '🎂',
};

export default function FollowUpTemplates({ templates = [], onComplete }) {
  const [activeTab, setActiveTab] = useState(null);
  const [viewedTabs, setViewedTabs] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);

  const tabs = templates.length > 0 ? templates : [];

  const handleTabClick = (id) => {
    setActiveTab(id);
    setViewedTabs((prev) => new Set([...prev, id]));
  };

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
    setTimeout(() => setCopiedId(null), 2000);
  };

  const allViewed = viewedTabs.size >= tabs.length && tabs.length > 0;
  const activeTemplate = tabs.find((t) => t.id === activeTab);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Follow-Up Templates</h2>
      <p style={styles.subtitle}>
        7 fertige Vorlagen fuer jede Situation. Klicke auf einen Tab, passe den Text an und kopiere ihn.
      </p>

      {/* Progress */}
      <div style={styles.progressBarOuter}>
        <div style={{ ...styles.progressBarInner, width: `${(viewedTabs.size / Math.max(tabs.length, 1)) * 100}%` }} />
      </div>
      <p style={styles.progressText}>{viewedTabs.size} von {tabs.length} angesehen</p>

      {/* Tab buttons */}
      <div style={styles.tabRow}>
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`btn ${activeTab === t.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              ...styles.tabBtn,
              ...(viewedTabs.has(t.id) && activeTab !== t.id ? { opacity: 0.7 } : {}),
            }}
            onClick={() => handleTabClick(t.id)}
          >
            <span style={styles.tabIcon}>{TAB_ICONS[t.id] || '📄'}</span>
            {t.titel}
          </button>
        ))}
      </div>

      {/* Active template */}
      {activeTemplate && (
        <div className="card" style={styles.templateCard}>
          <h3 style={styles.templateTitle}>{activeTemplate.titel}</h3>

          {activeTemplate.timing && (
            <div style={styles.timingBox}>
              <span style={styles.timingIcon}>⏰</span>
              <span style={styles.timingText}>{activeTemplate.timing}</span>
            </div>
          )}

          <pre style={styles.templateText}>{activeTemplate.text}</pre>

          <button
            className="btn btn-secondary"
            style={styles.copyBtn}
            onClick={() => handleCopy(activeTemplate.text, activeTemplate.id)}
          >
            {copiedId === activeTemplate.id ? (
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
        </div>
      )}

      {!activeTemplate && tabs.length > 0 && (
        <div style={styles.placeholder}>
          Waehle einen Tab, um die Vorlage zu sehen.
        </div>
      )}

      {allViewed && (
        <div style={styles.completeSection}>
          <p style={styles.completeText}>
            Alle 7 Templates gesehen! Denke daran: Das beste Follow-Up kommt innerhalb von 48 Stunden.
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
  tabRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tabBtn: { fontSize: 13, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 },
  tabIcon: { fontSize: '1rem' },
  templateCard: { padding: 20, marginBottom: 20 },
  templateTitle: { fontSize: 18, fontWeight: 700, color: 'var(--ki-text, #1a1a1a)', margin: '0 0 12px', fontFamily: 'Instrument Sans, sans-serif' },
  timingBox: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
    background: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.15)',
    borderRadius: 8, marginBottom: 16,
  },
  timingIcon: { fontSize: '1rem' },
  timingText: { fontSize: 13, color: '#3B82F6', fontWeight: 600 },
  templateText: {
    fontFamily: 'Instrument Sans, sans-serif', fontSize: 15, lineHeight: 1.7,
    color: 'var(--ki-text, #444)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
    background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 10,
    padding: 16, margin: '0 0 14px',
  },
  copyBtn: { fontSize: 14, padding: '8px 18px', display: 'inline-flex', alignItems: 'center' },
  copiedText: { color: 'var(--ki-success, #10B981)', fontWeight: 600 },
  placeholder: {
    textAlign: 'center', padding: 40, color: '#bbb', fontSize: 16,
    background: '#fafafa', borderRadius: 12, marginBottom: 20,
  },
  completeSection: { textAlign: 'center', marginTop: 24, padding: 24, background: 'rgba(204, 20, 38, 0.03)', borderRadius: 16 },
  completeText: { fontSize: 16, color: 'var(--ki-text, #333)', marginBottom: 16, lineHeight: 1.5 },
  completeBtn: { fontSize: 18, padding: '14px 40px' },
};
