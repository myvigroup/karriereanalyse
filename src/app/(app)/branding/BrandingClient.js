'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { awardPoints } from '@/lib/gamification';
import InfoTooltip from '@/components/ui/InfoTooltip';

// ---------------------------------------------------------------------------
// Post Templates
// ---------------------------------------------------------------------------
const POST_TEMPLATES = [
  {
    id: 'erfolgs-story',
    title: 'Erfolgs-Story',
    subtitle: 'STAR-Format',
    icon: '⭐',
    color: 'var(--ki-red)',
    text: 'Situation: [Beschreibe die Ausgangslage]\n\nTask: [Was war deine Aufgabe?]\n\nAction: [Was hast du konkret getan?]\n\nResult: [Was war das messbare Ergebnis?]\n\nKey Takeaway: [Was können andere daraus lernen?]',
  },
  {
    id: 'branchen-insight',
    title: 'Branchen-Insight',
    subtitle: 'Kontroverse These + Daten',
    icon: '📈',
    color: 'var(--ki-success)',
    text: 'Kontroverse These: [Formuliere eine mutige Aussage zu deiner Branche]\n\nDaten & Fakten: [Belege deine These mit konkreten Zahlen oder Studien]\n\nWarum das wichtig ist: [Erkläre die Auswirkungen auf die Branche]\n\nMeine Einschätzung: [Deine persönliche Perspektive als Experte]\n\nFrage an mein Netzwerk: [Stelle eine offene Frage zur Diskussion]',
  },
  {
    id: 'persoenlicher-meilenstein',
    title: 'Persönlicher Meilenstein',
    subtitle: 'Authentisch + Verletzlich',
    icon: '🏆',
    color: 'var(--ki-warning)',
    text: 'Der Moment: [Beschreibe den Meilenstein, den du erreicht hast]\n\nDer Weg dahin: [Was hat es dich gekostet — Zeit, Energie, Rückschläge?]\n\nWas ich fast aufgegeben hätte: [Sei ehrlich über Zweifel und Herausforderungen]\n\nWas ich gelernt habe: [Die wichtigste Erkenntnis auf diesem Weg]\n\nAn alle, die gerade auf dem Weg sind: [Ermutigende Worte]',
  },
  {
    id: 'how-to-guide',
    title: 'How-To Guide',
    subtitle: '3–5 Schritte',
    icon: '💡',
    color: 'var(--ki-blue, #2563eb)',
    text: 'Problem: [Welches häufige Problem löst du?]\n\nSchritt 1: [Erste konkrete Aktion]\n\nSchritt 2: [Zweite konkrete Aktion]\n\nSchritt 3: [Dritte konkrete Aktion]\n\nSchritt 4 (optional): [Vierte konkrete Aktion]\n\nSchritt 5 (optional): [Fünfte konkrete Aktion]\n\nErgebnis: [Was erreicht man, wenn man diese Schritte befolgt?]',
  },
  {
    id: 'empfehlung-buchreview',
    title: 'Empfehlung / Buchreview',
    subtitle: 'Was ich gelernt habe',
    icon: '📚',
    color: 'var(--ki-text-secondary)',
    text: 'Das Buch/Tool/Ressource: [Name und kurze Beschreibung]\n\nWarum ich es empfehle: [Was hat mich überzeugt?]\n\nDie 3 wichtigsten Learnings:\n1. [Erstes Learning]\n2. [Zweites Learning]\n3. [Drittes Learning]\n\nFür wen ist es geeignet? [Zielgruppe beschreiben]\n\nMein Fazit in einem Satz: [Kernaussage]',
  },
  {
    id: 'karriere-lektion',
    title: 'Karriere-Lektion',
    subtitle: 'Was ich anders machen würde',
    icon: '🌱',
    color: 'var(--ki-success)',
    text: 'Wenn ich die Zeit zurückdrehen könnte: [Beschreibe die Situation von damals]\n\nWas ich damals getan habe: [Die Entscheidung, die du getroffen hast]\n\nWas ich heute anders machen würde: [Deine heutige Perspektive]\n\nWarum: [Was hast du seitdem gelernt?]\n\nMein Rat an mein jüngeres Ich: [Eine konkrete Empfehlung]',
  },
];

