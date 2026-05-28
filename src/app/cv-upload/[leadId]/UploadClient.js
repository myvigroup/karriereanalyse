'use client';
import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Icon from '@/components/ui/Icon';
import AppFooter from '@/components/layout/AppFooter';

const ACCEPTED = '.pdf,.docx,.jpg,.jpeg,.png';

export default function UploadClient({ lead, advisorName }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(lead.cv_documents?.length > 0);
  const [dragOver, setDragOver] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
      setIsMobile(window.matchMedia('(max-width: 768px)').matches
        || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));
    }
  }, []);

  async function handleFile(file) {
    if (!file) return;
    setUploading(true); setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('leadId', lead.id);
      const res = await fetch('/api/cv/quick-upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Upload fehlgeschlagen');
      }
      setDone(true);
    } catch (e) {
      setError(e.message || 'Unbekannter Fehler');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div className="title-kicker">
          <span className="pulse" /> CV-Check · powered by Karriere-Institut
        </div>
        <h1 style={{ fontFamily: 'var(--sf)', fontSize: 32, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.15, marginTop: 12, marginBottom: 8 }}>
          Hallo {lead.first_name}.{' '}
          <span style={{ color: 'var(--label-3)' }}>Lade jetzt deinen CV hoch.</span>
        </h1>
        <p style={{ fontSize: 15, color: 'var(--label-2)', lineHeight: 1.5, marginBottom: 28 }}>
          Du bist hier auf Einladung von <strong>{advisorName}</strong>.
          In ein paar Sekunden hast du deine KI-Analyse — danach geht ihr sie gemeinsam durch.
        </p>

        {done ? (
          <div style={{
            background: 'var(--surface)', border: '0.5px solid var(--line)',
            borderRadius: 16, padding: '32px 28px', textAlign: 'center',
          }}>
            <div style={{ color: '#15803d', display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <Icon name="check-circle" size={48} stroke={1.5} />
            </div>
            <h2 style={{ fontFamily: 'var(--sf)', fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
              CV erhalten.
            </h2>
            <p style={{ fontSize: 14, color: 'var(--label-2)', lineHeight: 1.5 }}>
              Wir analysieren deinen Lebenslauf gerade — die KI braucht meist 10-30 Sekunden.<br/>
              {advisorName} wird sich bei dir melden, sobald die Auswertung fertig ist.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 20,
          }}>
            {/* === LINKS: Datei-Upload (Drag&Drop oder Klick) === */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--label-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                {isMobile ? 'Datei oder Foto' : 'Auf dem Computer'}
              </div>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault(); setDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFile(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: dragOver ? 'rgba(204,20,38,0.05)' : 'var(--surface)',
                  border: dragOver ? '2px dashed var(--ki-red)' : '2px dashed var(--line)',
                  borderRadius: 16, padding: '40px 20px', textAlign: 'center',
                  cursor: uploading ? 'wait' : 'pointer',
                  transition: 'all 0.15s',
                  minHeight: 240,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <div style={{ color: 'var(--ki-red)', display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon name={uploading ? 'refresh' : 'file-text'} size={40} stroke={1.5} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--label)', marginBottom: 4 }}>
                  {uploading ? 'Wird hochgeladen…' : (isMobile ? 'Datei wählen' : 'Datei wählen oder hierher ziehen')}
                </div>
                <div style={{ fontSize: 12, color: 'var(--label-3)' }}>
                  PDF, DOCX, JPG oder PNG · max. 10 MB
                </div>
                <input
                  ref={fileInputRef} type="file" accept={ACCEPTED}
                  style={{ display: 'none' }}
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </div>

              {/* Auf Mobile: Direkt-Foto-Button */}
              {isMobile && (
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    width: '100%', marginTop: 10,
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: 12,
                    padding: '14px 18px',
                    fontSize: 14, fontWeight: 600,
                    color: 'var(--label)',
                    cursor: uploading ? 'wait' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  📸 Foto vom CV machen
                </button>
              )}
              <input
                ref={cameraInputRef} type="file"
                accept="image/*" capture="environment"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>

            {/* === RECHTS: QR-Code für Hand-Off aufs Handy === */}
            {!isMobile && currentUrl && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--label-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                  Oder mit dem Handy
                </div>
                <div style={{
                  background: 'var(--surface)',
                  border: '0.5px solid var(--line)',
                  borderRadius: 16,
                  padding: '24px 20px',
                  textAlign: 'center',
                  minHeight: 240,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ background: '#fff', padding: 12, borderRadius: 12, marginBottom: 14, lineHeight: 0 }}>
                    <QRCodeSVG value={currentUrl} size={140} level="M" includeMargin={false} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--label)', marginBottom: 4 }}>
                    QR-Code scannen
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--label-3)', lineHeight: 1.45, margin: 0, maxWidth: 240 }}>
                    Mit der Handy-Kamera scannen — dann CV vom Handy hochladen
                    oder direkt ein Foto machen.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{
            marginTop: 16, padding: '12px 16px',
            background: 'rgba(204,20,38,0.08)', color: 'var(--ki-red-dark)',
            borderRadius: 12, fontSize: 13,
          }}>
            Fehler: {error}
          </div>
        )}

        <div style={{ marginTop: 32, fontSize: 12, color: 'var(--label-4)', textAlign: 'center' }}>
          Deine Daten bleiben bei dir und {advisorName}. Wir teilen nichts mit Dritten.
        </div>
      </div>
      <AppFooter showLogo={true} />
    </div>
  );
}
