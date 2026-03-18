import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CoursePlayerClient from './CoursePlayerClient';

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

  // Sort modules and lessons by sort_order
  if (course.modules) {
    course.modules.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    course.modules.forEach(m => {
      if (m.lessons) m.lessons.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    });
  }

  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed, notes')
    .eq('user_id', user.id);

  const { data: analysisResults } = await supabase
    .from('analysis_results')
    .select('field_id, score, competency_fields(title, slug)')
    .eq('user_id', user.id);

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_salary, target_salary')
    .eq('id', user.id)
    .single();

  return (
    <CoursePlayerClient
      course={course}
      progress={progress || []}
      analysisResults={analysisResults || []}
      profile={profile}
      userId={user.id}
    />
  );
}
