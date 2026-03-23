'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { awardPoints } from '@/lib/gamification';

/* ───────────────────────────── Platform Data ───────────────────────────── */

const PLATFORMS = [
  {
    id: 'wir-personalberater',
    name: 'Wir:Personalberater Jobportal',
    color: '#CC1426',
    icon: '⭐',
    url: 'https://jobportal.wirpersonalberater.de/#/',
    highlight: true,
    checklist: [
      'Account erstellen',
      'Profil vollständig ausfüllen',
      'Lebenslauf hochladen',
      'Jobpräferenzen einstellen',
    ],
    tips: [
      'Exklusive Stellen aus unserem Netzwerk',
      'Direkte Verbindung zu Personalberatern',
      'Viele Positionen werden hier exklusiv ausgeschrieben',
    ],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    icon: '🔵',
    url: 'https://linkedin.com',
    checklist: [
      'Profilbild (professionell, aktuell)',
      'Banner-Bild mit Branding',
      'Headline optimiert (nicht nur Jobtitel)',
      'About-Section (min. 200 Wörter)',
      'Berufserfahrung vollständig',
      'Skills & Endorsements (min. 10)',
      'Empfehlungen (min. 3)',
      'SSI-Score > 50',
      'Regelmäßig Posts/Artikel',
      'Karriere-Institut Zertifikate verlinkt',
    ],
    tips: [
      'Nutze Keywords aus Stellenanzeigen in deiner Headline',
      'Poste 2-3x pro Woche für maximale Sichtbarkeit',
      'Kommentiere bei Entscheidern deiner Branche',
      'Aktiviere "Open to Work" für Recruiter',
    ],
  },
  {
    id: 'xing',
    name: 'XING',
    color: '#006567',
    icon: '🟠',
    url: 'https://xing.com',
    checklist: [
      'Profilbild professionell',
      'Berufserfahrung vollständig',
      'Qualifikationen eingetragen',
      'Ich-suche / Ich-biete ausgefüllt',
      'Portfolio verlinkt',
      'Gehaltsvorstellung hinterlegt',
      'Status: Offen für Angebote',
      'Gruppen beigetreten (min. 3)',
    ],
    tips: [
      'XING ist besonders stark im DACH-Raum',
      'Viele Mittelständler nutzen primär XING',
      'Die "Ich suche"-Sektion ist Gold wert für Recruiter',
    ],
  },
  {
    id: 'stepstone',
    name: 'StepStone',
    color: '#00A88E',
    icon: '🟢',
    url: 'https://stepstone.de',
    checklist: [
      'Lebenslauf hochgeladen (aktuell)',
      'Jobpräferenzen eingestellt',
      'Gehaltsvorstellung definiert',
      'Job-Alerts aktiviert',
    ],
    tips: [
      'Aktualisiere deinen CV regelmäßig — Recruiter sehen "zuletzt aktiv"',
      'Nutze den Gehaltsplaner für realistische Erwartungen',
      'Bewirb dich auch auf "Fast-Matches"',
    ],
  },
  {
    id: 'indeed',
    name: 'Indeed',
    color: '#2164F3',
    icon: '🔴',
    url: 'https://indeed.de',
    checklist: [
      'Lebenslauf hochgeladen',
      'Profil vollständig',
      'Job-Alerts eingerichtet',
    ],
    tips: [
      'Indeed hat die größte Job-Datenbank weltweit',
      'Nutze die Gehaltsrecherche für Verhandlungen',
      'Filtere nach "Arbeitgeber-Bewertung" für bessere Matches',
    ],
  },
  {
    id: 'glassdoor',
    name: 'Glassdoor',
    color: '#0CAA41',
    icon: '🟣',
    url: 'https://glassdoor.de',
    checklist: [
      'Konto erstellt',
      'Arbeitgeber bewertet (für vollen Zugang)',
    ],
    tips: [
      'Lies Bewertungen VOR dem Bewerbungsgespräch',
      'Gehalts-Infos sind Gold wert für Verhandlungen',
      'Interview-Erfahrungen helfen bei der Vorbereitung',
    ],
  },
  {
    id: 'kununu',
    name: 'Kununu',
    color: '#99C613',
    icon: '⚫',
    url: 'https://kununu.com',
    checklist: [
      'Konto erstellt',
      'Arbeitgeber bewertet',
    ],
    tips: [
      'Kununu ist das größte Arbeitgeber-Bewertungsportal im DACH-Raum',
      'Nutze die anonyme Bewertungsfunktion',
      'Firmenbewertungen sind ideal für Gesprächsvorbereitung',
    ],
  },
];

