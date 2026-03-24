import { createClient } from '@/lib/supabase/client';

/**
 * Lädt alle relevanten Daten für das Master-Dashboard.
 * Profil, Vault, Streak, Achievements.
 */
export async function getDashboardData(userId) {
  const supabase = createClient();

  // 1. Profil-Daten
  const { data: profile } = await supabase
    .from('profiles')
    .select('phase, total_points, wpm_current, wpm_start, marktwert_xp, full_name')
    .eq('id', userId)
    .single()
    .catch(() => ({ data: null }));

  // 2. Neueste 5 Vault-Einträge
  const { data: vaultEntries } = await supabase
    .from('user_vault')
    .select('id, source_module, entry_type, title, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)
    .catch(() => ({ data: [] }));

  // 3. XP-Log für Streak-Berechnung
  const { data: xpLog } = await supabase
    .from('xp_log')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100)
    .catch(() => ({ data: [] }));

  // 4. Unlocked Achievements
  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_id, unlocked_at, achievements(slug, title, icon, xp_reward)')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false })
    .catch(() => ({ data: [] }));

  return {
    xp: profile?.total_points || 0,
    marktwert: profile?.marktwert_xp || 0,
    phase: profile?.phase || 'einsteiger',
    wpm: profile?.wpm_current || 0,
    wpmStart: profile?.wpm_start || 0,
    name: profile?.full_name || '',
    vault: vaultEntries || [],
    achievements: userAchievements || [],
    streak: calculateStreak(xpLog),
  };
}

/**
 * Speichert einen Eintrag in der Vault (Schatzkammer).
 */
export async function saveToVault(userId, { sourceModule, entryType, title, content, tags }) {
  const supabase = createClient();
  return supabase.from('user_vault').insert({
    user_id: userId,
    source_module: sourceModule,
    entry_type: entryType,
    title,
    content,
    tags: tags || [],
  });
}

/**
 * Loggt XP-Gewinn und updated das Profil.
 */
export async function logXP(userId, amount, reason, sourceModule) {
  const supabase = createClient();

  // Log schreiben
  await supabase.from('xp_log').insert({
    user_id: userId,
    amount,
    reason,
    source_module: sourceModule,
  }).catch(() => {});

  // Profil updaten
  const { data: profile } = await supabase
    .from('profiles')
    .select('total_points, marktwert_xp')
    .eq('id', userId)
    .single()
    .catch(() => ({ data: null }));

  if (profile) {
    await supabase.from('profiles').update({
      total_points: (profile.total_points || 0) + amount,
      marktwert_xp: (profile.marktwert_xp || 0) + Math.round(amount * 0.3),
    }).eq('id', userId);
  }
}

/**
 * Prüft und vergibt ein Achievement.
 */
export async function checkAndAwardAchievement(userId, achievementSlug) {
  const supabase = createClient();

  // Achievement-ID holen
  const { data: achievement } = await supabase
    .from('achievements')
    .select('id, xp_reward')
    .eq('slug', achievementSlug)
    .single()
    .catch(() => ({ data: null }));

  if (!achievement) return false;

  // Prüfen ob bereits unlocked
  const { data: existing } = await supabase
    .from('user_achievements')
    .select('id')
    .eq('user_id', userId)
    .eq('achievement_id', achievement.id)
    .maybeSingle()
    .catch(() => ({ data: null }));

  if (existing) return false;

  // Achievement vergeben
  await supabase.from('user_achievements').insert({
    user_id: userId,
    achievement_id: achievement.id,
  });

  // XP vergeben
  if (achievement.xp_reward > 0) {
    await logXP(userId, achievement.xp_reward, `Achievement: ${achievementSlug}`, 'achievements');
  }

  return true;
}

/**
 * Leaderboard: Top N User nach Marktwert-XP
 */
export async function getLeaderboard(limit = 20) {
  const supabase = createClient();

  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, phase, marktwert_xp, total_points')
    .order('marktwert_xp', { ascending: false })
    .limit(limit)
    .catch(() => ({ data: [] }));

  return (data || []).map((u, i) => ({
    ...u,
    rank: i + 1,
    initials: (u.full_name || '??').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
  }));
}

// --- Hilfsfunktionen ---

function calculateStreak(xpLog) {
  if (!xpLog || xpLog.length === 0) return 0;

  const days = new Set();
  xpLog.forEach(entry => {
    if (entry.created_at) {
      days.add(new Date(entry.created_at).toISOString().split('T')[0]);
    }
  });

  const sortedDays = [...days].sort().reverse();
  if (sortedDays.length === 0) return 0;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Streak zählt nur wenn heute oder gestern aktiv
  if (sortedDays[0] !== today && sortedDays[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 0; i < sortedDays.length - 1; i++) {
    const curr = new Date(sortedDays[i]);
    const prev = new Date(sortedDays[i + 1]);
    const diffDays = (curr - prev) / 86400000;
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
