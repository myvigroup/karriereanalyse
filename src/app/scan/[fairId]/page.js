'use client';
import { useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';

const BENEFITS = [
  { icon: '🤖', title: 'KI-Analyse in Sekunden', desc: 'Sofortiges Feedback zu Struktur, Inhalt, Design und Wirkung' },
  { icon: '⭐', title: 'Gesamtbewertung 1–5', desc: 'Klare Einschätzung deines Lebenslaufs auf einen Blick' },
  { icon: '💡', title: 'Konkrete Verbesserungen', desc: 'Individuelle Hinweise, was du direkt verbessern kannst' },
];

function StepIndicator({ currentStep }) {
  const steps = [
    { num: 1, label: 'Daten' },
    { num: 2, label: 'Hochladen' },
    { num: 3, label: 'Ergebnis' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 32 }}>
      {steps.map((step, idx) => (
        <div key={step.num} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: currentStep >= step.num ? '#CC1426' : '#E8E6E1',
              color: currentStep >= step.num ? '#fff' : '#9CA3AF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14,
              transition: 'background 0.2s',
            }}>
              {currentStep > step.num ? '✓' : step.num}
            </div>
            <span style={{
              fontSize: 11, fontWeight: 500,
              color: currentStep >= step.num ? '#CC1426' : '#9CA3AF',
            }}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div style={{
              width: 48, height: 2,
              background: currentStep > step.num ? '#CC1426' : '#E8E6E1',
              marginBottom: 16, transition: 'background 0.2s',
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

function InputField({ label, type = 'text', value, onChange, placeholder, required, hint }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#CC1426' }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%', padding: '12px 16px', borderRadius: 12,
          border: '1.5px solid #E8E6E1', fontSize: 16,
          background: '#fff', color: '#1A1A1A', outline: 'none',
          boxSizing: 'border-box',
          WebkitAppearance: 'none',
        }}
      />
      {hint && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9CA3AF' }}>{hint}</p>}
    </div>
  );
}

export default function ScanPage() {
  const params = useParams();
  const fairId = params.fairId;
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetPosition, setTargetPosition] = useState('');
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Step 1: Submit contact info
  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/self-check/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fairId, name, email, targetPosition }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fehler');
      setToken(data.token);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Upload CV
  const handleUpload = useCallback(async (file) => {
    if (!token) return;
    setError(null);
    setStep(3);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('token', token);
    try {
      const res = await fetch('/api/self-check/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload fehlgeschlagen');
      router.push(`/scan/result/${token}`);
    } catch (err) {
      setError(err.message);
      setStep(2);
    }
  }, [token, router]);

  const handleFileSelect = (file) => {
    if (!file) return;
    const accepted = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
    if (!accepted.includes(file.type)) {
      setError('Format nicht unterstützt. Bitte PDF, DOCX, JPG oder PNG.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Datei zu groß (max. 10 MB)');
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: 20,
    border: '1px solid #E8E6E1',
    padding: '28px 24px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
  };

  const primaryBtnStyle = {
    width: '100%', padding: '16px 24px', borderRadius: 980,
    background: submitting ? '#E8C0C5' : '#CC1426',
    color: '#fff', border: 'none', fontWeight: 700, fontSize: 16,
    cursor: submitting ? 'not-allowed' : 'pointer',
    transition: 'background 0.2s',
    letterSpacing: 0.2,
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px 48px' }}>
      <StepIndicator currentStep={step} />

      {/* Step 1: Info */}
      {step === 1 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1A1A1A', margin: '0 0 8px' }}>
              Kostenloser Lebenslauf-Check
            </h1>
            <p style={{ color: '#6B7280', fontSize: 15, margin: 0, lineHeight: 1.5 }}>
              Lade deinen Lebenslauf hoch und erhalte sofort KI-Feedback.
            </p>
          </div>

          {/* Benefits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {BENEFITS.map(b => (
              <div key={b.icon} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', background: '#FFF8F8', borderRadius: 14, border: '1px solid #FDECEA' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{b.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{b.title}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', margin: '0 0 20px' }}>Deine Daten</h2>
            <form onSubmit={handleInfoSubmit}>
              <InputField label="Dein Name" value={name} onChange={setName} placeholder="Max Mustermann" required />
              <InputField label="E-Mail-Adresse" type="email" value={email} onChange={setEmail} placeholder="max@beispiel.de" required hint="Für dein persönliches Ergebnis-Link" />
              <InputField label="Wunschposition" value={targetPosition} onChange={setTargetPosition} placeholder="z.B. Marketing Manager" hint="Optional – für gezielteres Feedback" />

              {error && (
                <div style={{ padding: '12px 16px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 14, marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={submitting} style={primaryBtnStyle}>
                {submitting ? 'Wird verarbeitet...' : 'Weiter → Lebenslauf hochladen'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Step 2: Upload */}
      {step === 2 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1A1A1A', margin: '0 0 8px' }}>
              Lebenslauf hochladen
            </h1>
            <p style={{ color: '#6B7280', fontSize: 15, margin: 0 }}>
              PDF, DOCX, JPG oder PNG — max. 10 MB
            </p>
          </div>

          <div style={cardStyle}>
            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              style={{
                border: `2px dashed ${dragOver ? '#CC1426' : selectedFile ? '#22C55E' : '#E8E6E1'}`,
                borderRadius: 16,
                padding: '40px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragOver ? '#FFF8F8' : selectedFile ? '#F0FDF4' : '#FAFAF8',
                transition: 'all 0.2s',
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>
                {selectedFile ? '✅' : '📄'}
              </div>
              {selectedFile ? (
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: '#15803D', marginBottom: 4 }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>
                    {(selectedFile.size / 1024 / 1024).toFixed(1)} MB · Tippe zum Ändern
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, color: '#1A1A1A', marginBottom: 6 }}>
                    Tippe hier oder ziehe deine Datei hierher
                  </div>
                  <div style={{ fontSize: 13, color: '#9CA3AF' }}>
                    PDF · DOCX · JPG · PNG
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.jpg,.jpeg,.png,.heic,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/heic"
              onChange={e => handleFileSelect(e.target.files?.[0])}
              style={{ display: 'none' }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={e => handleFileSelect(e.target.files?.[0])}
              style={{ display: 'none' }}
            />

            {/* Camera button */}
            {!selectedFile && (
              <button
                onClick={() => cameraInputRef.current?.click()}
                style={{
                  width: '100%', padding: '14px 24px', borderRadius: 12,
                  background: '#F3F4F6', color: '#1A1A1A', border: '1.5px solid #E8E6E1',
                  fontWeight: 600, fontSize: 15, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  marginBottom: 12,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                Foto aufnehmen
              </button>
            )}

            {error && (
              <div style={{ padding: '12px 16px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 14, marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button
              onClick={() => selectedFile && handleUpload(selectedFile)}
              disabled={!selectedFile}
              style={{
                ...primaryBtnStyle,
                background: !selectedFile ? '#E8E6E1' : '#CC1426',
                color: !selectedFile ? '#9CA3AF' : '#fff',
                cursor: !selectedFile ? 'not-allowed' : 'pointer',
              }}
            >
              KI-Analyse starten →
            </button>

            <button
              onClick={() => { setStep(1); setSelectedFile(null); setError(null); }}
              style={{ width: '100%', padding: '12px 24px', borderRadius: 980, background: 'transparent', color: '#6B7280', border: 'none', fontWeight: 500, fontSize: 14, cursor: 'pointer', marginTop: 8 }}
            >
              ← Zurück
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Analyzing */}
      {step === 3 && (
        <div style={{ textAlign: 'center', padding: '40px 16px' }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🤖</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', margin: '0 0 12px' }}>
              KI analysiert deinen Lebenslauf...
            </h2>
            <p style={{ color: '#6B7280', fontSize: 15, margin: '0 0 28px', lineHeight: 1.6 }}>
              Das dauert nur wenige Sekunden. Dein Ergebnis wird gleich angezeigt.
            </p>

            {/* Spinner */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                border: '4px solid #E8E6E1',
                borderTopColor: '#CC1426',
                animation: 'spin 0.8s linear infinite',
              }} />
            </div>

            {/* Progress steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
              {[
                { label: 'Lebenslauf hochgeladen', done: true },
                { label: 'Struktur & Inhalt analysieren', done: false },
                { label: 'Design & Wirkung bewerten', done: false },
                { label: 'Feedback zusammenstellen', done: false },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, background: item.done ? '#F0FDF4' : '#F9FAFB' }}>
                  <span style={{ fontSize: 16 }}>{item.done ? '✅' : '⏳'}</span>
                  <span style={{ fontSize: 14, color: item.done ? '#15803D' : '#6B7280', fontWeight: item.done ? 600 : 400 }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {error && (
              <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 14 }}>
                {error}
              </div>
            )}
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </div>
  );
}
