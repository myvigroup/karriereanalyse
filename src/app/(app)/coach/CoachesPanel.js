'use client';
import { useState, useMemo, useEffect } from 'react';
import { getActiveCoaches, getActiveSpecialtyGroups, getCoachesByGroup } from '@/lib/coaches';

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
  const allCoaches = useMemo(() => getActiveCoaches(), []);
  const filterGroups = useMemo(() => getActiveSpecialtyGroups(), []);
  const [filter, setFilter] = useState('alle');
  const [openCoach, setOpenCoach] = useState(null);

  const filteredCoaches = useMemo(() => {
    if (filter === 'alle') return allCoaches;
    return getCoachesByGroup(filter);
  }, [allCoaches, filter]);

  // Wenn der aktive Filter durch Gruppen-Änderung ungültig wird, zurück auf 'alle'
  useEffect(() => {
    if (filter !== 'alle' && !filterGroups.some(g => g.key === filter)) {
      setFilter('alle');
    }
  }, [filter, filterGroups]);

  // ESC schließt Modal + Scroll-Lock
  useEffect(() => {
    if (!openCoach) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpenCoach(null); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [openCoach]);

  return (
    <div className="coaches-v3">
      {/* Filter-Sektion — konsolidierte Hauptkategorien */}
      <div className="coaches-filterhead">
        <div className="coaches-filterhead-title">Wonach suchst du?</div>
        <div className="coaches-pills">
          <button
            className={`coaches-pill ${filter === 'alle' ? 'on' : ''}`}
            onClick={() => setFilter('alle')}
            type="button"
          >
            Alle
          </button>
          {filterGroups.map(g => (
            <button
              key={g.key}
              className={`coaches-pill ${filter === g.key ? 'on' : ''}`}
              onClick={() => setFilter(g.key)}
              type="button"
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid-Sektion */}
      <div className="coaches-secthead">
        <h3>
          {filter === 'alle' ? 'Alle Coaches' : filter}
          <span className="count">{filteredCoaches.length}</span>
        </h3>
      </div>

      <div className="coaches-grid-v3">
        {filteredCoaches.map(c => (
          <article
            key={c.id}
            className="coach-card-v3"
            onClick={() => setOpenCoach(c)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenCoach(c); } }}
          >
            <div className="coach-card-v3-photo" style={{ background: c.gradient }}>
              <span className={`coach-card-v3-status ${c.status}`}>
                <span className="dot" /> {c.status === 'available' ? 'Verfügbar' : 'Beschäftigt'}
              </span>
              {c.photoUrl ? (
                <img src={c.photoUrl} alt={c.name} />
              ) : (
                <span className="coach-card-v3-initials">{c.initials}</span>
              )}
            </div>
            <div className="coach-card-v3-body">
              <h4 className="coach-card-v3-name">{c.name}</h4>
              <div className="coach-card-v3-role">{c.role}</div>
              <p className="coach-card-v3-bio">{c.short}</p>
              <div className="coach-card-v3-chips">
                {c.specialties.slice(0, 4).map(s => (
                  <span key={s} className="coach-card-v3-chip">{s}</span>
                ))}
              </div>
            </div>
            <div className="coach-card-v3-foot">
              <span className="coach-card-v3-rating">
                <span className="star">★</span> {c.rating.toFixed(1)} · {c.sessionCount}+ Sessions
              </span>
              <span className="coach-card-v3-cta">Termin buchen →</span>
            </div>
          </article>
        ))}
      </div>

      {filteredCoaches.length === 0 && (
        <div className="coaches-empty-v3">
          Keine Coaches für „{filter}" gefunden.
        </div>
      )}

      {/* Coach-Detail-Modal */}
      {openCoach && (() => {
        const c = openCoach;
        return (
          <div className="coach-modal-overlay" onClick={() => setOpenCoach(null)}>
            <div className="coach-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={c.name}>
              <button
                className="coach-modal-close"
                onClick={() => setOpenCoach(null)}
                aria-label="Schließen"
                type="button"
              >
                ✕
              </button>

              {/* Header mit Foto/Avatar + Hauptinfos */}
              <div className="coach-modal-header" style={{ background: c.gradient }}>
                <div className="coach-modal-avatar">
                  {c.photoUrl ? (
                    <img src={c.photoUrl} alt={c.name} />
                  ) : (
                    <span>{c.initials}</span>
                  )}
                  <span className={`coach-modal-status-dot ${c.status}`} />
                </div>
                <div className="coach-modal-headinfo">
                  <h2 className="coach-modal-name">{c.name}</h2>
                  <div className="coach-modal-role">{c.role}</div>
                  <div className="coach-modal-badges">
                    <span className={`coach-modal-badge ${c.status}`}>
                      <span className="dot" />
                      {c.status === 'available' ? 'Online' : 'Beschäftigt'}
                    </span>
                    <span className="coach-modal-badge">{c.experience}</span>
                    <span className="coach-modal-badge">★ {c.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="coach-modal-section">
                <p className="coach-modal-bio">{c.bio}</p>
              </div>

              {/* Stats-Reihe */}
              <div className="coach-modal-stats">
                <div className="coach-modal-stat">
                  <div className="value"><span className="star">★</span> {c.rating.toFixed(1)}</div>
                  <div className="label">Coach-Bewertung</div>
                </div>
                <div className="coach-modal-stat">
                  <div className="value">{c.sessionCount}+</div>
                  <div className="label">Sessions</div>
                </div>
                <div className="coach-modal-stat">
                  <div className="value">{c.sinceYear ? (new Date().getFullYear() - c.sinceYear) + '+' : '–'}</div>
                  <div className="label">Jahre dabei</div>
                </div>
                <div className="coach-modal-stat">
                  <div className="value">{c.responseTime}</div>
                  <div className="label">Antwortzeit</div>
                </div>
              </div>

              {/* Über */}
              <div className="coach-modal-section">
                <div className="coach-modal-section-label">Über</div>
                <div className="coach-modal-meta-grid">
                  <div className="coach-modal-meta">
                    <span className="icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="1.7"
                           strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </span>
                    <span><strong>Standort:</strong> {c.location}</span>
                  </div>
                  <div className="coach-modal-meta">
                    <span className="icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="1.7"
                           strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>
                      </svg>
                    </span>
                    <span><strong>Sprachen:</strong> {c.languages.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Schwerpunkte */}
              <div className="coach-modal-section">
                <div className="coach-modal-section-label">Schwerpunkte</div>
                <div className="coach-modal-tags">
                  {c.specialties.map(s => (
                    <span key={s} className="coach-modal-tag">{s}</span>
                  ))}
                </div>
              </div>

              {/* Branchen */}
              {c.industries && c.industries.length > 0 && (
                <div className="coach-modal-section">
                  <div className="coach-modal-section-label">Branchen</div>
                  <div className="coach-modal-tags">
                    {c.industries.map(i => (
                      <span key={i} className="coach-modal-tag">{i}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hält folgende Seminare */}
              {c.seminarIds.length > 0 && (
                <div className="coach-modal-section">
                  <div className="coach-modal-section-label">
                    Hält {c.seminarIds.length === 1 ? 'das Seminar' : `${c.seminarIds.length} Seminare`}
                  </div>
                  <div className="coach-modal-tags">
                    {c.seminarIds.map(sid => (
                      <a key={sid} href="/masterclass" className="coach-modal-tag link">
                        {SEMINAR_TITLES[sid] || sid}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Nächste freie Slots */}
              {c.slots && c.slots.length > 0 && (
                <div className="coach-modal-section">
                  <div className="coach-modal-section-label">Nächste freie Slots</div>
                  <div className="coach-modal-slots">
                    {c.slots.map((slot, i) => (
                      <button key={i} className="coach-modal-slot" type="button">
                        <span className="day">{slot.day}</span>
                        <span className="time">{slot.time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer / Aktionen */}
              <div className="coach-modal-footer">
                <div className="coach-modal-hint">
                  <span className="dot" /> Antwortet meist innerhalb {c.responseTime}
                </div>
                <div className="coach-modal-actions">
                  <button type="button" className="coach-modal-action secondary">Nachricht</button>
                  <button type="button" className="coach-modal-action primary">Slot buchen</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
