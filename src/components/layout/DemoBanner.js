// Demo-Banner — zeigt sich nur, wenn der eingeloggte User der Demo-Advisor IST
// UND mindestens ein Demo-Lead in seinem Account existiert. Damit ist der Banner
// im normalen Admin-Alltag unsichtbar und nur sichtbar, wenn die Demo-Daten
// gerade geseeded sind (also Bühne aktiv).

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isDemoEmail } from '@/lib/demo';

const DEMO_LEAD_MARKER = 'anna.mueller@beispiel.de';

export default async function DemoBanner() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isDemoEmail(user.email)) return null;

    // Schneller Check: ist Anna Müller als Lead da? Dann ist Demo-Mode aktiv.
    const admin = createAdminClient();
    const { data: advisor } = await admin
      .from('advisors').select('id').eq('user_id', user.id).maybeSingle();
    if (!advisor) return null;

    const { count } = await admin
      .from('fair_leads')
      .select('id', { count: 'exact', head: true })
      .eq('advisor_id', advisor.id)
      .eq('email', DEMO_LEAD_MARKER);

    if (!count || count === 0) return null;

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
