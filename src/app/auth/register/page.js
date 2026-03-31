'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [dsgvo, setDsgvo] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    if (!dsgvo) { setError('Bitte stimme der Datenschutzerklärung zu.'); return; }
    if (form.password.length < 6) { setError('Passwort muss mindestens 6 Zeichen haben.'); return; }
    if (form.password !== form.confirm) { setError('Passwörter stimmen nicht überein.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { first_name: form.firstName, last_name: form.lastName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push('/analyse');
  }

  const labelStyle = { fontSize: 13, fontWeight: 500, color: 'var(--ki-text-secondary)', marginBottom: 6, display: 'block' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--ki-bg)' }}>
      {/* Left: Branding */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        background: 'var(--ki-charcoal)', color: 'white', padding: '64px',
      }}>
        <div style={{ maxWidth: 400 }}>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--ki-red)', marginBottom: 24, textTransform: 'uppercase' }}>
            Karriere-Institut
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 16 }}>
            Finde heraus, wo du stehst.
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            Kostenlose Karriere-Analyse mit 13 Kompetenzfeldern — in nur 15 Minuten. Danach passt sich die gesamte Plattform an dich an.
          </p>
          <div style={{ marginTop: 48, display: 'flex', gap: 32 }}>
            {[['13', 'Kompetenzfelder'], ['~15 Min', 'Analyse'], ['Kostenlos', 'Für immer']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--ki-red)' }}>{n}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Registration Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 48 }}>
        <div style={{ maxWidth: 380, width: '100%' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>Kostenlos starten</h2>
          <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 32 }}>Erstelle dein Konto und starte direkt die Karriere-Analyse.</p>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Vorname *</label>
                <input className="input" value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="Max" required />
              </div>
              <div>
                <label style={labelStyle}>Nachname *</label>
                <input className="input" value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Mustermann" required />
              </div>
            </div>
            <div>
              <label style={labelStyle}>E-Mail *</label>
              <input className="input" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="name@example.com" required />
            </div>
            <div>
              <label style={labelStyle}>Passwort * (min. 6 Zeichen)</label>
              <input className="input" type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="••••••" required />
            </div>
            <div>
              <label style={labelStyle}>Passwort bestätigen *</label>
              <input className="input" type="password" value={form.confirm} onChange={e => update('confirm', e.target.value)} placeholder="••••••" required />
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 13, color: 'var(--ki-text-secondary)' }}>
              <input type="checkbox" checked={dsgvo} onChange={e => setDsgvo(e.target.checked)} style={{ marginTop: 2, accentColor: 'var(--ki-red)' }} />
              <span>Ich stimme der Verarbeitung meiner Daten gemäß der <a href="/datenschutz" target="_blank" style={{ fontWeight: 600 }}>Datenschutzerklärung</a> zu.</span>
            </label>

            {error && <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'rgba(204,20,38,0.06)', color: 'var(--ki-red)', fontSize: 14 }}>{error}</div>}

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: 16, marginTop: 4 }}>
              {loading ? 'Wird erstellt...' : 'Karriere-Analyse starten →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--ki-border)' }}>
            <span style={{ fontSize: 14, color: 'var(--ki-text-secondary)' }}>Bereits ein Konto? </span>
            <a href="/auth/login" style={{ fontSize: 14, fontWeight: 600 }}>Anmelden</a>
          </div>
        </div>
      </div>
    </div>
  );
}
