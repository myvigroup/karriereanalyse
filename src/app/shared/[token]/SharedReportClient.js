'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { calculateOverallScore, calculatePriorities, classifyScore, prepareRadarData } from '@/lib/career-logic';

function RadarChart({ data, size = 300 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const n = data.length;
  if (n === 0) return null;

  const getPoint = (i, val) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const dist = (val / 100) * r;
    return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist };
  };

  const rings = [25, 50, 75, 100];
  const points = data.map((d, i) => getPoint(i, d.value));
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', maxWidth: size }}>
      {rings.map(ring => {
        const pts = Array.from({ length: n }, (_, i) => getPoint(i, ring));
        return <polygon key={ring} points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="var(--grey-5)" strokeWidth="0.5" />;
      })}
      {data.map((_, i) => {
        const end = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="var(--grey-5)" strokeWidth="0.5" />;
      })}
      <polygon points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(204,20,38,0.1)" stroke="var(--ki-red)" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--ki-red)" />
      ))}
      {data.map((d, i) => {
        const labelPt = getPoint(i, 118);
        return (
          <text key={i} x={labelPt.x} y={labelPt.y} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: 10, fill: 'var(--ki-text-secondary)', fontFamily: 'Instrument Sans' }}>
            {d.icon}
          </text>
        );
      })}
    </svg>
  );
}

export default function SharedReportClient({ report, results, session, token }) {
  const supabase = createClient();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(report.comments || []);
  const [submitting, setSubmitting] = useState(false);

  const scores = results.map(r => ({
    fieldId: r.field_id,
    score: r.score,
    title: r.competency_fields?.title || '',
    icon: r.competency_fields?.icon || '',
    slug: r.competency_fields?.slug || '',
    sort_order: r.competency_fields?.sort_order || 0,
  }));

  const overall = session?.overall_score || calculateOverallScore(scores);
  const prios = calculatePriorities(scores);
  const radarData = prepareRadarData(results.map(r => ({
    ...r, title: r.competency_fields?.title, icon: r.competency_fields?.icon, sort_order: r.competency_fields?.sort_order || 0,
  })));
  const sorted = [...scores].sort((a, b) => a.score - b.score);
  const ownerName = report.is_anonymized ? 'Anonymer Nutzer' : (report.profiles?.name || 'Nutzer');

  async function submitComment() {
    if (!comment.trim()) return;
    setSubmitting(true);
    const newComments = [...comments, { text: comment, created_at: new Date().toISOString(), author: report.recipient_name || 'Anonym' }];
    await supabase.from('shared_reports').update({ comments: newComments }).eq('share_token', token);
    setComments(newComments);
    setComment('');
    setSubmitting(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ki-bg)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--ki-red)', textTransform: 'uppercase', marginBottom: 8 }}>Karriere-Institut</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 8 }}>Kompetenzanalyse</h1>
          <p style={{ color: 'var(--ki-text-secondary)', fontSize: 15 }}>Ergebnis von {ownerName}</p>
        </div>

        {/* Overall Score */}
        <div className="card" style={{ textAlign: 'center', marginBottom: 32, padding: 32 }}>
          <div style={{ fontSize: 56, fontWeight: 700, color: 'var(--ki-red)' }}>{Math.round(overall)}%</div>
          <p style={{ color: 'var(--ki-text-secondary)', marginTop: 4 }}>Gesamtscore</p>
        </div>

        {/* Radar + PRIOs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          <div className="card" style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
            <RadarChart data={radarData} size={300} />
          </div>
          <div className="card">
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Fokus-Bereiche</h3>
            {[prios.prio1, prios.prio2, prios.prio3].filter(Boolean).map((p, i) => {
              const cls = classifyScore(p.score);
              return (
                <div key={p.fieldId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--ki-border)' : 'none' }}>
                  <span className="pill pill-red">PRIO {i + 1}</span>
                  <span style={{ flex: 1, fontWeight: 500 }}>{p.title}</span>
                  <span style={{ fontWeight: 700, color: cls.color }}>{Math.round(p.score)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Scores */}
        <div className="card" style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Alle Kompetenzfelder</h3>
          {sorted.map((s, i) => {
            const cls = classifyScore(s.score);
            return (
              <div key={s.fieldId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--ki-border)' }}>
                <span style={{ fontSize: 16, width: 24, textAlign: 'center' }}>{s.icon}</span>
                <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{s.title}</span>
                <div style={{ width: 100 }}>
                  <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${s.score}%`, background: cls.color }} /></div>
                </div>
                <span style={{ fontWeight: 600, color: cls.color, minWidth: 36, textAlign: 'right', fontSize: 14 }}>{Math.round(s.score)}%</span>
              </div>
            );
          })}
        </div>

        {/* Comment Box */}
        <div className="card">
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Kommentare</h3>
          {comments.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {comments.map((c, i) => (
                <div key={i} style={{ padding: 12, background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)' }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{c.author}</div>
                  <div style={{ fontSize: 14, marginTop: 4 }}>{c.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', marginTop: 4 }}>
                    {new Date(c.created_at).toLocaleDateString('de-DE')}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <textarea
              className="input"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Kommentar schreiben..."
              rows={2}
              style={{ resize: 'vertical' }}
            />
            <button onClick={submitComment} className="btn btn-primary" disabled={submitting || !comment.trim()} style={{ alignSelf: 'flex-end' }}>
              Senden
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 12, color: 'var(--ki-text-tertiary)' }}>
          Erstellt mit dem Karriere-Institut OS
        </div>
      </div>
    </div>
  );
}
