// Diskreter Hinweis-Pill, der oben in der App erscheint, wenn der Demo-Account eingeloggt ist.
// Server Component — checked die E-Mail direkt aus der Session.

import { createClient } from '@/lib/supabase/server';
import { isDemoEmail } from '@/lib/demo';

export default async function DemoBanner() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isDemoEmail(user.email)) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: 'rgba(204, 20, 38, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: 'white',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          padding: '6px 14px',
          borderRadius: 980,
          boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          pointerEvents: 'none',
        }}
        aria-label="Demo-Modus aktiv"
      >
        <span style={{
          display: 'inline-block',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#fff',
          animation: 'demo-pulse 1.6s ease-in-out infinite',
        }} />
        Demo-Modus
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes demo-pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
        `}} />
      </div>
    );
  } catch {
    return null;
  }
}
