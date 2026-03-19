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

  const { data: analysisSession } = await supabase
    .from('analysis_sessions')
    .select('scores')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: profile } = await supabase
    .from('profiles')
    .select('total_points, subscription_plan, purchased_products')
    .eq('id', user.id)
    .single();

  return <MasterclassClient
    courses={courses || []}
    progress={progress || []}
    analysisScores={analysisSession?.scores || null}
    profile={profile}
  />;
}
