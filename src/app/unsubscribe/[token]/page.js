import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function UnsubscribePage({ params }) {
  const { token } = params;
  let success = false;

  if (token) {
    const { data } = await supabase
      .from('profiles')
      .update({ email_notifications: false })
      .eq('unsubscribe_token', token)
      .select('id')
      .single();

    success = !!data;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ki-bg)', padding: 24, fontFamily: "'Instrument Sans', sans-serif" }}>
      <div className="card" style={{ maxWidth: 440, width: '100%', textAlign: 'center', padding: 48 }}>
        {success ? (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{'\u2709\uFE0F'}</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 12 }}>Abgemeldet</h1>
            <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
              Du erhältst keine E-Mails mehr vom Karriere-Institut. Du kannst dies jederzeit in deinem Profil unter Einstellungen ändern.
            </p>
            <a href="/profile" style={{ color: 'var(--ki-red)', fontSize: 14, fontWeight: 600 }}>Zu den Einstellungen</a>
          </>
        ) : (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{'\u26A0\uFE0F'}</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 12 }}>Link ungültig</h1>
            <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)' }}>Dieser Abmelde-Link ist ungültig oder abgelaufen.</p>
          </>
        )}
      </div>
    </div>
  );
}
