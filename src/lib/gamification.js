export const POINT_ACTIONS = {
  COMPLETE_LESSON: 50,
  COMPLETE_QUIZ: 100,
  FIRST_ANALYSIS: 200,
  ADD_APPLICATION: 30,
  WIN_LOGGED: 40,
  DAILY_LOGIN: 10,
  STREAK_3: 50,
  STREAK_7: 150,
  STREAK_30: 500,
  CONTACT_ADDED: 20,
  DOCUMENT_UPLOADED: 30,
  INTERVIEW_BRIEFING: 75,
  EXIT_PLAN_COMPLETE: 200,
  VALUE_ASSESSMENT: 150,
  COACH_SESSION: 20,
};

export const LEVELS = [
  { level: 1, name: 'Einsteiger', minXP: 0, icon: '\u{1F331}' },
  { level: 2, name: 'Entdecker', minXP: 200, icon: '\u{1F50D}' },
  { level: 3, name: 'Aufsteiger', minXP: 500, icon: '\u{1F4C8}' },
  { level: 4, name: 'Stratege', minXP: 1200, icon: '\u{1F9E0}' },
  { level: 5, name: 'Leader', minXP: 2500, icon: '\u{1F451}' },
  { level: 6, name: 'Executive', minXP: 5000, icon: '\u{1F3C6}' },
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

export async function awardPoints(supabase, userId, action) {
  const points = POINT_ACTIONS[action];
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

export async function checkStreak(supabase, userId) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('streak_count, last_streak_date, total_points')
    .eq('id', userId)
    .single();

  if (!profile) return { streak: 0 };

  const today = new Date().toISOString().split('T')[0];
  if (profile.last_streak_date === today) {
    return { streak: profile.streak_count, alreadyCounted: true };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak;
  if (profile.last_streak_date === yesterday) {
    newStreak = (profile.streak_count || 0) + 1;
  } else {
    newStreak = 1;
  }

  let bonusPoints = POINT_ACTIONS.DAILY_LOGIN;
  if (newStreak === 3) bonusPoints += POINT_ACTIONS.STREAK_3;
  if (newStreak === 7) bonusPoints += POINT_ACTIONS.STREAK_7;
  if (newStreak === 30) bonusPoints += POINT_ACTIONS.STREAK_30;

  const newTotal = (profile.total_points || 0) + bonusPoints;

  await supabase
    .from('profiles')
    .update({
      streak_count: newStreak,
      last_streak_date: today,
      total_points: newTotal,
    })
    .eq('id', userId);

  return { streak: newStreak, bonus: bonusPoints, totalXP: newTotal };
}