// ---------------------------------------------------------------------------
// Checklist items
// ---------------------------------------------------------------------------
const CHECKLIST_ITEMS = [
  { id: 'photo', label: 'Profilbild (professionell)' },
  { id: 'banner', label: 'Banner-Bild' },
  { id: 'headline', label: 'Headline optimiert' },
  { id: 'about', label: 'About-Section (min. 200 Wörter)' },
  { id: 'skills', label: '5+ Skills endorsed' },
  { id: 'recommendations', label: '3+ Empfehlungen' },
  { id: 'activity', label: 'Aktivitäts-Score > 50' },
];

// ---------------------------------------------------------------------------
// Client-side headline variations generator
// ---------------------------------------------------------------------------
function generateHeadlineVariations(currentPosition, skills, targetPosition) {
  const skillStr = skills.filter(Boolean).join(' | ');
  const s1 = skills[0] || 'Experte';
  const s2 = skills[1] || 'Strategie';
  const s3 = skills[2] || 'Leadership';

  return [
    `${currentPosition} → ${targetPosition} | ${skillStr}`,
    `${targetPosition} in Vorbereitung | ${s1} & ${s2} | Offen für neue Chancen`,
    `${s1}-Experte mit Fokus auf ${s2} | Jetzt: ${currentPosition} | Ziel: ${targetPosition}`,
    `Vom ${currentPosition} zum ${targetPosition} | ${skillStr} | Let's connect`,
    `${s1} • ${s2} • ${s3} | ${currentPosition} | Auf dem Weg zu ${targetPosition}`,
  ].filter((h) => h.trim().length > 10);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function ScoreRing({ score, size = 120 }) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 70 ? 'var(--ki-success)' : score >= 40 ? 'var(--ki-warning)' : 'var(--ki-red)';
  return (
    <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--grey-5, #e5e5e5)" strokeWidth="8" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: 28, fontWeight: 700, fill: color, fontFamily: 'inherit' }}>
        {score}
      </text>
    </svg>
  );
}

function ProfileRing({ percent, size = 140 }) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  const color = percent >= 80 ? 'var(--ki-success)' : percent >= 50 ? 'var(--ki-warning)' : 'var(--ki-red)';
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--grey-5, #e5e5e5)" strokeWidth="10" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 26, fontWeight: 700, fill: color, fontFamily: 'inherit' }}>
          {percent}%
        </text>
        <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 10, fill: 'var(--ki-text-secondary)', fontFamily: 'inherit' }}>
          optimiert
        </text>
      </svg>
    </div>
  );
}

