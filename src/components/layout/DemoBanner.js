// Demo-Banner — zeigt sich, wenn der Demo-Berater-Account eingeloggt ist.
// Plus "Tour starten" Button für die geguidete Bühnen-Tour.
// Server Component — checked die E-Mail direkt aus der Session.

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
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
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          pointerEvents: 'none', // Wrapper ohne Events, einzelne Elemente reaktivieren
        }}
        aria-label="Demo-Modus aktiv"
      >
        {/* Pille DEMO-MODUS */}
        <div style={{
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
        }}>
          <span style={{
            display: 'inline-block',
            width: 6, height: 6, borderRadius: '50%',
            background: '#fff',
            animation: 'demo-pulse 1.6s ease-in-out infinite',
          }} />
          Demo-Modus
        </div>

        {/* Tour-Button */}
        <Link
          href="/advisor/leads?tour=start"
          style={{
            pointerEvents: 'auto',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: '#CC1426',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.04em',
            padding: '6px 14px',
            borderRadius: 980,
            boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            border: '1px solid rgba(204,20,38,0.2)',
          }}
        >
          <span>▶</span>
          Bühnen-Tour starten
        </Link>

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
