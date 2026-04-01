'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { saveFeedback, toggleFeedbackItem, saveFeedbackFreetext, saveCategoryRating } from '@/app/advisor/actions';

const CATEGORIES = [
  { key: 'struktur', label: 'Struktur', icon: '📐' },
  { key: 'inhalt', label: 'Inhalt', icon: '📝' },
  { key: 'design', label: 'Design', icon: '🎨' },
  { key: 'wirkung', label: 'Wirkung', icon: '✨' },
];

function StarRating({ value, onChange, size = 24 }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star === value ? 0 : star)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: size, padding: 0, lineHeight: 1,
            color: star <= value ? '#D4A017' : '#E8E6E1',
            transition: 'color 0.15s',
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function CVReview() {
  const { fairId, leadId } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [lead, setLead] = useState(null);
  const [document, setDocument] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [presets, setPresets] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [freetexts, setFreetexts] = useState({});
  const [categoryRatings, setCategoryRatings] = useState({});
  const [overallRating, setOverallRating] = useState(0);
  const [summary, setSummary] = useState('');
  const [activeTab, setActiveTab] = useState('struktur');
  const [loading, setLoading] = useState(true);

  const debounceRef = useRef(null);

  // Daten laden
  useEffect(() => {
    async function load() {
      // Lead
      const { data: leadData } = await supabase
        .from('fair_leads')
        .select('*')
        .eq('id', leadId)
        .single();
      setLead(leadData);

      // Dokument
      const { data: doc } = await supabase
        .from('cv_documents')
        .select('*')
        .eq('fair_lead_id', leadId)
        .eq('is_current', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      setDocument(doc);

      // Signed URL für Preview
      if (doc) {
        const { data: urlData } = await supabase.storage
          .from('cv-documents')
          .createSignedUrl(doc.file_path, 3600);
        setPreviewUrl(urlData?.signedUrl);
      }

      // Presets laden
      const { data: presetsData } = await supabase
        .from('cv_feedback_presets')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      setPresets(presetsData || []);

      // Advisor-ID
      const { data: { user } } = await supabase.auth.getUser();
      const { data: advisor } = await supabase
        .from('advisors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // Feedback laden oder erstellen
      let { data: existingFeedback } = await supabase
        .from('cv_feedback')
        .select('*')
        .eq('fair_lead_id', leadId)
        .maybeSingle();

      if (!existingFeedback && doc && advisor) {
        const { data: newFeedback } = await supabase
          .from('cv_feedback')
          .insert({
            cv_document_id: doc.id,
            fair_lead_id: leadId,
            advisor_id: advisor.id,
            status: 'draft',
          })
          .select()
          .single();
        existingFeedback = newFeedback;
      }

      setFeedback(existingFeedback);
      setOverallRating(existingFeedback?.overall_rating || 0);
      setSummary(existingFeedback?.summary || '');

      // Bestehende Feedback-Items laden
      if (existingFeedback) {
        const { data: items } = await supabase
          .from('cv_feedback_items')
          .select('*')
          .eq('cv_feedback_id', existingFeedback.id);

        const selected = new Set();
        const texts = {};
        const ratings = {};

        (items || []).forEach(item => {
          if (item.type === 'preset' && !item.content.startsWith('__rating_')) {
            selected.add(item.content);
          } else if (item.type === 'freetext') {
            texts[item.category] = item.content;
          } else if (item.content.startsWith('__rating_')) {
            ratings[item.category] = item.rating;
          }
        });

        setSelectedItems(selected);
        setFreetexts(texts);
        setCategoryRatings(ratings);
      }

      setLoading(false);
    }
    load();
  }, [leadId, supabase]);

  // Auto-Save für Gesamtbewertung + Zusammenfassung
  useEffect(() => {
    if (!feedback) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveFeedback(feedback.id, { overallRating, summary });
    }, 1000);
    return () => clearTimeout(debounceRef.current);
  }, [overallRating, summary, feedback]);

  const handleTogglePreset = useCallback(async (preset) => {
    if (!feedback) return;
    const isActive = !selectedItems.has(preset.label);
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (isActive) next.add(preset.label);
      else next.delete(preset.label);
      return next;
    });
    await toggleFeedbackItem(feedback.id, preset, isActive);
  }, [feedback, selectedItems]);

  const handleFreetextChange = useCallback((category, value) => {
    setFreetexts(prev => ({ ...prev, [category]: value }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (feedback) saveFeedbackFreetext(feedback.id, category, value);
    }, 1000);
  }, [feedback]);

  const handleCategoryRating = useCallback(async (category, rating) => {
    setCategoryRatings(prev => ({ ...prev, [category]: rating }));
    if (feedback) await saveCategoryRating(feedback.id, category, rating);
  }, [feedback]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 64, color: '#86868b' }}>
        Wird geladen...
      </div>
    );
  }

  const renderPreview = () => {
    if (!document || !previewUrl) {
      return (
        <div style={{ textAlign: 'center', padding: 48, color: '#86868b' }}>
          Kein Dokument vorhanden
        </div>
      );
    }

    if (document.file_type === 'pdf') {
      return (
        <iframe
          src={previewUrl}
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: 12 }}
          title="CV Preview"
        />
      );
    }

    if (document.file_type === 'image') {
      return (
        <div style={{ overflow: 'auto', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 16 }}>
          <img
            src={previewUrl}
            alt="CV"
            style={{ maxWidth: '100%', borderRadius: 8 }}
          />
        </div>
      );
    }

    // DOCX
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <p style={{ color: '#86868b', marginBottom: 16 }}>
          Vorschau für DOCX nicht verfügbar
        </p>
        <a
          href={previewUrl}
          download={document.file_name}
          style={{
            display: 'inline-block', padding: '10px 24px',
            background: '#CC1426', color: '#fff', borderRadius: 980,
            textDecoration: 'none', fontWeight: 600, fontSize: 14,
          }}
        >
          Datei herunterladen
        </a>
      </div>
    );
  };

  const categoryPresets = presets.filter(p => p.category === activeTab);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <a
            href={`/advisor/fair/${fairId}`}
            style={{ fontSize: 13, color: '#86868b', textDecoration: 'none' }}
          >
            &larr; Zurück
          </a>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', margin: '4px 0 0' }}>
            CV-Review: {lead?.name}
          </h1>
        </div>
      </div>

      {/* Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, minHeight: 600 }}>
        {/* Links: Preview */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #E8E6E1',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #E8E6E1', fontSize: 13, fontWeight: 600, color: '#86868b' }}>
            {document?.file_name || 'Lebenslauf'}
          </div>
          <div style={{ flex: 1, minHeight: 500 }}>
            {renderPreview()}
          </div>
        </div>

        {/* Rechts: Feedback */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #E8E6E1',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #E8E6E1',
            overflow: 'auto',
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  background: activeTab === cat.key ? '#fff' : '#FAFAF8',
                  border: 'none',
                  borderBottom: activeTab === cat.key ? '2px solid #CC1426' : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  color: activeTab === cat.key ? '#CC1426' : '#86868b',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Feedback-Content */}
          <div style={{ flex: 1, padding: 20, overflow: 'auto' }}>
            {/* Kategorie-Rating */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 6, display: 'block' }}>
                Bewertung
              </label>
              <StarRating
                value={categoryRatings[activeTab] || 0}
                onChange={(r) => handleCategoryRating(activeTab, r)}
              />
            </div>

            {/* Preset-Chips */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 8, display: 'block' }}>
                Feedback-Punkte
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {categoryPresets.map(preset => {
                  const isSelected = selectedItems.has(preset.label);
                  const bgColor = isSelected
                    ? preset.sentiment === 'positive' ? '#D1FAE5'
                    : preset.sentiment === 'negative' ? '#FEE2E2'
                    : '#F3F4F6'
                    : '#FAFAF8';
                  const borderColor = isSelected
                    ? preset.sentiment === 'positive' ? '#059669'
                    : preset.sentiment === 'negative' ? '#DC2626'
                    : '#9CA3AF'
                    : '#E8E6E1';
                  const textColor = isSelected
                    ? preset.sentiment === 'positive' ? '#059669'
                    : preset.sentiment === 'negative' ? '#DC2626'
                    : '#1A1A1A'
                    : '#6B7280';

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleTogglePreset(preset)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 980,
                        border: `1px solid ${borderColor}`,
                        background: bgColor,
                        color: textColor,
                        fontSize: 13,
                        fontWeight: isSelected ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        lineHeight: 1.4,
                      }}
                    >
                      {preset.sentiment === 'positive' ? '✓ ' : preset.sentiment === 'negative' ? '✗ ' : ''}{preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Freitext */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 6, display: 'block' }}>
                Eigener Kommentar
              </label>
              <textarea
                value={freetexts[activeTab] || ''}
                onChange={(e) => handleFreetextChange(activeTab, e.target.value)}
                placeholder="Optionaler Freitext-Kommentar..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #E8E6E1',
                  borderRadius: 12,
                  fontSize: 14,
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Gesamtbewertung */}
          <div style={{
            padding: 20,
            borderTop: '1px solid #E8E6E1',
            background: '#FAFAF8',
            borderRadius: '0 0 16px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>
                Gesamtbewertung
              </label>
              <StarRating value={overallRating} onChange={setOverallRating} size={28} />
            </div>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Kurze Zusammenfassung für den Besucher..."
              rows={2}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #E8E6E1',
                borderRadius: 12,
                fontSize: 14,
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                marginBottom: 12,
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={() => router.push(`/advisor/fair/${fairId}/lead/${leadId}/summary`)}
              style={{
                width: '100%',
                padding: '14px',
                background: '#CC1426',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Weiter zur Zusammenfassung
            </button>
          </div>
        </div>
      </div>

      {/* Responsive: Stack on small screens */}
      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
