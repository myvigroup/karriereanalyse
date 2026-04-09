'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const ACCEPTED = '.pdf,.docx,.jpg,.jpeg,.png,.heic';

export default function CVUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);

  const upload = useCallback(async (file) => {
    setError(null);
    setUploading(true);
    setProgress('Datei wird hochgeladen…');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/cv/self-upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload fehlgeschlagen');

      setProgress('KI analysiert deinen Lebenslauf…');
      // Small delay so user sees the "analyzing" message
      await new Promise(r => setTimeout(r, 800));

      router.push('/cv-check');
    } catch (err) {
      setError(err.message);
      setUploading(false);
      setProgress(null);
    }
  }, [router]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }, [upload]);

  const handleSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  return (
    <div className="page-container" style={{ paddingTop: 40, paddingBottom: 64, maxWidth: 640 }}>
      <a href="/dashboard" style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>
        ← Dashboard
      </a>

      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Lebenslauf-Check</h1>
      <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 32, fontSize: 15 }}>
        Lade deinen Lebenslauf hoch — unsere KI analysiert ihn sofort und gibt dir konkretes Feedback zu Struktur, Inhalt, Design und Wirkung.
      </p>

      {error && (
        <div style={{
          background: 'rgba(204,20,38,0.06)', border: '1px solid rgba(204,20,38,0.2)',
          borderRadius: 12, padding: '12px 16px', fontSize: 14, color: 'var(--ki-red)', marginBottom: 20,
        }}>
          {error}
        </div>
      )}

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? 'var(--ki-red)' : 'var(--ki-border)'}`,
          borderRadius: 16,
          padding: '56px 32px',
          textAlign: 'center',
          cursor: uploading ? 'default' : 'pointer',
          background: dragOver ? 'rgba(204,20,38,0.03)' : 'var(--ki-card)',
          transition: 'all 0.2s',
          marginBottom: 16,
        }}
      >
        <input ref={fileInputRef} type="file" accept={ACCEPTED} onChange={handleSelect} style={{ display: 'none' }} />

        {uploading ? (
          <div>
            <div style={{ fontSize: 40, marginBottom: 16 }}>
              {progress?.includes('KI') ? '🤖' : '⏳'}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ki-text)', marginBottom: 4 }}>{progress}</div>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>Bitte warten…</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ki-text)', marginBottom: 8 }}>
              Datei hierhin ziehen oder klicken
            </div>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>
              PDF, DOCX, JPG, PNG · Max. 10 MB
            </div>
          </div>
        )}
      </div>

      {/* What to expect */}
      {!uploading && (
        <div className="card" style={{ marginTop: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
            Was du bekommst
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: '📐', label: 'Struktur', desc: 'Aufbau, Länge, Vollständigkeit' },
              { icon: '📝', label: 'Inhalt', desc: 'Erfahrungen, Kompetenzen, Erfolge' },
              { icon: '🎨', label: 'Design', desc: 'Layout, Lesbarkeit, Formatierung' },
              { icon: '✨', label: 'Wirkung', desc: 'Positionierung, erster Eindruck' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
