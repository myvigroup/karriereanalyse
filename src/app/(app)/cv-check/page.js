import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import CvCheckClient from './CvCheckClient';

export default async function CVCheckPage() {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const needsPasswordSetup = user.user_metadata?.needs_password_setup === true;

  // CV-Dokument laden — versuche zuerst mit is_current, dann ohne
  let doc = null;
  const { data: currentDoc } = await admin
    .from('cv_documents')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  doc = currentDoc;

  if (!doc) redirect('/dashboard');

  // Feedback laden — zuerst via fair_leads, dann direkt über cv_document_id
  const { data: lead } = await admin
    .from('fair_leads')
    .select('*, fairs(name, start_date)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  let feedback = null;

  // 1. Versuch: via fair_lead (Berater-Flow)
  if (lead) {
    const { data: fb } = await admin
      .from('cv_feedback')
      .select('*')
      .eq('fair_lead_id', lead.id)
      .maybeSingle();
    feedback = fb;
  }

  // 2. Fallback: direkt über cv_document_id (Self-Upload-Flow)
  if (!feedback && doc) {
    const { data: fb } = await admin
      .from('cv_feedback')
      .select('*')
      .eq('cv_document_id', doc.id)
      .maybeSingle();
    feedback = fb;
  }

  const { data: rawItems } = feedback
    ? await admin
        .from('cv_feedback_items')
        .select('*')
        .eq('cv_feedback_id', feedback.id)
        .order('sort_order')
    : { data: [] };

  const items = rawItems || [];

  // Signed URL
  let previewUrl = null;
  const { data: urlData } = await admin.storage
    .from('cv-documents')
    .createSignedUrl(doc.storage_path || doc.file_path, 3600);
  previewUrl = urlData?.signedUrl;

  // Analytics (fire-and-forget)
  admin.from('analytics_events').insert({
    user_id: user.id,
    event_name: 'cv_check_viewed',
    metadata: { source: 'magic_link' },
  }).then(() => {}).catch(() => {});

  // Items nach Kategorie gruppieren
  const byCategory = {};
  items.forEach(item => {
    if (!item.content) return;
    const key = item.category;
    if (!byCategory[key]) byCategory[key] = { presets: [], freetext: null, rating: 0 };
    if (item.content.startsWith('__rating_')) {
      byCategory[key].rating = item.rating || 0;
    } else if (item.type === 'preset') {
      byCategory[key].presets.push(item.content);
    } else if (item.type === 'freetext') {
      byCategory[key].freetext = item.content;
    }
  });

  // Karriere-Analyse Status laden
  const { data: analysisSession } = await supabase
    .from('analysis_sessions')
    .select('overall_score, completed_at')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const hasAnalysis = !!analysisSession;

  const fairName = lead?.fairs?.name;
  const hasRating = feedback?.overall_rating > 0;

  return (
    <CvCheckClient
      doc={doc}
      feedback={feedback}
      byCategory={byCategory}
      previewUrl={previewUrl}
      analysisSession={analysisSession}
      needsPasswordSetup={needsPasswordSetup}
      targetPosition={lead?.target_position || null}
    />
  );
}
