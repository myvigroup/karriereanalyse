// =====================================================
// /demo — Auto-Login als Demo-Berater
// =====================================================
// Ein Klick → eingeloggt als Demo-Berater → direkt im Berater-Dashboard.
//
// Flow:
//   1. Demo-Berater wird sichergestellt (idempotent)
//   2. Beim ersten Aufruf werden Demo-Daten automatisch geseeded
//   3. signInWithPassword setzt Session-Cookies
//   4. Redirect zum Berater-Dashboard
//
// Sicher: Passwort kommt aus Vercel-Env-Var DEMO_PASSWORD, nicht aus dem Code.

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  ensureDemoAdvisor,
  seedDemoData,
} from '@/lib/demo';

export async function GET(request) {
  try {
    // 1) Demo-Account sicherstellen
    const { advisorId } = await ensureDemoAdvisor();

    // 2) Beim ersten Mal: Demo-Daten seeden
    const admin = createAdminClient();
    // fair_leads hat advisor_user_id (kein advisor_id)
    const { data: adv } = await admin
      .from('advisors').select('user_id').eq('id', advisorId).maybeSingle();
    const { count } = await admin
      .from('fair_leads')
      .select('id', { count: 'exact', head: true })
      .eq('advisor_user_id', adv?.user_id || '');
    if (!count || count === 0) {
      await seedDemoData();
    }

    // 3) Auto-Login
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });

    if (signInError) {
      return NextResponse.json(
        {
          error: 'Demo-Login fehlgeschlagen',
          details: signInError.message,
          hint: 'Prüfe, ob die Vercel Environment Variable DEMO_PASSWORD gesetzt ist.',
        },
        { status: 500 }
      );
    }

    // 4) Redirect zum Berater-Dashboard
    return NextResponse.redirect(new URL('/advisor', request.url));
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Demo-Setup fehlgeschlagen',
        details: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
