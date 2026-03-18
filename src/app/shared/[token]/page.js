import { createClient } from '@/lib/supabase/server';
import SharedReportClient from './SharedReportClient';

export default async function SharedReportPage({ params }) {
  const supabase = createClient();

  const { data: report } = await supabase
    .from('shared_reports')
    .select('*, profiles(name, company, position)')
    .eq('share_token', params.token)
    .single();

  if (!report) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ki-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Report nicht gefunden</h1>
          <p style={{ color: 'var(--ki-text-secondary)' }}>Dieser Link ist ungültig oder abgelaufen.</p>
        </div>
      </div>
    );
  }

  const { data: results } = await supabase
    .from('analysis_results')
    .select('field_id, score, competency_fields(title, icon, slug, sort_order)')
    .eq('user_id', report.user_id)
    .order('score', { ascending: true });

  const { data: session } = await supabase
    .from('analysis_sessions')
    .select('overall_score, prio_1_field, prio_2_field, prio_3_field')
    .eq('user_id', report.user_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return (
    <SharedReportClient
      report={report}
      results={results || []}
      session={session}
      token={params.token}
    />
  );
}
