import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import UploadClient from './UploadClient';

export const dynamic = 'force-dynamic';

export default async function DirectUploadPage({ params }) {
  const admin = createAdminClient();
  // Kein Sub-Select für cv_feedback/cv_documents — Supabase findet die Relation
  // nicht (Foreign-Keys zu fair_leads existieren nicht für cv_feedback in der Live-DB).
  const { data: lead, error: leadErr } = await admin
    .from('fair_leads')
    .select('id, first_name, last_name, email, target_position, status, source, advisor_user_id')
    .eq('id', params.leadId)
    .maybeSingle();

  if (leadErr) {
    console.error('[cv-upload] Lead-Query Fehler:', leadErr.message);
    notFound();
  }
  if (!lead) notFound();

  // Separat: gibt es schon hochgeladene CV-Dokumente für diesen Lead?
  const { data: existingDocs } = await admin
    .from('cv_documents').select('id').eq('lead_id', lead.id).limit(1);
  lead.cv_documents = existingDocs || [];

  // Berater-Name über advisor_user_id (nicht über advisor_id-FK, der nicht existiert)
  let advisorName = 'dein Berater';
  if (lead.advisor_user_id) {
    const { data: advisor } = await admin
      .from('advisors').select('display_name').eq('user_id', lead.advisor_user_id).maybeSingle();
    if (advisor?.display_name) advisorName = advisor.display_name;
  }

  return <UploadClient lead={lead} advisorName={advisorName} />;
}
