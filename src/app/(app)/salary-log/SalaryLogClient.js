'use client';
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { awardPoints } from '@/lib/gamification';
import InfoTooltip from '@/components/ui/InfoTooltip';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EVENT_TYPES = [
  { key: 'annual_review', label: 'Jahresgespräch', icon: '📅' },
  { key: 'promotion', label: 'Beförderung', icon: '⬆' },
  { key: 'offer', label: 'Externes Angebot', icon: '✉' },
  { key: 'counter_offer', label: 'Gegenangebot', icon: '↩' },
  { key: 'raise', label: 'Gehaltserhöhung', icon: '💰' },
  { key: 'bonus', label: 'Bonus/Sonderzahlung', icon: '🎁' },
];

const WIN_CATEGORIES = [
  { key: 'project',    label: 'Projekt',  icon: '🏆', color: 'pill-green' },
  { key: 'feedback',   label: 'Feedback', icon: '💬', color: 'pill-gold'  },
  { key: 'revenue',    label: 'Umsatz',   icon: '💰', color: 'pill-red'   },
  { key: 'skill',      label: 'Skill',    icon: '🧠', color: 'pill-grey'  },
  { key: 'leadership', label: 'Führung',  icon: '👥', color: 'pill-red'   },
  { key: 'general',    label: 'Sonstiges',icon: '⭐', color: 'pill-grey'  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setHours(0, 0, 0, 0);
  date.setDate(diff);
  return date;
}

function isMonday() {
  return new Date().getDay() === 1;
}

function isoDate(d) {
  // returns YYYY-MM-DD in local time
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function entryDate(e) {
  return new Date(e.win_date || e.date || e.created_at);
}

function monthKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key) {
  const [y, m] = key.split('-');
  return new Date(+y, +m - 1, 1).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          style={{
            fontSize: 24,
            cursor: 'pointer',
            color: n <= (hovered || value) ? '#eab308' : 'var(--ki-border)',
            transition: 'color 0.1s',
            userSelect: 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function CategoryPill({ cat, selected, onClick }) {
  return (
    <button
      type="button"
      className={`pill ${cat.color}`}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        opacity: selected ? 1 : 0.45,
        outline: selected ? '2px solid var(--ki-red)' : 'none',
        outlineOffset: 2,
        transition: 'opacity 0.15s, outline 0.15s',
        fontWeight: selected ? 700 : 400,
      }}
    >
      {cat.icon} {cat.label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Heatmap (last 90 days)
// ---------------------------------------------------------------------------

function WinHeatmap({ wins }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build a map: isoDate → count
  const countMap = useMemo(() => {
    const m = {};
    wins.forEach(w => {
      const d = entryDate(w);
      const key = isoDate(d);
      m[key] = (m[key] || 0) + 1;
    });
    return m;
  }, [wins]);

  // Generate last 90 days, starting from Monday of that week
  const days = useMemo(() => {
    const arr = [];
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      arr.push(d);
    }
    return arr;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const maxCount = Math.max(1, ...Object.values(countMap));

  function cellColor(count) {
    if (!count) return 'var(--ki-bg-alt, #f3f4f6)';
    const intensity = count / maxCount;
    if (intensity < 0.25) return '#bbf7d0';
    if (intensity < 0.5)  return '#4ade80';
    if (intensity < 0.75) return '#16a34a';
    return '#14532d';
  }

  // Group days into weeks for the grid
  const weeks = useMemo(() => {
    const result = [];
    let week = [];
    days.forEach((d, idx) => {
      // day 0 = Sunday … we want Monday first
      const dow = (d.getDay() + 6) % 7; // 0=Mon … 6=Sun
      if (idx === 0 && dow > 0) {
        // Pad beginning of first week
        for (let p = 0; p < dow; p++) week.push(null);
      }
      week.push(d);
      if (week.length === 7) { result.push(week); week = []; }
    });
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      result.push(week);
    }
    return result;
  }, [days]);

  const dayLabels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  return (
    <div className="card" style={{ padding: 20, marginBottom: 24 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>90-Tage Win-Heatmap</h3>
      <p style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginBottom: 14 }}>
        Wie viele Wins hast du pro Tag eingetragen?
      </p>

      {/* Day-of-week labels */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 4, paddingLeft: 0 }}>
        {dayLabels.map(l => (
          <div key={l} style={{ width: 14, fontSize: 9, color: 'var(--ki-text-secondary)', textAlign: 'center', flexShrink: 0 }}>{l}</div>
        ))}
      </div>

      {/* Grid — one row per week */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', gap: 2 }}>
            {week.map((d, di) => {
              if (!d) return <div key={di} style={{ width: 14, height: 14 }} />;
              const key = isoDate(d);
              const count = countMap[key] || 0;
              return (
                <div
                  key={di}
                  title={`${d.toLocaleDateString('de-DE')}: ${count} Win${count !== 1 ? 's' : ''}`}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: cellColor(count),
                    flexShrink: 0,
                    cursor: 'default',
                    transition: 'transform 0.1s',
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
        <span style={{ fontSize: 11, color: 'var(--ki-text-secondary)' }}>Weniger</span>
        {['var(--ki-bg-alt, #f3f4f6)', '#bbf7d0', '#4ade80', '#16a34a', '#14532d'].map((c, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: c }} />
        ))}
        <span style={{ fontSize: 11, color: 'var(--ki-text-secondary)' }}>Mehr</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Win Timeline
// ---------------------------------------------------------------------------

function WinTimeline({ wins }) {
  // Group by month
  const grouped = useMemo(() => {
    const map = {};
    wins.forEach(w => {
      const d = entryDate(w);
      const k = monthKey(d);
      if (!map[k]) map[k] = [];
      map[k].push(w);
    });
    // Sort months descending
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [wins]);

  if (wins.length === 0) return null;

  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Win-Timeline</h2>
      {grouped.map(([mk, items]) => (
        <div key={mk} style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--ki-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 10,
            paddingBottom: 6,
            borderBottom: '1px solid var(--ki-border)',
          }}>
            {monthLabel(mk)}
          </div>

          {items.map(w => {
            const cat = WIN_CATEGORIES.find(c => c.key === w.win_category) || WIN_CATEGORIES[WIN_CATEGORIES.length - 1];
            const d = entryDate(w);
            const stars = w.impact_score || 0;
            return (
              <div key={w.id} className="card animate-in" style={{ marginBottom: 10, padding: '14px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ fontSize: 26, lineHeight: 1 }}>{cat.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span className={`pill ${cat.color}`} style={{ fontSize: 11 }}>{cat.icon} {cat.label}</span>
                      <span style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>
                        {d.toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{w.win_description || w.notes || '—'}</p>
                    {stars > 0 && (
                      <div style={{ marginTop: 6, display: 'flex', gap: 2 }}>
                        {[1,2,3,4,5].map(n => (
                          <span key={n} style={{ fontSize: 14, color: n <= stars ? '#eab308' : 'var(--ki-border)' }}>★</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Salary Entry Timeline
// ---------------------------------------------------------------------------

function SalaryTimeline({ entries }) {
  if (entries.length === 0) return null;

  // Group by month
  const grouped = useMemo(() => {
    const map = {};
    entries.forEach(e => {
      const d = new Date(e.date || e.created_at);
      const k = monthKey(d);
      if (!map[k]) map[k] = [];
      map[k].push(e);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [entries]);

  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Gehalts-Logbuch</h2>
      {grouped.map(([mk, items]) => (
        <div key={mk} style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--ki-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 10,
            paddingBottom: 6,
            borderBottom: '1px solid var(--ki-border)',
          }}>
            {monthLabel(mk)}
          </div>

          {items.map(e => {
            const type = EVENT_TYPES.find(t => t.key === e.event_type) || EVENT_TYPES[0];
            const winCat = WIN_CATEGORIES.find(c => c.key === e.win_category);
            const success = e.my_ask && e.final_result ? Math.round((e.final_result / e.my_ask) * 100) : null;
            return (
              <div key={e.id} className="card animate-in" style={{ marginBottom: 8, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{type.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{type.label}{e.company ? ` — ${e.company}` : ''}</div>
                    <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{new Date(e.date || e.created_at).toLocaleDateString('de-DE')}</span>
                      {winCat && <span className={`pill ${winCat.color}`} style={{ fontSize: 11 }}>{winCat.label}</span>}
                    </div>
                  </div>
                  {success != null && (
                    <span className={`pill ${success >= 90 ? 'pill-green' : success >= 70 ? 'pill-gold' : 'pill-red'}`}>{success}%</span>
                  )}
                </div>
                {(e.my_ask || e.their_offer || e.final_result) && (
                  <div style={{ display: 'flex', gap: 16, marginTop: 10, paddingLeft: 36, fontSize: 13 }}>
                    {e.my_ask && <span>Gefordert: <strong>€{(+e.my_ask).toLocaleString('de-DE')}</strong></span>}
                    {e.their_offer && <span>Angebot: <strong>€{(+e.their_offer).toLocaleString('de-DE')}</strong></span>}
                    {e.final_result && <span style={{ color: 'var(--ki-success)', fontWeight: 600 }}>Ergebnis: €{(+e.final_result).toLocaleString('de-DE')}</span>}
                  </div>
                )}
                {e.notes && <div style={{ marginTop: 8, paddingLeft: 36, fontSize: 13, color: 'var(--ki-text-secondary)' }}>{e.notes}</div>}
                {e.lessons_learned && <div style={{ marginTop: 8, paddingLeft: 36, fontSize: 13, color: 'var(--ki-text-secondary)', fontStyle: 'italic' }}>💡 {e.lessons_learned}</div>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Win Quick-Add Modal
// ---------------------------------------------------------------------------

const EMPTY_WIN_FORM = {
  win_category: 'general',
  win_description: '',
  impact_score: 3,
};

function WinModal({ onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_WIN_FORM);
  const [saving, setSaving] = useState(false);

  const canSave = form.win_description.trim().length > 0;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="card" style={{ width: 500, maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>🏆 Win des Tages</h3>
          <button className="btn btn-ghost" onClick={onClose} style={{ fontSize: 22, padding: '2px 8px', lineHeight: 1 }}>×</button>
        </div>

        <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
          Was hast du heute erreicht? Jeder Erfolg zählt — auch kleine.
        </p>

        {/* Description */}
        <textarea
          className="input"
          placeholder="Was hast du heute erreicht?"
          rows={4}
          value={form.win_description}
          onChange={e => setForm(p => ({ ...p, win_description: e.target.value }))}
          style={{ marginBottom: 16, resize: 'vertical' }}
          autoFocus
        />

        {/* Category Tags */}
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 8 }}>
          Kategorie
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {WIN_CATEGORIES.map(cat => (
            <CategoryPill
              key={cat.key}
              cat={cat}
              selected={form.win_category === cat.key}
              onClick={() => setForm(p => ({ ...p, win_category: cat.key }))}
            />
          ))}
        </div>

        {/* Impact Score */}
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 8 }}>
          Impact-Score
        </label>
        <div style={{ marginBottom: 24 }}>
          <StarRating value={form.impact_score} onChange={v => setForm(p => ({ ...p, impact_score: v }))} />
          <span style={{ fontSize: 11, color: 'var(--ki-text-secondary)', marginTop: 4, display: 'block' }}>
            {['', 'Kleiner Schritt', 'Solider Beitrag', 'Guter Erfolg', 'Großer Erfolg', 'Game Changer'][form.impact_score]}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Abbrechen</button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!canSave || saving}
            style={{ flex: 2, background: 'var(--ki-red)', opacity: !canSave ? 0.5 : 1 }}
          >
            {saving ? 'Wird gespeichert…' : '💾 Win speichern (+40 XP)'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Salary Add Modal
// ---------------------------------------------------------------------------

const EMPTY_SALARY_FORM = {
  event_type: 'annual_review',
  win_category: 'general',
  company: '',
  my_ask: '',
  their_offer: '',
  final_result: '',
  notes: '',
  lessons_learned: '',
};

function SalaryModal({ onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_SALARY_FORM);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="card" style={{ width: 500, maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto', padding: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Verhandlung dokumentieren</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <select className="input" value={form.event_type} onChange={e => setForm(p => ({ ...p, event_type: e.target.value }))}>
            {EVENT_TYPES.map(t => <option key={t.key} value={t.key}>{t.icon} {t.label}</option>)}
          </select>

          <div>
            <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginBottom: 6, display: 'block' }}>Win-Kategorie</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {WIN_CATEGORIES.map(cat => (
                <CategoryPill
                  key={cat.key}
                  cat={cat}
                  selected={form.win_category === cat.key}
                  onClick={() => setForm(p => ({ ...p, win_category: cat.key }))}
                />
              ))}
            </div>
          </div>

          <input className="input" placeholder="Unternehmen" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />

          <div className="grid-3" style={{ gap: 8 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Meine Forderung €</label>
              <input className="input" type="number" value={form.my_ask} onChange={e => setForm(p => ({ ...p, my_ask: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Deren Angebot €</label>
              <input className="input" type="number" value={form.their_offer} onChange={e => setForm(p => ({ ...p, their_offer: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Ergebnis €</label>
              <input className="input" type="number" value={form.final_result} onChange={e => setForm(p => ({ ...p, final_result: e.target.value }))} />
            </div>
          </div>

          <textarea className="input" placeholder="Wie lief das Gespräch?" rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={{ resize: 'vertical' }} />
          <textarea className="input" placeholder="Was habe ich gelernt?" rows={2} value={form.lessons_learned} onChange={e => setForm(p => ({ ...p, lessons_learned: e.target.value }))} style={{ resize: 'vertical' }} />

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Abbrechen</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1 }}>{saving ? 'Speichern…' : 'Speichern'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function SalaryLogClient({ entries: initial, userId }) {
  const supabase = createClient();

  // salary log entries (from DB / SSR)
  const [entries, setEntries] = useState(initial || []);

  // quick wins (separate table: user_wins)
  const [wins, setWins] = useState([]);
  const [winsLoading, setWinsLoading] = useState(true);

  // modal visibility
  const [showWinModal, setShowWinModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showWinReminder, setShowWinReminder] = useState(false);

  // Active tab: 'wins' | 'salary'
  const [activeTab, setActiveTab] = useState('wins');

  // ---------------------------------------------------------------------------
  // Load wins from Supabase
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!userId) { setWinsLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('user_wins')
        .select('*')
        .eq('user_id', userId)
        .order('win_date', { ascending: false });
      if (data) setWins(data);
      setWinsLoading(false);
    })();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------------------------------------------------------------------
  // Weekly Win Reminder (Mondays)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isMonday()) return;
    const mondayKey = 'salary_log_win_reminder_' + getMonday(new Date()).toISOString().slice(0, 10);
    if (typeof window !== 'undefined' && localStorage.getItem(mondayKey)) return;

    setShowWinReminder(true);

    (async () => {
      const weekStart = getMonday(new Date()).toISOString();
      const { data: existing } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .eq('type', 'win_reminder')
        .gte('created_at', weekStart)
        .limit(1);

      if (!existing || existing.length === 0) {
        await supabase.from('notifications').insert({
          user_id: userId,
          type: 'win_reminder',
          title: 'Wöchentlicher Win-Reminder',
          message: 'Montag ist Win-Tag! Trage deinen wichtigsten Erfolg der letzten Woche ein.',
        });
      }
      if (typeof window !== 'undefined') localStorage.setItem(mondayKey, '1');
    })();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------------------------------------------------------------------
  // Stats
  // ---------------------------------------------------------------------------
  const avgSuccess = useMemo(() => {
    const valid = entries.filter(e => e.my_ask && e.final_result);
    if (!valid.length) return 0;
    return Math.round(valid.reduce((s, e) => s + (e.final_result / e.my_ask) * 100, 0) / valid.length);
  }, [entries]);

  const totalGained = useMemo(
    () => entries.reduce((s, e) => s + ((e.final_result || 0) - (e.their_offer || 0)), 0),
    [entries]
  );

  const totalWins = wins.length;
  const avgImpact = useMemo(() => {
    if (!wins.length) return 0;
    return (wins.reduce((s, w) => s + (w.impact_score || 3), 0) / wins.length).toFixed(1);
  }, [wins]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleAddWin = async (form) => {
    const today = isoDate(new Date());
    const { data } = await supabase.from('user_wins').insert({
      user_id: userId,
      win_date: today,
      win_category: form.win_category,
      win_description: form.win_description,
      impact_score: form.impact_score,
    }).select().single();

    if (data) {
      setWins(p => [data, ...p]);
      try { await awardPoints(userId, 40, 'win_added'); } catch (_) {}
    }
  };

  const handleAddSalaryEntry = async (form) => {
    const { data } = await supabase.from('salary_log').insert({
      user_id: userId,
      ...form,
      my_ask: +form.my_ask || null,
      their_offer: +form.their_offer || null,
      final_result: +form.final_result || null,
    }).select().single();
    if (data) setEntries(p => [data, ...p]);
  };

  const handleExport = () => {
    alert('Feature kommt bald');
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="page-container" style={{ maxWidth: 740 }}>

      {/* Weekly Win Reminder Banner */}
      {showWinReminder && (
        <div className="card animate-in" style={{ marginBottom: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 12, borderLeft: '4px solid var(--ki-success)' }}>
          <span style={{ fontSize: 28 }}>🏆</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Montag ist Win-Tag!</div>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>Trage deinen wichtigsten Erfolg der letzten Woche ein — kleine Wins zählen auch.</div>
          </div>
          <button className="btn btn-primary" onClick={() => { setShowWinModal(true); setShowWinReminder(false); }} style={{ whiteSpace: 'nowrap' }}>+ Win eintragen</button>
          <button className="btn btn-ghost" onClick={() => setShowWinReminder(false)} style={{ padding: '4px 8px', fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Win-Tracker & Gehalts-Tagebuch <InfoTooltip moduleId="salary-log" profile={null} /></h1>
          <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', margin: 0 }}>
            Dokumentiere Erfolge und Verhandlungen — dein Verhandlungs-Logbuch.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleExport}>
            📊 Verhandlungs-Dossier erstellen
          </button>
          <button className="btn btn-secondary" onClick={() => setShowSalaryModal(true)}>
            + Verhandlung
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--ki-red)' }}>{totalWins}</div>
          <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Wins gesamt</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#eab308' }}>
            {'★'.repeat(Math.round(+avgImpact))}{'☆'.repeat(5 - Math.round(+avgImpact))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Ø Impact {avgImpact}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--ki-success)' }}>
            +€{Math.max(0, totalGained).toLocaleString('de-DE')}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Mehr rausgeholt</div>
        </div>
      </div>

      {/* Video Placeholder */}
      <div className="card" style={{ marginBottom: 24, padding: 20, background: 'var(--ki-bg-alt)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: 'var(--ki-red)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 24 }}>▶</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Wie du deine Erfolge systematisch trackst</div>
            <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginTop: 2 }}>
              Lerne, wie du Wins strategisch dokumentierst und in Gehaltsverhandlungen einsetzt.
            </div>
          </div>
          <button className="btn btn-ghost" style={{ marginLeft: 'auto', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Ansehen
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--ki-border)', paddingBottom: 0 }}>
        {[
          { key: 'wins', label: '🏆 Win-Timeline' },
          { key: 'heatmap', label: '📅 Heatmap' },
          { key: 'salary', label: '💰 Gehalts-Logbuch' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="btn btn-ghost"
            style={{
              borderBottom: activeTab === tab.key ? '2px solid var(--ki-red)' : '2px solid transparent',
              borderRadius: 0,
              fontWeight: activeTab === tab.key ? 700 : 400,
              color: activeTab === tab.key ? 'var(--ki-red)' : 'var(--ki-text-secondary)',
              padding: '8px 14px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'wins' && (
        winsLoading
          ? <div style={{ textAlign: 'center', padding: 48, color: 'var(--ki-text-secondary)' }}>Lädt…</div>
          : wins.length === 0
            ? (
              <div className="card" style={{ padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>🏆</div>
                <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 16, fontSize: 14 }}>
                  Noch keine Wins eingetragen. Dein erster Erfolg wartet darauf, dokumentiert zu werden!
                </p>
                <button className="btn btn-primary" style={{ background: 'var(--ki-red)' }} onClick={() => setShowWinModal(true)}>
                  Ersten Win eintragen
                </button>
              </div>
            )
            : <WinTimeline wins={wins} />
      )}

      {activeTab === 'heatmap' && (
        wins.length === 0 && !winsLoading
          ? (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📅</div>
              <p style={{ color: 'var(--ki-text-secondary)', fontSize: 14 }}>Trage erste Wins ein, um die Heatmap zu sehen.</p>
            </div>
          )
          : <WinHeatmap wins={wins} />
      )}

      {activeTab === 'salary' && (
        entries.length === 0
          ? (
            <div className="card" style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
              <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 16 }}>Dokumentiere deine Gehaltsverhandlungen — jedes Gespräch zählt.</p>
              <button className="btn btn-primary" onClick={() => setShowSalaryModal(true)}>Erste Verhandlung eintragen</button>
            </div>
          )
          : <SalaryTimeline entries={entries} />
      )}

      {/* Modals */}
      {showWinModal && (
        <WinModal onClose={() => setShowWinModal(false)} onSave={handleAddWin} />
      )}
      {showSalaryModal && (
        <SalaryModal onClose={() => setShowSalaryModal(false)} onSave={handleAddSalaryEntry} />
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowWinModal(true)}
        title="Win des Tages eintragen"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'var(--ki-red)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
          fontSize: 28,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.25)'; }}
      >
        🏆
      </button>
    </div>
  );
}
