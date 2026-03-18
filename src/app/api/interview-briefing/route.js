import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { applicationId, companyName, position } = await request.json();

    // Load user's analysis for strength matching
    const { data: results } = await supabase
      .from('analysis_results')
      .select('score, competency_fields(title, slug)')
      .eq('user_id', user.id)
      .order('score', { ascending: false })
      .limit(5);

    const topStrengths = (results || []).map(r => r.competency_fields?.title).filter(Boolean);

    // MVP: Mock briefing (replace with Claude API + web search in production)
    const briefing = {
      company_research: {
        culture_notes: `${companyName} ist bekannt für eine leistungsorientierte Kultur mit flachen Hierarchien.`,
        recent_news: [`${companyName} expandiert aktuell in neue Märkte`, `Kürzlich neue Führungsebene eingesetzt`],
      },
      predicted_questions: [
        `Warum möchten Sie zu ${companyName} wechseln?`,
        `Wie würden Sie Ihre ersten 90 Tage als ${position} gestalten?`,
        'Erzählen Sie von einer schwierigen Führungssituation und wie Sie sie gelöst haben.',
        'Was unterscheidet Sie von anderen Kandidaten?',
        'Wo sehen Sie sich in 3 Jahren?',
      ],
      star_stories: [
        { situation: 'Komplexes Projekt mit engem Zeitrahmen', task: 'Team koordinieren und Deadline einhalten', action: '...deine konkrete Handlung hier...', result: '...messbares Ergebnis...' },
      ],
      strengths_match: topStrengths,
    };

    // Save briefing
    if (applicationId) {
      await supabase.from('interview_briefings').insert({
        user_id: user.id, application_id: applicationId,
        company_research: briefing.company_research,
        predicted_questions: briefing.predicted_questions,
        star_stories: briefing.star_stories,
        strengths_match: briefing.strengths_match,
      });
    }

    return NextResponse.json(briefing);
  } catch (error) {
    return NextResponse.json({ error: 'Briefing failed' }, { status: 500 });
  }
}
