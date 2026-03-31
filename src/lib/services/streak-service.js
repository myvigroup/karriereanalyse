// src/lib/services/streak-service.js
// ══════════════════════════════════════════════════
// Daily Streak System — Karriere-Institut
// Tägliche Missionen, Streak-Logik, Meilensteine, Phoenix-Comeback
// ══════════════════════════════════════════════════

import { POINT_ACTIONS } from '@/lib/gamification';
import { berechnePersonalisierung, KURSE } from '@/lib/personalization';

// ── Meilenstein-Definitionen ──
const MILESTONES = [
  { days: 3,   label: 'Erster Schritt',     bonusXP: 50,   icon: '🏃' },
  { days: 7,   label: 'Eine Woche Fokus',   bonusXP: 100,  icon: '⭐' },
  { days: 14,  label: 'Karriere-Momentum',   bonusXP: 200,  icon: '🚀' },
  { days: 30,  label: 'Durchhalter',         bonusXP: 500,  icon: '🔥' },
  { days: 60,  label: 'Karriere-Maschine',   bonusXP: 1000, icon: '⚡' },
  { days: 100, label: 'Elite',               bonusXP: 2500, icon: '💎' },
  { days: 365, label: 'Legende',             bonusXP: 5000, icon: '🏆' },
];

// ── XP-Multiplikatoren basierend auf Streak ──
function getStreakMultiplier(streakDays) {
  if (streakDays >= 30) return 1.5;
  if (streakDays >= 7) return 1.2;
  return 1.0;
}

// ══════════════════════════════════════════════════
// TÄGLICHE MISSION GENERIEREN
// ══════════════════════════════════════════════════

const MISSION_TEMPLATES = {
  lesson: [
    { title: 'Lektion in „{kurs}" abschließen', description: 'Lerne etwas Neues in deinem empfohlenen Kurs', xp: 50 },
    { title: 'Nächste Lektion starten', description: 'Setze deinen Lernpfad fort', xp: 50 },
  ],
  reflection: [
    { title: 'Tagesreflexion schreiben', description: 'Was war dein größter Karriere-Moment heute?', xp: 25 },
    { title: 'Stärke des Tages notieren', description: 'Welche Stärke hat dir heute geholfen?', xp: 25 },
    { title: 'Karriereziel überdenken', description: 'Bist du noch auf dem richtigen Weg?', xp: 25 },
  ],
  coach: [
    { title: 'KI-Coach Gespräch führen', description: 'Stelle eine Karrierefrage an deinen KI-Coach', xp: 40 },
    { title: 'Vorstellungsgespräch simulieren', description: 'Übe mit dem KI-Coach für dein nächstes Interview', xp: 40 },
    { title: 'Gehaltsverhandlung üben', description: 'Simuliere eine Verhandlung mit dem KI-Coach', xp: 40 },
  ],
  quiz: [
    { title: 'Quiz bestehen', description: 'Teste dein Wissen in einem Modul-Quiz', xp: 35 },
  ],
  salary_search: [
    { title: 'Gehalt recherchieren', description: 'Finde heraus, was du wirklich wert bist', xp: 20 },
  ],
};

