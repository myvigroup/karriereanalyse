const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.daskarriereinstitut.de';

function layout(content, unsubscribeToken) {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f5f5f7;color:#1d1d1f">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <div style="text-align:center;margin-bottom:32px">
      <span style="font-size:11px;font-weight:700;letter-spacing:2px;color:#CC1426;text-transform:uppercase">KARRIERE-INSTITUT</span>
    </div>
    <div style="background:white;border-radius:16px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
      ${content}
    </div>
    <div style="text-align:center;margin-top:24px;font-size:12px;color:#86868b">
      <p>\u00A9 2026 - Das Karriere-Institut | +49 511 5468 4547</p>
      <p>info@daskarriereinstitut.de</p>
      ${unsubscribeToken ? `<p style="margin-top:12px"><a href="${APP_URL}/unsubscribe/${unsubscribeToken}" style="color:#86868b;text-decoration:underline">E-Mails abbestellen</a></p>` : ''}
    </div>
  </div>
</body>
</html>`;
}

function btn(text, url) {
  return `<a href="${url}" style="display:inline-block;padding:12px 28px;background:#CC1426;color:white;border-radius:980px;text-decoration:none;font-weight:600;font-size:15px;margin-top:16px">${text}</a>`;
}

export const TEMPLATES = {
  welcome: (name, token) => ({
    subject: 'Willkommen beim Karriere-Institut!',
    html: layout(`
      <h2 style="font-size:22px;font-weight:700;margin:0 0 12px">Willkommen, ${name}! \u{1F389}</h2>
      <p style="color:#86868b;line-height:1.6">Schön, dass du da bist. Dein Karriere-Betriebssystem ist bereit.</p>
      <p style="color:#86868b;line-height:1.6">Starte am besten mit der <strong>Karriereanalyse</strong> â sie ist die Basis für alles Weitere.</p>
      ${btn('Karriereanalyse starten', `${APP_URL}/analyse`)}
    `, token),
  }),

  onboarding_incomplete: (name, token) => ({
    subject: 'Du bist fast da! \u{1F3AF}',
    html: layout(`
      <h2 style="font-size:22px;font-weight:700;margin:0 0 12px">Hey ${name}, du bist fast da!</h2>
      <p style="color:#86868b;line-height:1.6">Du hast dein Onboarding noch nicht abgeschlossen. Es dauert nur 2 Minuten!</p>
      ${btn('Jetzt abschließen', `${APP_URL}/onboarding`)}
    `, token),
  }),

  weekly_digest: (name, stats, token) => ({
    subject: `Dein Wochen-Update \u{1F4CA}`,
    html: layout(`
      <h2 style="font-size:22px;font-weight:700;margin:0 0 12px">Dein Wochen-Update, ${name}</h2>
      <div style="display:flex;gap:16px;margin:20px 0">
        <div style="flex:1;text-align:center;padding:16px;background:#f5f5f7;border-radius:12px">
          <div style="font-size:24px;font-weight:700">${stats.streak || 0}</div>
          <div style="font-size:12px;color:#86868b">Tage Streak</div>
        </div>
        <div style="flex:1;text-align:center;padding:16px;background:#f5f5f7;border-radius:12px">
          <div style="font-size:24px;font-weight:700">${stats.xp || 0}</div>
          <div style="font-size:12px;color:#86868b">XP gesamt</div>
        </div>
        <div style="flex:1;text-align:center;padding:16px;background:#f5f5f7;border-radius:12px">
          <div style="font-size:24px;font-weight:700">${stats.wins || 0}</div>
          <div style="font-size:12px;color:#86868b">Wins</div>
        </div>
      </div>
      ${stats.recommendation ? `<p style="color:#86868b;line-height:1.6"><strong>Empfehlung:</strong> ${stats.recommendation}</p>` : ''}
      ${btn('Zum Dashboard', `${APP_URL}/dashboard`)}
    `, token),
  }),

  streak_broken: (name, token) => ({
    subject: 'Dein \u{1F525} Streak ist erloschen',
    html: layout(`
      <h2 style="font-size:22px;font-weight:700;margin:0 0 12px">Dein Streak ist erloschen \u{1F525}</h2>
      <p style="color:#86868b;line-height:1.6">Hey ${name}, dein Login-Streak wurde unterbrochen. Aber keine Sorge â starte heute eine neue Serie!</p>
      ${btn('Streak neu starten', `${APP_URL}/dashboard`)}
    `, token),
  }),

  inactive_7d: (name, token) => ({
    subject: 'Wir vermissen dich! \u{1F44B}',
    html: layout(`
      <h2 style="font-size:22px;font-weight:700;margin:0 0 12px">Hey ${name}, wir vermissen dich!</h2>
      <p style="color:#86868b;line-height:1.6">Dein Coach wartet auf dich. Schon 5 Minuten am Tag machen einen Unterschied.</p>
      ${btn('Zurückkommen', `${APP_URL}/dashboard`)}
    `, token),
  }),

  inactive_30d: (name, token) => ({
    subject: 'Dein Marktwert könnte sich verändert haben',
    html: layout(`
      <h2 style="font-size:22px;font-weight:700;margin:0 0 12px">Hallo ${name},</h2>
      <p style="color:#86868b;line-height:1.6">Es ist einen Monat her seit deinem letzten Login. In der Zwischenzeit könnte sich dein Marktwert verändert haben.</p>
      ${btn('Marktwert prüfen', `${APP_URL}/marktwert`)}
    `, token),
  }),

  level_up: (name, level, token) => ({
    subject: `Glückwunsch! Du bist jetzt ${level.name} ${level.icon}`,
    html: layout(`
      <div style="text-align:center">
        <div style="font-size:64px;margin-bottom:12px">${level.icon}</div>
        <h2 style="font-size:22px;font-weight:700;margin:0 0 8px">Level Up!</h2>
        <p style="font-size:18px;font-weight:600;color:#CC1426">Level ${level.level}: ${level.name}</p>
        <p style="color:#86868b;line-height:1.6;margin-top:12px">Glückwunsch, ${name}! Du hast ${level.minXP} XP erreicht.</p>
        ${btn('Weiter wachsen', `${APP_URL}/career`)}
      </div>
    `, token),
  }),

  application_reminder: (name, company, token) => ({
    subject: `Follow-up: ${company} wartet auf dich`,
    html: layout(`
      <h2 style="font-size:22px;font-weight:700;margin:0 0 12px">Follow-up fällig \u2709\uFE0F</h2>
      <p style="color:#86868b;line-height:1.6">Hey ${name}, deine Bewerbung bei <strong>${company}</strong> ist seit 14+ Tagen ohne Update. Zeit für ein Follow-up!</p>
      ${btn('Bewerbungen ansehen', `${APP_URL}/applications`)}
    `, token),
  }),

  trial_ending: (name, daysLeft, token) => ({
    subject: 'Deine Testphase endet bald \u23F0',
    html: layout(`
      <h2 style="font-size:22px;font-weight:700;margin:0 0 12px">Deine Testphase endet in ${daysLeft} Tagen</h2>
      <p style="color:#86868b;line-height:1.6">Hey ${name}, dein kostenloser Masterclass-Zugang läuft bald ab. Sichere dir weiterhin Zugang zu allen Kursen.</p>
      ${btn('Abo aktivieren', `${APP_URL}/angebote`)}
    `, token),
  }),

  payment_failed: (name, token) => ({
    subject: 'Bitte aktualisiere deine Zahlungsdaten',
    html: layout(`
      <h2 style="font-size:22px;font-weight:700;margin:0 0 12px">Zahlung fehlgeschlagen \u26A0\uFE0F</h2>
      <p style="color:#86868b;line-height:1.6">Hey ${name}, deine letzte Zahlung konnte nicht verarbeitet werden. Bitte aktualisiere deine Zahlungsdaten, damit dein Zugang erhalten bleibt.</p>
      ${btn('Zahlungsdaten aktualisieren', `${APP_URL}/profile`)}
    `, token),
  }),

  subscription_canceled: (name, endDate, token) => ({
    subject: 'Schade! Dein Zugang läuft bald aus',
    html: layout(`
      <h2 style="font-size:22px;font-weight:700;margin:0 0 12px">Dein Abo wurde gekündigt</h2>
      <p style="color:#86868b;line-height:1.6">Hey ${name}, dein Zugang läuft am <strong>${endDate}</strong> aus. Deine Daten bleiben erhalten â du kannst jederzeit reaktivieren.</p>
      ${btn('Abo reaktivieren', `${APP_URL}/angebote`)}
    `, token),
  }),

  coaching_booked: (name, calendlyUrl, token) => ({
    subject: 'Dein Coaching-Termin ist bestätigt \u{1F91D}',
    html: layout(`
      <h2 style="font-size:22px;font-weight:700;margin:0 0 12px">Coaching gebucht! \u{1F389}</h2>
      <p style="color:#86868b;line-height:1.6">Hey ${name}, dein Privat-Coaching ist bestätigt. Buche jetzt deinen Wunschtermin:</p>
      ${btn('Termin buchen', calendlyUrl || `${APP_URL}/dashboard`)}
      <p style="color:#86868b;font-size:13px;margin-top:16px">Tipp: Bereite 2-3 konkrete Fragen vor, die du im Coaching besprechen möchtest.</p>
    `, token),
  }),
};

export function getTemplate(templateKey, ...args) {
  const fn = TEMPLATES[templateKey];
  if (!fn) return null;
  return fn(...args);
}
