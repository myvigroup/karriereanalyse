'use client';

import { useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';

const ACCEPTED = '.pdf,.docx,.jpg,.jpeg,.png';
const MAX_SIZE = 10 * 1024 * 1024;

export default function PublicUpload() {
  const { token } = useParams();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(async (file) => {
    setError(null);
    if (file.size > MAX_SIZE) {
      setError('Datei zu groß. Maximal 10 MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/upload/${token}`, { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload fehlgeschlagen');
      setUploaded(true);
    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  }, [token]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  // Nach erfolgreichem Upload: einfache Bestätigung
  if (uploaded) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FAFAF8', padding: 24,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>✅</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1A1A1A', marginBottom: 12 }}>
            Lebenslauf hochgeladen!
          </h1>
          <p style={{ color: '#86868b', lineHeight: 1.6, fontSize: 16, marginBottom: 8 }}>
            Dein Coach analysiert deinen Lebenslauf jetzt gleich persönlich.
          </p>
          <p style={{ color: '#86868b', fontSize: 14 }}>
            Du kannst diese Seite schließen.
          </p>
        </div>
      </div>
    );
  }

  // Upload-Seite
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: '#FAFAF8',
    }}>
      <header style={{ textAlign: 'center', padding: '24px 16px 0' }}>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 2,
          color: '#CC1426', textTransform: 'uppercase',
        }}>
          Karriere-Institut
        </span>
      </header>

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
      }}>
        <div style={{ maxWidth: 440, width: '100%' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 8, textAlign: 'center' }}>
            Lebenslauf hochladen
          </h1>
          <p style={{ color: '#86868b', textAlign: 'center', marginBottom: 32, lineHeight: 1.5 }}>
            Lade deinen Lebenslauf hoch, damit dein Karriere-Coach ihn direkt analysieren kann.
          </p>

          {error && (
            <div style={{
              background: '#FEF2F2', color: '#CC1426', padding: '12px 16px',
              borderRadius: 12, fontSize: 14, marginBottom: 16, textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? '#CC1426' : '#E8E6E1'}`,
              borderRadius: 16, padding: 40, textAlign: 'center',
              cursor: uploading ? 'not-allowed' : 'pointer',
              background: dragOver ? '#FEF2F2' : '#fff',
              transition: 'all 0.2s', marginBottom: 12,
              opacity: uploading ? 0.6 : 1,
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              onChange={(e) => { if (e.target.files?.[0]) uploadFile(e.target.files[0]); }}
              style={{ display: 'none' }}
            />
            {uploading ? (
              <p style={{ fontWeight: 600, color: '#1A1A1A' }}>Wird hochgeladen...</p>
            ) : (
              <>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📄</div>
                <p style={{ fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>
                  Datei auswählen
                </p>
                <p style={{ fontSize: 13, color: '#86868b' }}>
                  PDF, DOCX, JPG, PNG · Max. 10 MB
                </p>
              </>
            )}
          </div>

          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={uploading}
            style={{
              width: '100%', padding: 14, background: '#fff',
              border: '1px solid #E8E6E1', borderRadius: 12,
              fontSize: 15, fontWeight: 600, cursor: 'pointer', color: '#1A1A1A',
            }}
          >
            📷 Foto aufnehmen
          </button>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => { if (e.target.files?.[0]) uploadFile(e.target.files[0]); }}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}