export async function generateDailyMission(supabase, userId, analysisResults, userPhase, progress, courses) {
  const today = new Date().toISOString().split('T')[0];

  // Bereits generiert?
  const { data: existing } = await supabase
    .from('daily_missions')
    .select('*')
    .eq('user_id', userId)
    .eq('mission_date', today);

  if (existing && existing.length > 0) return existing;

  const pers = berechnePersonalisierung(analysisResults, userPhase);
  const completedLessonIds = new Set((progress || []).filter(p => p.completed).map(p => p.lesson_id));

  // Finde nächste unbearbeitete Lektion im empfohlenen Kurs
  let targetCourse = null;
  let targetLesson = null;

  if (pers.empfohleneKurse.length > 0) {
    for (const kurs of pers.empfohleneKurse) {
      const course = (courses || []).find(c => c.id === kurs.kursId);
      if (!course) continue;
      for (const mod of (course.modules || [])) {
        for (const lesson of (mod.lessons || [])) {
          if (!completedLessonIds.has(lesson.id)) {
            targetCourse = course;
            targetLesson = lesson;
            break;
          }
        }
        if (targetLesson) break;
      }
      if (targetLesson) break;
    }
  }

  // Primäre Mission: Lektion im Wachstumsfeld (oder Fallback)
  const isWeaknessCourse = pers.empfohleneKurse[0]?.istSchwaeche;
  const kursTitle = targetCourse?.title || pers.empfohleneKurse[0]?.title || 'E-Learning';
  const multiplier = isWeaknessCourse ? 2.0 : 1.0;

  const primary = {
    user_id: userId,
    mission_date: today,
    mission_type: 'primary',
    title: targetLesson
      ? `Lektion in „${kursTitle}" abschließen`
      : 'Nächste Lektion abschließen',
    description: targetLesson
      ? `„${targetLesson.title}" — dein nächster Schritt`
      : 'Setze deinen personalisierten Lernpfad fort',
    action_type: 'lesson',
    target_course_id: targetCourse?.id || null,
    target_lesson_id: targetLesson?.id || null,
    xp_reward: 50,
    xp_multiplier: multiplier,
  };

  // Bonus-Missionen
  const bonusTypes = ['reflection', 'coach'];
  const bonus1Template = MISSION_TEMPLATES[bonusTypes[0]][Math.floor(Math.random() * MISSION_TEMPLATES[bonusTypes[0]].length)];
  const bonus2Template = MISSION_TEMPLATES[bonusTypes[1]][Math.floor(Math.random() * MISSION_TEMPLATES[bonusTypes[1]].length)];

  const missions = [
    primary,
    {
      user_id: userId,
      mission_date: today,
      mission_type: 'bonus_1',
      title: bonus1Template.title,
      description: bonus1Template.description,
      action_type: bonusTypes[0],
      xp_reward: bonus1Template.xp,
      xp_multiplier: 1.0,
    },
    {
      user_id: userId,
      mission_date: today,
      mission_type: 'bonus_2',
      title: bonus2Template.title,
      description: bonus2Template.description,
      action_type: bonusTypes[1],
      xp_reward: bonus2Template.xp,
      xp_multiplier: 1.0,
    },
  ];

  const { data, error } = await supabase
    .from('daily_missions')
    .upsert(missions, { onConflict: 'user_id,mission_date,mission_type' })
    .select();

  return data || missions;
}

// ══════════════════════════════════════════════════
// MISSION ABSCHLIESSEN
// ══════════════════════════════════════════════════

export async function completeMission(supabase, userId, missionType) {
  const today = new Date().toISOString().split('T')[0];

  const { data: mission } = await supabase
    .from('daily_missions')
    .select('*')
    .eq('user_id', userId)
    .eq('mission_date', today)
    .eq('mission_type', missionType)
    .single();

  if (!mission || mission.completed) return null;

  const xpEarned = Math.round(mission.xp_reward * mission.xp_multiplier);

  await supabase
    .from('daily_missions')
    .update({ completed: true, completed_at: new Date().toISOString() })
    .eq('id', mission.id);

  return { mission, xpEarned };
}

// ══════════════════════════════════════════════════
// STREAK AKTUALISIEREN (erweitert bestehende Logik)
// ══════════════════════════════════════════════════

