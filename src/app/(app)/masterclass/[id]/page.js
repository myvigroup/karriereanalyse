import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CoursePlayerClient from './CoursePlayerClient';
import PaywallGate from '@/components/PaywallGate';
import { hasAccess } from '@/lib/access-control';

const GEHALT_COURSE_ID = 'c1000000-0000-0000-0000-000000000007';

export default async function CoursePlayerPage({ params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: course } = await supabase
    .from('courses')
    .select('*, modules(*, lessons(*))')
    .eq('id', params.id)
    .single();

  if (!course) redirect('/masterclass');

  // Sort modules and lessons
  if (course.modules) {
    course.modules.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    course.modules.forEach(m => {
      if (m.lessons) m.lessons.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscription_plan, purchased_products')
    .eq('id', user.id)
    .single();

  // Paywall: Gehaltsverhandlung Masterclass nur mit Abo
  if (params.id === GEHALT_COURSE_ID && !hasAccess(profile, 'masterclass_all')) {
    return <PaywallGate feature="masterclass" />;
  }

  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed, quiz_score, practice_completed')
    .eq('user_id', user.id);

  // Analyse-Ergebnisse laden (Kompetenz-Scores)
  const { data: analysisResults } = await supabase
    .from('analysis_results')
    .select('score, competency_fields(slug, title, icon)')
    .eq('user_id', user.id);

  const formattedResults = (analysisResults || []).map(r => ({
    score: r.score,
    field_slug: r.competency_fields?.slug,
    field_title: r.competency_fields?.title,
    field_icon: r.competency_fields?.icon,
  }));

  return (
    <CoursePlayerClient
      course={course}
      progress={progress || []}
      profile={profile}
      userId={user.id}
      analysisResults={formattedResults}
    />
  );
}
