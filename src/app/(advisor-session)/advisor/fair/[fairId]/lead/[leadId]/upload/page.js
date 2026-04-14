'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { createClient } from '@/lib/supabase/client';
import { sanitizeFilename } from '@/lib/utils';

const UPLOAD_STEPS = [
  { label: 'Lebenslauf wird hochgeladen…' },
  { label: 'Datei wird gespeichert…' },
  { label: 'Analyse wird vorbereitet…' },
];

function LoadingScreen({ progress }) {
  // progress: 0 = none, 1 = step1 done, 2 = step2 done, 3 = all done
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'linear-gradient(135deg, #f0f4f0 0%, #faf8f4 50%, #f5f0ea 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 24, padding: '40px 32px',
        width: '100%', maxWidth: 440,
        boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
      }}>
        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 64 }}>📄</span>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {UPLOAD_STEPS.map((step, i) => {
            const done = progress > i;
            const active = progress === i;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', borderRadius: 12,
                background: done ? '#F0FDF4' : active ? '#1a6b5a' : '#F9F9F9',
                border: `1px solid ${done ? '#BBF7D0' : active ? '#1a6b5a' : '#EDEDED'}`,
                transition: 'all 0.4s ease',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: done ? '#22C55E' : active ? 'rgba(255,255,255,0.2)' : '#E5E7EB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                }}>
                  {done ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l3.5 3.5L12 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : active ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                      <path d="M7 2a5 5 0 0 1 5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  ) : null}
                </div>
                <span style={{
                  fontSize: 15, fontWeight: 600,
                  color: done ? '#15803D' : active ? '#fff' : '#9CA3AF',
                }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <p style={{
          textAlign: 'center', fontSize: 13, color: '#9CA3AF', lineHeight: 1.6, margin: 0,
        }}>
          Einen Moment – wir bereiten den Lebenslauf<br/>für die Analyse vor.
        </p>
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const ACCEPTED_TYPES = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/heic': 'image',
};
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function CVUpload() {
  const { fairId, leadId } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [lead, setLead] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(0); // 0=none, 1,2,3=steps done
  const [error, setError] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Lead laden
  useEffect(() => {
    async function loadLead() {
      const { data } = await supabase
        .from('fair_leads')
        .select('id, first_name, last_name, email, magic_token, status')
        .eq('id', leadId)
        .single();
      setLead(data);

      // Wenn CV bereits hochgeladen, weiter zum Review
      if (data?.status === 'analyzing' || data?.status === 'feedback_pending' || data?.status === 'completed') {
        router.push(`/advisor/fair/${fairId}/lead/${leadId}/review`);
      }
    }
    loadLead();
  }, [leadId, fairId, router, supabase]);

  // Polling für QR-Upload
  useEffect(() => {
    if (!showQR) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/lead/${leadId}/upload-status`);
      const data = await res.json();
      if (data.uploaded) {
        router.push(`/advisor/fair/${fairId}/lead/${leadId}/review`);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [showQR, leadId, fairId, router]);

  const uploadFile = useCallback(async (file) => {
    setError(null);
    const fileType = ACCEPTED_TYPES[file.type];
    if (!fileType) {
      setError('Nicht unterstütztes Dateiformat. Bitte PDF, DOCX, JPG oder PNG hochladen.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('Datei zu groß. Maximal 10 MB.');
      return;
    }

    setUploading(true);
    setUploadStep(0);

    try {
      const docId = crypto.randomUUID();
      const safeFilename = sanitizeFilename(file.name);
      const filePath = `${lead?.id || 'unknown'}/${docId}/${safeFilename}`;

      // Step 1: Storage-Upload
      const { error: uploadError } = await supabase.storage
        .from('cv-documents')
        .upload(filePath, file, { contentType: file.type });

      if (uploadError) throw new Error(uploadError.message);
      setUploadStep(1);

      // Step 2: DB-Eintrag
      const { error: dbError } = await supabase.from('cv_documents').insert({
        lead_id: leadId,
        storage_path: filePath,
        file_name: file.name,
        file_type: fileType,
        file_size_bytes: file.size,
      });

      if (dbError) throw new Error(dbError.message);
      setUploadStep(2);

      // Step 3: Lead-Status updaten
      await supabase.from('fair_leads')
        .update({ status: 'analyzing', updated_at: new Date().toISOString() })
        .eq('id', leadId);

      setUploadStep(3);
      // Kurze Pause damit Schritt 3 sichtbar ist
      await new Promise(r => setTimeout(r, 600));
      router.push(`/advisor/fair/${fairId}/lead/${leadId}/review`);
    } catch (err) {
      setError(err.message || 'Upload fehlgeschlagen');
      setUploading(false);
      setUploadStep(0);
    }
  }, [lead, leadId, fairId, router, supabase]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.daskarriereinstitut.de';
  const qrUrl = lead?.magic_token ? `${appUrl}/upload/${lead.magic_token}` : '';

  if (uploading) return <LoadingScreen progress={uploadStep} />;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <a
        href={`/advisor/fair/${fairId}`}
        style={{ fontSize: 13, color: '#86868b', textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}
      >
        &larr; Zurück
      </a>

      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>
        Lebenslauf hochladen
      </h1>
      {lead && (
        <p style={{ color: '#86868b', marginBottom: 32 }}>
          für <strong>{`${lead.first_name} ${lead.last_name || ''}`.trim()}</strong>
        </p>
      )}

      {error && (
        <div style={{
          background: '#FEF2F2', color: '#CC1426', padding: '12px 16px',
          borderRadius: 12, fontSize: 14, marginBottom: 16,
        }}>
          {error}
        </div>
      )}

      {!showQR ? (
        <>
          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? '#CC1426' : '#E8E6E1'}`,
              borderRadius: 16,
              padding: 48,
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? '#FEF2F2' : '#fff',
              transition: 'all 0.2s',
              marginBottom: 16,
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.jpg,.jpeg,.png,.heic"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
              <p style={{ fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>
                Datei hierhin ziehen
              </p>
              <p style={{ fontSize: 14, color: '#86868b' }}>
                oder klicken zum Auswählen · PDF, DOCX, JPG, PNG · Max. 10 MB
              </p>
            </div>
          </div>

          {/* Kamera-Button */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={uploading}
              style={{
                flex: 1,
                padding: '14px',
                background: '#fff',
                border: '1px solid #E8E6E1',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                color: '#1A1A1A',
              }}
            >
              📷 Foto aufnehmen
            </button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            <button
              onClick={() => setShowQR(true)}
              disabled={uploading}
              style={{
                flex: 1,
                padding: '14px',
                background: '#fff',
                border: '1px solid #E8E6E1',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                color: '#1A1A1A',
              }}
            >
              📱 QR-Code
            </button>
          </div>
        </>
      ) : (
        /* QR-Code Ansicht */
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          textAlign: 'center',
          border: '1px solid #E8E6E1',
          marginBottom: 16,
        }}>
          <p style={{ fontWeight: 600, fontSize: 16, color: '#1A1A1A', marginBottom: 4 }}>
            Besucher scannt diesen Code
          </p>
          <p style={{ fontSize: 14, color: '#86868b', marginBottom: 24 }}>
            Der Lebenslauf wird automatisch erkannt
          </p>

          {qrUrl && (
            <div style={{ display: 'inline-block', padding: 16, background: '#fff', borderRadius: 12, border: '1px solid #E8E6E1' }}>
              <QRCodeSVG value={qrUrl} size={240} level="M" />
            </div>
          )}

          <div style={{
            marginTop: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: '#86868b',
            fontSize: 14,
          }}>
            <span className="pulse-dot" style={{
              width: 8, height: 8, borderRadius: '50%', background: '#CC1426',
              display: 'inline-block', animation: 'pulse 1.5s infinite',
            }} />
            Warte auf Upload...
          </div>

          <button
            onClick={() => setShowQR(false)}
            style={{
              marginTop: 20, padding: '10px 24px', background: 'none',
              border: '1px solid #E8E6E1', borderRadius: 980, fontSize: 14,
              cursor: 'pointer', color: '#86868b',
            }}
          >
            Abbrechen
          </button>

          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