const UNIVERSAL_CHECKLIST = [
  'Profilbild (professionell, aktuell)',
  'Headline optimiert (nicht nur Jobtitel)',
  'Zusammenfassung/About (min. 150 Wörter)',
  'Berufserfahrung vollständig',
  'Skills & Kenntnisse (min. 5)',
  'Empfehlungen/Referenzen (min. 2)',
  'Karriere-Institut Zertifikate verlinkt',
  'Jobportal-Profil bei Wir:Personalberater',
];

/* ──────────────────────── Headline-Generator Helpers ───────────────────── */

function generateHeadlinesFallback(position, skills, target) {
  const skillStr = skills.filter(Boolean).join(', ');
  const base = [];

  if (position && skillStr && target) {
    base.push(
      `${position} | ${skillStr} | Auf dem Weg zum ${target}`,
      `${target} in spe — ${skillStr} | Aktuell ${position}`,
      `${position} mit Fokus auf ${skillStr} → ${target}`,
      `Von ${position} zu ${target} | Expertise: ${skillStr}`,
      `${skillStr} Experte | ${position} | Nächstes Ziel: ${target}`,
    );
  } else if (position && skillStr) {
    base.push(
      `${position} | ${skillStr}`,
      `${position} — Spezialisiert auf ${skillStr}`,
      `${skillStr} | ${position} mit Leidenschaft`,
      `Erfahrener ${position} | ${skillStr}`,
      `${position} | Expertise in ${skillStr}`,
    );
  } else if (position) {
    base.push(
      `${position} — Offen für neue Herausforderungen`,
      `Erfahrener ${position} mit breitem Skillset`,
      `${position} | Karriere-Institut Akademie Absolvent`,
      `${position} auf der Suche nach Impact`,
      `${position} | Innovativ. Engagiert. Ergebnisorientiert.`,
    );
  } else {
    base.push(
      'Karriereorientierter Professional — Offen für neue Wege',
      'Fachkraft mit Leidenschaft und Zielstrebigkeit',
      'Bereit für den nächsten Karriereschritt',
      'Professional | Karriere-Institut Akademie',
      'Fachexperte — Offen für spannende Herausforderungen',
    );
  }

  return base;
}

/* ──────────────────────────── Progress Ring ─────────────────────────────── */

function ProgressRing({ percent, size = 80, stroke = 6 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const ringColor =
    percent === 100
      ? 'var(--ki-success)'
      : percent >= 50
        ? 'var(--ki-warning)'
        : 'var(--ki-red)';

  return (
    <svg width={size} height={size} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--ki-border)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={ringColor}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="var(--ki-text)"
        fontSize={size * 0.22}
        fontWeight={700}
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
      >
        {percent}%
      </text>
    </svg>
  );
}

/* ───────────────────────── Toast Notification ──────────────────────────── */

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: 'var(--ki-card)',
        border: '1px solid var(--ki-border)',
        borderRadius: 'var(--r-md)',
        padding: '12px 20px',
        boxShadow: 'var(--sh-lg)',
        zIndex: 9999,
        color: 'var(--ki-text)',
        fontSize: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        animation: 'fadeIn 0.3s ease',
      }}
    >
      {message}
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--ki-text-tertiary)',
          cursor: 'pointer',
          fontSize: 16,
          marginLeft: 8,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}

/* ══════════════════════════ MAIN COMPONENT ══════════════════════════════ */

