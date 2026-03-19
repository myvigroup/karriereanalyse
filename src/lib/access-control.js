export function hasAccess(profile, feature) {
  const plan = profile?.subscription_plan || 'FREE';
  const purchased = profile?.purchased_products || [];

  const ACCESS_MAP = {
    analyse_full: purchased.includes('ANALYSE_STUDENT') || purchased.includes('ANALYSE_PRO') || plan !== 'FREE',
    masterclass_all: plan === 'MASTERCLASS' || plan === 'TEAM',
    coach_unlimited: plan !== 'FREE',
    linkedin_optimizer: plan !== 'FREE',
    zeugnis_decoder: plan !== 'FREE',
    bewerbung_generator: plan !== 'FREE',
    gehalt_export: plan !== 'FREE',
    community: plan !== 'FREE' || purchased.length > 0,
    report_pdf: purchased.includes('ANALYSE_STUDENT') || purchased.includes('ANALYSE_PRO'),
    coaching_session: purchased.includes('COACHING'),
    seminar: purchased.includes('SEMINAR'),
  };

  return ACCESS_MAP[feature] || false;
}

export const FREE_LIMITS = {
  coach_messages_per_day: 3,
  applications_total: 3,
  analyses_total: 1,
  courses_total: 1,
};

export function getRemainingUsage(profile, feature, currentUsage) {
  if (hasAccess(profile, feature)) return Infinity;
  const limit = FREE_LIMITS[feature];
  if (!limit) return 0;
  return Math.max(0, limit - currentUsage);
}
