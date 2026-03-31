'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getLevel, getLevelProgress } from '@/lib/career-logic';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { KARRIERE_PHASEN_AUSWAHL } from '@/lib/elearning/zielgruppen-config';

export default function ProfileClient({ profile: initialProfile, userBadges, allBadges, analysisSession, lessonsCompleted, certificates, userId }) {
  const supabase = createClient();
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name || '',
    company: profile?.company || '',
    position: profile?.position || '',
    current_salary: profile?.current_salary || '',
    target_salary: profile?.target_salary || '',
    career_goal: profile?.career_goal || '',
  });

  const [currentPhase, setCurrentPhase] = useState(profile?.phase || 'berufseinsteiger');
  const [phaseSaving, setPhaseSaving] = useState(false);

  async function changePhase(newPhase) {
    setPhaseSaving(true);
    await supabase.from('profiles').update({ phase: newPhase }).eq('id', userId);
    setCurrentPhase(newPhase);
    setProfile(prev => ({ ...prev, phase: newPhase }));
    setPhaseSaving(false);
  }

  const earnedBadgeIds = new Set((userBadges || []).map(ub => ub.badge_id));
  const level = getLevel(profile?.xp || 0);
  const { next, progress: levelProgress } = getLevelProgress(profile?.xp || 0);
  const initials = (profile?.name || '??').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  async function saveProfile() {
    setSaving(true);
    const updateData = {
      name: form.name,
      company: form.company,
      position: form.position,
      current_salary: form.current_salary ? parseInt(form.current_salary) : null,
      target_salary: form.target_salary ? parseInt(form.target_salary) : null,
      career_goal: form.career_goal,
    };
    await supabase.from('profiles').update(updateData).eq('id', userId);
    setProfile(prev => ({ ...prev, ...updateData }));
    setEditing(false);
    setSaving(false);
  }

  return (
    <div className="page-container animate-in">
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Mein Profil<InfoTooltip moduleId="profile" profile={profile} /></h1>
        <p className="page-subtitle">Einstellungen, Badges & Statistiken</p>
      </div>

      {/* Profile Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: 'var(--ki-red)',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 700, flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="grid-2" style={{ gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Name</label>
                  <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Position</label>
                  <input className="input" value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Unternehmen</label>
                <input className="input" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
              </div>
              <div className="grid-3" style={{ gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Aktuelles Gehalt €</label>
                  <input className="input" type="number" value={form.current_salary} onChange={e => setForm(p => ({ ...p, current_salary: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Zielgehalt €</label>
                  <input className="input" type="number" value={form.target_salary} onChange={e => setForm(p => ({ ...p, target_salary: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Karriereziel</label>
                  <input className="input" value={form.career_goal} onChange={e => setForm(p => ({ ...p, career_goal: e.target.value }))} placeholder="z.B. Teamleitung" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={saveProfile} className="btn btn-primary" style={{ fontSize: 13 }} disabled={saving}>
                  {saving ? 'Speichert...' : 'Speichern'}
                </button>
                <button onClick={() => setEditing(false)} className="btn btn-ghost" style={{ fontSize: 13 }}>Abbrechen</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>{profile?.name || 'Kein Name'}</h2>
                <button onClick={() => setEditing(true)} className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 12px' }}>✎ Bearbeiten</button>
              </div>
              <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginTop: 4 }}>
                {profile?.position && <span>{profile.position}</span>}
                {profile?.company && <span> bei {profile.company}</span>}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', marginTop: 2 }}>{profile?.email}</div>
              {(profile?.current_salary || profile?.target_salary) && (
                <div style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', marginTop: 4 }}>
                  {profile.current_salary && <span>Gehalt: €{profile.current_salary.toLocaleString('de-DE')}</span>}
                  {profile.target_salary && <span> → Ziel: €{profile.target_salary.toLocaleString('de-DE')}</span>}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <div className="card animate-in delay-1" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>KI-Points</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--ki-red)', letterSpacing: '-0.04em' }}>{profile?.xp || 0}</div>
        </div>
        <div className="card animate-in delay-2" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Level</div>
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em' }}>{level.icon}</div>
          <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 4 }}>{level.title}</div>
        </div>
        <div className="card animate-in delay-3" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Lektionen</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--ki-success)', letterSpacing: '-0.04em' }}>{lessonsCompleted}</div>
          <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 4 }}>abgeschlossen</div>
        </div>
        <div className="card animate-in delay-4" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Zertifikate</div>
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em' }}>{certificates.length}</div>
        </div>
      </div>

      {/* Karrierephase */}
      <div className="card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Deine Karrierephase</div>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 2 }}>
              Alle E-Learnings passen sich an deine Phase an
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
          {KARRIERE_PHASEN_AUSWAHL.map(p => {
            const isActive = currentPhase === p.id;
            return (
              <button
                key={p.id}
                onClick={() => !isActive && changePhase(p.id)}
                disabled={phaseSaving}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px', borderRadius: 'var(--r-md)',
                  background: isActive ? 'rgba(204,20,38,0.05)' : 'var(--ki-bg-alt)',
                  border: isActive ? '2px solid var(--ki-red)' : '1px solid var(--ki-border)',
                  cursor: isActive ? 'default' : 'pointer',
                  textAlign: 'left', transition: 'all 0.15s',
                  opacity: phaseSaving ? 0.6 : 1,
                }}
              >
                <span style={{ fontSize: 22 }}>{p.label.split(' ')[0]}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--ki-red)' : 'var(--ki-text)' }}>
                    {p.label.slice(p.label.indexOf(' ') + 1)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>{p.desc}</div>
                </div>
                {isActive && <span style={{ marginLeft: 'auto', fontSize: 14, color: 'var(--ki-red)' }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Progress */}
      {next && (
        <div className="card" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Fortschritt zu {next.icon} {next.title}</div>
            <span className="pill pill-grey">{levelProgress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${levelProgress}%` }} />
          </div>
          <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 8 }}>
            {profile?.xp || 0} / {next.minXP} KI-Points
          </div>
        </div>
      )}

      {/* Badge Showcase */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>Badges</h3>
        <div className="grid-4">
          {(allBadges || []).map(badge => {
            const earned = earnedBadgeIds.has(badge.id);
            const userBadge = (userBadges || []).find(ub => ub.badge_id === badge.id);
            return (
              <div
                key={badge.id}
                className="card"
                style={{
                  textAlign: 'center', padding: '24px 16px',
                  opacity: earned ? 1 : 0.45,
                  filter: earned ? 'none' : 'grayscale(1)',
                  transition: 'all var(--t-med)',
                  position: 'relative',
                }}
                title={!earned ? `Bedingung: ${badge.condition_type || 'Unbekannt'}` : ''}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>{badge.icon || '🏅'}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{badge.title}</div>
                <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>{badge.description}</div>
                {earned && userBadge?.earned_at && (
                  <div style={{ fontSize: 11, color: 'var(--ki-success)', marginTop: 8 }}>
                    ✓ {new Date(userBadge.earned_at).toLocaleDateString('de-DE')}
                  </div>
                )}
                {!earned && (
                  <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', marginTop: 8 }}>Noch nicht verdient</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Abo & Billing */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Mein Abo & Rechnungen</h3>
        <div style={{ display: 'flex', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Aktueller Plan</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{profile?.subscription_plan || 'FREE'}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</div>
            <span className={`pill ${profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing' ? 'pill-green' : profile?.subscription_status === 'past_due' ? 'pill-gold' : 'pill-grey'}`}>
              {profile?.subscription_status === 'active' ? 'Aktiv' : profile?.subscription_status === 'trialing' ? 'Testphase' : profile?.subscription_status === 'past_due' ? 'Überfällig' : profile?.subscription_status === 'canceled' ? 'Gekündigt' : 'Inaktiv'}
            </span>
          </div>
          {profile?.subscription_ends_at && (
            <div>
              <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Läuft bis</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{new Date(profile.subscription_ends_at).toLocaleDateString('de-DE')}</div>
            </div>
          )}
        </div>

        {profile?.subscription_status === 'trialing' && (
          <div style={{ padding: '10px 16px', background: 'rgba(212,160,23,0.08)', borderRadius: 'var(--r-md)', marginBottom: 12, fontSize: 13, color: 'var(--ki-warning)' }}>
            {'\u26A0\uFE0F'} Deine Testphase endet am {profile?.subscription_ends_at ? new Date(profile.subscription_ends_at).toLocaleDateString('de-DE') : 'bald'}.
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {profile?.stripe_customer_id && (
            <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={async () => {
              const res = await fetch('/api/billing-portal', { method: 'POST' });
              const data = await res.json();
              if (data.url) window.location.href = data.url;
            }}>
              Abo verwalten / Rechnungen
            </button>
          )}
          {(!profile?.subscription_plan || profile?.subscription_plan === 'FREE') && (
            <a href="/angebote" className="btn btn-primary" style={{ fontSize: 13 }}>Upgrade</a>
          )}
        </div>
      </div>

      {/* Einstellungen */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Einstellungen</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start', fontSize: 13 }}
            onClick={async () => {
              await supabase.from('profiles').update({ tour_completed: false, tour_step: 0 }).eq('id', userId);
              window.location.reload();
            }}
          >
            {'\u{1F3AF}'} Tour nochmal starten
          </button>
          <a href="/api/data-export" className="btn btn-secondary" style={{ justifyContent: 'flex-start', fontSize: 13, textDecoration: 'none', color: 'inherit' }}>
            {'\u{1F4E5}'} Meine Daten herunterladen (DSGVO)
          </a>
          <button
            className="btn btn-ghost"
            style={{ justifyContent: 'flex-start', fontSize: 13, color: 'var(--ki-error)' }}
            onClick={async () => {
              if (!confirm('Bist du sicher? Alle deine Daten werden unwiderruflich gelöscht.')) return;
              if (!confirm('Letzte Warnung: Dies kann NICHT rückgängig gemacht werden.')) return;
              await supabase.rpc('delete_user_data', { target_user_id: userId });
              await supabase.auth.signOut();
              window.location.href = '/auth/login';
            }}
          >
            {'\u{1F5D1}\uFE0F'} Konto und alle Daten löschen
          </button>
        </div>
      </div>
    </div>
  );
}
