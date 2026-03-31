import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AnalyseClient from './AnalyseClient';

export default async function AnalysePage({ searchParams }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Load existing analysis session if any
  const { data: existingSession } = await supabase
    .from('analysis_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const autoStart = searchParams?.start === 'true';
  return <AnalyseClient profile={profile} existingSession={existingSession} userId={user.id} autoStart={autoStart} />;
}
