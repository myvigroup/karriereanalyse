'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdvisorForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/set-password`,
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', background: '#F5F5F7',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 48, height: 48, background: '#1A1A1A', borderRadius: 12, marginBottom: 16,
          }}>
            <span style={{ fontSize: 22 }}>💼</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Karriere-Institut
          </div>
          <div style={{ fontSize: 11, color: '#86868b', marginTop: 2 }}>Berater-Portal</div>
        </div>

        <div style={{
          background: '#fff', borderRadius: 20, border: '1px solid #E8E6E1',
          padding: '36px 32px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✉️</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>E-Mail gesendet</h2>
              <p style={{ fontSize: 14, color: '#86868b', lineHeight: 1.6 }}>
                Falls ein Berater-Konto mit dieser E-Mail existiert, erhältst du einen Reset-Link.
              </p>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>
                Passwort zurücksetzen
              </h1>
              <p style={{ fontSize: 13, color: '#86868b', marginBottom: 28 }}>
                Wir senden dir einen Link per E-Mail.
              </p>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    E-Mail
                  </label>
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="vorname@karriere-institut.de"
                    required
                    autoFocus
                    style={{ width: '100%' }}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', padding: '13px 24px', fontSize: 15 }}
                >
                  {loading ? 'Senden...' : 'Link senden →'}
                </button>
              </form>
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="/advisor/login" style={{ fontSize: 13, color: '#86868b', textDecoration: 'none' }}>
            ← Zurück zum Login
          </a>
        </div>
      </div>
    </div>
  );
}
