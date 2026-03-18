import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { currentHeadline, careerGoal, position } = await request.json();

    // MVP: Mock response (replace with Claude API in production)
    const analysis = {
      visibility_score: Math.floor(Math.random() * 30) + 35,
      suggested_headlines: [
        `Ich transformiere ${careerGoal || 'Unternehmen'} — ${position || 'Führungskraft'} mit Passion für messbare Ergebnisse`,
        `${position || 'Senior Professional'} | Strategie × Umsetzung | ${careerGoal || 'Nächstes Level'}`,
        `Von der Idee zur Wirkung — ${position || 'Manager'} für nachhaltiges Wachstum`,
      ],
      content_suggestions: [
        `Teile eine Erkenntnis aus deinem letzten Projekt: "3 Dinge, die ich über ${careerGoal || 'Führung'} gelernt habe"`,
        'Kommentiere einen aktuellen Branchen-Trend mit deiner eigenen Einschätzung',
        'Erzähle von einem Fehler, der dich weitergebracht hat (Authentizität schlägt Perfektion)',
        `Empfehle ein Buch oder einen Podcast, der dich als ${position || 'Führungskraft'} geprägt hat`,
      ],
      ai_feedback: `Deine aktuelle Headline "${currentHeadline}" beschreibt nur deinen Titel, nicht deinen Impact. Top-Profile auf LinkedIn zeigen, WAS du für Unternehmen tust, nicht WO du arbeitest. Ersetze Jobtitel durch Ergebnis-Formulierungen.`,
    };

    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
