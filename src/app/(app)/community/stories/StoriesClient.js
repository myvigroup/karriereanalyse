'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { hasAccess } from '@/lib/access-control';
import UpgradePrompt from '@/components/ui/UpgradePrompt';
import EmptyState from '@/components/ui/EmptyState';

export default function StoriesClient({ stories: initial, profile, userId }) {
  const supabase = createClient();
  const [stories, setStories] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ before_position: '', before_salary_range: '', after_position: '', after_salary_range: '', tip: '', timeframe: '' });
  const [saving, setSaving] = useState(false);

  if (!hasAccess(profile, 'community')) {
    return (
      <div className="page-container">
        <h1 className="page-title">Erfolgs-Stories</h1>
        <UpgradePrompt productName="Community" features={['Vorher/Nachher Stories', 'Tipps der Community', 'Inspiration']} />
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!form.before_position || !form.after_position || !form.tip) return;
    setSaving(true);
    const { data } = await supabase.from('success_stories').insert({
      user_id: userId, ...form, approved: false,
    }).select().single();
    if (data) setStories(prev => [data, ...prev]);
    setShowForm(false);
    setForm({ before_position: '', before_salary_range: '', after_position: '', after_salary_range: '', tip: '', timeframe: '' });
    setSaving(false);
  };

  const handleLike = async (id) => {
    const story = stories.find(s => s.id === id);
    setStories(prev => prev.map(s => s.id === id ? { ...s, likes: (s.likes || 0) + 1 } : s));
    await supabase.from('success_stories').update({ likes: (story?.likes || 0) + 1 }).eq('id', id);
  };

  const approved = stories.filter(s => s.approved || s.user_id === userId);

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Erfolgs-Stories</h1>
          <p className="page-subtitle">Echte Karriere-Transformationen</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} style={{ fontSize: 13 }}>
          {showForm ? 'Abbrechen' : '+ Meine Story teilen'}
        </button>
      </div>

      {/* Submit Form */}
      {showForm && (
        <div className="card animate-in" style={{ marginBottom: 24, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Deine Erfolgs-Story</h3>
          <div className="grid-2" style={{ marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Vorher: Position</label>
              <input className="input" placeholder="z.B. Junior Developer" value={form.before_position} onChange={e => setForm(p => ({ ...p, before_position: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Vorher: Gehaltsrange</label>
              <input className="input" placeholder="z.B. 40-45k" value={form.before_salary_range} onChange={e => setForm(p => ({ ...p, before_salary_range: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Nachher: Position</label>
              <input className="input" placeholder="z.B. Senior Engineer" value={form.after_position} onChange={e => setForm(p => ({ ...p, after_position: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Nachher: Gehaltsrange</label>
              <input className="input" placeholder="z.B. 65-75k" value={form.after_salary_range} onChange={e => setForm(p => ({ ...p, after_salary_range: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Zeitraum</label>
            <input className="input" placeholder="z.B. 8 Monate" value={form.timeframe} onChange={e => setForm(p => ({ ...p, timeframe: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Dein Tipp (max. 280 Zeichen)</label>
            <textarea className="input" rows={3} maxLength={280} placeholder="Was hat den Unterschied gemacht?" value={form.tip} onChange={e => setForm(p => ({ ...p, tip: e.target.value }))} style={{ resize: 'none' }} />
            <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textAlign: 'right', marginTop: 4 }}>{form.tip.length}/280</div>
          </div>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving || !form.tip || !form.before_position || !form.after_position} style={{ opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Wird eingereicht...' : 'Story einreichen (wird moderiert)'}
          </button>
        </div>
      )}

      {/* Stories */}
      {approved.length === 0 ? (
        <EmptyState icon={'\u{1F4D6}'} title="Noch keine Stories" description="Sei der Erste! Teile deine Karriere-Transformation." ctaText="Meine Story teilen" ctaLink="#" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {approved.map(s => (
            <div key={s.id} className="card animate-in" style={{ padding: 24 }}>
              {!s.approved && s.user_id === userId && (
                <span className="pill pill-gold" style={{ fontSize: 11, marginBottom: 12, display: 'inline-block' }}>Wartet auf Freigabe</span>
              )}
              <div style={{ display: 'flex', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Vorher</div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{s.before_position}</div>
                  {s.before_salary_range && <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>{s.before_salary_range}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, color: 'var(--ki-success)' }}>{'\u2192'}</div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Nachher</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ki-success)' }}>{s.after_position}</div>
                  {s.after_salary_range && <div style={{ fontSize: 13, color: 'var(--ki-success)' }}>{s.after_salary_range}</div>}
                </div>
                {s.timeframe && <span className="pill pill-grey" style={{ alignSelf: 'center', fontSize: 11 }}>{s.timeframe}</span>}
              </div>
              {s.tip && (
                <div style={{ padding: '12px 16px', background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)', fontSize: 14, fontStyle: 'italic', borderLeft: '3px solid var(--ki-red)' }}>
                  &ldquo;{s.tip}&rdquo;
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>
                  {new Date(s.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <button onClick={() => handleLike(s.id)} className="btn btn-ghost" style={{ fontSize: 13, padding: '4px 10px' }}>
                  {'\u2764\uFE0F'} {s.likes || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
