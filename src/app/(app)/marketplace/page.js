import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MarketplaceClient from './MarketplaceClient';

export default async function MarketplacePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: coaches } = await supabase
    .from('profiles')
    .select('id, first_name, name, specialization, hourly_rate, calendly_url, bio, avatar_url')
    .eq('marketplace_visible', true)
    .eq('role', 'coach')
    .order('name', { ascending: true });

  const coachIds = (coaches || []).map(c => c.id);

  let reviews = [];
  if (coachIds.length > 0) {
    const { data: reviewData } = await supabase
      .from('coach_reviews')
      .select('*')
      .in('coach_id', coachIds)
      .order('created_at', { ascending: false });
    reviews = reviewData || [];
  }

  return (
    <MarketplaceClient
      coaches={coaches || []}
      reviews={reviews}
      profile={profile}
    />
  );
}
