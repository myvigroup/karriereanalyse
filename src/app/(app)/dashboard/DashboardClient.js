'use client';
import { useMemo } from 'react';
import { berechnePersonalisierung } from '@/lib/personalization';
import { getLevelProgress } from '@/lib/gamification';
import { Target, BookOpen, DollarSign, CheckCircle2, Crosshair, Bot, NotebookPen } from 'lucide-react';

export default function DashboardClient({
  profile, analysisSession, analysisResults, progress, courses,
  documents, applications, marketValue, recentActivity,
  streakStatus, dailyMissions,
}) {
  const hasAnalysis = !!analysisSession;
  const xp = profile?.total_points || profile?.xp || 0;
  const { current: lvl, next: nextLvl, progress: lvlPct } = getLevelProgress(xp);
  const pers = useMemo(() => berechnePersonalisierung(analysisResults, profile?.phase), [analysisResults, profile?.phase]);

  const completedLessons = (progress || []).filter(p => p.completed).length;
  const totalLessons = (courses || []).reduce((s, c) => s + (c.modules || []).reduce((s2, m) => s2 + (m.lessons || []).length, 0), 0);
  const streakDays = streakStatus?.currentStreak || profile?.streak_count || 0;

  const firstName = profile?.full_name?.split(' ')[0] || profile?.name?.split(' ')[0] || 'User';
  const greeting = new Date().getHours() < 12 ? 'Morgen' : new Date().getHours() < 18 ? 'Tag' : 'Abend';

  const primaryMission = (dailyMissions || []).find(m => m.mission_type === 'primary');
  const bonusMissions = (dailyMissions || []).filter(m => m.mission_type !== 'primary');

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Gerade eben';
    if (hours < 24) return `vor ${hours} Std.`;
    const days = Math.floor(hours / 24);
    return days === 1 ? 'Gestern' : `vor ${days} Tagen`;
  };

  // ════════════════════════════════════════
  // NEUER USER — Fokus auf Analyse-Start
  // ════════════════════════════════════════
  if (!hasAnalysis) {
    return (
      <div className="page-container">
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 14, color: 'var(--ki-text-tertiary)', margin: '0 0 4px' }}>Guten {greeting},</p>
          <h1 className="page-title" style={{ margin: 0 }}>{firstName}</h1>
        </div>

        <div className="card animate-in" style={{
          padding: '40px 32px', textAlign: 'center', marginBottom: 32,
          background: 'linear-gradient(135deg, rgba(204,20,38,0.03), rgba(204,20,38,0.08))',
          border: '1.5px solid rgba(204,20,38,0.12)',
        }}>
          <Target size={48} strokeWidth={1.2} style={{ marginBottom: 16, color: 'var(--ki-red)', opacity: 0.8 }} />
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Finde heraus, wo du stehst
          </h2>
          <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Deine kostenlose Karriere-Analyse — 13 Kompetenzfelder, ~15 Minuten.
            Danach passt sich die gesamte Plattform an dich an.
          </p>
          <a href="/analyse?start=true" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
            Jetzt starten — kostenlos
          </a>
        </div>

        <div className="grid-3" style={{ marginBottom: 32 }}>
          {[
            { Icon: Target, title: 'Analyse', sub: '13 Dimensionen, personalisiert für dich' },
            { Icon: BookOpen, title: 'Lernpfad', sub: 'E-Learnings sortiert nach deinem Profil' },
            { Icon: DollarSign, title: 'Gehaltsdaten', sub: 'Echte Zahlen für deine Karrierestufe' },
          ].map(item => (
            <div key={item.title} className="card animate-in" style={{ padding: '20px', textAlign: 'center' }}>
              <item.Icon size={28} strokeWidth={1.4} style={{ marginBottom: 8, color: 'var(--ki-text-secondary)' }} />
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════
  // AKTIVER USER — Kompaktes Dashboard
  // ════════════════════════════════════════
  return (
    <div className="page-container">

      {/* ── Header: Greeting + Level + Streak ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 14, color: 'var(--ki-text-tertiary)', margin: '0 0 4px' }}>Guten {greeting},</p>
          <h1 className="page-title" style={{ margin: 0 }}>{firstName}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)' }}>
            <span style={{ fontSize: 14 }}>{lvl.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 700 }}>Lvl {lvl.level}</span>
            <span style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>{xp} XP</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            background: streakDays >= 7 ? 'rgba(245,158,11,0.08)' : 'var(--ki-bg-alt)',
            borderRadius: 'var(--r-md)',
          }}>
            <span style={{ fontSize: 14 }}>🔥</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{streakDays}</span>
          </div>
        </div>
      </div>

      {/* ── Tägliche Mission ── */}
      {primaryMission && (
        <a href={primaryMission.target_course_id ? `/masterclass/${primaryMission.target_course_id}` : '/masterclass'}
          className="card animate-in" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', marginBottom: 20, textDecoration: 'none', color: 'inherit',
            borderLeft: `3px solid ${primaryMission.completed ? 'var(--ki-success)' : 'var(--ki-red)'}`,
            opacity: primaryMission.completed ? 0.6 : 1,
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {primaryMission.completed ? <CheckCircle2 size={20} style={{ color: 'var(--ki-success)' }} /> : <Crosshair size={20} style={{ color: 'var(--ki-red)' }} />}
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ki-text-tertiary)', marginBottom: 2 }}>Tägliche Mission</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{primaryMission.title}</div>
            </div>
          </div>
          {!primaryMission.completed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--ki-warning)', fontWeight: 600 }}>+{Math.round((primaryMission.xp_reward || 50) * (primaryMission.xp_multiplier || 1))} XP</span>
              <span className="btn btn-primary" style={{ fontSize: 12, padding: '6px 14px', pointerEvents: 'none' }}>Starten →</span>
            </div>
          )}
        </a>
      )}

      {/* ── 3 KPI Cards ── */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <a href="/analyse" className="card animate-in" style={{ textDecoration: 'none', color: 'inherit', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ki-text-tertiary)' }}>Karriere-Score</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--ki-red)' }}>{pers.gesamtScore}%</span>
          </div>
          <div className="progress-bar" style={{ marginTop: 10, height: 4 }}>
            <div className="progress-bar-fill" style={{ width: `${pers.gesamtScore}%`, background: 'var(--ki-warning)' }} />
          </div>
        </a>

        <a href="/masterclass" className="card animate-in delay-1" style={{ textDecoration: 'none', color: 'inherit', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ki-text-tertiary)' }}>Lektionen</span>
            <span style={{ fontSize: 22, fontWeight: 700 }}>{completedLessons}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--ki-text-tertiary)' }}>/{totalLessons}</span></span>
          </div>
          <div className="progress-bar" style={{ marginTop: 10, height: 4 }}>
            <div className="progress-bar-fill" style={{ width: `${totalLessons > 0 ? Math.round(completedLessons / totalLessons * 100) : 0}%` }} />
          </div>
        </a>

        <div className="card animate-in delay-2" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ki-text-tertiary)' }}>Level</span>
            <span style={{ fontSize: 16 }}>{lvl.icon}</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{lvl.name}</div>
          <div className="progress-bar" style={{ marginTop: 6, height: 3 }}>
            <div className="progress-bar-fill" style={{ width: `${lvlPct}%` }} />
          </div>
        </div>
      </div>

      {/* ── Wachstumsfelder + Empfohlene Kurse ── */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card animate-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Wachstumspotenzial</h2>
            <a href="/analyse" style={{ fontSize: 11, fontWeight: 600 }}>Alle Felder →</a>
          </div>
          {pers.schwaechen.slice(0, 3).map((s, i) => (
            <div key={s.field_id || s.field_slug || i} style={{ marginBottom: i < 2 ? 12 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{s.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.score < 50 ? 'var(--ki-red)' : 'var(--ki-warning)' }}>{Math.round(s.score)}%</span>
              </div>
              <div className="progress-bar" style={{ height: 3 }}>
                <div className="progress-bar-fill" style={{ width: `${s.score}%`, background: s.score < 50 ? 'var(--ki-red)' : 'var(--ki-warning)' }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card animate-in delay-1">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Empfohlene Kurse</h2>
            <a href="/masterclass" style={{ fontSize: 11, fontWeight: 600 }}>Alle →</a>
          </div>
          {pers.empfohleneKurse.slice(0, 3).map((kurs, i) => (
            <a key={kurs.kursId} href={`/masterclass/${kurs.kursId}`} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
              borderRadius: 'var(--r-sm)', background: 'var(--ki-bg-alt)',
              textDecoration: 'none', color: 'inherit', marginBottom: i < 2 ? 8 : 0,
              borderLeft: `3px solid ${kurs.farbe}`,
            }}>
              <span style={{ fontSize: 18 }}>{kurs.icon}</span>
              <span style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{kurs.title}</span>
              {kurs.istSchwaeche && <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--ki-warning)', background: 'rgba(245,158,11,0.1)', padding: '2px 6px', borderRadius: 99 }}>2x XP</span>}
            </a>
          ))}
        </div>
      </div>

      {/* ── Letzte Aktivität ── */}
      {(recentActivity || []).length > 0 && (
        <div className="card animate-in" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px' }}>Letzte Aktivität</h2>
          {recentActivity.slice(0, 3).map((item, i) => (
            <div key={item.lesson_id || i} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
              borderBottom: i < Math.min(recentActivity.length, 3) - 1 ? '1px solid var(--ki-border)' : 'none',
            }}>
              <span style={{ fontSize: 13 }}>✅</span>
              <span style={{ flex: 1, fontSize: 12 }}>{item.lessons?.title || 'Lektion abgeschlossen'}</span>
              <span style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>{timeAgo(item.completed_at)}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Bonus-Missionen ── */}
      {bonusMissions.length > 0 && (
        <div style={{ display: 'flex', gap: 10 }}>
          {bonusMissions.map(bm => (
            <a key={bm.mission_type} href={bm.action_type === 'coach' ? '/ki-coach' : '#'} className="card animate-in" style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px',
              textDecoration: 'none', color: 'inherit', opacity: bm.completed ? 0.5 : 1,
            }}>
              {bm.completed ? <CheckCircle2 size={16} style={{ color: 'var(--ki-success)' }} /> : bm.action_type === 'reflection' ? <NotebookPen size={16} style={{ color: 'var(--ki-text-tertiary)' }} /> : <Bot size={16} style={{ color: 'var(--ki-text-tertiary)' }} />}
              <span style={{ flex: 1, fontSize: 11, fontWeight: 500 }}>{bm.title}</span>
              <span style={{ fontSize: 10, color: 'var(--ki-warning)', fontWeight: 600 }}>+{bm.xp_reward}</span>
            </a>
          ))}
        </div>
      )}

    </div>
  );
}
