export function getRecommendations(profile, analysisSession, lessonsCompleted, documents, applications) {
  const recs = [];

  // No analysis → top priority
  if (!analysisSession) {
    recs.push({
      icon: '\u25CE',
      title: 'Starte mit dem Karriere-Blutbild',
      description: 'Die Analyse ist die Basis f\u00FCr alle Empfehlungen.',
      link: '/analyse',
      priority: 10,
    });
  }

  // Analysis done, no courses
  if (analysisSession && (lessonsCompleted || 0) === 0) {
    recs.push({
      icon: '\u25B6',
      title: 'Starte deinen ersten Kurs',
      description: 'Basierend auf deiner Analyse empfehlen wir die Masterclass.',
      link: '/masterclass',
      priority: 8,
    });
  }

  // No CV uploaded
  const hasCv = (documents || []).some(d => d.doc_type === 'cv' || d.title?.toLowerCase().includes('lebenslauf'));
  if (!hasCv) {
    recs.push({
      icon: '\u{1F4C4}',
      title: 'Lade deinen CV hoch',
      description: 'F\u00FCr KI-Analyse und Bewerbungsmappe.',
      link: '/pre-coaching',
      priority: 6,
    });
  }

  // No applications
  if (!applications || applications.length === 0) {
    recs.push({
      icon: '\u2709',
      title: 'Erste Bewerbung anlegen',
      description: 'Tracke deine Bewerbungen im Kanban-Board.',
      link: '/applications',
      priority: 5,
    });
  }

  // Long inactive (based on streak)
  if (profile?.streak_count === 0 && profile?.total_points > 100) {
    recs.push({
      icon: '\u{1F916}',
      title: 'Dein Coach vermisst dich',
      description: 'Komm zur\u00FCck und halte deinen Streak am Leben.',
      link: '/coach',
      priority: 4,
    });
  }

  // No salary log wins
  if (profile?.total_points < 200) {
    recs.push({
      icon: '\u{1F3C6}',
      title: 'Trage deinen ersten Win ein',
      description: 'Dokumentiere deine Erfolge f\u00FCr die n\u00E4chste Verhandlung.',
      link: '/salary-log',
      priority: 3,
    });
  }

  return recs.sort((a, b) => b.priority - a.priority).slice(0, 3);
}
