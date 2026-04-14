import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AnalyseClient from './AnalyseClient';
import PaywallGate from '@/components/PaywallGate';
import { hasAccess } from '@/lib/access-control';

export default async function AnalysePage() {
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

  // Paywall: Analyse nur mit gekauftem Produkt oder Abo zugänglich
  // Ausnahme: wer schon eine abgeschlossene Session hat, kann sie weiter sehen
  const alreadyCompleted = !!existingSession?.completed_at;
  if (!hasAccess(profile, 'analyse_full') && !alreadyCompleted) {
    return <PaywallGate feature="analyse" />;
  }

  return <AnalyseClient profile={profile} existingSession={existingSession} userId={user.id} hasFullAccess={hasAccess(profile, 'analyse_full')} />;
}
