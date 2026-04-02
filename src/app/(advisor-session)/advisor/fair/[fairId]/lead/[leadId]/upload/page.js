'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { createClient } from '@/lib/supabase/client';

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
  const [error, setError] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

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
    setUploadProgress('Wird hochgeladen...');

    try {
      const docId = crypto.randomUUID();
      const ext = file.name.split('.').pop() || fileType;
      const filePath = `${lead?.email || 'unknown'}/${docId}/${file.name}`;

      // Storage-Upload
      const { error: uploadError } = await supabase.storage
        .from('cv-documents')
        .upload(filePath, file, { contentType: file.type });

      if (uploadError) throw new Error(uploadError.message);

      // DB-Eintrag
      const { error: dbError } = await supabase.from('cv_documents').insert({
        fair_lead_id: leadId,
        version: 1,
        file_path: filePath,
        file_name: file.name,
        file_type: fileType,
        file_size_bytes: file.size,
        is_current: true,
      });

      if (dbError) throw new Error(dbError.message);

      // Lead-Status updaten
      await supabase.from('fair_leads')
        .update({ status: 'analyzing', updated_at: new Date().toISOString() })
        .eq('id', leadId);

      setUploadProgress('Fertig!');
      router.push(`/advisor/fair/${fairId}/lead/${leadId}/review`);
    } catch (err) {
      setError(err.message || 'Upload fehlgeschlagen');
      setUploading(false);
      setUploadProgress(null);
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
          für <strong>{`${lead.first_name} ${lead.last_name || ''}`.trim()}</strong> ({lead.email})
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
              cursor: uploading ? 'not-allowed' : 'pointer',
              background: dragOver ? '#FEF2F2' : '#fff',
              transition: 'all 0.2s',
              marginBottom: 16,
              opacity: uploading ? 0.6 : 1,
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.jpg,.jpeg,.png,.heic"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            {uploading ? (
              <div>
                <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
                <p style={{ fontWeight: 600, color: '#1A1A1A' }}>{uploadProgress}</p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
                <p style={{ fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>
                  Datei hierhin ziehen
                </p>
                <p style={{ fontSize: 14, color: '#86868b' }}>
                  oder klicken zum Auswählen · PDF, DOCX, JPG, PNG · Max. 10 MB
                </p>
              </div>
            )}
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
