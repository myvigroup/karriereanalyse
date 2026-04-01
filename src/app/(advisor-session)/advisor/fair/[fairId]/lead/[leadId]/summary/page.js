'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { completeFeedback } from '@/app/(advisor-session)/advisor/actions';
import Link from 'next/link';

const CATEGORY_LABELS = {
  struktur: { label: 'Struktur', icon: '📐' },
  inhalt: { label: 'Inhalt', icon: '📝' },
  design: { label: 'Design', icon: '🎨' },
  wirkung: { label: 'Wirkung', icon: '✨' },
};

function Stars({ count }) {
  return (
    <span style={{ color: '#D4A017' }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  );
}

export default function SummaryPage() {
  const { fairId, leadId } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [lead, setLead] = useState(null);
  const [document, setDocument] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      const { data: leadData } = await supabase
        .from('fair_leads')
        .select('*')
        .eq('id', leadId)
        .single();
      setLead(leadData);

      const { data: doc } = await supabase
        .from('cv_documents')
        .select('*')
        .eq('fair_lead_id', leadId)
        .eq('is_current', true)
        .limit(1)
        .single();
      setDocument(doc);

      const { data: fb } = await supabase
        .from('cv_feedback')
        .select('*')
        .eq('fair_lead_id', leadId)
        .maybeSingle();
      setFeedback(fb);

      if (fb) {
        const { data: fbItems } = await supabase
          .from('cv_feedback_items')
          .select('*')
          .eq('cv_feedback_id', fb.id)
          .order('sort_order');
        setItems(fbItems || []);
      }

      setLoading(false);
    }
    load();
  }, [leadId, supabase]);

  async function handleComplete() {
    setSubmitting(true);
    setError(null);
    try {
      await completeFeedback(leadId);
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 64, color: '#86868b' }}>Wird geladen...</div>;
  }

  // Items nach Kategorie gruppieren
  const byCategory = {};
  (items || []).forEach(item => {
    if (item.content.startsWith('__rating_')) {
      // Rating-Item
      if (!byCategory[item.category]) byCategory[item.category] = { presets: [], freetext: null, rating: 0 };
      byCategory[item.category].rating = item.rating;
    } else if (item.type === 'preset') {
      if (!byCategory[item.category]) byCategory[item.category] = { presets: [], freetext: null, rating: 0 };
      byCategory[item.category].presets.push(item.content);
    } else if (item.type === 'freetext') {
      if (!byCategory[item.category]) byCategory[item.category] = { presets: [], freetext: null, rating: 0 };
      byCategory[item.category].freetext = item.content;
    }
  });

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <Link
        href={`/advisor/fair/${fairId}/lead/${leadId}/review`}
        style={{ fontSize: 13, color: '#86868b', textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}
      >
        &larr; Zurück zum Review
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 24 }}>
        Zusammenfassung
      </h1>

      {/* Lead-Info */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: 20,
        border: '1px solid #E8E6E1', marginBottom: 16,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <strong>{lead?.name}</strong>
          <span style={{ color: '#86868b', fontSize: 14 }}>{lead?.email}</span>
        </div>
        {document && (
          <div style={{ fontSize: 14, color: '#86868b' }}>
            CV: {document.file_name}
          </div>
        )}
      </div>

      {/* Gesamtbewertung */}
      {feedback?.overall_rating && (
        <div style={{
          background: '#fff', borderRadius: 16, padding: 20,
          border: '1px solid #E8E6E1', marginBottom: 16,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#86868b', marginBottom: 8 }}>Gesamtbewertung</div>
          <div style={{ fontSize: 28 }}><Stars count={feedback.overall_rating} /></div>
          {feedback.summary && (
            <p style={{ color: '#1A1A1A', marginTop: 12, lineHeight: 1.5, fontSize: 14 }}>
              {feedback.summary}
            </p>
          )}
        </div>
      )}

      {/* Kategorien */}
      {Object.entries(CATEGORY_LABELS).map(([key, { label, icon }]) => {
        const cat = byCategory[key];
        if (!cat || (cat.presets.length === 0 && !cat.freetext && !cat.rating)) return null;

        return (
          <div
            key={key}
            style={{
              background: '#fff', borderRadius: 16, padding: 20,
              border: '1px solid #E8E6E1', marginBottom: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{icon} {label}</h3>
              {cat.rating > 0 && <Stars count={cat.rating} />}
            </div>
            {cat.presets.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: cat.freetext ? 12 : 0 }}>
                {cat.presets.map((p, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 980,
                      background: '#F3F4F6',
                      fontSize: 13,
                      color: '#1A1A1A',
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            )}
            {cat.freetext && (
              <p style={{ fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                {cat.freetext}
              </p>
            )}
          </div>
        );
      })}

      {/* Fehler */}
      {error && (
        <div style={{
          background: '#FEF2F2', color: '#CC1426', padding: '12px 16px',
          borderRadius: 12, fontSize: 14, marginBottom: 16,
        }}>
          {error}
        </div>
      )}

      {/* Abschluss-Button */}
      <button
        onClick={handleComplete}
        disabled={submitting}
        style={{
          width: '100%',
          padding: '18px',
          background: submitting ? '#E8E6E1' : '#CC1426',
          color: '#fff',
          border: 'none',
          borderRadius: 16,
          fontSize: 17,
          fontWeight: 700,
          cursor: submitting ? 'not-allowed' : 'pointer',
          marginTop: 8,
          marginBottom: 32,
          transition: 'background 0.15s',
        }}
      >
        {submitting ? 'Wird gesendet...' : 'Gespräch abschließen & Magic Link senden'}
      </button>
    </div>
  );
}