function SsiChart({ scores }) {
  if (scores.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 24, color: 'var(--ki-text-secondary)', fontSize: 13 }}>
        Noch keine SSI-Daten vorhanden. Trage deinen ersten Score ein.
      </div>
    );
  }

  const width = 500;
  const height = 180;
  const padL = 40; const padR = 16; const padT = 16; const padB = 32;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const values = scores.map((s) => s.score);
  const minVal = Math.max(0, Math.min(...values) - 10);
  const maxVal = Math.min(100, Math.max(...values) + 10);
  const range = maxVal - minVal || 1;

  const points = scores.map((s, i) => {
    const x = padL + (scores.length === 1 ? chartW / 2 : (i / (scores.length - 1)) * chartW);
    const y = padT + chartH - ((s.score - minVal) / range) * chartH;
    return { x, y, score: s.score, date: s.recorded_at };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');
  const trend = values.length >= 2 ? values[values.length - 1] - values[0] : 0;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const y = padT + chartH - frac * chartH;
          const val = Math.round(minVal + frac * range);
          return (
            <g key={frac}>
              <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="var(--grey-5, #e5e5e5)" strokeWidth="0.5" />
              <text x={padL - 8} y={y + 4} textAnchor="end" style={{ fontSize: 10, fill: 'var(--ki-text-secondary)' }}>{val}</text>
            </g>
          );
        })}
        <polyline points={polyline} fill="none" stroke="var(--ki-red)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <polygon
          points={`${points[0].x},${padT + chartH} ${polyline} ${points[points.length - 1].x},${padT + chartH}`}
          fill="var(--ki-red)" opacity="0.06"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="var(--ki-red)" strokeWidth="2" />
            <text x={p.x} y={p.y - 10} textAnchor="middle"
              style={{ fontSize: 10, fontWeight: 600, fill: 'var(--ki-text)' }}>{p.score}</text>
          </g>
        ))}
        {points.map((p, i) => {
          const d = new Date(p.date);
          const label = `${d.getDate()}.${d.getMonth() + 1}`;
          return (
            <text key={i} x={p.x} y={height - 6} textAnchor="middle"
              style={{ fontSize: 9, fill: 'var(--ki-text-secondary)' }}>{label}</text>
          );
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 8 }}>
        <span className={trend > 0 ? 'pill pill-green' : trend < 0 ? 'pill pill-red' : 'pill pill-grey'} style={{ fontSize: 11 }}>
          Trend: {trend > 0 ? '+' : ''}{trend} Punkte
        </span>
        <span className="pill pill-grey" style={{ fontSize: 11 }}>
          Aktuell: {values[values.length - 1]}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function BrandingClient({ userId, existing, profile }) {
  const supabase = createClient();

  // ---- Existing LinkedIn analysis state ----
  const [linkedinUrl, setLinkedinUrl] = useState(existing?.linkedin_url || '');
  const [headline, setHeadline] = useState(existing?.current_headline || '');
  const [visScore, setVisScore] = useState(existing?.visibility_score || null);
  const [contentIdeas, setContentIdeas] = useState(existing?.content_suggestions || []);
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(existing?.ai_feedback || '');
  const [existingSuggestions, setExistingSuggestions] = useState(existing?.suggested_headlines || []);

  // ---- Headline Generator state ----
  const [genPosition, setGenPosition] = useState(profile?.position || '');
  const [genSkills, setGenSkills] = useState(['', '', '']);
  const [genTarget, setGenTarget] = useState(profile?.career_goal || '');
  const [genSkillInput, setGenSkillInput] = useState('');
  const [genSkillTags, setGenSkillTags] = useState([]);
  const [genLoading, setGenLoading] = useState(false);
  const [genHeadlines, setGenHeadlines] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);

  // ---- Profil-Checkliste state ----
  const [checklist, setChecklist] = useState(() =>
    CHECKLIST_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: false }), {})
  );
  const [checklistAwarded, setChecklistAwarded] = useState(false);

  // ---- SSI state ----
  const [ssiScore, setSsiScore] = useState('');
  const [ssiScores, setSsiScores] = useState([]);
  const [ssiSaving, setSsiSaving] = useState(false);

  // ---- Template editor state ----
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [editorText, setEditorText] = useState('');
  const [optimizing, setOptimizing] = useState(false);
  const [optimizeResult, setOptimizeResult] = useState(null);
  const [postAwarded, setPostAwarded] = useState(false);

  // ---- Toast ----
  const [toast, setToast] = useState(null);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }

  // Load SSI scores on mount
  useEffect(() => {
    const loadSsiScores = async () => {
      const { data } = await supabase
        .from('ssi_scores')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: true })
        .limit(12);
      if (data) setSsiScores(data);
    };
    loadSsiScores();
  }, [userId]);

  // ---------------------------------------------------------------------------
  // Existing analyze handler
  // ---------------------------------------------------------------------------
  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/linkedin-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkedinUrl,
          currentHeadline: headline,
          careerGoal: profile?.career_goal,
          position: profile?.position,
        }),
      });
      const data = await res.json();
      setExistingSuggestions(data.suggested_headlines || []);
      setVisScore(data.visibility_score || 50);
      setContentIdeas(data.content_suggestions || []);
      setFeedback(data.ai_feedback || '');
      await supabase.from('linkedin_analysis').upsert(
        {
          user_id: userId,
          linkedin_url: linkedinUrl,
          current_headline: headline,
          suggested_headlines: data.suggested_headlines,
          visibility_score: data.visibility_score,
          content_suggestions: data.content_suggestions,
          ai_feedback: data.ai_feedback,
          analyzed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
    } catch (err) {
      console.error(err);
    }
    setAnalyzing(false);
  };

  // ---------------------------------------------------------------------------
  // Headline Generator
  // ---------------------------------------------------------------------------
  const handleAddSkillTag = () => {
    const trimmed = genSkillInput.trim();
    if (!trimmed || genSkillTags.length >= 3) return;
    setGenSkillTags((prev) => [...prev, trimmed]);
    setGenSkillInput('');
  };

  const handleRemoveSkillTag = (idx) => {
    setGenSkillTags((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleGenerateHeadlines = async () => {
    if (!genPosition.trim() || !genTarget.trim()) return;
    setGenLoading(true);
    setGenHeadlines([]);

    // Try API first; fall back to client-side generation
    try {
      const res = await fetch('/api/linkedin-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Aktuelle Position: ${genPosition}\nSkills: ${genSkillTags.join(', ')}\nZiel-Position: ${genTarget}`,
          template_type: 'headline',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // If the API returns headline suggestions directly
        if (data.headlines && Array.isArray(data.headlines)) {
          setGenHeadlines(data.headlines.slice(0, 5));
          setGenLoading(false);
          return;
        }
        // Otherwise parse from optimized_text as newlines
        if (data.optimized_text) {
          const lines = data.optimized_text.split('\n').map((l) => l.trim()).filter(Boolean);
          if (lines.length >= 2) {
            setGenHeadlines(lines.slice(0, 5));
            setGenLoading(false);
            return;
          }
        }
      }
    } catch (_) {
      // fall through to client-side
    }

    // Client-side fallback
    const variations = generateHeadlineVariations(genPosition, genSkillTags, genTarget);
    setGenHeadlines(variations);
    setGenLoading(false);
  };

  const handleCopyHeadline = (text, idx) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      showToast('Headline kopiert!');
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  // ---------------------------------------------------------------------------
  // Profil-Checkliste
  // ---------------------------------------------------------------------------
  const checklistPercent = Math.round(
    (Object.values(checklist).filter(Boolean).length / CHECKLIST_ITEMS.length) * 100
  );

  const handleChecklistToggle = async (id) => {
    const newChecklist = { ...checklist, [id]: !checklist[id] };
    setChecklist(newChecklist);

    // Award +50 XP once when profile reaches 100%
    const allDone = Object.values(newChecklist).every(Boolean);
    if (allDone && !checklistAwarded) {
      setChecklistAwarded(true);
      await awardPoints(supabase, userId, 'COMPLETE_LESSON'); // 50 XP
      showToast('+50 XP für optimiertes Profil!');
    }
  };

  // ---------------------------------------------------------------------------
  // SSI save handler
  // ---------------------------------------------------------------------------
  const handleSaveSsi = async () => {
    const score = parseInt(ssiScore, 10);
    if (isNaN(score) || score < 1 || score > 100) return;
    setSsiSaving(true);
    try {
      const { data, error } = await supabase
        .from('ssi_scores')
        .insert({ user_id: userId, score, recorded_at: new Date().toISOString() })
        .select()
        .single();
      if (!error && data) {
        setSsiScores((prev) => [...prev, data].slice(-12));
        setSsiScore('');
        showToast('SSI-Score gespeichert!');
      }
    } catch (err) {
      console.error(err);
    }
    setSsiSaving(false);
  };

  // ---------------------------------------------------------------------------
  // Template editor
  // ---------------------------------------------------------------------------
  const handleTemplateClick = (template) => {
    setActiveTemplate(template);
    setEditorText(template.text);
    setOptimizeResult(null);
    setPostAwarded(false);
    // scroll to editor
    setTimeout(() => {
      document.getElementById('template-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleOptimize = async () => {
    if (!editorText.trim()) return;
    setOptimizing(true);
    setOptimizeResult(null);
    try {
      const res = await fetch('/api/linkedin-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editorText, template_type: activeTemplate?.id || 'general' }),
      });
      const data = await res.json();
      setOptimizeResult(data);

      // Award +20 XP for creating a post (once per template session)
      if (!postAwarded) {
        setPostAwarded(true);
        await awardPoints(supabase, userId, 'CONTACT_ADDED'); // 20 XP
        showToast('+20 XP für erstellten Post!');
      }
    } catch (err) {
      console.error(err);
    }
    setOptimizing(false);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="page-container" style={{ maxWidth: 720, position: 'relative' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: toast.type === 'success' ? 'var(--ki-success)' : 'var(--ki-red)',
          color: '#fff', padding: '10px 20px', borderRadius: 'var(--r-md)',
          fontSize: 14, fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {toast.msg}
        </div>
      )}

      <h1 className="page-title">Personal Branding <InfoTooltip moduleId="branding" profile={profile} /></h1>
      <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 32, fontSize: 15 }}>
        Optimiere deine LinkedIn-Präsenz — werde gefunden statt zu suchen.
      </p>

      {/* ------------------------------------------------------------------ */}
      {/* 1. Headline Generator                                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="card animate-in" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>🤖 Headline-Generator</h3>
        <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
          Gib deine aktuelle Position, bis zu 3 Skills und dein Ziel ein — KI generiert 5 Vorschläge.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            className="input"
            placeholder="Aktuelle Position (z.B. Projektmanager, Senior Developer)"
            value={genPosition}
            onChange={(e) => setGenPosition(e.target.value)}
          />

          {/* Skill Tags */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                className="input"
                placeholder={`Skill hinzufügen (${genSkillTags.length}/3)`}
                value={genSkillInput}
                onChange={(e) => setGenSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkillTag()}
                disabled={genSkillTags.length >= 3}
                style={{ flex: 1 }}
              />
              <button
                className="btn btn-secondary"
                onClick={handleAddSkillTag}
                disabled={!genSkillInput.trim() || genSkillTags.length >= 3}
              >
                + Tag
              </button>
            </div>
            {genSkillTags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {genSkillTags.map((tag, i) => (
                  <span key={i} className="pill pill-grey" style={{ fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {tag}
                    <span onClick={() => handleRemoveSkillTag(i)} style={{ opacity: 0.6, fontWeight: 700, lineHeight: 1 }}>×</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <input
            className="input"
            placeholder="Ziel-Position (z.B. Head of Product, VP Engineering)"
            value={genTarget}
            onChange={(e) => setGenTarget(e.target.value)}
          />

          <button
            className="btn btn-primary"
            onClick={handleGenerateHeadlines}
            disabled={genLoading || !genPosition.trim() || !genTarget.trim()}
            style={{ width: '100%' }}
          >
            {genLoading ? 'Generiere Vorschläge...' : '🤖 Generieren'}
          </button>
        </div>

        {/* Headline Suggestions */}
        {genHeadlines.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text-secondary)', marginBottom: 10 }}>
              5 Headline-Vorschläge:
            </div>
            {genHeadlines.map((h, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  padding: '12px 14px', marginBottom: 8, borderRadius: 'var(--r-md)',
                  background: i === 0 ? 'rgba(204,20,38,0.05)' : 'var(--ki-bg-alt)',
                  border: i === 0 ? '1px solid rgba(204,20,38,0.2)' : '1px solid var(--ki-border)',
                }}
              >
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {i === 0 && <span className="pill pill-red" style={{ fontSize: 10, flexShrink: 0 }}>TOP</span>}
                  <span style={{ fontSize: 14, fontWeight: i === 0 ? 600 : 400, lineHeight: 1.4 }}>{h}</span>
                </div>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleCopyHeadline(h, i)}
                  style={{ fontSize: 12, flexShrink: 0, color: copiedIdx === i ? 'var(--ki-success)' : undefined }}
                >
                  {copiedIdx === i ? '✓ Kopiert' : 'Kopieren'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Profil-Checkliste                                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="card animate-in" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Profil-Checkliste</h3>
            <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
              Hake ab, was du bereits optimiert hast. 100% = +50 XP.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CHECKLIST_ITEMS.map((item) => (
                <label
                  key={item.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                    padding: '10px 14px', borderRadius: 'var(--r-md)',
                    background: checklist[item.id] ? 'rgba(34,197,94,0.07)' : 'var(--ki-bg-alt)',
                    border: checklist[item.id] ? '1px solid rgba(34,197,94,0.25)' : '1px solid var(--ki-border)',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => handleChecklistToggle(item.id)}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                    border: checklist[item.id] ? '2px solid var(--ki-success)' : '2px solid var(--ki-border)',
                    background: checklist[item.id] ? 'var(--ki-success)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}>
                    {checklist[item.id] && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={{
                    fontSize: 14,
                    color: checklist[item.id] ? 'var(--ki-success)' : 'var(--ki-text)',
                    textDecoration: checklist[item.id] ? 'line-through' : 'none',
                    fontWeight: checklist[item.id] ? 400 : 500,
                    transition: 'color 0.2s ease',
                  }}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Progress Ring */}
          <div style={{ flexShrink: 0, paddingTop: 8 }}>
            <ProfileRing percent={checklistPercent} size={140} />
            <div style={{ textAlign: 'center', marginTop: 6, fontSize: 12, color: 'var(--ki-text-secondary)' }}>
              {Object.values(checklist).filter(Boolean).length}/{CHECKLIST_ITEMS.length} erledigt
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 16 }}>
          <div className="progress-bar" style={{ background: 'var(--ki-bg-alt)', borderRadius: 99, overflow: 'hidden', height: 6 }}>
            <div style={{
              height: '100%', width: `${checklistPercent}%`,
              background: checklistPercent === 100 ? 'var(--ki-success)' : checklistPercent >= 50 ? 'var(--ki-warning)' : 'var(--ki-red)',
              borderRadius: 99, transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginTop: 6, textAlign: 'right' }}>
            {checklistPercent === 100
              ? '🎉 Profil vollständig optimiert! +50 XP erhalten.'
              : checklistPercent >= 50
              ? 'Gut — weiter optimieren!'
              : 'Noch viel Potenzial — hake weitere Punkte ab.'}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. LinkedIn Profil-Analyse (existing)                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="card animate-in" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Profil-Analyse (KI)</h3>
        <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
          KI analysiert dein Profil und gibt dir einen Sichtbarkeits-Score + Feedback.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            className="input"
            placeholder="LinkedIn-URL (z.B. linkedin.com/in/dein-name)"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
          />
          <input
            className="input"
            placeholder="Aktuelle Headline (z.B. 'Projektmanager bei Firma X')"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={analyzing || !headline}
            style={{ width: '100%' }}
          >
            {analyzing ? 'KI analysiert...' : 'Profil analysieren & optimieren'}
          </button>
        </div>
      </div>

      {/* Visibility Score + Feedback */}
      {visScore !== null && (
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="card animate-in" style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Sichtbarkeits-Score
            </div>
            <ScoreRing score={visScore} />
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 8 }}>
              {visScore >= 70 ? 'Stark — du wirst gefunden!' : visScore >= 40 ? 'Ausbaufähig — Potenzial vorhanden' : 'Unsichtbar — dringend optimieren'}
            </div>
          </div>
          <div className="card animate-in">
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>KI-Feedback</div>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>{feedback}</p>
          </div>
        </div>
      )}

      {/* Headline Suggestions from analysis */}
      {existingSuggestions.length > 0 && (
        <div className="card animate-in" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Headline-Vorschläge (Analyse)</h3>
          <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>
            Aktuell: <span style={{ textDecoration: 'line-through' }}>{headline}</span>
          </div>
          {existingSuggestions.map((s, i) => (
            <div key={i} style={{
              padding: 12, borderRadius: 'var(--r-md)', marginBottom: 8,
              background: i === 0 ? 'rgba(204,20,38,0.04)' : 'var(--ki-bg-alt)',
              border: i === 0 ? '1px solid rgba(204,20,38,0.15)' : '1px solid transparent',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {i === 0 && <span className="pill pill-red" style={{ fontSize: 10 }}>TOP</span>}
                <span style={{ fontSize: 15, fontWeight: i === 0 ? 600 : 400 }}>{s}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Ideas */}
      {contentIdeas.length > 0 && (
        <div className="card animate-in" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Content-Ideen für diese Woche</h3>
          <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>
            Poste regelmäßig, um deine Expertise sichtbar zu machen.
          </p>
          {contentIdeas.map((idea, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--ki-border)' }}>
              <span style={{ color: 'var(--ki-red)', fontWeight: 700, fontSize: 14, minWidth: 20 }}>{i + 1}</span>
              <span style={{ fontSize: 14 }}>{idea}</span>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. Post-Templates                                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="card animate-in" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Post-Templates</h3>
        <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
          Wähle ein Template und erstelle deinen nächsten LinkedIn-Post. +20 XP pro KI-Optimierung.
        </p>
        <div className="grid-3" style={{ gap: 12 }}>
          {POST_TEMPLATES.map((t) => (
            <div
              key={t.id}
              className="card"
              onClick={() => handleTemplateClick(t)}
              style={{
                cursor: 'pointer', padding: 16, textAlign: 'center',
                border: activeTemplate?.id === t.id ? `2px solid ${t.color}` : '1px solid var(--ki-border)',
                transition: 'border-color 0.2s, transform 0.15s',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.title}</div>
              <div style={{ fontSize: 11, color: 'var(--ki-text-secondary)' }}>{t.subtitle}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Template Editor */}
      {activeTemplate && (
        <div id="template-editor" className="card animate-in" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>
              {activeTemplate.icon} {activeTemplate.title}
            </h3>
            <button
              className="btn btn-ghost"
              onClick={() => { setActiveTemplate(null); setOptimizeResult(null); }}
              style={{ fontSize: 13 }}
            >
              Schließen
            </button>
          </div>
          <textarea
            className="input"
            value={editorText}
            onChange={(e) => setEditorText(e.target.value)}
            rows={12}
            style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={handleOptimize}
              disabled={optimizing || !editorText.trim()}
            >
              {optimizing ? 'KI optimiert...' : '🤖 KI verbessern'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                navigator.clipboard.writeText(optimizeResult?.optimized_text || editorText);
                showToast('Post kopiert!');
              }}
            >
              Kopieren
            </button>
          </div>

          {optimizeResult && (
            <div style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text-secondary)', marginBottom: 6 }}>Optimierter Text</div>
                <div className="card" style={{ padding: 16, background: 'var(--ki-bg-alt)', whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.7 }}>
                  {optimizeResult.optimized_text}
                </div>
              </div>

              {optimizeResult.hook_suggestion && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text-secondary)', marginBottom: 6 }}>Hook-Vorschlag (erste Zeile)</div>
                  <div className="card" style={{ padding: 12, background: 'rgba(204,20,38,0.04)', border: '1px solid rgba(204,20,38,0.15)', fontSize: 14, fontWeight: 500 }}>
                    {optimizeResult.hook_suggestion}
                  </div>
                </div>
              )}

              {optimizeResult.hashtags?.length > 0 && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text-secondary)', marginBottom: 6 }}>Empfohlene Hashtags</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {optimizeResult.hashtags.map((tag, i) => (
                      <span key={i} className="pill pill-grey" style={{ fontSize: 12 }}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <button
                className="btn btn-secondary"
                style={{ marginTop: 12 }}
                onClick={() => setEditorText(optimizeResult.optimized_text)}
              >
                Optimierten Text übernehmen
              </button>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. SSI Score Tracker                                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="card animate-in" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>SSI Score Tracker</h3>
        <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
          Tracke deinen LinkedIn Social Selling Index (1–100) über die letzten 12 Wochen.{' '}
          <a
            href="https://www.linkedin.com/sales/ssi"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--ki-red)', textDecoration: 'underline' }}
          >
            Meinen SSI-Score herausfinden →
          </a>
        </p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <input
            className="input"
            type="number"
            min="1" max="100"
            placeholder="SSI Score (1–100)"
            value={ssiScore}
            onChange={(e) => setSsiScore(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveSsi()}
            style={{ flex: 1 }}
          />
          <button
            className="btn btn-primary"
            onClick={handleSaveSsi}
            disabled={ssiSaving || !ssiScore}
          >
            {ssiSaving ? 'Speichern...' : 'Eintragen'}
          </button>
        </div>
        <SsiChart scores={ssiScores} />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 6. Video Placeholder                                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="card animate-in" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>🎬 LinkedIn-Profil in 30 Minuten optimieren</h3>
        <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
          Schritt-für-Schritt Anleitung von unserem Karriere-Coach.
        </p>
        <div style={{
          background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-lg)',
          aspectRatio: '16/9', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 12,
          border: '2px dashed var(--ki-border)',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--ki-red)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
          <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', fontWeight: 500 }}>
            Video kommt bald
          </div>
          <span className="pill pill-grey" style={{ fontSize: 11 }}>ca. 30 Minuten</span>
        </div>
      </div>

    </div>
  );
}
