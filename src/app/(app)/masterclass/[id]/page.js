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

  // Sort modules and lessons
  if (course.modules) {
    course.modules.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    course.modules.forEach(m => {
      if (m.lessons) m.lessons.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    });
  }

  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed, quiz_score, practice_completed')
    .eq('user_id', user.id);

  const { data: profile } = await supabase
    .from('profiles')
    .select('total_points')
    .eq('id', user.id)
    .single();

  return (
    <CoursePlayerClient
      course={course}
      progress={progress || []}
      profile={profile}
      userId={user.id}
    />
  );
}
