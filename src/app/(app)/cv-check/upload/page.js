'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const ACCEPTED = '.pdf,.docx,.jpg,.jpeg,.png,.heic';
const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];

export default function CVUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const addMoreRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [imagePages, setImagePages] = useState([]); // For multi-image CV

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
      await new Promise(r => setTimeout(r, 800));

      router.push('/cv-check');
    } catch (err) {
      setError(err.message);
      setUploading(false);
      setProgress(null);
    }
  }, [router]);

  const uploadMultipleImages = useCallback(async () => {
    if (imagePages.length === 0) return;
    setError(null);
    setUploading(true);
    setProgress(`${imagePages.length} Seiten werden hochgeladen…`);

    // Upload first image as the main file, send all page texts to AI
    const formData = new FormData();
    formData.append('file', imagePages[0]);
    // Append additional pages
    imagePages.slice(1).forEach((page, i) => {
      formData.append(`page_${i + 2}`, page);
    });

    try {
      const res = await fetch('/api/cv/self-upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload fehlgeschlagen');

      setProgress('KI analysiert deinen Lebenslauf…');
      await new Promise(r => setTimeout(r, 800));

      router.push('/cv-check');
    } catch (err) {
      setError(err.message);
      setUploading(false);
      setProgress(null);
    }
  }, [imagePages, router]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (IMAGE_TYPES.includes(file.type)) {
        setImagePages(prev => [...prev, file]);
      } else {
        upload(file);
      }
    }
  }, [upload]);

  const handleSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (IMAGE_TYPES.includes(file.type) && imagePages.length > 0) {
      // Adding more pages
      setImagePages(prev => [...prev, file]);
    } else if (IMAGE_TYPES.includes(file.type)) {
      // First image — show multi-page option
      setImagePages([file]);
    } else {
      // PDF or DOCX — upload directly
      upload(file);
    }
  };

  const handleAddMore = (e) => {
    const file = e.target.files?.[0];
    if (file && IMAGE_TYPES.includes(file.type)) {
      setImagePages(prev => [...prev, file]);
    }
  };

  const removePage = (index) => {
    setImagePages(prev => prev.filter((_, i) => i !== index));
  };

  // Multi-image staging view
  if (imagePages.length > 0 && !uploading) {
    return (
      <div className="page-container" style={{ paddingTop: 40, paddingBottom: 64, maxWidth: 640 }}>
        <a href="/dashboard" style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>
          &larr; Dashboard
        </a>

        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Seiten deines Lebenslaufs</h1>
        <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 24, fontSize: 15 }}>
          {imagePages.length === 1
            ? 'Hat dein Lebenslauf mehrere Seiten? Dann klicke auf "Seite hinzufügen".'
            : `${imagePages.length} Seiten bereit — füge weitere hinzu oder starte die Analyse.`
          }
        </p>

        {error && (
          <div style={{
            background: 'rgba(204,20,38,0.06)', border: '1px solid rgba(204,20,38,0.2)',
            borderRadius: 12, padding: '12px 16px', fontSize: 14, color: 'var(--ki-red)', marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        {/* Page thumbnails */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          {imagePages.map((page, i) => (
            <div key={i} style={{
              position: 'relative', borderRadius: 12, overflow: 'hidden',
              border: '1px solid var(--ki-border)', background: 'var(--ki-card)',
            }}>
              <img
                src={URL.createObjectURL(page)}
                alt={`Seite ${i + 1}`}
                style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'rgba(0,0,0,0.6)', padding: '6px 10px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Seite {i + 1}</span>
                <button
                  onClick={() => removePage(i)}
                  style={{ background: 'none', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1 }}
                >
                  &times;
                </button>
              </div>
            </div>
          ))}

          {/* Add more button */}
          <button
            onClick={() => addMoreRef.current?.click()}
            style={{
              border: '2px dashed var(--ki-border)', borderRadius: 12,
              height: 180, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: 'pointer', background: 'transparent', color: 'var(--ki-text-secondary)',
            }}
          >
            <span style={{ fontSize: 28 }}>+</span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Seite hinzufügen</span>
          </button>
          <input ref={addMoreRef} type="file" accept="image/*" capture="environment" onChange={handleAddMore} style={{ display: 'none' }} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={uploadMultipleImages}
            className="btn btn-primary"
            style={{ flex: 1, padding: '14px', fontSize: 15, fontWeight: 700 }}
          >
            {imagePages.length === 1 ? 'Mit 1 Seite analysieren' : `Alle ${imagePages.length} Seiten analysieren`}
          </button>
          <button
            onClick={() => setImagePages([])}
            className="btn btn-secondary"
            style={{ padding: '14px 20px', fontSize: 14 }}
          >
            Abbrechen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ paddingTop: 40, paddingBottom: 64, maxWidth: 640 }}>
      <a href="/dashboard" style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>
        &larr; Dashboard
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
              PDF, DOCX, JPG, PNG · Max. 10 MB · Mehrseitige Fotos werden kombiniert
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
