// =====================================================
// /demo — Magic-Login für Bühnen-Demo
// =====================================================
// Ruft man /demo auf, passiert folgendes (alles serverseitig):
//   1. Demo-Berater wird sichergestellt (idempotent)
//   2. Falls noch keine Demo-Daten vorhanden: einmaliges Seed
//   3. Auto-Login via signInWithPassword (setzt Session-Cookies)
//   4. Redirect zum Berater-Dashboard
//
// Funktioniert auch für nicht-Admins — Demo-Account ist absichtlich öffentlich.
// Mitarbeiter können denselben Link nach der Präsi nutzen, um es selbst auszuprobieren.

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

    // 2) Demo-Daten seeden falls leer
    const admin = createAdminClient();
    const { count } = await admin
      .from('fair_leads')
      .select('id', { count: 'exact', head: true })
      .eq('advisor_id', advisorId);
    if (!count || count === 0) {
      await seedDemoData();
    }

    // 3) Auto-Login (setzt Session-Cookies via createServerClient)
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });

    if (signInError) {
      return NextResponse.json(
        { error: `Demo-Login fehlgeschlagen: ${signInError.message}` },
        { status: 500 }
      );
    }

    // 4) Redirect zum Berater-Dashboard
    const url = new URL('/advisor', request.url);
    return NextResponse.redirect(url);
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
