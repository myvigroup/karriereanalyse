'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function SetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  useEffect(() => {
    // Check for error in URL hash first (e.g. expired OTP)
    const hash = window.location.hash;
    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1));
      if (hashParams.get('error')) {
        const desc = hashParams.get('error_description')?.replace(/\+/g, ' ') || 'Link ungültig oder abgelaufen.';
        window.history.replaceState(null, '', window.location.pathname);
        setError(desc);
        return;
      }
    }

    let resolved = false;
    const errorTimeout = setTimeout(() => {
      if (!resolved) {
        setError('Link abgelaufen oder ungültig. Bitte eine neue Einladung anfordern.');
      }
    }, 8000);

    // onAuthStateChange fires INITIAL_SESSION if session already exists,
    // or SIGNED_IN when the session is newly established — covers both
    // cases: detectSessionInUrl auto-processing and manual setSession()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        resolved = true;
        clearTimeout(errorTimeout);
        window.history.replaceState(null, '', window.location.pathname);
        setSessionReady(true);
      }
    });

    // Manual hash token handling as fallback (in case detectSessionInUrl is disabled)
    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const access_token = hashParams.get('access_token');
      const refresh_token = hashParams.get('refresh_token');
      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token }).then(({ data, error: setErr }) => {
          if (setErr || !data?.session) {
            resolved = true;
            clearTimeout(errorTimeout);
            setError(setErr?.message || 'Link ungültig oder abgelaufen.');
          }
          // On success → onAuthStateChange fires SIGNED_IN → setSessionReady(true)
        });
      }
    }

    // PKCE flow (?code=...)
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data, error: exchErr }) => {
        window.history.replaceState(null, '', window.location.pathname);
        if (exchErr || !data?.session) {
          resolved = true;
          clearTimeout(errorTimeout);
          setError(exchErr?.message || 'Link ungültig oder abgelaufen.');
        }
        // On success → onAuthStateChange fires SIGNED_IN → setSessionReady(true)
      });
    }

    return () => {
      clearTimeout(errorTimeout);
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e) {
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

    const { error: updateError } = await supabase.auth.updateUser({
      password,
      data: { needs_password_setup: false },
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    window.location.href = '/dashboard';
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F5F5F7',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: '#CC1426', textTransform: 'uppercase' }}>
            KARRIERE-INSTITUT
          </span>
          <p style={{ color: '#86868b', fontSize: 13, margin: '6px 0 0' }}>Konto-Einstellungen</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', margin: '0 0 8px' }}>
            Neues Passwort setzen
          </h1>
          <p style={{ color: '#86868b', fontSize: 14, margin: '0 0 28px', lineHeight: 1.5 }}>
            Gib dein neues Passwort ein. Du wirst danach automatisch weitergeleitet.
          </p>

          {error ? (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '16px 14px' }}>
              <p style={{ fontSize: 13, color: '#DC2626', margin: '0 0 12px', fontWeight: 600 }}>Link ungültig</p>
              <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{error}</p>
            </div>
          ) : !sessionReady ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#86868b', fontSize: 14 }}>
              Link wird verifiziert…
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>
                  Neues Passwort
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mindestens 8 Zeichen"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 44px 12px 14px',
                      borderRadius: 10,
                      border: '1px solid #E8E6E1',
                      fontSize: 15,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#9CA3AF', fontSize: 18, lineHeight: 1 }}>
                    {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>
                  Passwort wiederholen
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Passwort bestätigen"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 44px 12px 14px',
                      borderRadius: 10,
                      border: '1px solid #E8E6E1',
                      fontSize: 15,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#9CA3AF', fontSize: 18, lineHeight: 1 }}>
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading ? '#6B7280' : '#CC1426',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: 4,
                }}
              >
                {loading ? 'Wird gespeichert…' : 'Passwort speichern'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
