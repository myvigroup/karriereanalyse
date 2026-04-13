import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import CompleteButton from './CompleteButton';

const CATEGORY_LABELS = {
  struktur: { label: 'Struktur', icon: '📐' },
  inhalt:   { label: 'Inhalt',   icon: '📝' },
  design:   { label: 'Design',   icon: '🎨' },
  wirkung:  { label: 'Wirkung',  icon: '✨' },
};

function Stars({ count }) {
  return (
    <span style={{ color: '#D4A017' }}>
      {'★'.repeat(count || 0)}{'☆'.repeat(5 - (count || 0))}
    </span>
  );
}

export default async function SummaryPage({ params }) {
  const { fairId, leadId } = params;
  const admin = createAdminClient();

  const { data: lead } = await admin
    .from('fair_leads').select('*').eq('id', leadId).maybeSingle();

  const { data: doc } = await admin
    .from('cv_documents').select('*').eq('lead_id', leadId)
    .order('created_at', { ascending: false }).limit(1).maybeSingle();

  const { data: fb } = await admin
    .from('cv_feedback').select('*').eq('fair_lead_id', leadId).maybeSingle();

  const { data: rawItems } = fb
    ? await admin.from('cv_feedback_items').select('*')
        .eq('cv_feedback_id', fb.id).order('sort_order')
    : { data: [] };

  const items = rawItems || [];

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

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <Link
        href={`/advisor/fair/${fairId}/lead/${leadId}/contact`}
        style={{ fontSize: 13, color: '#86868b', textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}
      >
        ← Zurück zu Kontaktdaten
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 24 }}>
        Zusammenfassung
      </h1>

      {/* Lead-Info */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #E8E6E1', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <strong>{`${lead?.first_name || ''} ${lead?.last_name || ''}`.trim()}</strong>
          <span style={{ color: '#86868b', fontSize: 14 }}>{lead?.email || 'Noch keine E-Mail'}</span>
        </div>
        {doc && <div style={{ fontSize: 14, color: '#86868b' }}>CV: {doc.file_name}</div>}
      </div>

      {/* Gesamtbewertung */}
      {fb?.overall_rating > 0 && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #E8E6E1', marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#86868b', marginBottom: 8 }}>Gesamtbewertung</div>
          <div style={{ fontSize: 28 }}><Stars count={fb.overall_rating} /></div>
          {fb.summary && (
            <p style={{ color: '#1A1A1A', marginTop: 12, lineHeight: 1.5, fontSize: 14 }}>{fb.summary}</p>
          )}
        </div>
      )}

      {/* Kategorien */}
      {Object.entries(CATEGORY_LABELS).map(([key, { label, icon }]) => {
        const cat = byCategory[key];
        if (!cat || (cat.presets.length === 0 && !cat.freetext && !cat.rating)) return null;
        return (
          <div key={key} style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #E8E6E1', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{icon} {label}</h3>
              {cat.rating > 0 && <Stars count={cat.rating} />}
            </div>
            {cat.presets.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: cat.freetext ? 12 : 0 }}>
                {cat.presets.map((p, i) => (
                  <span key={i} style={{ padding: '4px 12px', borderRadius: 980, background: '#F3F4F6', fontSize: 13, color: '#1A1A1A' }}>
                    {p}
                  </span>
                ))}
              </div>
            )}
            {cat.freetext && (
              <p style={{ fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{cat.freetext}</p>
            )}
          </div>
        );
      })}

      <CompleteButton leadId={leadId} />
    </div>
  );
}
