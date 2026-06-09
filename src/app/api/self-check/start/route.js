import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const admin = createAdminClient();

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 }); }

  const { fairId, name, email, targetPosition } = body;
  if (!name?.trim()) return NextResponse.json({ error: 'Name ist erforderlich' }, { status: 400 });
  if (!email?.trim()) return NextResponse.json({ error: 'E-Mail ist erforderlich' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return NextResponse.json({ error: 'Ungültige E-Mail-Adresse' }, { status: 400 });

  // When no fair specified, auto-assign to the one fair active today (if unambiguous)
  let resolvedFairId = fairId || null;
  if (!resolvedFairId) {
    const today = new Date().toISOString().split('T')[0];
    const { data: activeFairs } = await admin
      .from('fairs')
      .select('id')
      .lte('start_date', today)
      .or(`end_date.gte.${today},status.eq.active`)
      .limit(2);
    if (activeFairs?.length === 1) resolvedFairId = activeFairs[0].id;
  }

  const { data, error } = await admin.from('self_service_checks').insert({
    fair_id: resolvedFairId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    target_position: targetPosition?.trim() || null,
    status: 'pending',
  }).select('id, result_token').single();

  if (error) { console.error('self-check/start error:', error); return NextResponse.json({ error: error.message }, { status: 500 }); }
  return NextResponse.json({ checkId: data.id, token: data.result_token });
}
