'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const DISMISSED_KEY = 'pw_banner_dismissed';

export default function SetPasswordBanner() {
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Nicht zeigen, wenn der User den Banner schon weggeklickt hat
    if (typeof window !== 'undefined' && !localStorage.getItem(DISMISSED_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1');
    setVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen haben.');
      return;
    }
    if (password !== confirm) {
      setError('Passwörter stimmen nicht überein.');
      return;
    }

    setLoading(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );

    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    localStorage.setItem(DISMISSED_KEY, '1');
    // Banner nach 3 Sekunden automatisch ausblenden
    setTimeout(() => setVisible(false), 3000);
  };

  if (!visible) return null;

  if (success) {
    return (
      <div style={{
        background: '#D1FAE5',
        border: '1px solid #6EE7B7',
        borderRadius: 16,
        padding: '16px 20px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <span style={{ fontSize: 22 }}>✅</span>
        <p style={{ margin: 0, fontWeight: 600, color: '#065F46' }}>
          Passwort gesetzt! Du kannst dich ab jetzt jederzeit direkt einloggen.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: '#FFF7ED',
      border: '1px solid #FED7AA',
      borderRadius: 16,
      padding: '20px 24px',
      marginBottom: 24,
      position: 'relative',
    }}>
      {/* Schließen-Button */}
      <button
        onClick={dismiss}
        style={{
          position: 'absolute', top: 12, right: 12,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 18, color: '#9CA3AF', lineHeight: 1,
        }}
        aria-label="Schließen"
      >
        ×
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <span style={{ fontSize: 24, flexShrink: 0 }}>🔐</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 15, color: '#1A1A1A' }}>
            Passwort festlegen – für direkten Zugang
          </p>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: '#6B7280' }}>
            Du wurdest per E-Mail-Link eingeloggt. Mit einem Passwort kannst du dich künftig direkt anmelden, ohne auf eine neue E-Mail zu warten.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 4 }}>
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mindestens 8 Zeichen"
                required
                style={{
                  padding: '9px 14px', borderRadius: 10, border: '1px solid #E5E7EB',
                  fontSize: 14, width: 200, background: '#fff',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 4 }}>
                Passwort wiederholen
              </label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Wiederholen"
                required
                style={{
                  padding: '9px 14px', borderRadius: 10, border: '1px solid #E5E7EB',
                  fontSize: 14, width: 200, background: '#fff',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '9px 20px', background: '#CC1426', color: '#fff',
                border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Wird gesetzt…' : 'Passwort setzen'}
            </button>
          </form>

          {error && (
            <p style={{ margin: '8px 0 0', fontSize: 13, color: '#DC2626' }}>{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
