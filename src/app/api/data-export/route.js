import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = user.id;

    // Fetch all user data in parallel
    const [
      { data: profile },
      { data: applications },
      { data: contacts },
      { data: salaryLog },
      { data: lessonProgress },
      { data: coachingMessages },
      { data: analysisResults },
      { data: valueAssessments },
      { data: burnoutAssessments },
      { data: documents },
      { data: notifications },
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('applications').select('*').eq('user_id', userId),
      supabase.from('contacts').select('*').eq('user_id', userId),
      supabase.from('salary_log').select('*').eq('user_id', userId),
      supabase.from('lesson_progress').select('*').eq('user_id', userId),
      supabase.from('coaching_messages').select('role, content, created_at').eq('user_id', userId).order('created_at'),
      supabase.from('analysis_results').select('*').eq('user_id', userId),
      supabase.from('value_assessments').select('*').eq('user_id', userId),
      supabase.from('burnout_assessments').select('*').eq('user_id', userId),
      supabase.from('documents').select('title, doc_type, status, created_at').eq('user_id', userId),
      supabase.from('notifications').select('title, content, type, created_at').eq('user_id', userId),
    ]);

    const exportData = {
      export_date: new Date().toISOString(),
      export_type: 'DSGVO Art. 20 - Datenportabilit\u00E4t',
      profile,
      applications: applications || [],
      contacts: contacts || [],
      salary_log: salaryLog || [],
      lesson_progress: lessonProgress || [],
      coaching_messages: coachingMessages || [],
      analysis_results: analysisResults || [],
      value_assessments: valueAssessments || [],
      burnout_assessments: burnoutAssessments || [],
      documents: documents || [],
      notifications: notifications || [],
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="karriere-institut-daten-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
