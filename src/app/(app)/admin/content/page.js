import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ContentClient from './ContentClient';

export default async function AdminContentPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') redirect('/dashboard');

  const { data: courses } = await supabase
    .from('courses')
    .select('*, modules(*, lessons(*))')
    .order('sort_order');

  (courses || []).forEach(c => {
    if (c.modules) {
      c.modules.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      c.modules.forEach(m => {
        if (m.lessons) m.lessons.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      });
    }
  });

  return <ContentClient courses={courses || []} />;
}
