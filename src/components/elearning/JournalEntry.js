'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function JournalEntry({ frage, modulIndex, userId, onComplete }) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const charCount = text.length;
  const minChars = 50;
  const canSubmit = charCount >= minChars;

  // Load existing entry from localStorage on mount
  useEffect(() => {
    const storageKey = `journal_${modulIndex}`;
    const existing = localStorage.getItem(storageKey);
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        if (parsed.text) setText(parsed.text);
      } catch {
        // Ignore parse errors
      }
    }
  }, [modulIndex]);

  const handleSave = async () => {
    if (!canSubmit || saving) return;

    setSaving(true);
    setError(null);

    const storageKey = `journal_${modulIndex}`;
    const entry = {
      text,
      frage,
      modulIndex,
      timestamp: new Date().toISOString(),
    };

    // Always save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(entry));

    // Try Supabase save
    if (userId) {
      try {
        const supabase = createClient();
        await supabase.from('lesson_progress').upsert({
          user_id: userId,
          lesson_key: `journal_modul_${modulIndex}`,
          extra_data: entry,
          completed: true,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,lesson_key' });
      } catch (err) {
        console.warn('Supabase save failed, using localStorage:', err);
      }
    }

    setSaving(false);
    setSaved(true);
  };

  if (saved) {
    return (
      <div style={styles.container}>
        <div className="card" style={styles.successCard}>
          <div style={styles.successIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="var(--ki-success)" opacity="0.15"/>
              <path d="M8 12l3 3 5-5" stroke="var(--ki-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 style={styles.successTitle}>Gespeichert!</h3>
          <p style={styles.successText}>Deine Reflexion wurde erfolgreich gespeichert.</p>
          <button
            className="btn btn-primary"
            onClick={() => onComplete?.({ text, modulIndex })}
            style={{ marginTop: 16 }}
          >
            Weiter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.questionBlock}>
        <div style={styles.quoteBar} />
        <p style={styles.questionText}>{frage}</p>
      </div>

      <div style={styles.textareaWrapper}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          style={styles.textarea}
          placeholder="Schreibe deine Gedanken hier..."
          rows={6}
          autoFocus
        />
        <div style={styles.charCountRow}>
          <span style={{
            ...styles.charCount,
            color: canSubmit ? 'var(--ki-success)' : '#aaa',
          }}>
            {charCount} / {minChars} Zeichen {canSubmit ? '' : '(Minimum)'}
          </span>
        </div>
      </div>

      {error && (
        <p style={styles.errorText}>{error}</p>
      )}

      <button
        className="btn btn-primary"
        onClick={handleSave}
        disabled={!canSubmit || saving}
        style={{
          ...styles.saveBtn,
          opacity: canSubmit && !saving ? 1 : 0.5,
          cursor: canSubmit && !saving ? 'pointer' : 'not-allowed',
        }}
      >
        {saving ? 'Speichern...' : 'Speichern'}
      </button>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Instrument Sans, sans-serif',
    maxWidth: 600,
    margin: '0 auto',
    padding: 16,
  },
  questionBlock: {
    display: 'flex',
    gap: 16,
    marginBottom: 28,
    padding: 20,
    background: 'rgba(204, 20, 38, 0.03)',
    borderRadius: 14,
    alignItems: 'flex-start',
  },
  quoteBar: {
    width: 4,
    minHeight: 40,
    background: 'var(--ki-red)',
    borderRadius: 2,
    flexShrink: 0,
    alignSelf: 'stretch',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 600,
    color: 'var(--ki-text)',
    lineHeight: 1.5,
    margin: 0,
    fontStyle: 'italic',
  },
  textareaWrapper: {
    marginBottom: 16,
  },
  textarea: {
    width: '100%',
    minHeight: 180,
    padding: 18,
    fontSize: 16,
    fontFamily: 'Instrument Sans, sans-serif',
    border: '2px solid #e0e0e0',
    borderRadius: 14,
    resize: 'vertical',
    outline: 'none',
    lineHeight: 1.7,
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    background: 'var(--ki-bg, #fff)',
    color: 'var(--ki-text)',
  },
  charCountRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  charCount: {
    fontSize: 13,
    fontWeight: 500,
    transition: 'color 0.3s',
  },
  errorText: {
    color: 'var(--ki-red)',
    fontSize: 14,
    marginBottom: 12,
  },
  saveBtn: {
    width: '100%',
    fontSize: 17,
    padding: '14px 0',
    transition: 'opacity 0.2s',
  },
  successCard: {
    textAlign: 'center',
    padding: 32,
  },
  successIcon: {
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--ki-text)',
    marginBottom: 8,
    fontFamily: 'Instrument Sans, sans-serif',
  },
  successText: {
    fontSize: 16,
    color: '#888',
    lineHeight: 1.5,
  },
};
