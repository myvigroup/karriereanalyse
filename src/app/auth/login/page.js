'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push('/dashboard');
  }

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
            Dein Karriere-Betriebssystem.
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            Analyse. Masterclass. Coaching. Alles an einem Ort — für Fach- und Führungskräfte, die den nächsten Schritt machen wollen.
          </p>
          <div style={{ marginTop: 48, display: 'flex', gap: 32 }}>
            {[['13', 'Kompetenzfelder'], ['52', 'Lektionen'], ['€40k+', 'Marktwert-Potenzial']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--ki-red)' }}>{n}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 48 }}>
        <div style={{ maxWidth: 380, width: '100%' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>Willkommen zurück</h2>
          <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 32 }}>Melde dich an, um fortzufahren.</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ki-text-secondary)', marginBottom: 6, display: 'block' }}>E-Mail</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ki-text-secondary)', marginBottom: 6, display: 'block' }}>Passwort</label>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" required />
            </div>

            {error && <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'rgba(204,20,38,0.06)', color: 'var(--ki-red)', fontSize: 14 }}>{error}</div>}

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 8, padding: '14px 24px', fontSize: 16 }}>
              {loading ? 'Anmelden...' : 'Anmelden'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <a href="/auth/forgot-password" style={{ fontSize: 14, color: 'var(--ki-text-secondary)' }}>Passwort vergessen?</a>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--ki-border)' }}>
            <span style={{ fontSize: 14, color: 'var(--ki-text-secondary)' }}>Noch kein Konto? </span>
            <a href="/auth/register" style={{ fontSize: 14, fontWeight: 600 }}>Jetzt registrieren</a>
          </div>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <a href="/advisor/login" style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', textDecoration: 'none' }}>
              Du bist Berater? → Berater-Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
