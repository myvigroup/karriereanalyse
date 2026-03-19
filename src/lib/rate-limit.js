const LIMITS = {
  'coach-chat': { max: 20, windowMs: 60 * 60 * 1000 },
  'analyze-cv': { max: 5, windowMs: 60 * 60 * 1000 },
  'linkedin-optimize': { max: 10, windowMs: 60 * 60 * 1000 },
  'generate-application': { max: 10, windowMs: 60 * 60 * 1000 },
  'zeugnis-decode': { max: 5, windowMs: 60 * 60 * 1000 },
};

export async function checkRateLimit(supabase, userId, endpoint) {
  const config = LIMITS[endpoint];
  if (!config) return { allowed: true, remaining: 999 };

  const windowStart = new Date(Date.now() - config.windowMs).toISOString();

  const { count } = await supabase
    .from('rate_limit_log')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .gte('created_at', windowStart);

  const used = count || 0;
  const remaining = Math.max(0, config.max - used);
  const allowed = used < config.max;

  if (allowed) {
    await supabase.from('rate_limit_log').insert({
      user_id: userId,
      endpoint,
    });
  }

  return {
    allowed,
    remaining: remaining - (allowed ? 1 : 0),
    resetAt: new Date(Date.now() + config.windowMs).toISOString(),
    limit: config.max,
  };
}
