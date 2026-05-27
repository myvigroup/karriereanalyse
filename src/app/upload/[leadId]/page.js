import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import UploadClient from './UploadClient';

export const dynamic = 'force-dynamic';

export default async function DirectUploadPage({ params }) {
  const admin = createAdminClient();
  const { data: lead } = await admin
    .from('fair_leads')
    .select(`
      id, first_name, last_name, email, target_position, status, source,
      advisor_id, advisor_user_id,
      cv_documents(id),
      cv_feedback(id, ai_parsed_at, overall_rating, summary)
    `)
    .eq('id', params.leadId)
    .maybeSingle();

  if (!lead) notFound();

  // Coach-Name laden
  let advisorName = 'dein Berater';
  if (lead.advisor_id) {
    const { data: advisor } = await admin
      .from('advisors').select('display_name').eq('id', lead.advisor_id).maybeSingle();
    if (advisor?.display_name) advisorName = advisor.display_name;
  }

  return <UploadClient lead={lead} advisorName={advisorName} />;
}
