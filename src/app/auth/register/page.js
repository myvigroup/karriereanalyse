'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', company: '', position: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Passwort muss mindestens 6 Zeichen haben.'); return; }
    if (form.password !== form.confirm) { setError('Passwörter stimmen nicht überein.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { first_name: form.firstName, last_name: form.lastName, company: form.company, position: form.position },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  }

  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: 6 };
  const labelStyle = { fontSize: 13, fontWeight: 500, color: 'var(--ki-text-secondary)' };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--ki-bg)', padding: 24 }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--ki-red)', marginBottom: 32, textTransform: 'uppercase' }}>Karriere-Institut</div>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(204,20,38,0.08)', border: '2px solid rgba(204,20,38,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--ki-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 12 }}>E-Mail bestätigen</h1>
          <p style={{ fontSize: 16, color: 'var(--ki-text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
            Wir haben eine Bestätigungsmail an <strong style={{ color: 'var(--ki-text)' }}>{form.email}</strong> gesendet.
            Bitte klicke auf den Link in der E-Mail, um dein Konto zu aktivieren.
          </p>
          <div style={{
            background: '#FFF9E6', border: '1px solid #FDE68A',
            borderRadius: 10, padding: '12px 16px', marginBottom: 32,
            fontSize: 13, color: '#92400E', lineHeight: 1.5, textAlign: 'left',
          }}>
            📬 Keine E-Mail erhalten? Bitte prüfe auch deinen <strong>Spam-Ordner</strong>.
          </div>
          <a href="/auth/login" className="btn btn-primary" style={{ display: 'inline-block', padding: '12px 32px', fontSize: 15 }}>
            Zur Anmeldeseite
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--ki-bg)', padding: 24 }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--ki-red)', marginBottom: 12, textTransform: 'uppercase' }}>Karriere-Institut</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em' }}>Konto erstellen</h1>
          <p style={{ color: 'var(--ki-text-secondary)', marginTop: 8 }}>Starte jetzt deine Karriereanalyse.</p>
        </div>

        <form onSubmit={handleRegister} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Vorname *</label>
              <input className="input" value={form.firstName} onChange={e => update('firstName', e.target.value)} required />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Nachname *</label>
              <input className="input" value={form.lastName} onChange={e => update('lastName', e.target.value)} required />
            </div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>E-Mail *</label>
            <input className="input" type="email" value={form.email} onChange={e => update('email', e.target.value)} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Unternehmen</label>
              <input className="input" value={form.company} onChange={e => update('company', e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Position</label>
              <input className="input" value={form.position} onChange={e => update('position', e.target.value)} />
            </div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Passwort * (min. 6 Zeichen)</label>
            <input className="input" type="password" value={form.password} onChange={e => update('password', e.target.value)} required />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Passwort bestätigen *</label>
            <input className="input" type="password" value={form.confirm} onChange={e => update('confirm', e.target.value)} required />
          </div>

          {error && <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'rgba(204,20,38,0.06)', color: 'var(--ki-red)', fontSize: 14 }}>{error}</div>}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: 16 }}>
            {loading ? 'Registrierung...' : 'Zugang erstellen'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ki-text-tertiary)' }}>
            Mit der Registrierung akzeptierst du unsere Nutzungsbedingungen und Datenschutzrichtlinie.
          </p>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <span style={{ fontSize: 14, color: 'var(--ki-text-secondary)' }}>Bereits ein Konto? </span>
          <a href="/auth/login" style={{ fontSize: 14, fontWeight: 600 }}>Anmelden</a>
        </div>
      </div>
    </div>
  );
}
