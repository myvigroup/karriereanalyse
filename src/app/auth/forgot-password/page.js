'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
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
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--ki-bg)', padding: 24 }}>
      <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--ki-red)', marginBottom: 16, textTransform: 'uppercase' }}>Karriere-Institut</div>
        {sent ? (
          <div className="card" style={{ padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>E-Mail gesendet</h2>
            <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 20 }}>Wir haben einen Reset-Link an <strong>{email}</strong> gesendet.</p>
            <div style={{ background: '#FFF9E6', border: '1px solid #FDE68A', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#92400E', lineHeight: 1.5 }}>
              📬 Keine E-Mail erhalten? Bitte prüfe auch deinen <strong>Spam-Ordner</strong>.
            </div>
            <a href="/auth/login" className="btn btn-secondary">Zurück zum Login</a>
          </div>
        ) : (
          <div className="card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Passwort vergessen?</h2>
            <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 24 }}>Gib deine E-Mail ein — wir senden dir einen Reset-Link.</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Senden...' : 'Reset-Link senden'}
              </button>
            </form>
            <div style={{ marginTop: 16 }}>
              <a href="/auth/login" style={{ fontSize: 14, color: 'var(--ki-text-secondary)' }}>← Zurück zum Login</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