export async function updateStreak(supabase, userId) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('streak_count, longest_streak, last_streak_date, total_points, streak_freezes, phoenix_mode, phoenix_expires_at')
    .eq('id', userId)
    .single();

  if (!profile) return null;

  const today = new Date().toISOString().split('T')[0];

  // Heute schon gezählt?
  if (profile.last_streak_date === today) {
    return {
      streak: profile.streak_count,
      alreadyCounted: true,
      milestone: null,
      phoenix: false,
    };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak;
  let freezeUsed = false;
  let newFreezes = profile.streak_freezes || 0;
  let phoenixActive = profile.phoenix_mode || false;

  if (profile.last_streak_date === yesterday) {
    // Konsekutiver Tag
    newStreak = (profile.streak_count || 0) + 1;
  } else if (newFreezes > 0 && profile.streak_count > 0) {
    // Freeze einsetzen
    newStreak = (profile.streak_count || 0) + 1;
    newFreezes -= 1;
    freezeUsed = true;
  } else {
    // Streak gebrochen — Phoenix-Check
    const daysSinceActive = profile.last_streak_date
      ? Math.floor((Date.now() - new Date(profile.last_streak_date).getTime()) / 86400000)
      : 999;

    if (daysSinceActive >= 10) {
      phoenixActive = true;
    }
    newStreak = 1;
  }

  // XP-Bonus berechnen
  let bonusXP = POINT_ACTIONS.DAILY_LOGIN; // 10 XP Basis
  const streakMultiplier = getStreakMultiplier(newStreak);

  // Phoenix-Bonus
  const phoenixMultiplier = phoenixActive && profile.phoenix_expires_at && new Date(profile.phoenix_expires_at) > new Date()
    ? 2.5
    : 1.0;

  bonusXP = Math.round(bonusXP * streakMultiplier * phoenixMultiplier);

  // Meilenstein-Check
  let milestone = null;
  const milestoneMatch = MILESTONES.find(m => m.days === newStreak);
  if (milestoneMatch) {
    // Prüfe ob schon erreicht
    const { data: existingMilestone } = await supabase
      .from('streak_milestones')
      .select('id')
      .eq('user_id', userId)
      .eq('milestone_days', milestoneMatch.days)
      .single();

    if (!existingMilestone) {
      await supabase.from('streak_milestones').insert({
        user_id: userId,
        milestone_days: milestoneMatch.days,
        bonus_xp_awarded: milestoneMatch.bonusXP,
      });
      bonusXP += milestoneMatch.bonusXP;
      milestone = milestoneMatch;

      // Streak-Freeze bei 7-Tage-Meilenstein
      if (milestoneMatch.days === 7) {
        newFreezes = Math.min(newFreezes + 1, 3);
      }
    }
  }

  const newLongest = Math.max(profile.longest_streak || 0, newStreak);
  const newTotal = (profile.total_points || 0) + bonusXP;

  // Phoenix-Mode setzen/resetten
  const phoenixExpires = phoenixActive && newStreak === 1
    ? new Date(Date.now() + 3 * 86400000).toISOString()
    : phoenixActive && newStreak >= 3
      ? null // Phoenix-Phase erfolgreich abgeschlossen
      : profile.phoenix_expires_at;

  await supabase
    .from('profiles')
    .update({
      streak_count: newStreak,
      longest_streak: newLongest,
      last_streak_date: today,
      last_activity_date: today,
      total_points: newTotal,
      streak_freezes: newFreezes,
      phoenix_mode: phoenixActive && newStreak < 3,
      phoenix_expires_at: phoenixExpires,
    })
    .eq('id', userId);

  // Activity Log
  await supabase.from('xp_log').insert({
    user_id: userId,
    amount: bonusXP,
    reason: milestone ? `Streak-Meilenstein: ${milestone.label} (${milestone.days} Tage)` : `Täglicher Streak: Tag ${newStreak}`,
    source_module: 'streak',
  });

  return {
    streak: newStreak,
    longestStreak: newLongest,
    bonusXP,
    totalXP: newTotal,
    freezeUsed,
    freezes: newFreezes,
    milestone,
    phoenix: phoenixActive,
    phoenixMultiplier: phoenixMultiplier > 1 ? phoenixMultiplier : null,
    streakMultiplier: streakMultiplier > 1 ? streakMultiplier : null,
  };
}

// ══════════════════════════════════════════════════
// STREAK-STATUS LADEN (für Dashboard)
// ══════════════════════════════════════════════════

export async function getStreakStatus(supabase, userId) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('streak_count, longest_streak, last_streak_date, streak_freezes, phoenix_mode, phoenix_expires_at, total_points')
    .eq('id', userId)
    .single();

  if (!profile) return null;

  const today = new Date().toISOString().split('T')[0];
  const isActiveToday = profile.last_streak_date === today;

  // Wochentags-Aktivität (Mo-So)
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Montag
  const weekStartStr = weekStart.toISOString().split('T')[0];

  const { data: weekActivity } = await supabase
    .from('activity_log')
    .select('created_at')
    .eq('user_id', userId)
    .gte('created_at', weekStartStr)
    .order('created_at');

  const activeDays = new Set(
    (weekActivity || []).map(a => new Date(a.created_at).toISOString().split('T')[0])
  );

  // Heutige Missionen
  const { data: todayMissions } = await supabase
    .from('daily_missions')
    .select('*')
    .eq('user_id', userId)
    .eq('mission_date', today);

  // Erreichte Meilensteine
  const { data: milestones } = await supabase
    .from('streak_milestones')
    .select('milestone_days, reached_at, bonus_xp_awarded')
    .eq('user_id', userId)
    .order('milestone_days');

  // Nächster Meilenstein
  const reachedDays = new Set((milestones || []).map(m => m.milestone_days));
  const nextMilestone = MILESTONES.find(m => !reachedDays.has(m.days) && m.days > (profile.streak_count || 0));

  // Streak-Gefahr?
  const now = new Date();
  const hoursLeft = 24 - now.getHours();
  const streakAtRisk = !isActiveToday && profile.streak_count > 0 && hoursLeft <= 6;

  return {
    currentStreak: profile.streak_count || 0,
    longestStreak: profile.longest_streak || 0,
    isActiveToday,
    freezesAvailable: profile.streak_freezes || 0,
    phoenixMode: profile.phoenix_mode || false,
    phoenixExpiresAt: profile.phoenix_expires_at,
    weekActivity: Array.from(activeDays),
    todayMissions: todayMissions || [],
    milestones: milestones || [],
    nextMilestone,
    streakAtRisk,
    hoursLeft,
  };
}

export { MILESTONES };
