import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import BrandingClient from './BrandingClient';

export default async function BrandingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: analysis } = await supabase.from('linkedin_analysis').select('*').eq('user_id', user.id).single();
  const { data: profile } = await supabase.from('profiles').select('career_goal, position, company').eq('id', user.id).single();
  return <BrandingClient userId={user.id} existing={analysis} profile={profile} />;
}
