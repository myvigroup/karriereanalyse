'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { saveFeedback, toggleFeedbackItem, saveFeedbackFreetext, saveCategoryRating } from '@/app/(advisor-session)/advisor/actions';

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
  const [aiStatus, setAiStatus] = useState('idle'); // idle | analyzing | done | error
  const [aiSuggested, setAiSuggested] = useState(new Set()); // Track welche Items KI-Vorschläge sind

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
      let hasExistingItems = false;
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

        hasExistingItems = selected.size > 0 || Object.keys(texts).length > 0;
        setSelectedItems(selected);
        setFreetexts(texts);
        setCategoryRatings(ratings);

        // Wenn KI-Analyse schon da, Status auf done
        if (existingFeedback.ai_analysis) {
          setAiStatus('done');
        }
      }

      setLoading(false);

      // KI-Analyse automatisch triggern wenn:
      // - Dokument existiert
      // - Feedback existiert
      // - Noch keine KI-Analyse da
      // - Noch keine manuellen Items
      if (doc && existingFeedback && !existingFeedback.ai_analysis && !hasExistingItems) {
        triggerAiAnalysis(doc.id, existingFeedback.id);
      }
    }
    load();
  }, [leadId, supabase]);

  // KI-Analyse triggern
  async function triggerAiAnalysis(documentId, feedbackId) {
    setAiStatus('analyzing');
    try {
      const res = await fetch('/api/cv/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, feedbackId }),
      });
      const data = await res.json();

      if (data.success && data.aiAnalysis) {
        applyAiSuggestions(data.aiAnalysis, feedbackId);
        setAiStatus('done');
      } else {
        setAiStatus('error');
      }
    } catch {
      setAiStatus('error');
    }
  }

  // KI-Vorschläge anwenden
  async function applyAiSuggestions(analysis, feedbackId) {
    const suggested = new Set();
    const newSelected = new Set();
    const newFreetexts = {};
    const newRatings = {};

    if (analysis.categories) {
      for (const [category, catData] of Object.entries(analysis.categories)) {
        // Presets auswählen
        if (catData.selectedPresets) {
          for (const presetLabel of catData.selectedPresets) {
            newSelected.add(presetLabel);
            suggested.add(presetLabel);
            // In DB speichern
            const preset = presets.find(p => p.label === presetLabel && p.category === category);
            if (preset && feedbackId) {
              await toggleFeedbackItem(feedbackId, preset, true);
            }
          }
        }
        // Freitext
        if (catData.comment) {
          newFreetexts[category] = catData.comment;
          if (feedbackId) {
            await saveFeedbackFreetext(feedbackId, category, catData.comment);
          }
        }
        // Rating
        if (catData.rating) {
          newRatings[category] = catData.rating;
          if (feedbackId) {
            await saveCategoryRating(feedbackId, category, catData.rating);
          }
        }
      }
    }

    // Gesamtbewertung
    if (analysis.overallRating && feedbackId) {
      setOverallRating(analysis.overallRating);
      await saveFeedback(feedbackId, { overallRating: analysis.overallRating, summary: analysis.summary || '' });
    }
    if (analysis.summary) {
      setSummary(analysis.summary);
    }

    setSelectedItems(newSelected);
    setAiSuggested(suggested);
    setFreetexts(newFreetexts);
    setCategoryRatings(newRatings);
  }

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
    // Entferne aus AI-Vorschlägen wenn manuell getoggelt
    setAiSuggested(prev => {
      const next = new Set(prev);
      next.delete(preset.label);
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
            CV-Review: {`${lead?.first_name || ''} ${lead?.last_name || ''}`.trim()}
          </h1>
        </div>
        {/* KI-Status Badge */}
        {aiStatus !== 'idle' && (
          <div style={{
            padding: '6px 14px',
            borderRadius: 980,
            fontSize: 13,
            fontWeight: 600,
            background: aiStatus === 'analyzing' ? '#FEF3C7' : aiStatus === 'done' ? '#D1FAE5' : '#FEE2E2',
            color: aiStatus === 'analyzing' ? '#D97706' : aiStatus === 'done' ? '#059669' : '#DC2626',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            {aiStatus === 'analyzing' && (
              <>
                <span style={{ animation: 'pulse 1.5s infinite' }}>⏳</span>
                KI analysiert...
              </>
            )}
            {aiStatus === 'done' && '✓ KI-Vorschläge angewendet'}
            {aiStatus === 'error' && (
              <>
                KI-Analyse fehlgeschlagen
                <button
                  onClick={() => document && feedback && triggerAiAnalysis(document.id, feedback.id)}
                  style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', textDecoration: 'underline', fontSize: 13 }}
                >
                  Nochmal
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* KI-Analyse Banner */}
      {aiStatus === 'analyzing' && (
        <div style={{
          background: 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2E 100%)',
          borderRadius: 16,
          padding: 24,
          marginBottom: 20,
          textAlign: 'center',
          color: '#fff',
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🤖</div>
          <p style={{ fontWeight: 600, fontSize: 16, margin: '0 0 4px' }}>KI analysiert den Lebenslauf...</p>
          <p style={{ fontSize: 13, opacity: 0.7, margin: 0 }}>Die Feedback-Chips werden automatisch vorausgefüllt. Du kannst sie danach anpassen.</p>
        </div>
      )}

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
          opacity: aiStatus === 'analyzing' ? 0.6 : 1,
          pointerEvents: aiStatus === 'analyzing' ? 'none' : 'auto',
          transition: 'opacity 0.3s',
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
                  const isAiSuggestion = aiSuggested.has(preset.label);
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
                        position: 'relative',
                      }}
                    >
                      {preset.sentiment === 'positive' ? '✓ ' : preset.sentiment === 'negative' ? '✗ ' : ''}{preset.label}
                      {isSelected && isAiSuggestion && (
                        <span style={{
                          marginLeft: 4,
                          fontSize: 10,
                          opacity: 0.7,
                        }} title="KI-Vorschlag">🤖</span>
                      )}
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
              onClick={() => router.push(`/advisor/fair/${fairId}/lead/${leadId}/contact`)}
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
              Weiter zu Kontaktdaten
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
