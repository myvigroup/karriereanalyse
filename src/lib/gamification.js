// src/lib/gamification.js
// ══════════════════════════════════════════════════
// XP-System — Balanciert & Realistisch
// ══════════════════════════════════════════════════
//
// DESIGN-PRINZIPIEN:
// 1. Eine Lektion = Basis-Einheit (30 XP)
// 2. Übungen = höherer Aufwand → 40 XP
// 3. Quiz = Wissens-Check → 50 XP
// 4. Kurs-Abschluss = großes Ziel → 150 XP
// 5. Analyse = einmaliger Meilenstein → 100 XP
// 6. Schwächen-Kurse = 2x Multiplikator (aus personalization.js)
// 7. Streaks belohnen Konsistenz, nicht Glück
//
// REALISMUS-CHECK (für einen aktiven User):
// - 1 Lektion/Tag = ~30 XP/Tag (normal) oder ~60 XP/Tag (Schwäche)
// - 1 Kurs (12 Module, ~36 Lektionen) = ~1.080 XP normal, ~2.160 XP Schwäche
// - 6 Kurse komplett = ~6.480 bis ~12.960 XP + Boni
// - Level 6 (5.000 XP) = erreichbar nach ~3-4 abgeschlossenen Kursen
// ══════════════════════════════════════════════════

export const POINT_ACTIONS = {
  // ── Kern-Aktivitäten ──
  COMPLETE_LESSON:      30,   // Standard-Lektion (Video, Text, etc.)
  COMPLETE_EXERCISE:    40,   // Interaktive Übung (Drag-Drop, Szenario, etc.)
  COMPLETE_QUIZ:        50,   // Modul-Quiz bestanden
  COMPLETE_BOSS_FIGHT:  60,   // Boss-Fight Szenario gemeistert
  COMPLETE_COURSE:     150,   // Ganzen Kurs abgeschlossen (6 Kurse insgesamt)
  COMPLETE_ABSCHLUSS:  100,   // Abschlusstest eines Kurses

  // ── Analyse & Profil ──
  FIRST_ANALYSIS:      100,   // Erste Karriere-Analyse abgeschlossen
  VALUE_ASSESSMENT:     75,   // Marktwert-Assessment durchgeführt

  // ── Alltägliche Aktionen ──
  ADD_APPLICATION:      15,   // Bewerbung hinzugefügt
  WIN_LOGGED:           20,   // Erfolg dokumentiert
  CONTACT_ADDED:        10,   // Netzwerk-Kontakt hinzugefügt
  DOCUMENT_UPLOADED:    15,   // Dokument hochgeladen
  COACH_SESSION:        20,   // Coach-Frage gestellt
  INTERVIEW_BRIEFING:   40,   // Interview-Vorbereitung abgeschlossen
  EXIT_PLAN_COMPLETE:  100,   // Exit-Strategie erstellt

  // ── Streaks (tägliche Konsistenz) ──
  DAILY_LOGIN:          10,   // Täglicher Login
  STREAK_3:             20,   // 3-Tage Streak
  STREAK_7:             50,   // 7-Tage Streak (+ Freeze-Token)
  STREAK_14:           100,   // 14-Tage Streak
  STREAK_30:           200,   // 30-Tage Streak (ein Monat!)

  // ── Journal & Reflexion ──
  JOURNAL_ENTRY:        15,   // Journal-Eintrag geschrieben
};

// ══════════════════════════════════════════════════
// LEVEL-SYSTEM
// ══════════════════════════════════════════════════
// Progression: Realistische Stufen basierend auf Aktivität
//
// Level 1 → 2:   200 XP  ≈ 1-2 Tage aktiv (7 Lektionen)
// Level 2 → 3:   500 XP  ≈ 1 Woche (Analyse + 10 Lektionen)
// Level 3 → 4: 1.200 XP  ≈ 2-3 Wochen (1 Kurs fast fertig)
// Level 4 → 5: 2.500 XP  ≈ 1-2 Monate (2 Kurse + Streaks)
// Level 5 → 6: 5.000 XP  ≈ 3-4 Monate (3-4 Kurse + Extras)

