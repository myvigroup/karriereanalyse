import { createClient } from '@/lib/supabase/server';
import { analyzeCVWithAI } from '@/lib/ai-provider';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { cvText, careerGoal } = await request.json();
    if (!cvText) return NextResponse.json({ error: 'No CV text provided' }, { status: 400 });

    // Analyse-Scores für Kontext laden
    const { data: results } = await supabase
      .from('analysis_results')
      .select('score, competency_fields(title)')
      .eq('user_id', user.id);

    const analysis = await analyzeCVWithAI(cvText, careerGoal, results);

    // Ergebnis in career_documents speichern
    await supabase
      .from('career_documents')
      .update({
        ai_analysis: analysis,
        status: 'feedback',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('doc_type', 'cv');

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('CV Analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
