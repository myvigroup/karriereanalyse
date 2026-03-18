'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', company: '', position: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
    router.push('/dashboard');
  }

  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: 6 };
  const labelStyle = { fontSize: 13, fontWeight: 500, color: 'var(--ki-text-secondary)' };

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
