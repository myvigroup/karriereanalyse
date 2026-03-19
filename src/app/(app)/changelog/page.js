import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ChangelogClient from './ChangelogClient';

export default async function ChangelogPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, last_changelog_seen')
    .eq('id', user.id)
    .single();

  const { data: entries } = await supabase
    .from('changelog_entries')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <ChangelogClient
      entries={entries || []}
      profile={profile}
      userId={user.id}
    />
  );
}
