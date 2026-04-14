'use client';
import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { trackEvent, EVENTS } from '@/lib/analytics';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    trackEvent(supabase, data.user.id, EVENTS.LOGIN, { source: 'web' });
    if (data?.user?.user_metadata?.needs_password_setup) {
      router.push('/auth/set-password');
      return;
    }
    const redirect = searchParams.get('redirect');
    router.push(redirect || '/dashboard');
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .login-branding { display: none !important; }
          .login-wrapper { flex-direction: column !important; }
          .login-form-side {
            padding: 32px 24px !important;
            align-items: stretch !important;
          }
          .login-mobile-header {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .login-mobile-header { display: none !important; }
        }
      `}</style>

      <div className="login-wrapper" style={{ minHeight: '100vh', display: 'flex', background: 'var(--ki-bg)' }}>

        {/* Mobile-only compact header */}
        <div className="login-mobile-header" style={{
          display: 'none',
          background: 'var(--ki-charcoal)', color: 'white',
          padding: '28px 24px 24px',
          flexDirection: 'column',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--ki-red)', marginBottom: 10, textTransform: 'uppercase' }}>
            Karriere-Institut
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Dein Karriere-Betriebssystem.
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
            {[['13', 'Kompetenzfelder'], ['52', 'Lektionen'], ['€40k+', 'Potenzial']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ki-red)' }}>{n}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Left Branding */}
        <div className="login-branding" style={{
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

        {/* Right / Mobile: Login Form */}
        <div className="login-form-side" style={{
          flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 48,
        }}>
          <div style={{ maxWidth: 380, width: '100%' }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>Willkommen zurück</h2>
            <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 32 }}>Melde dich an, um fortzufahren.</p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ki-text-secondary)', marginBottom: 6, display: 'block' }}>E-Mail</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required autoComplete="email" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ki-text-secondary)', marginBottom: 6, display: 'block' }}>Passwort</label>
                <div style={{ position: 'relative' }}>
                  <input className="input" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" required style={{ paddingRight: 44 }} autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#9CA3AF', lineHeight: 1 }}>
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
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
              <a href="/berater/login" style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', textDecoration: 'none' }}>
                Du bist Berater? → Berater-Portal
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
