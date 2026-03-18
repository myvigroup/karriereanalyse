import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AnalyseClient from './AnalyseClient';

export default async function AnalysePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: fields } = await supabase
    .from('competency_fields')
    .select('*, competency_questions(*)')
    .order('sort_order');

  const { data: results } = await supabase
    .from('analysis_results')
    .select('*, competency_fields(title, icon, slug)')
    .eq('user_id', user.id);

  return <AnalyseClient fields={fields || []} existingResults={results || []} userId={user.id} />;
}