export const LEVELS = [
  { level: 1, name: 'Einsteiger',  minXP:     0, icon: '🌱' },
  { level: 2, name: 'Entdecker',   minXP:   200, icon: '🔍' },
  { level: 3, name: 'Aufsteiger',  minXP:   500, icon: '📈' },
  { level: 4, name: 'Stratege',    minXP: 1200, icon: '🧠' },
  { level: 5, name: 'Leader',      minXP: 2500, icon: '👑' },
  { level: 6, name: 'Executive',   minXP: 5000, icon: '🏆' },
];

export function getLevel(xp) {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.minXP) current = lvl;
    else break;
  }
  return current;
}

export function getLevelProgress(xp) {
  const current = getLevel(xp);
  const nextLevel = LEVELS.find(l => l.minXP > current.minXP);
  if (!nextLevel) return { current, next: null, progress: 100 };
  const range = nextLevel.minXP - current.minXP;
  const done = xp - current.minXP;
  return { current, next: nextLevel, progress: Math.round((done / range) * 100) };
}

// ══════════════════════════════════════════════════
// XP VERGABE (zentral, verhindert Dopplung)
// ══════════════════════════════════════════════════

export async function awardPoints(supabase, userId, action, customPoints) {
  const points = customPoints || POINT_ACTIONS[action];
  if (!points) return { awarded: 0, levelUp: false };

  const { data: profile } = await supabase
    .from('profiles')
    .select('total_points')
    .eq('id', userId)
    .single();

  const oldXP = profile?.total_points || 0;
  const newXP = oldXP + points;
  const oldLevel = getLevel(oldXP);
  const newLevel = getLevel(newXP);

  await supabase
    .from('profiles')
    .update({ total_points: newXP })
    .eq('id', userId);

  return {
    awarded: points,
    totalXP: newXP,
    levelUp: newLevel.level > oldLevel.level,
    newLevel: newLevel.level > oldLevel.level ? newLevel : null,
  };
}

// ══════════════════════════════════════════════════
// STREAK-SYSTEM
// ══════════════════════════════════════════════════

export async function checkStreak(supabase, userId) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('streak_count, last_streak_date, total_points, streak_freezes')
    .eq('id', userId)
    .single();

  if (!profile) return { streak: 0 };

  const today = new Date().toISOString().split('T')[0];
  if (profile.last_streak_date === today) {
    return { streak: profile.streak_count, alreadyCounted: true, freezes: profile.streak_freezes || 0 };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak;
  let freezeUsed = false;
  let newFreezes = profile.streak_freezes || 0;

  if (profile.last_streak_date === yesterday) {
    newStreak = (profile.streak_count || 0) + 1;
  } else if (newFreezes > 0 && profile.streak_count > 0) {
    newStreak = (profile.streak_count || 0) + 1;
    newFreezes -= 1;
    freezeUsed = true;
  } else {
    newStreak = 1;
  }

  let bonusPoints = POINT_ACTIONS.DAILY_LOGIN;
  if (newStreak === 3)  bonusPoints += POINT_ACTIONS.STREAK_3;
  if (newStreak === 7) {
    bonusPoints += POINT_ACTIONS.STREAK_7;
    newFreezes = Math.min(newFreezes + 1, 3);
  }
  if (newStreak === 14) bonusPoints += POINT_ACTIONS.STREAK_14;
  if (newStreak === 30) bonusPoints += POINT_ACTIONS.STREAK_30;

  const newTotal = (profile.total_points || 0) + bonusPoints;

  await supabase
    .from('profiles')
    .update({
      streak_count: newStreak,
      last_streak_date: today,
      total_points: newTotal,
      streak_freezes: newFreezes,
    })
    .eq('id', userId);

  return { streak: newStreak, bonus: bonusPoints, totalXP: newTotal, freezeUsed, freezes: newFreezes };
}
