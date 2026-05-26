'use client';
import Link from 'next/link';
import { getActiveCoaches } from '@/lib/coaches';

const SEMINAR_TITLES = {
  'sem-typgerecht': 'Typgerechtes Lernen',
  'sem-worklife': 'Work-Life-Balance',
  'sem-leadership': 'Personal Leadership',
  'sem-speedreading': 'Speedreading',
  'sem-achtsamkeit': 'Achtsamkeit',
  'sem-rhetorik': 'Rhetorik, Dialektik, Kinesik',
  'sem-motivation': 'Selbstmotivation',
  'sem-kommunikation': 'Kommunikation',
  'sem-konflikt': 'Konfliktmanagement',
  'sem-homeoffice': 'Arbeiten im Home Office',
};

export default function CoachesPanel() {
  const coaches = getActiveCoaches();

  return (
    <div className="coaches-v2">
      <div className="title-kicker">
        <span className="pulse" />
        Unsere Live-Coaches
      </div>
      <h1 className="page-title">
        Die Menschen hinter{' '}
        <span className="faded">deinem Coaching.</span>
      </h1>
      <p className="page-sub">
        Lizenzierte Referent:innen mit eigener Karrierebiografie. Sie halten die Live-Seminare,
        begleiten Einzelcoachings und entwickeln die Inhalte unserer Masterclasses.
      </p>

      <div className="coaches-grid">
        {coaches.map(c => (
          <article key={c.id} className="coach-card">
            <header className="coach-card-head">
              <div className="coach-card-avatar" style={{ background: c.gradient }}>
                {c.initials}
              </div>
              <div className="coach-card-headinfo">
                <h2 className="coach-card-name">{c.name}</h2>
                <div className="coach-card-title">{c.title}</div>
                <div className="coach-card-since">seit {c.sinceYear} am Karriere-Institut</div>
              </div>
            </header>

            <p className="coach-card-bio">{c.bio}</p>

            <div className="coach-card-section">
              <div className="coach-card-section-label">Schwerpunkte</div>
              <div className="coach-card-chips">
                {c.specialties.map(s => (
                  <span key={s} className="coach-card-chip">{s}</span>
                ))}
              </div>
            </div>

            {c.seminarIds.length > 0 && (
              <div className="coach-card-section">
                <div className="coach-card-section-label">
                  Hält {c.seminarIds.length === 1 ? 'das Seminar' : `${c.seminarIds.length} Seminare`}
                </div>
                <ul className="coach-card-seminars">
                  {c.seminarIds.map(sid => (
                    <li key={sid}>
                      <Link href="/masterclass">{SEMINAR_TITLES[sid] || sid}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))}
      </div>

      {coaches.length === 0 && (
        <div className="coaches-empty">
          Aktuell sind keine aktiven Coaches mit zugewiesenen Seminaren hinterlegt.
        </div>
      )}
    </div>
  );
}
