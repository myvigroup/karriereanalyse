'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// ─── Icons ───────────────────────────────────────────────────────────────────
function Icon({ name, size = 14, stroke = 1.7 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
              stroke: 'currentColor', strokeWidth: stroke,
              strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'user':     return (<svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
    case 'mail':     return (<svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>);
    case 'phone':    return (<svg {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
    case 'brief':    return (<svg {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);
    case 'pin':      return (<svg {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>);
    case 'globe':    return (<svg {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>);
    case 'target':   return (<svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
    case 'wallet':   return (<svg {...p}><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>);
    case 'trend':    return (<svg {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>);
    case 'spark':    return (<svg {...p}><path d="M5 3v4M3 5h4M19 17v4M17 19h4M12 2l2.4 5.1L20 9l-5.1 2.4L12 16l-2.4-5L4 9l5.4-2L12 2z"/></svg>);
    case 'flame':    return (<svg {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>);
    case 'cal':      return (<svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
    case 'edit':     return (<svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
    case 'check':    return (<svg {...p}><polyline points="20 6 9 17 4 12"/></svg>);
    case 'lock':     return (<svg {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
    case 'shield':   return (<svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
    case 'eye':      return (<svg {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);
    case 'logout':   return (<svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>);
    case 'camera':   return (<svg {...p}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>);
    case 'star':     return (<svg {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
    case 'doc':      return (<svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>);
    default: return null;
  }
}

export default function ProfileClient({ profile, userBadges, allBadges, analysisSession, lessonsCompleted, certificates, userId }) {
  const router = useRouter();
  const supabase = createClient();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    company: profile?.company || '',
    position: profile?.position || '',
    industry: profile?.industry || '',
    experience_years: profile?.experience_years ?? '',
    career_goal: profile?.career_goal || '',
    current_salary: profile?.current_salary ?? '',
    target_salary: profile?.target_salary ?? '',
  });

  const [prefs, setPrefs] = useState({
    community_visible: !!profile?.community_visible,
    email_notifications: profile?.email_notifications !== false,
    share_achievements: !!profile?.share_achievements,
  });

  const fullName = useMemo(() => {
    const parts = [profile?.first_name, profile?.last_name].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : (profile?.name || 'Mitglied');
  }, [profile]);

  const initials = useMemo(() => {
    if (profile?.avatar_initials) return profile.avatar_initials;
    const f = profile?.first_name?.[0] || '';
    const l = profile?.last_name?.[0] || '';
    return (f + l).toUpperCase() || (profile?.name?.[0] || '?').toUpperCase();
  }, [profile]);

  const plan = (profile?.subscription_plan || 'FREE').toUpperCase();
  const isPremium = plan !== 'FREE';
  const planLabel = isPremium ? 'Premium' : 'Free';

  const memberSince = profile?.created_at ? new Date(profile.created_at) : null;
  const memberSinceLabel = memberSince
    ? memberSince.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
    : '—';
  const memberSinceYear = memberSince ? memberSince.getFullYear() : '—';
  const memberSinceMonths = memberSince
    ? Math.max(1, Math.round((Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24 * 30)))
    : 0;

  const completeness = useMemo(() => {
    const fields = ['first_name', 'last_name', 'email', 'phone', 'company', 'position',
                    'industry', 'career_goal', 'current_salary', 'target_salary'];
    const filled = fields.filter(f => !!profile?.[f]).length;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);

  function update(key) {
    return (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));
  }

  async function onSave() {
    setSaving(true);
    try {
      const payload = { ...form };
      if (payload.experience_years !== '') payload.experience_years = parseInt(payload.experience_years, 10) || null;
      if (payload.current_salary !== '') payload.current_salary = parseFloat(payload.current_salary) || null;
      if (payload.target_salary !== '') payload.target_salary = parseFloat(payload.target_salary) || null;
      await supabase.from('profiles').update(payload).eq('id', userId);
      setEditing(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  function onCancel() {
    setForm({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone: profile?.phone || '',
      company: profile?.company || '',
      position: profile?.position || '',
      industry: profile?.industry || '',
      experience_years: profile?.experience_years ?? '',
      career_goal: profile?.career_goal || '',
      current_salary: profile?.current_salary ?? '',
      target_salary: profile?.target_salary ?? '',
    });
    setEditing(false);
  }

  async function togglePref(key) {
    const next = !prefs[key];
    setPrefs(p => ({ ...p, [key]: next }));
    try {
      await supabase.from('profiles').update({ [key]: next }).eq('id', userId);
    } catch {
      setPrefs(p => ({ ...p, [key]: !next }));
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  }

  return (
    <div className="profile-v2">
      <div className="title-kicker">
        <span className="pulse" />
        Mitglied seit {memberSinceLabel} · {planLabel} aktiv
      </div>
      <h1 className="page-title">
        Mein Profil.{' '}
        <span className="faded">Deine Daten und Einstellungen.</span>
      </h1>
      <p className="page-sub">
        Halte deine Angaben aktuell — sie helfen uns beim Matching und sorgen für persönlichere Coaching-Empfehlungen.
      </p>

      <section className="profile-hero">
        <div className="profile-hero-avatar">
          {initials}
          <button type="button" className="profile-hero-edit" title="Foto ändern" onClick={() => alert('Foto-Upload kommt bald')}>
            <Icon name="camera" size={14} stroke={1.8} />
          </button>
        </div>
        <div className="profile-hero-body">
          <span className="profile-hero-eyebrow">
            <span className="star">★</span> {planLabel}-Mitglied{profile?.phase ? ` · Phase ${profile.phase}` : ''}
          </span>
          <h2 className="profile-hero-name">{fullName}</h2>
          {(profile?.position || profile?.company) && (
            <div className="profile-hero-role">
              {profile.position || '—'}{profile.company ? ` @ ${profile.company}` : ''}
            </div>
          )}
          <div className="profile-hero-meta">
            {profile?.industry && (
              <span className="profile-hero-chip"><Icon name="brief" size={12} /> {profile.industry}</span>
            )}
            {profile?.experience_years != null && (
              <span className="profile-hero-chip"><Icon name="trend" size={12} /> {profile.experience_years} Jahre Erfahrung</span>
            )}
            <span className="profile-hero-chip"><Icon name="cal" size={12} /> Mitglied seit {memberSinceLabel}</span>
          </div>
        </div>
        <div className="profile-hero-actions">
          {!editing && (
            <button type="button" className="btn btn-on-dark" onClick={() => setEditing(true)}>
              <Icon name="edit" size={13} stroke={2} /> Profil bearbeiten
            </button>
          )}
        </div>
      </section>

      <div className="stats">
        <div className="stat">
          <div className="stat-label"><span className="sl-ic"><Icon name="spark" size={11} stroke={2} /></span> Total XP</div>
          <div className="stat-value">{profile?.total_points || 0}<span className="unit">XP</span></div>
          <div className="stat-sub">{lessonsCompleted} Lektionen abgeschlossen</div>
        </div>
        <div className="stat">
          <div className="stat-label"><span className="sl-ic"><Icon name="flame" size={11} stroke={2} /></span> Streak</div>
          <div className="stat-value">{profile?.streak_count || 0}<span className="unit">Tage</span></div>
          <div className="stat-sub">
            {profile?.last_streak_date ? `Zuletzt aktiv: ${new Date(profile.last_streak_date).toLocaleDateString('de-DE')}` : 'Noch nicht gestartet'}
          </div>
        </div>
        <div className="stat">
          <div className="stat-label"><span className="sl-ic"><Icon name="star" size={11} stroke={2} /></span> Karriere-Score</div>
          <div className="stat-value">
            {analysisSession?.overall_score != null ? analysisSession.overall_score : '—'}
            <span className="unit">/100</span>
          </div>
          <div className="stat-sub">{analysisSession?.overall_score != null ? 'Aus Karriere-Analyse' : 'Analyse noch nicht abgeschlossen'}</div>
        </div>
        <div className="stat">
          <div className="stat-label"><span className="sl-ic"><Icon name="cal" size={11} stroke={2} /></span> Dabei seit</div>
          <div className="stat-value">{memberSinceYear}</div>
          <div className="stat-sub">{memberSinceMonths} {memberSinceMonths === 1 ? 'Monat' : 'Monate'} dabei</div>
        </div>
      </div>

      <section className="card">
        <div className="card-head">
          <h3 className="card-title">
            Persönliche Daten
            <span className="kicker">Nur für dich sichtbar</span>
          </h3>
          {!editing && (
            <button type="button" className="card-link" onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>Bearbeiten →</button>
          )}
        </div>

        {!editing ? (
          <div className="info-list">
            {[
              { ic: 'user',  label: 'Name',       value: fullName },
              { ic: 'mail',  label: 'E-Mail',     value: profile?.email || '—' },
              { ic: 'phone', label: 'Telefon',    value: profile?.phone || '—' },
              { ic: 'brief', label: 'Position',   value: profile?.position || '—' },
              { ic: 'pin',   label: 'Unternehmen',value: profile?.company || '—' },
              { ic: 'globe', label: 'Branche',    value: profile?.industry || '—' },
            ].map((r, i) => (
              <div className="info-row" key={i}>
                <span className="info-ic"><Icon name={r.ic} size={14} /></span>
                <div className="info-block">
                  <div className="info-label">{r.label}</div>
                  <div className="info-value">{r.value}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="field-grid">
            <div className="field">
              <label className="field-label">Vorname</label>
              <input className="input" value={form.first_name} onChange={update('first_name')} />
            </div>
            <div className="field">
              <label className="field-label">Nachname</label>
              <input className="input" value={form.last_name} onChange={update('last_name')} />
            </div>
            <div className="field">
              <label className="field-label">Telefon</label>
              <input className="input" type="tel" value={form.phone} onChange={update('phone')} />
            </div>
            <div className="field">
              <label className="field-label">Position</label>
              <input className="input" value={form.position} onChange={update('position')} />
            </div>
            <div className="field">
              <label className="field-label">Unternehmen</label>
              <input className="input" value={form.company} onChange={update('company')} />
            </div>
            <div className="field">
              <label className="field-label">Branche</label>
              <input className="input" value={form.industry} onChange={update('industry')} />
            </div>
            <div className="field">
              <label className="field-label">Erfahrung (Jahre)</label>
              <input className="input" type="number" min="0" value={form.experience_years} onChange={update('experience_years')} />
            </div>
            <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
              <button type="button" className="btn-cancel" onClick={onCancel}>Abbrechen</button>
              <button type="button" className="btn-save" onClick={onSave} disabled={saving}>
                {saving ? 'Speichert…' : 'Speichern'}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-head">
          <h3 className="card-title">
            Karriere-Profil
            <span className="kicker">Beeinflusst Empfehlungen</span>
          </h3>
          <a className="card-link" href="/analyse">Karriere-Analyse →</a>
        </div>
        {!editing ? (
          <div className="info-list">
            <div className="info-row">
              <span className="info-ic"><Icon name="target" size={14} /></span>
              <div className="info-block">
                <div className="info-label">Karriereziel</div>
                <div className="info-value">{profile?.career_goal || '—'}</div>
              </div>
            </div>
            <div className="info-row">
              <span className="info-ic"><Icon name="wallet" size={14} /></span>
              <div className="info-block">
                <div className="info-label">Aktuelles Gehalt</div>
                <div className="info-value">{profile?.current_salary ? `${profile.current_salary} €` : '—'}</div>
              </div>
            </div>
            <div className="info-row">
              <span className="info-ic"><Icon name="trend" size={14} /></span>
              <div className="info-block">
                <div className="info-label">Zielgehalt</div>
                <div className="info-value">{profile?.target_salary ? `${profile.target_salary} €` : '—'}</div>
              </div>
            </div>
            <div className="info-row">
              <span className="info-ic"><Icon name="user" size={14} /></span>
              <div className="info-block">
                <div className="info-label">Karriere-Phase</div>
                <div className="info-value">{profile?.phase || '—'}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="field-grid">
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label className="field-label">Karriereziel</label>
              <input className="input" value={form.career_goal} onChange={update('career_goal')} placeholder="z. B. Senior Product Manager in 3 Jahren" />
            </div>
            <div className="field">
              <label className="field-label">Aktuelles Gehalt (€)</label>
              <input className="input" type="number" min="0" value={form.current_salary} onChange={update('current_salary')} />
            </div>
            <div className="field">
              <label className="field-label">Zielgehalt (€)</label>
              <input className="input" type="number" min="0" value={form.target_salary} onChange={update('target_salary')} />
            </div>
          </div>
        )}

        <div className="goal-meter">
          <div className="goal-meter-head">
            <div className="info-label">Profil-Vollständigkeit</div>
            <div className="goal-meter-value">{completeness}%</div>
          </div>
          <div className="goal-bar">
            <div className="goal-bar-fill" style={{ width: `${completeness}%` }} />
          </div>
          <div className="goal-text">
            <span>
              {completeness === 100
                ? 'Profil vollständig — top!'
                : `Noch ${10 - Math.round(completeness / 10)} Felder bis zum vollständigen Profil`}
            </span>
            {completeness < 100 && !editing && (
              <a href="#" onClick={(e) => { e.preventDefault(); setEditing(true); }}>Vervollständigen →</a>
            )}
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h3 className="card-title">Mitgliedschaft</h3>
        </div>
        <div className="plan-card">
          <div>
            <span className={`plan-badge ${!isPremium ? 'free' : ''}`}>
              <Icon name="star" size={11} stroke={2} /> {planLabel}
            </span>
            <div className="plan-title">{isPremium ? 'Premium-Mitgliedschaft' : 'Free-Mitgliedschaft'}</div>
            <div className="plan-sub">
              {isPremium
                ? 'Alle Kurse, Seminare und Premium-Tools freigeschaltet.'
                : 'Basis-Zugriff. Premium für Vollzugriff aktivieren.'}
            </div>
            {!isPremium && (
              <div className="plan-features">
                {['Alle E-Learning-Kurse', '1 Seminar / Monat (Wert 99 €)', 'Gehalts-Masterclass', 'Persönliches CV-Feedback'].map((f, i) => (
                  <div key={i} className="plan-feat">
                    <span className="ic"><Icon name="check" size={10} stroke={3} /></span>{f}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="plan-meta">
            {!isPremium ? (
              <>
                <div className="plan-billing">15 €<span className="per"> / Monat</span></div>
                <div className="plan-renew">jederzeit kündbar</div>
                <a href="/angebote" className="btn-save" style={{ textDecoration: 'none' }}>Premium starten</a>
              </>
            ) : (
              <>
                <div className="plan-billing">Aktiv</div>
                <div className="plan-renew">{(profile?.purchased_products || []).length} Produkt(e) freigeschaltet</div>
                <a href="/angebote" className="btn-cancel" style={{ textDecoration: 'none' }}>Mitgliedschaft verwalten</a>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="grid-2">
        <section className="card">
          <div className="card-head">
            <h3 className="card-title">Privatsphäre</h3>
          </div>
          <div className="pref-row">
            <span className="pref-ic"><Icon name="eye" size={14} /></span>
            <div>
              <div className="pref-title">In der Community sichtbar</div>
              <div className="pref-sub">Andere Mitglieder sehen deinen Namen und deine Phase</div>
            </div>
            <button
              type="button"
              className={`switch ${prefs.community_visible ? 'on' : ''}`}
              onClick={() => togglePref('community_visible')}
              aria-pressed={prefs.community_visible}
            />
          </div>
          <div className="pref-row">
            <span className="pref-ic"><Icon name="mail" size={14} /></span>
            <div>
              <div className="pref-title">E-Mail-Benachrichtigungen</div>
              <div className="pref-sub">Karriere-Tipps, Erinnerungen und Neuerungen</div>
            </div>
            <button
              type="button"
              className={`switch ${prefs.email_notifications ? 'on' : ''}`}
              onClick={() => togglePref('email_notifications')}
              aria-pressed={prefs.email_notifications}
            />
          </div>
          <div className="pref-row">
            <span className="pref-ic"><Icon name="star" size={14} /></span>
            <div>
              <div className="pref-title">Achievements teilen</div>
              <div className="pref-sub">Badges und Streaks in der Community zeigen</div>
            </div>
            <button
              type="button"
              className={`switch ${prefs.share_achievements ? 'on' : ''}`}
              onClick={() => togglePref('share_achievements')}
              aria-pressed={prefs.share_achievements}
            />
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <h3 className="card-title">Sicherheit</h3>
          </div>
          <div className="pref-row">
            <span className="pref-ic"><Icon name="lock" size={14} /></span>
            <div>
              <div className="pref-title">Passwort ändern</div>
              <div className="pref-sub">Neues Passwort setzen oder zurücksetzen</div>
            </div>
            <a href="/auth/set-password" className="btn-cancel" style={{ textDecoration: 'none' }}>Ändern</a>
          </div>
          <div className="pref-row">
            <span className="pref-ic"><Icon name="shield" size={14} /></span>
            <div>
              <div className="pref-title">Account-E-Mail</div>
              <div className="pref-sub" style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{profile?.email || '—'}</div>
            </div>
          </div>
        </section>
      </div>

      <section className="card">
        <div className="card-head">
          <h3 className="card-title">Account</h3>
        </div>
        <div className="pref-row">
          <span className="pref-ic"><Icon name="doc" size={14} /></span>
          <div>
            <div className="pref-title">Abmelden</div>
            <div className="pref-sub">Beendet diese Session und kehrt zur Login-Seite zurück</div>
          </div>
          <button type="button" className="btn-cancel" onClick={handleLogout}>
            <Icon name="logout" size={12} stroke={2} /> Abmelden
          </button>
        </div>
        <div className="danger-zone">
          <div>
            <div className="pref-title danger">Account löschen</div>
            <div className="danger-zone-text">Lösche dauerhaft alle deine Daten. Diese Aktion kann nicht rückgängig gemacht werden.</div>
          </div>
          <a href="mailto:support@daskarriereinstitut.de?subject=Account%20l%C3%B6schen" className="btn-danger" style={{ textDecoration: 'none' }}>
            Support kontaktieren
          </a>
        </div>
      </section>
    </div>
  );
}
