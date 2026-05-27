import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import CheckFormClient from './CheckFormClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Lebenslauf-Check starten · Karriere-Institut',
};

export default async function CheckStartPage({ params }) {
  const slug = (params.slug || '').toLowerCase().trim();
  if (!slug) notFound();

  const admin = createAdminClient();
  const { data: advisor } = await admin
    .from('advisors')
    .select('id, display_name, status')
    .ilike('slug', slug)
    .maybeSingle();

  if (!advisor || advisor.status === 'inactive') notFound();

  return <CheckFormClient advisor={advisor} slug={slug} />;
}
