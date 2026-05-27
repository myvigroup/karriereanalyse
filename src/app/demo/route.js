// =====================================================
// /demo — Bequemer Einstiegspunkt für den Berater-Bereich
// =====================================================
// Da die Demo jetzt auf dem persönlichen Admin-Account von Louis Jacob läuft
// (l.jacob@myvi.de), gibt es kein generisches Auto-Login mehr. Diese Route
// leitet einfach zum Berater-Dashboard weiter — wenn der User nicht eingeloggt
// ist, übernimmt die Middleware den Login-Redirect.
//
// Die eigentliche Demo-Verwaltung (Setup, Reset, Wipe) läuft über /admin/demo.

import { NextResponse } from 'next/server';

export async function GET(request) {
  return NextResponse.redirect(new URL('/advisor', request.url));
}
