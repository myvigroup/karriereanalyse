export async function createAutoNotifications(supabase, userId, context = {}) {
  const notifications = [];
  const now = new Date();

  // Bewerbung > 7 Tage ohne Update
  if (context.applications) {
    const stale = context.applications.filter(a => {
      if (a.status !== 'applied') return false;
      const days = Math.floor((now - new Date(a.updated_at || a.created_at)) / 86400000);
      return days > 7;
    });
    for (const app of stale) {
      notifications.push({
        user_id: userId,
        title: `Follow-up: ${app.company_name}`,
        content: 'Seit 7+ Tagen ohne R\u00FCckmeldung. Zeit f\u00FCr ein Follow-up!',
        type: 'reminder',
        link: '/applications',
      });
    }
  }

  // Streak gebrochen
  if (context.profile?.streak_count === 0 && context.profile?.last_streak_date) {
    notifications.push({
      user_id: userId,
      title: 'Streak unterbrochen',
      content: 'Deine Login-Serie wurde unterbrochen. Starte heute eine neue!',
      type: 'streak',
      link: '/dashboard',
    });
  }

  // Kontakt > 30 Tage nicht gesprochen
  if (context.contacts) {
    const cold = context.contacts.filter(c => {
      if (!c.last_contacted_at) return false;
      const days = Math.floor((now - new Date(c.last_contacted_at)) / 86400000);
      return days > 30;
    });
    if (cold.length > 0) {
      notifications.push({
        user_id: userId,
        title: `${cold.length} Kontakt${cold.length > 1 ? 'e' : ''} warten auf dich`,
        content: `${cold[0].name} und andere wurden l\u00E4nger nicht kontaktiert.`,
        type: 'reminder',
        link: '/network',
      });
    }
  }

  // Burnout-Score > 18
  if (context.burnoutScore && context.burnoutScore > 18) {
    notifications.push({
      user_id: userId,
      title: 'Burnout-Warnung',
      content: 'Dein Burnout-Score ist erh\u00F6ht. Sprich mit deinem Coach.',
      type: 'coaching_impulse',
      link: '/coach',
    });
  }

  // Level-Up
  if (context.levelUp && context.newLevel) {
    notifications.push({
      user_id: userId,
      title: `Level Up: ${context.newLevel.name}!`,
      content: `Du hast Level ${context.newLevel.level} erreicht. Weiter so!`,
      type: 'achievement',
      link: '/career',
    });
  }

  // Insert notifications (avoid duplicates by checking recent)
  for (const notif of notifications) {
    const { data: existing } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('title', notif.title)
      .gte('created_at', new Date(Date.now() - 86400000).toISOString())
      .limit(1);

    if (!existing || existing.length === 0) {
      await supabase.from('notifications').insert(notif);
    }
  }

  return notifications.length;
}

export function showToast(message, type = 'info') {
  if (typeof window === 'undefined') return;
  const toast = document.createElement('div');
  toast.textContent = message;
  const colors = { success: 'var(--ki-success)', error: 'var(--ki-red)', info: 'var(--ki-charcoal)', warning: 'var(--ki-warning)' };
  Object.assign(toast.style, {
    position: 'fixed', bottom: '80px', right: '24px', zIndex: '10000',
    padding: '12px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '500',
    color: 'white', background: colors[type] || colors.info,
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    animation: 'fadeIn 0.3s ease, fadeIn 0.3s ease 2.5s reverse forwards',
    fontFamily: 'Instrument Sans, sans-serif',
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
