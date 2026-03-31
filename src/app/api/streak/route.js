import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { updateStreak, completeMission } from '@/lib/services/streak-service';

// POST /api/streak — Streak aktualisieren + Mission abschließen
export async function POST(req) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });

  const body = await req.json();
  const { action, missionType } = body;

  try {
    // Streak zählen
    const streakResult = await updateStreak(supabase, user.id);

    // Mission abschließen (optional)
    let missionResult = null;
    if (missionType) {
      missionResult = await completeMission(supabase, user.id, missionType);
    }

    return NextResponse.json({
      streak: streakResult,
      mission: missionResult,
    });
  } catch (error) {
    console.error('Streak update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/streak — Streak-Status abrufen
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });

  try {
    const { getStreakStatus } = await import('@/lib/services/streak-service');
    const status = await getStreakStatus(supabase, user.id);
    return NextResponse.json(status);
  } catch (error) {
    console.error('Streak status error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
