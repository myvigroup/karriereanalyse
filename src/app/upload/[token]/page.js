'use client';

import { useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';

const ACCEPTED = '.pdf,.docx,.jpg,.jpeg,.png';
const MAX_SIZE = 10 * 1024 * 1024;

const BENEFITS = [
  { icon: '📋', text: 'Persönliches Lebenslauf-Feedback deines Coaches' },
  { icon: '🎯', text: 'Kostenlose Karriereanalyse — entdecke dein Potenzial' },
  { icon: '🎓', text: 'Karriere-Grundlagen-Seminar' },
  { icon: '📊', text: 'Persönlicher Karrierepfad & Fortschritts-Tracker' },
  { icon: '🤖', text: 'KI-Coach für individuelle Karrierefragen' },
];

export default function PublicUpload() {
  const { token } = useParams();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signingUp, setSigningUp] = useState(false);
  const [signupDone, setSignupDone] = useState(false);
  const [signupError, setSignupError] = useState(null);

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

  async function handleSignup(e) {
    e.preventDefault();
    setSignupError(null);
    setSigningUp(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name: signupName,
          email: signupEmail,
          password: signupPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registrierung fehlgeschlagen');
      setSignupDone(true);
    } catch (err) {
      setSignupError(err.message);
      setSigningUp(false);
    }
  }

  // Schritt 3: Registrierung abgeschlossen — Seite schließen
  if (signupDone) {
    // Versuche die Seite zu schließen (funktioniert wenn via QR geöffnet)
    if (typeof window !== 'undefined') {
      try { window.close(); } catch {}
    }

    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FAFAF8', padding: 24,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>
            Willkommen!
          </h1>
          <p style={{ color: '#86868b', lineHeight: 1.6, marginBottom: 16 }}>
            Dein Account ist bereit. Du erhältst eine E-Mail mit dem Zugang zu deinem Portal.
          </p>
          <p style={{ color: '#86868b', fontSize: 14 }}>
            Du kannst diese Seite jetzt schließen.
          </p>
        </div>
      </div>
    );
  }

  // Schritt 2: Upload fertig → Registrierung
  if (uploaded) {
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
            {/* Erfolg */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px' }}>
                Lebenslauf hochgeladen!
              </h2>
              <p style={{ color: '#86868b', fontSize: 14 }}>
                Dein Coach gibt dir gleich persönliches Feedback.
              </p>
            </div>

            {/* Benefits */}
            <div style={{
              background: '#fff', borderRadius: 16, padding: 20,
              border: '1px solid #E8E6E1', marginBottom: 20,
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 16 }}>
                Melde dich kostenlos an und erhalte:
              </h3>
              {BENEFITS.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>{b.icon}</span>
                  <span style={{ fontSize: 14, color: '#1A1A1A' }}>{b.text}</span>
                </div>
              ))}
            </div>

            {/* Registrierungsformular */}
            <form onSubmit={handleSignup}>
              <div style={{ marginBottom: 12 }}>
                <input
                  type="text"
                  required
                  placeholder="Dein Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  style={{
                    width: '100%', padding: '14px 16px', fontSize: 16,
                    border: '1px solid #E8E6E1', borderRadius: 12,
                    outline: 'none', background: '#fff', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input
                  type="email"
                  required
                  placeholder="E-Mail-Adresse"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  style={{
                    width: '100%', padding: '14px 16px', fontSize: 16,
                    border: '1px solid #E8E6E1', borderRadius: 12,
                    outline: 'none', background: '#fff', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Passwort wählen (min. 6 Zeichen)"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  style={{
                    width: '100%', padding: '14px 16px', fontSize: 16,
                    border: '1px solid #E8E6E1', borderRadius: 12,
                    outline: 'none', background: '#fff', boxSizing: 'border-box',
                  }}
                />
              </div>

              <p style={{ fontSize: 12, color: '#86868b', lineHeight: 1.5, marginBottom: 16 }}>
                Mit der Anmeldung stimmst du unserer{' '}
                <a href="/datenschutz" target="_blank" style={{ color: '#CC1426' }}>Datenschutzerklärung</a> zu.
              </p>

              {signupError && (
                <div style={{
                  background: '#FEF2F2', color: '#CC1426', padding: '12px 16px',
                  borderRadius: 12, fontSize: 14, marginBottom: 12, textAlign: 'center',
                }}>
                  {signupError}
                </div>
              )}

              <button
                type="submit"
                disabled={signingUp}
                style={{
                  width: '100%', padding: 16,
                  background: signingUp ? '#E8E6E1' : '#CC1426',
                  color: '#fff', border: 'none', borderRadius: 12,
                  fontSize: 16, fontWeight: 700, cursor: signingUp ? 'not-allowed' : 'pointer',
                }}
              >
                {signingUp ? 'Wird registriert...' : 'Kostenlos anmelden'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#86868b', marginTop: 16 }}>
              Oder schließe diese Seite — dein Coach sendet dir den Zugang per E-Mail.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Schritt 1: Upload
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
