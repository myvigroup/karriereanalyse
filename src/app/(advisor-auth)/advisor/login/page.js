'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdvisorLoginPage() {
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

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError('E-Mail oder Passwort ungültig.');
      setLoading(false);
      return;
    }

    // Check that user is actually an advisor/admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (!profile || !['advisor', 'admin'].includes(profile.role)) {
      await supabase.auth.signOut();
      setError('Kein Zugang zum Berater-Portal. Bitte wende dich an deinen Administrator.');
      setLoading(false);
      return;
    }

    router.push('/advisor/leads');
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', background: '#F5F5F7',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
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

        {/* Card */}
        <div style={{
          background: '#fff', borderRadius: 20, border: '1px solid #E8E6E1',
          padding: '36px 32px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>
            Anmelden
          </h1>
          <p style={{ fontSize: 13, color: '#86868b', marginBottom: 28 }}>
            Nur für autorisierte Berater.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Passwort
              </label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%' }}
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(204,20,38,0.06)', color: '#CC1426', fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '13px 24px', fontSize: 15, marginTop: 4 }}
            >
              {loading ? 'Anmelden...' : 'Anmelden →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <a
              href="/advisor/forgot-password"
              style={{ fontSize: 13, color: '#86868b', textDecoration: 'none' }}
            >
              Passwort vergessen?
            </a>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#C5C5C7' }}>
          Du bist Bewerber?{' '}
          <a href="/auth/login" style={{ color: '#86868b', textDecoration: 'underline' }}>
            Zum Karriere-Institut
          </a>
        </div>
      </div>
    </div>
  );
}
