'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function BrandingClient({ userId, existing, profile }) {
  const supabase = createClient();
  const [linkedinUrl, setLinkedinUrl] = useState(existing?.linkedin_url || '');
  const [headline, setHeadline] = useState(existing?.current_headline || '');
  const [suggestions, setSuggestions] = useState(existing?.suggested_headlines || []);
  const [visScore, setVisScore] = useState(existing?.visibility_score || null);
  const [contentIdeas, setContentIdeas] = useState(existing?.content_suggestions || []);
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(existing?.ai_feedback || '');

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/linkedin-analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedinUrl, currentHeadline: headline, careerGoal: profile?.career_goal, position: profile?.position }),
      });
      const data = await res.json();
      setSuggestions(data.suggested_headlines || []);
      setVisScore(data.visibility_score || 50);
      setContentIdeas(data.content_suggestions || []);
      setFeedback(data.ai_feedback || '');
      // Save to DB
      await supabase.from('linkedin_analysis').upsert({
        user_id: userId, linkedin_url: linkedinUrl, current_headline: headline,
        suggested_headlines: data.suggested_headlines, visibility_score: data.visibility_score,
        content_suggestions: data.content_suggestions, ai_feedback: data.ai_feedback,
        analyzed_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    } catch (err) { console.error(err); }
    setAnalyzing(false);
  };

  const ScoreRing = ({ score, size = 120 }) => {
    const r = (size - 12) / 2, c = 2 * Math.PI * r, offset = c - (score / 100) * c;
    const color = score >= 70 ? 'var(--ki-success)' : score >= 40 ? 'var(--ki-warning)' : 'var(--ki-red)';
    return (
      <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--grey-5)" strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: 'stroke-dashoffset 1s var(--ease-apple)' }} />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 28, fontWeight: 700, fill: color, fontFamily: 'Instrument Sans' }}>{score}</text>
      </svg>
    );
  };

  return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      <h1 className="page-title">Personal Branding</h1>
      <p className="page-subtitle" style={{ marginBottom: 32 }}>Optimiere deine LinkedIn-Präsenz — werde gefunden statt zu suchen.</p>

      {/* Input */}
      <div className="card animate-in" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Dein LinkedIn-Profil</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input className="input" placeholder="LinkedIn-URL (z.B. linkedin.com/in/dein-name)" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} />
          <input className="input" placeholder="Aktuelle Headline (z.B. 'Projektmanager bei Firma X')" value={headline} onChange={e => setHeadline(e.target.value)} />
          <button className="btn btn-primary" onClick={handleAnalyze} disabled={analyzing || !headline} style={{ width: '100%' }}>
            {analyzing ? '🤖 KI analysiert...' : '🤖 Profil analysieren & optimieren'}
          </button>
        </div>
      </div>

      {/* Visibility Score */}
      {visScore !== null && (
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="card animate-in" style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sichtbarkeits-Score</div>
            <ScoreRing score={visScore} />
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 8 }}>
              {visScore >= 70 ? 'Stark — du wirst gefunden!' : visScore >= 40 ? 'Ausbaufähig — Potenzial vorhanden' : 'Unsichtbar — dringend optimieren'}
            </div>
          </div>
          <div className="card animate-in">
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>KI-Feedback</div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ki-text)' }}>{feedback}</p>
          </div>
        </div>
      )}

      {/* Headline Suggestions */}
      {suggestions.length > 0 && (
        <div className="card animate-in" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>✨ Headline-Vorschläge</h3>
          <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>
            Aktuell: <span style={{ textDecoration: 'line-through' }}>{headline}</span>
          </div>
          {suggestions.map((s, i) => (
            <div key={i} style={{
              padding: 12, background: i === 0 ? 'rgba(204,20,38,0.04)' : 'var(--ki-bg-alt)',
              borderRadius: 'var(--r-md)', marginBottom: 8,
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
        <div className="card animate-in">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>📝 Content-Ideen für diese Woche</h3>
          <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>Poste regelmäßig, um deine Expertise sichtbar zu machen.</p>
          {contentIdeas.map((idea, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--ki-border)' }}>
              <span style={{ color: 'var(--ki-red)', fontWeight: 700, fontSize: 14, minWidth: 20 }}>{i + 1}</span>
              <span style={{ fontSize: 14 }}>{idea}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