export default function BrandingClient({ userId, existing, profile }) {
  const supabase = createClient();

  /* ── State ── */
  const [expandedPlatform, setExpandedPlatform] = useState(null);
  const [platformChecklists, setPlatformChecklists] = useState(() => {
    const saved = existing?.platform_checklists;
    if (saved && typeof saved === 'object') return saved;
    const init = {};
    PLATFORMS.forEach((p) => {
      init[p.id] = [];
    });
    return init;
  });
  const [universalChecklist, setUniversalChecklist] = useState(
    () => existing?.universal_checklist ?? [],
  );
  const [universalXpAwarded, setUniversalXpAwarded] = useState(
    () => existing?.universal_xp_awarded ?? false,
  );

  // Headline generator
  const [hlPosition, setHlPosition] = useState(profile?.position || '');
  const [hlSkills, setHlSkills] = useState(['', '', '']);
  const [hlTarget, setHlTarget] = useState(profile?.career_goal || '');
  const [hlResults, setHlResults] = useState([]);
  const [hlLoading, setHlLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg) => setToast(msg), []);

  /* ── Persistence ── */
  const persist = useCallback(
    async (pChecklists, uChecklist, xpFlag) => {
      if (!userId) return;
      await supabase.from('module_progress').upsert(
        {
          user_id: userId,
          module: 'branding',
          platform_checklists: pChecklists,
          universal_checklist: uChecklist,
          universal_xp_awarded: xpFlag,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,module' },
      );
    },
    [userId, supabase],
  );

  /* ── Platform checklist toggle ── */
  const togglePlatformItem = useCallback(
    (platformId, item) => {
      setPlatformChecklists((prev) => {
        const items = prev[platformId] ?? [];
        const next = items.includes(item)
          ? items.filter((i) => i !== item)
          : [...items, item];
        const updated = { ...prev, [platformId]: next };
        persist(updated, universalChecklist, universalXpAwarded);
        return updated;
      });
    },
    [persist, universalChecklist, universalXpAwarded],
  );

  /* ── Universal checklist toggle ── */
  const toggleUniversalItem = useCallback(
    (item) => {
      setUniversalChecklist((prev) => {
        const next = prev.includes(item)
          ? prev.filter((i) => i !== item)
          : [...prev, item];

        const allDone = next.length === UNIVERSAL_CHECKLIST.length;
        let xpFlag = universalXpAwarded;

        if (allDone && !universalXpAwarded) {
          xpFlag = true;
          setUniversalXpAwarded(true);
          awardPoints(supabase, userId, 'COMPLETE_LESSON').then(() => {
            showToast('+50 XP — Universelle Profil-Checkliste abgeschlossen!');
          });
        }

        persist(platformChecklists, next, xpFlag);
        return next;
      });
    },
    [persist, platformChecklists, universalXpAwarded, userId, showToast, supabase],
  );

  /* ── Platform progress ── */
  const getPlatformPercent = useCallback(
    (platformId) => {
      const p = PLATFORMS.find((x) => x.id === platformId);
      if (!p) return 0;
      const checked = (platformChecklists[platformId] ?? []).length;
      return Math.round((checked / p.checklist.length) * 100);
    },
    [platformChecklists],
  );

  /* ── Universal progress ── */
  const universalPercent = useMemo(
    () =>
      Math.round(
        (universalChecklist.length / UNIVERSAL_CHECKLIST.length) * 100,
      ),
    [universalChecklist],
  );

  /* ── Headline Generator ── */
  const generateHeadlines = useCallback(async () => {
    setHlLoading(true);
    setHlResults([]);
    setCopiedIdx(null);

    const skills = hlSkills.filter(Boolean);

    try {
      const res = await fetch('/api/ai/headlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position: hlPosition,
          skills,
          target: hlTarget,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.headlines?.length) {
          setHlResults(data.headlines.slice(0, 5));
          setHlLoading(false);
          return;
        }
      }
    } catch {
      /* fallback below */
    }

    const fallback = generateHeadlinesFallback(hlPosition, skills, hlTarget);
    setHlResults(fallback);
    setHlLoading(false);
  }, [hlPosition, hlSkills, hlTarget]);

  const copyToClipboard = useCallback(
    (text, idx) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedIdx(idx);
        showToast('In die Zwischenablage kopiert!');
        setTimeout(() => setCopiedIdx(null), 2000);
      });
    },
    [showToast],
  );

  const updateSkill = useCallback((index, value) => {
    setHlSkills((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  /* ═══════════════════════════ RENDER ══════════════════════════════════ */

  return (
    <div className="page-container">
      {/* ── Toast ── */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ═══════════ 1. HEADER ═══════════ */}
      <header className="animate-in" style={{ marginBottom: 32 }}>
        <h1
          className="page-title"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          Jobportale &amp; Plattformen
          <InfoTooltip moduleId="branding" />
        </h1>
        <p className="page-subtitle">
          Deine Präsenz auf den wichtigsten Karriere-Plattformen optimieren
        </p>
      </header>

      {/* ═══════════ 2. WIR:PERSONALBERATER JOBPORTAL ═══════════ */}
      <section
        className="card animate-in"
        style={{
          borderLeft: '3px solid var(--ki-red)',
          marginBottom: 32,
          padding: 28,
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 8,
            color: 'var(--ki-text)',
          }}
        >
          🏢 Wir:Personalberater Jobportal
        </h2>
        <p
          style={{
            color: 'var(--ki-text-secondary)',
            marginBottom: 20,
            lineHeight: 1.6,
          }}
        >
          Das exklusive Jobportal des Karriere-Instituts. Hier findest du
          kuratierte Stellenangebote von unseren Partner-unternehmen.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginBottom: 24,
          }}
        >
          {[
            'Kuratierte Stellen',
            'Direkter Kontakt zu Entscheidern',
            'Karriere-Institut Mitglieder bevorzugt',
          ].map((item) => (
            <div
              key={item}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span style={{ color: 'var(--ki-success)', fontSize: 18 }}>
                ✓
              </span>
              <span style={{ color: 'var(--ki-text)' }}>{item}</span>
            </div>
          ))}
        </div>

        <a
          href="https://jobportal.wirpersonalberater.de/#/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{
            fontSize: 16,
            padding: '12px 28px',
            display: 'inline-block',
            textDecoration: 'none',
          }}
        >
          Zum Jobportal →
        </a>
        <p
          style={{
            marginTop: 8,
            fontSize: 12,
            color: 'var(--ki-text-tertiary)',
          }}
        >
          jobportal.wirpersonalberater.de
        </p>
      </section>

      {/* ═══════════ 3. PROFIL-OPTIMIERUNG — 6 Platform Cards ═══════════ */}
      <section className="animate-in" style={{ marginBottom: 40 }}>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 16,
            color: 'var(--ki-text)',
          }}
        >
          Profil-Optimierung
        </h2>

        <div className="grid-3">
          {PLATFORMS.map((platform) => {
            const isOpen = expandedPlatform === platform.id;
            const checked = platformChecklists[platform.id] ?? [];
            const percent = getPlatformPercent(platform.id);

            return (
              <div
                key={platform.id}
                className="card"
                style={{
                  borderTop: `3px solid ${platform.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Card Header */}
                <div style={{ padding: 20, paddingBottom: isOpen ? 12 : 20 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{platform.icon}</span>
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: 'var(--ki-text)',
                          margin: 0,
                        }}
                      >
                        {platform.name}
                      </h3>
                    </div>
                    <span
                      className={`pill ${
                        percent === 100
                          ? 'pill-green'
                          : percent > 0
                            ? 'pill-grey'
                            : 'pill-red'
                      }`}
                    >
                      {percent}%
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: 13, padding: '4px 10px' }}
                      onClick={() =>
                        setExpandedPlatform(isOpen ? null : platform.id)
                      }
                    >
                      {isOpen ? 'Schließen' : 'Checkliste öffnen'}
                    </button>
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost"
                      style={{
                        fontSize: 13,
                        padding: '4px 10px',
                        textDecoration: 'none',
                      }}
                    >
                      Profil öffnen →
                    </a>
                  </div>
                </div>

                {/* Expandable Content */}
                {isOpen && (
                  <div
                    style={{
                      borderTop: '1px solid var(--ki-border)',
                      padding: 20,
                      background: 'var(--ki-bg-alt)',
                      animation: 'fadeIn 0.25s ease',
                    }}
                  >
                    {/* Checklist */}
                    <h4
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--ki-text-secondary)',
                        marginBottom: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Checkliste
                    </h4>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        marginBottom: 20,
                      }}
                    >
                      {platform.checklist.map((item) => {
                        const isChecked = checked.includes(item);
                        return (
                          <label
                            key={item}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 8,
                              cursor: 'pointer',
                              fontSize: 14,
                              color: isChecked
                                ? 'var(--ki-text-tertiary)'
                                : 'var(--ki-text)',
                              textDecoration: isChecked
                                ? 'line-through'
                                : 'none',
                              transition: 'color 0.2s ease',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() =>
                                togglePlatformItem(platform.id, item)
                              }
                              style={{
                                marginTop: 2,
                                accentColor: platform.color,
                                cursor: 'pointer',
                              }}
                            />
                            {item}
                          </label>
                        );
                      })}
                    </div>

                    {/* Tips */}
                    <h4
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--ki-text-secondary)',
                        marginBottom: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Tipps
                    </h4>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: 18,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}
                    >
                      {platform.tips.map((tip) => (
                        <li
                          key={tip}
                          style={{
                            fontSize: 13,
                            color: 'var(--ki-text-secondary)',
                            lineHeight: 1.5,
                          }}
                        >
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════ 4. LINKEDIN HEADLINE-GENERATOR ═══════════ */}
      <section
        className="card animate-in"
        style={{ marginBottom: 32, padding: 28 }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 4,
            color: 'var(--ki-text)',
          }}
        >
          LinkedIn Headline-Generator
        </h2>
        <p
          style={{
            color: 'var(--ki-text-secondary)',
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          Erstelle eine optimierte Headline für dein LinkedIn-Profil.
        </p>

        <div className="grid-2" style={{ marginBottom: 16 }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--ki-text-secondary)',
                marginBottom: 6,
              }}
            >
              Aktuelle Position
            </label>
            <input
              className="input"
              type="text"
              placeholder="z.B. Marketing Manager"
              value={hlPosition}
              onChange={(e) => setHlPosition(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--ki-text-secondary)',
                marginBottom: 6,
              }}
            >
              Ziel-Position
            </label>
            <input
              className="input"
              type="text"
              placeholder="z.B. Head of Marketing"
              value={hlTarget}
              onChange={(e) => setHlTarget(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--ki-text-secondary)',
              marginBottom: 6,
            }}
          >
            Top 3 Skills
          </label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {hlSkills.map((skill, idx) => (
              <input
                key={idx}
                className="input"
                type="text"
                placeholder={`Skill ${idx + 1}`}
                value={skill}
                onChange={(e) => updateSkill(idx, e.target.value)}
                style={{ flex: '1 1 150px', minWidth: 120 }}
              />
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={generateHeadlines}
          disabled={hlLoading}
          style={{ marginBottom: 20 }}
        >
          {hlLoading ? 'Generiere...' : 'Headlines generieren'}
        </button>

        {hlResults.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {hlResults.map((headline, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '12px 16px',
                  background:
                    idx === 0
                      ? 'rgba(204,20,38,0.05)'
                      : 'var(--ki-bg-alt)',
                  borderRadius: 'var(--r-md)',
                  border:
                    idx === 0
                      ? '1px solid rgba(204,20,38,0.2)'
                      : '1px solid var(--ki-border)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flex: 1,
                  }}
                >
                  {idx === 0 && (
                    <span
                      className="pill pill-red"
                      style={{ fontSize: 10, flexShrink: 0 }}
                    >
                      TOP
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 14,
                      color: 'var(--ki-text)',
                      lineHeight: 1.5,
                      fontWeight: idx === 0 ? 600 : 400,
                    }}
                  >
                    {headline}
                  </span>
                </div>
                <button
                  className="btn btn-secondary"
                  style={{
                    fontSize: 12,
                    padding: '4px 12px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                  onClick={() => copyToClipboard(headline, idx)}
                >
                  {copiedIdx === idx ? '✓ Kopiert' : 'Kopieren'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══════════ 5. UNIVERSELLE PROFIL-CHECKLISTE ═══════════ */}
      <section className="card animate-in" style={{ padding: 28 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 4,
                color: 'var(--ki-text)',
              }}
            >
              Universelle Profil-Checkliste
            </h2>
            <p
              style={{
                color: 'var(--ki-text-secondary)',
                fontSize: 14,
                margin: 0,
              }}
            >
              Diese Punkte gelten für <strong>alle</strong> Plattformen.
              {!universalXpAwarded && (
                <span style={{ color: 'var(--ki-warning)', marginLeft: 6 }}>
                  +50 XP bei 100%
                </span>
              )}
              {universalXpAwarded && (
                <span style={{ color: 'var(--ki-success)', marginLeft: 6 }}>
                  ✓ +50 XP erhalten
                </span>
              )}
            </p>
          </div>
          <ProgressRing percent={universalPercent} />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {UNIVERSAL_CHECKLIST.map((item) => {
            const isChecked = universalChecklist.includes(item);
            return (
              <label
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 'var(--r-md)',
                  background: isChecked
                    ? 'var(--ki-bg-alt)'
                    : 'transparent',
                  border: '1px solid var(--ki-border)',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  color: isChecked
                    ? 'var(--ki-text-tertiary)'
                    : 'var(--ki-text)',
                  textDecoration: isChecked ? 'line-through' : 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleUniversalItem(item)}
                  style={{
                    accentColor: 'var(--ki-red)',
                    cursor: 'pointer',
                    width: 16,
                    height: 16,
                  }}
                />
                <span style={{ fontSize: 14 }}>{item}</span>
              </label>
            );
          })}
        </div>

        {universalPercent === 100 && (
          <div
            style={{
              marginTop: 20,
              padding: '14px 18px',
              borderRadius: 'var(--r-md)',
              background: 'var(--ki-bg-alt)',
              border: '1px solid var(--ki-success)',
              textAlign: 'center',
              color: 'var(--ki-success)',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Alle Punkte abgeschlossen — dein Profil ist optimal aufgestellt!
          </div>
        )}
      </section>
    </div>
  );
}
