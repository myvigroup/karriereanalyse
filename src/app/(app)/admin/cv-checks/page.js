import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminCvChecksClient from './AdminCvChecksClient';

export default async function AdminCvChecksPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'coach'].includes(profile.role)) redirect('/dashboard');

  // CV-Documents mit Feedback joined
  const { data: docs } = await supabase
    .from('cv_documents')
    .select(`
      id, user_id, file_name, file_type, page_count, is_current, extraction_status,
      created_at, processing_error,
      cv_feedback(id, overall_rating, status, ai_parsed_at, ai_analysis, advisor_id, updated_at)
    `)
    .order('created_at', { ascending: false })
    .limit(200);

  const userIds = Array.from(new Set((docs || []).map(d => d.user_id).filter(Boolean)));
  const { data: profiles } = userIds.length
    ? await supabase.from('profiles').select('id, name, first_name, avatar_initials, email').in('id', userIds)
    : { data: [] };
  const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p]));

  // Stats
  const [
    { count: totalDocs },
    { count: withAi },
    { count: withReview },
    { count: pending },
  ] = await Promise.all([
    supabase.from('cv_documents').select('*', { count: 'exact', head: true }),
    supabase.from('cv_feedback').select('*', { count: 'exact', head: true }).not('ai_parsed_at', 'is', null),
    supabase.from('cv_feedback').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('cv_feedback').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  return <AdminCvChecksClient
    docs={docs || []}
    profileMap={profileMap}
    stats={{
      total: totalDocs || 0,
      withAi: withAi || 0,
      withReview: withReview || 0,
      pending: pending || 0,
    }}
  />;
}
