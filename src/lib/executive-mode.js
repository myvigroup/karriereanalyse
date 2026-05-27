export function isExecutive(profile) {
  return profile?.target_salary >= 100000;
}

export function getText(profile, standard, executive) {
  return isExecutive(profile) ? executive : standard;
}

export function getGreeting(profile) {
  const hour = new Date().getHours();
  const name = profile?.first_name || profile?.name || '';
  const timeGreeting = hour < 12 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend';

  if (isExecutive(profile)) {
    return `${timeGreeting}, ${name}. Bereit für strategische Entscheidungen?`;
  }
  return `${timeGreeting}, ${name}`;
}
