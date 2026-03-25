import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MasterclassClient from './MasterclassClient';

export default async function MasterclassPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: courses } = await supabase
    .from('courses')
    .select('*, modules(*, lessons(*))')
    .eq('is_published', true)
    .order('sort_order');

  // Sort modules and lessons
  (courses || []).forEach(c => {
    if (c.modules) {
      c.modules.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      c.modules.forEach(m => {
        if (m.lessons) m.lessons.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      });
    }
  });

  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed')
    .eq('user_id', user.id);

  // Analyse-Ergebnisse aus analysis_results Tabelle (nicht analysis_sessions.scores)
  const { data: analysisResults } = await supabase
    .from('analysis_results')
    .select('*, competency_fields(title, icon, slug)')
    .eq('user_id', user.id);

  const formattedResults = (analysisResults || []).map(r => ({
    ...r,
    field_slug: r.competency_fields?.slug,
    field_title: r.competency_fields?.title,
  }));

  const { data: profile } = await supabase
    .from('profiles')
    .select('total_points, subscription_plan, purchased_products, phase')
    .eq('id', user.id)
    .single();

  return <MasterclassClient
    courses={courses || []}
    progress={progress || []}
    analysisResults={formattedResults}
    profile={profile}
  />;
}
