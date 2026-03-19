'use client';
import { useState, useMemo, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { awardPoints } from '@/lib/gamification';
import InfoTooltip from '@/components/ui/InfoTooltip';
import EmptyState from '@/components/ui/EmptyState';

const INDUSTRIES = ['IT & Software', 'Finanzen & Versicherung', 'Beratung & Consulting', 'Industrie & Produktion', 'Pharma & Medizin', 'Medien & Marketing', 'Handel & E-Commerce', 'Energie & Umwelt', 'Bildung & Forschung', 'Öffentlicher Dienst', 'Sonstige'];
const SENIORITIES = [
  { key: 'junior', label: 'Junior (0-2 J.)' }, { key: 'mid', label: 'Mid-Level (3-5 J.)' },
  { key: 'senior', label: 'Senior (6-10 J.)' }, { key: 'lead', label: 'Lead/Team Lead' },
  { key: 'head', label: 'Head of / VP' }, { key: 'director', label: 'Director' }, { key: 'c_level', label: 'C-Level' },
];
const REGIONS = ['Berlin', 'München', 'Hamburg', 'Frankfurt', 'Köln/Düsseldorf', 'Stuttgart', 'Nordrhein-Westfalen', 'Bayern', 'Baden-Württemberg', 'Niedersachsen', 'Hessen', 'Remote/Deutschland-weit', 'Sonstige'];
const COMPANY_SIZES = ['1-50', '51-200', '201-1000', '1001-5000', '5000+'];
const BENEFITS = ['Homeoffice', 'Firmenwagen', 'Aktien/ESOP', 'Weiterbildungsbudget', 'Bonus', '30+ Urlaubstage', 'Betriebliche AV', 'Gym/Fitness', 'Sabbatical'];

const COMPANY_SIZE_LABELS = { 'Startup': '1-50', 'Mittelstand': '51-200,201-1000', 'Konzern': '1001-5000,5000+' };
const FILTER_INDUSTRIES = ['IT & Software', 'Finanzen & Versicherung', 'Beratung & Consulting', 'Industrie & Produktion', 'Pharma & Medizin', 'Sonstige'];
const TOP_CITIES = ['Berlin', 'München', 'Hamburg', 'Frankfurt', 'Köln/Düsseldorf', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dresden', 'Hannover', 'Remote/Deutschland-weit'];

/* Scenario definitions for the "Was wäre wenn" calculator */
const SCENARIOS = [
  {
    id: 'cert1',
    label: '+1 Zertifikat',
    description: 'Relevante Fachzertifizierung (z.B. PMP, AWS, CISA)',
    pct: 5,
    type: 'checkbox',
    icon: '🎓',
  },
  {
    id: 'cert2',
    label: '+2. Zertifikat',
    description: 'Zweite Zertifizierung erhöht Marktattraktivität deutlich',
    pct: 4,
    type: 'checkbox',
    icon: '🏅',
  },
  {
    id: 'city_change',
    label: 'Stadtwechsel (z.B. Leipzig → München)',
    description: 'Wechsel in eine der Top-3-Gehaltsregionen Deutschlands',
    pct: 12,
    type: 'checkbox',
    icon: '📍',
  },
  {
    id: 'industry_change',
    label: 'Branchenwechsel',
    description: 'Wechsel in eine besser zahlende Branche',
    pct: null, // variable — controlled by slider
    type: 'slider',
    min: -5,
    max: 25,
    defaultValue: 8,
    icon: '🔄',
  },
  {
    id: 'seniority_up',
    label: 'Beförderung / nächstes Level',
    description: 'Aufstieg zu Senior / Lead / Head of',
    pct: 18,
    type: 'checkbox',
    icon: '📈',
  },
  {
    id: 'negotiation',
    label: 'Aktive Gehaltsverhandlung',
    description: 'Gut vorbereitete Verhandlung nach Coaching-Methode',
    pct: 7,
    type: 'checkbox',
    icon: '💬',
  },
];

/* Bell curve helper — returns an array of {x, y} points for a normal distribution */
function bellCurvePoints(mean, stddev, steps = 80) {
  const pts = [];
  const lo = mean - 3.2 * stddev;
  const hi = mean + 3.2 * stddev;
  for (let i = 0; i <= steps; i++) {
    const x = lo + (hi - lo) * (i / steps);
    const z = (x - mean) / stddev;
    const y = Math.exp(-0.5 * z * z) / (stddev * Math.sqrt(2 * Math.PI));
    pts.push({ x, y });
  }
  return pts;
}

function fmt(num) {
  return Math.round(num).toLocaleString('de-DE');
}

export default function GehaltClient({ benchmarks: initial, stats, userId, profile }) {
  const supabase = createClient();
  const [tab, setTab] = useState('search'); // search, contribute, simulator
  const [searchFilters, setSearchFilters] = useState({ job_title: '', industry: '', seniority: '', region: '', company_size_cat: '', filter_industry: '' });
  const [results, setResults] = useState(initial || []);
  const [searching, setSearching] = useState(false);
  const [showContribute, setShowContribute] = useState(false);
  const [form, setForm] = useState({
    job_title: profile?.position || '', industry: '', seniority: 'mid', region: '',
    company_size: '', education: '', base_salary: profile?.current_salary || '',
    bonus: '', benefits: [], satisfaction: 7, is_after_coaching: false, previous_salary: '',
  });

  /* --- Comparison mode state --- */
  const [compareMode, setCompareMode] = useState(false);
  const [compareA, setCompareA] = useState('');
  const [compareB, setCompareB] = useState('');
  const [compareResults, setCompareResults] = useState(null);
  const [compareFetching, setCompareFetching] = useState(false);

  /* --- Gamification state --- */
  const [xpAwarded, setXpAwarded] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [xpToast, setXpToast] = useState(null);

  /* --- "Was wäre wenn" Szenario-Rechner state --- */
  const [scenarioBase, setScenarioBase] = useState(profile?.current_salary || 70000);
  const [activeScenarios, setActiveScenarios] = useState({});
  const [sliderValues, setSliderValues] = useState(
    Object.fromEntries(SCENARIOS.filter(s => s.type === 'slider').map(s => [s.id, s.defaultValue]))
  );

  /* --- Praxis-Aufgabe state --- */
  const [jobAds, setJobAds] = useState(['', '', '']);
  const [taskCompleted, setTaskCompleted] = useState(false);

  /* Award XP on first salary research */
  const triggerFirstSearchXP = async () => {
    if (xpAwarded || !userId) return;
    setXpAwarded(true);
    try {
      await awardPoints(supabase, userId, 'WIN_LOGGED'); // 40 XP
      await supabase.from('activity_log').insert({
        user_id: userId,
        activity_type: 'salary_research',
        activity_label: 'Erste Gehaltsrecherche durchgeführt',
        xp_earned: 40,
      });
      setShowBadge(true);
      setXpToast('+40 XP');
      setTimeout(() => setXpToast(null), 3500);
      setTimeout(() => setShowBadge(false), 6000);
    } catch (_) {}
  };

  /* Scenario calculator: computed salary */
  const scenarioResult = useMemo(() => {
    let multiplier = 1;
    for (const s of SCENARIOS) {
      if (!activeScenarios[s.id]) continue;
      const pct = s.type === 'slider' ? (sliderValues[s.id] ?? s.defaultValue) : s.pct;
      multiplier *= 1 + pct / 100;
    }
    return Math.round(scenarioBase * multiplier);
  }, [scenarioBase, activeScenarios, sliderValues]);

  const scenarioDelta = scenarioResult - scenarioBase;
  const scenarioDeltaPct = scenarioBase > 0 ? ((scenarioDelta / scenarioBase) * 100).toFixed(1) : 0;

  // Search
  const handleSearch = async () => {
    setSearching(true);
    let query = supabase.from('salary_benchmarks').select('*').eq('is_public', true);
    if (searchFilters.job_title) query = query.ilike('job_title', `%${searchFilters.job_title}%`);
    if (searchFilters.industry) query = query.eq('industry', searchFilters.industry);
    if (searchFilters.filter_industry) query = query.eq('industry', searchFilters.filter_industry);
    if (searchFilters.seniority) query = query.eq('seniority', searchFilters.seniority);
    if (searchFilters.region) query = query.eq('region', searchFilters.region);
    if (searchFilters.company_size_cat) {
      const sizes = COMPANY_SIZE_LABELS[searchFilters.company_size_cat];
      if (sizes) query = query.in('company_size', sizes.split(','));
    }
    const { data } = await query.order('total_compensation', { ascending: false }).limit(50);
    setResults(data || []);
    setSearching(false);
    triggerFirstSearchXP();
  };

  // Comparison fetch
  const handleCompare = async () => {
    if (!compareA.trim() || !compareB.trim()) return;
    setCompareFetching(true);
    const [resA, resB] = await Promise.all([
      supabase.from('salary_benchmarks').select('*').eq('is_public', true).ilike('job_title', `%${compareA.trim()}%`).limit(40),
      supabase.from('salary_benchmarks').select('*').eq('is_public', true).ilike('job_title', `%${compareB.trim()}%`).limit(40),
    ]);
    setCompareResults({ a: resA.data || [], b: resB.data || [] });
    setCompareFetching(false);
  };

  // Contribute
  const handleContribute = async () => {
    const entry = {
      user_id: userId, ...form,
      base_salary: +form.base_salary, bonus: +form.bonus || 0,
      previous_salary: form.previous_salary ? +form.previous_salary : null,
    };
    const { data } = await supabase.from('salary_benchmarks').insert(entry).select().single();
    if (data) {
      setShowContribute(false);
      setTab('search');
      await supabase.from('activity_log').insert({ user_id: userId, activity_type: 'salary_benchmark', activity_label: 'Gehaltsdaten beigetragen', xp_earned: 50 });
      await supabase.from('profiles').update({ xp: (profile?.xp || 0) + 50 }).eq('id', userId);
    }
  };

  // Praxis-Aufgabe completion
  const handleTaskComplete = async () => {
    const filled = jobAds.filter(a => a.trim().length > 0).length;
    if (filled < 3) return;
    setTaskCompleted(true);
    if (userId) {
      try {
        await supabase.from('activity_log').insert({
          user_id: userId,
          activity_type: 'salary_task',
          activity_label: 'Praxis-Aufgabe: 3 Stellenanzeigen verglichen',
          xp_earned: 20,
        });
      } catch (_) {}
    }
  };

  // Stats from results
  const computedStats = useMemo(() => {
    if (results.length < 3) return null;
    const comps = results.map(r => r.total_compensation || r.base_salary + (r.bonus || 0)).sort((a, b) => a - b);
    return {
      count: comps.length,
      p25: comps[Math.floor(comps.length * 0.25)],
      median: comps[Math.floor(comps.length * 0.5)],
      p75: comps[Math.floor(comps.length * 0.75)],
      average: Math.round(comps.reduce((a, b) => a + b, 0) / comps.length),
      min: comps[0],
      max: comps[comps.length - 1],
      salaries: comps,
    };
  }, [results]);

  const userSalary = profile?.current_salary || 0;
  const userPercentile = computedStats && userSalary
    ? Math.round(results.filter(r => (r.total_compensation || r.base_salary) <= userSalary).length / results.length * 100)
    : null;

  /* --- Comparison stats helper --- */
  const compareStats = useMemo(() => {
    if (!compareResults) return null;
    const calc = (arr) => {
      if (arr.length === 0) return null;
      const comps = arr.map(r => r.total_compensation || r.base_salary + (r.bonus || 0)).sort((a, b) => a - b);
      return {
        count: comps.length,
        p25: comps[Math.floor(comps.length * 0.25)],
        median: comps[Math.floor(comps.length * 0.5)],
        p75: comps[Math.floor(comps.length * 0.75)],
        average: Math.round(comps.reduce((a, b) => a + b, 0) / comps.length),
      };
    };
    return { a: calc(compareResults.a), b: calc(compareResults.b) };
  }, [compareResults]);

  /* --- Distribution curve data --- */
  const distributionCurve = useMemo(() => {
    if (!computedStats || computedStats.salaries.length < 5) return null;
    const salaries = computedStats.salaries;
    const mean = computedStats.average;
    const variance = salaries.reduce((s, v) => s + (v - mean) ** 2, 0) / salaries.length;
    const stddev = Math.sqrt(variance) || mean * 0.15;
    return { mean, stddev, pts: bellCurvePoints(mean, stddev) };
  }, [computedStats]);

  /* Max scenario bar value for scaling */
  const scenarioMaxSalary = useMemo(() => {
    let all = [scenarioBase];
    for (const s of SCENARIOS) {
      const pct = s.type === 'slider' ? (sliderValues[s.id] ?? s.defaultValue) : s.pct;
      all.push(scenarioBase * (1 + pct / 100));
    }
    return Math.max(...all);
  }, [scenarioBase, sliderValues]);

  return (
    <div className="page-container">

      {/* XP Toast */}
      {xpToast && (
        <div style={{
          position: 'fixed', top: 80, right: 24, zIndex: 9999,
          background: 'var(--ki-success)', color: 'white',
          padding: '10px 20px', borderRadius: 'var(--r-pill)',
          fontWeight: 700, fontSize: 15, boxShadow: 'var(--sh-lg)',
          animation: 'slideInRight 0.35s var(--ease-apple)',
        }}>
          {xpToast} — Gehalts-Detektiv 🔍
        </div>
      )}

      {/* Badge overlay */}
      {showBadge && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.45)',
        }} onClick={() => setShowBadge(false)}>
          <div className="card" style={{
            textAlign: 'center', padding: '40px 48px', maxWidth: 360,
            animation: 'scaleIn 0.4s var(--ease-apple)',
          }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Badge freigeschaltet!</div>
            <div style={{ fontSize: 17, color: 'var(--ki-red)', fontWeight: 600, marginBottom: 8 }}>Gehalts-Detektiv</div>
            <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 20 }}>
              Du hast deine erste Gehaltsrecherche abgeschlossen und weißt jetzt, wo du im Markt stehst.
            </div>
            <span className="pill" style={{ background: 'var(--ki-success)', color: 'white', fontSize: 16, fontWeight: 700, padding: '8px 20px' }}>+40 XP</span>
            <div style={{ marginTop: 16, fontSize: 12, color: 'var(--ki-text-tertiary)' }}>Tippen zum Schließen</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Gehaltsdatenbank</h1><InfoTooltip moduleId="gehalt" profile={profile} />
          <p style={{ color: 'var(--ki-text-secondary)', marginTop: 4 }}>
            Anonyme Gehaltsvergleiche — von Fach- und Führungskräften für Fach- und Führungskräfte.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowContribute(true)}>+ Mein Gehalt eintragen</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          ['search', '🔎 Suchen'],
          ['simulator', '⚡ Was wäre wenn'],
          ['contribute', '➕ Beitragen'],
        ].map(([key, label]) => (
          <button key={key}
            className={`btn ${tab === key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab(key)}
            style={{ fontSize: 13, padding: '8px 16px' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ===================== SEARCH TAB ===================== */}
      {tab === 'search' && (
        <>
          {/* Filter Bar */}
          <div className="card" style={{ marginBottom: 16, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text-secondary)', whiteSpace: 'nowrap' }}>Filter:</span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
                <select className="input" value={searchFilters.company_size_cat}
                  onChange={e => setSearchFilters(p => ({ ...p, company_size_cat: e.target.value }))}
                  style={{ width: 'auto', minWidth: 140, fontSize: 13, padding: '6px 10px' }}>
                  <option value="">Alle Größen</option>
                  <option value="Startup">Startup (1-50)</option>
                  <option value="Mittelstand">Mittelstand (51-1000)</option>
                  <option value="Konzern">Konzern (1000+)</option>
                </select>
                <select className="input" value={searchFilters.region}
                  onChange={e => setSearchFilters(p => ({ ...p, region: e.target.value }))}
                  style={{ width: 'auto', minWidth: 150, fontSize: 13, padding: '6px 10px' }}>
                  <option value="">Alle Standorte</option>
                  {TOP_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="input" value={searchFilters.filter_industry}
                  onChange={e => setSearchFilters(p => ({ ...p, filter_industry: e.target.value }))}
                  style={{ width: 'auto', minWidth: 140, fontSize: 13, padding: '6px 10px' }}>
                  <option value="">Alle Branchen</option>
                  {FILTER_INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <button className={`btn ${compareMode ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCompareMode(p => !p)}
                style={{ fontSize: 12, padding: '6px 12px', whiteSpace: 'nowrap' }}>
                {compareMode ? 'Vergleich aus' : 'Vergleiche 2 Positionen'}
              </button>
            </div>

            {(searchFilters.company_size_cat || searchFilters.region || searchFilters.filter_industry) && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {searchFilters.company_size_cat && (
                  <span className="pill" style={{ cursor: 'pointer', fontSize: 11, background: 'var(--ki-red)', color: 'white' }}
                    onClick={() => setSearchFilters(p => ({ ...p, company_size_cat: '' }))}>
                    {searchFilters.company_size_cat} &times;
                  </span>
                )}
                {searchFilters.region && (
                  <span className="pill" style={{ cursor: 'pointer', fontSize: 11, background: 'var(--ki-red)', color: 'white' }}
                    onClick={() => setSearchFilters(p => ({ ...p, region: '' }))}>
                    {searchFilters.region} &times;
                  </span>
                )}
                {searchFilters.filter_industry && (
                  <span className="pill" style={{ cursor: 'pointer', fontSize: 11, background: 'var(--ki-red)', color: 'white' }}
                    onClick={() => setSearchFilters(p => ({ ...p, filter_industry: '' }))}>
                    {searchFilters.filter_industry} &times;
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Comparison Mode Panel */}
          {compareMode && (
            <div className="card" style={{ marginBottom: 24, padding: 20, borderLeft: '3px solid var(--ki-red)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Positionsvergleich</h3>
              <div className="grid-2" style={{ gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Position A</label>
                  <input className="input" placeholder="z.B. Projektmanager" value={compareA}
                    onChange={e => setCompareA(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Position B</label>
                  <input className="input" placeholder="z.B. Product Owner" value={compareB}
                    onChange={e => setCompareB(e.target.value)} />
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleCompare}
                disabled={compareFetching || !compareA.trim() || !compareB.trim()}
                style={{ width: '100%' }}>
                {compareFetching ? 'Lade...' : 'Vergleichen'}
              </button>

              {compareStats && (compareStats.a || compareStats.b) && (
                <div style={{ marginTop: 20 }}>
                  {(() => {
                    const sa = compareStats.a;
                    const sb = compareStats.b;
                    const metrics = [
                      { label: '25. Perzentil', keyA: sa?.p25 || 0, keyB: sb?.p25 || 0 },
                      { label: 'Median', keyA: sa?.median || 0, keyB: sb?.median || 0 },
                      { label: 'Durchschnitt', keyA: sa?.average || 0, keyB: sb?.average || 0 },
                      { label: '75. Perzentil', keyA: sa?.p75 || 0, keyB: sb?.p75 || 0 },
                    ];
                    const barMax = Math.max(...metrics.map(m => Math.max(m.keyA, m.keyB)), 1);
                    return (
                      <div>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 12 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--ki-red)', display: 'inline-block' }} />
                            {compareA || 'Position A'} ({sa?.count || 0} Einträge)
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--ki-success)', display: 'inline-block' }} />
                            {compareB || 'Position B'} ({sb?.count || 0} Einträge)
                          </span>
                        </div>
                        {metrics.map(m => (
                          <div key={m.label} style={{ marginBottom: 14 }}>
                            <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{m.label}</div>
                            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <div style={{ height: 18, borderRadius: 'var(--r-sm)', background: 'var(--ki-red)', width: `${Math.max((m.keyA / barMax) * 100, 2)}%`, transition: 'width var(--t-med) var(--ease-apple)' }} />
                                  <span style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{m.keyA > 0 ? `${Math.round(m.keyA / 1000)}k` : '—'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <div style={{ height: 18, borderRadius: 'var(--r-sm)', background: 'var(--ki-success)', width: `${Math.max((m.keyB / barMax) * 100, 2)}%`, transition: 'width var(--t-med) var(--ease-apple)' }} />
                                  <span style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{m.keyB > 0 ? `${Math.round(m.keyB / 1000)}k` : '—'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {(!sa || sa.count === 0) && <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>Keine Daten für &quot;{compareA}&quot; gefunden.</p>}
                        {(!sb || sb.count === 0) && <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>Keine Daten für &quot;{compareB}&quot; gefunden.</p>}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Search */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Gehälter vergleichen</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              <input className="input" placeholder="Jobtitel (z.B. Projektmanager)" value={searchFilters.job_title}
                onChange={e => setSearchFilters(p => ({ ...p, job_title: e.target.value }))} />
              <select className="input" value={searchFilters.industry} onChange={e => setSearchFilters(p => ({ ...p, industry: e.target.value }))}>
                <option value="">Alle Branchen</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <select className="input" value={searchFilters.seniority} onChange={e => setSearchFilters(p => ({ ...p, seniority: e.target.value }))}>
                <option value="">Alle Level</option>
                {SENIORITIES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
              <select className="input" value={searchFilters.region} onChange={e => setSearchFilters(p => ({ ...p, region: e.target.value }))}>
                <option value="">Alle Regionen</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" onClick={handleSearch} disabled={searching} style={{ marginTop: 12, width: '100%' }}>
              {searching ? 'Suche...' : `Gehälter anzeigen (${results.length} Ergebnisse)`}
            </button>
          </div>

          {/* Stats Summary */}
          {computedStats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
              <div className="card" style={{ textAlign: 'center', padding: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>25. Perzentil</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>€{Math.round(computedStats.p25 / 1000)}k</div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: 16, borderTop: '3px solid var(--ki-red)' }}>
                <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Median</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ki-red)' }}>€{Math.round(computedStats.median / 1000)}k</div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>75. Perzentil</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>€{Math.round(computedStats.p75 / 1000)}k</div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Datenpunkte</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{computedStats.count}</div>
              </div>
            </div>
          )}

          {/* Percentile Distribution Curve */}
          {userPercentile !== null && computedStats && distributionCurve && (
            <div className="card" style={{ marginBottom: 24, padding: 20, borderLeft: '3px solid var(--ki-red)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>Dein Gehalt im Vergleich</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>Du liegst im {userPercentile}. Perzentil</div>
                  <div style={{ fontSize: 14, color: userPercentile >= 50 ? 'var(--ki-success)' : 'var(--ki-red)', marginTop: 4 }}>
                    {userPercentile >= 75 ? 'Überdurchschnittlich — stark!' :
                     userPercentile >= 50 ? 'Im oberen Mittelfeld — Potenzial vorhanden.' :
                     userPercentile >= 25 ? 'Unter dem Median — hier liegt Verhandlungspotenzial.' :
                     'Deutlich unter Markt — dringend verhandeln!'}
                  </div>
                </div>
                <div>
                  <span className="pill"
                    style={{
                      fontSize: 16, fontWeight: 700, padding: '6px 14px',
                      background: userPercentile >= 75 ? 'var(--ki-success)' : userPercentile >= 50 ? 'var(--ki-warning)' : 'var(--ki-red)',
                      color: 'white',
                    }}>
                    Top {100 - userPercentile}%
                  </span>
                </div>
              </div>

              {/* SVG Distribution Curve */}
              {(() => {
                const { pts, mean, stddev } = distributionCurve;
                const svgW = 600; const svgH = 140;
                const padX = 40; const padTop = 10; const padBot = 28;
                const plotW = svgW - 2 * padX;
                const plotH = svgH - padTop - padBot;
                const xMin = pts[0].x; const xMax = pts[pts.length - 1].x;
                const yMax = Math.max(...pts.map(p => p.y));
                const toSvgX = (v) => padX + ((v - xMin) / (xMax - xMin)) * plotW;
                const toSvgY = (v) => padTop + plotH - (v / yMax) * plotH;
                const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(p.x).toFixed(1)},${toSvgY(p.y).toFixed(1)}`).join(' ')
                  + ` L${toSvgX(pts[pts.length - 1].x).toFixed(1)},${toSvgY(0).toFixed(1)} L${toSvgX(pts[0].x).toFixed(1)},${toSvgY(0).toFixed(1)} Z`;
                const lineD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(p.x).toFixed(1)},${toSvgY(p.y).toFixed(1)}`).join(' ');
                const salaryX = Math.max(xMin, Math.min(xMax, userSalary));
                const arrowSvgX = toSvgX(salaryX);
                const zUser = (salaryX - mean) / stddev;
                const yUser = Math.exp(-0.5 * zUser * zUser) / (stddev * Math.sqrt(2 * Math.PI));
                const arrowSvgY = toSvgY(yUser);
                const p25x = toSvgX(computedStats.p25);
                const p50x = toSvgX(computedStats.median);
                const p75x = toSvgX(computedStats.p75);
                return (
                  <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: 'auto', maxHeight: 160, display: 'block' }}>
                    <defs>
                      <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--ki-red)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--ki-red)" stopOpacity="0.03" />
                      </linearGradient>
                    </defs>
                    <path d={pathD} fill="url(#curveFill)" />
                    <path d={lineD} fill="none" stroke="var(--ki-red)" strokeWidth="2" />
                    {[{ x: p25x, label: 'P25', val: computedStats.p25 }, { x: p50x, label: 'Median', val: computedStats.median }, { x: p75x, label: 'P75', val: computedStats.p75 }].map(p => (
                      <g key={p.label}>
                        <line x1={p.x} y1={padTop} x2={p.x} y2={padTop + plotH} stroke="var(--ki-border)" strokeWidth="1" strokeDasharray="3,3" />
                        <text x={p.x} y={svgH - 4} textAnchor="middle" fontSize="9" fill="var(--ki-text-tertiary)" fontFamily="inherit">
                          {p.label} ({Math.round(p.val / 1000)}k)
                        </text>
                      </g>
                    ))}
                    <line x1={padX} y1={padTop + plotH} x2={padX + plotW} y2={padTop + plotH} stroke="var(--ki-border)" strokeWidth="1" />
                    <line x1={arrowSvgX} y1={arrowSvgY} x2={arrowSvgX} y2={padTop + plotH} stroke="var(--ki-red)" strokeWidth="2" />
                    <circle cx={arrowSvgX} cy={arrowSvgY} r="5" fill="var(--ki-red)" stroke="white" strokeWidth="2" />
                    <rect x={arrowSvgX - 30} y={arrowSvgY - 22} width="60" height="16" rx="4" fill="var(--ki-red)" />
                    <text x={arrowSvgX} y={arrowSvgY - 10} textAnchor="middle" fontSize="9" fill="white" fontWeight="600" fontFamily="inherit">
                      Du: {Math.round(userSalary / 1000)}k
                    </text>
                  </svg>
                );
              })()}
            </div>
          )}

          {/* Fallback percentile bar */}
          {userPercentile !== null && computedStats && !distributionCurve && (
            <div className="card" style={{ marginBottom: 24, padding: 20, borderLeft: '3px solid var(--ki-red)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>Dein Gehalt im Vergleich</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>Du liegst im {userPercentile}. Perzentil</div>
                  <div style={{ fontSize: 14, color: userPercentile >= 50 ? 'var(--ki-success)' : 'var(--ki-red)', marginTop: 4 }}>
                    {userPercentile >= 75 ? 'Überdurchschnittlich — stark!' :
                     userPercentile >= 50 ? 'Im oberen Mittelfeld — Potenzial vorhanden.' :
                     userPercentile >= 25 ? 'Unter dem Median — hier liegt Verhandlungspotenzial.' :
                     'Deutlich unter Markt — dringend verhandeln!'}
                  </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <div style={{ position: 'relative', width: 200, height: 12, background: 'var(--grey-5)', borderRadius: 6 }}>
                    <div style={{ position: 'absolute', left: `${userPercentile}%`, top: -4, width: 20, height: 20, borderRadius: '50%', background: 'var(--ki-red)', border: '2px solid white', boxShadow: 'var(--sh-md)', transform: 'translateX(-50%)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ki-text-tertiary)', marginTop: 4 }}>
                    <span>P25</span><span>Median</span><span>P75</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Table */}
          {results.length > 0 && (
            <div className="card" style={{ overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--ki-border)', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--ki-text-secondary)' }}>Titel</th>
                      <th style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--ki-text-secondary)' }}>Branche</th>
                      <th style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--ki-text-secondary)' }}>Level</th>
                      <th style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--ki-text-secondary)' }}>Region</th>
                      <th style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--ki-text-secondary)', textAlign: 'right' }}>Gehalt</th>
                      <th style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--ki-text-secondary)', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slice(0, 20).map((r) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid var(--ki-border)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 500 }}>{r.job_title}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--ki-text-secondary)' }}>{r.industry}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span className="pill" style={{ background: 'var(--ki-bg-alt)', color: 'var(--ki-charcoal)', fontSize: 11 }}>
                            {SENIORITIES.find(s => s.key === r.seniority)?.label || r.seniority}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', color: 'var(--ki-text-secondary)' }}>{r.region}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>€{(r.base_salary || 0).toLocaleString('de-DE')}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--ki-success)' }}>
                          €{((r.total_compensation || r.base_salary + (r.bonus || 0))).toLocaleString('de-DE')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {results.length > 20 && (
                <div style={{ padding: 12, textAlign: 'center', fontSize: 13, color: 'var(--ki-text-secondary)' }}>
                  Zeige 20 von {results.length} Ergebnissen
                </div>
              )}
            </div>
          )}

          {results.length === 0 && (
            <div className="card" style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Starte deine Gehaltsrecherche</h3>
              <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 16 }}>Wähle Jobtitel, Branche und Region — und vergleiche dein Gehalt mit dem Markt.</p>
              <p style={{ fontSize: 13, color: 'var(--ki-text-tertiary)' }}>Je mehr User beitragen, desto präziser werden die Daten. Trage auch dein Gehalt ein!</p>
            </div>
          )}

          {/* Video Placeholder */}
          <div className="card" style={{ marginBottom: 24, overflow: 'hidden' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--ki-charcoal) 0%, #1a1f20 100%)',
              borderRadius: 'var(--r-md)',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              padding: 32,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at 30% 50%, rgba(204,20,38,0.15) 0%, transparent 60%)',
              }} />
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(204,20,38,0.9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, cursor: 'pointer',
                boxShadow: '0 0 0 12px rgba(204,20,38,0.15)',
                position: 'relative', zIndex: 1,
              }}>▶</div>
              <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                  Masterclass
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 4 }}>
                  Die Kunst der Gehaltsverhandlung
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                  Lerne in 45 Min., wie Top-Performer 15–25% mehr rausholen
                </div>
              </div>
              <span className="pill" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 11, position: 'relative', zIndex: 1 }}>
                45 Min. · Inkl. Verhandlungs-Skript
              </span>
            </div>
          </div>

          {/* Praxis-Aufgabe */}
          <div className="card" style={{ marginBottom: 24, borderLeft: '4px solid var(--ki-warning)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ fontSize: 32, flexShrink: 0 }}>📋</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-warning)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                  Praxis-Aufgabe
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                  Recherchiere 3 Stellenanzeigen für deine Position und vergleiche die Gehälter
                </h3>
                <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
                  Öffne LinkedIn, StepStone oder Indeed — suche nach deinem Jobtitel und notiere die genannten Gehaltsangaben oder Gehaltsbänder.
                </p>

                {!taskCompleted ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {jobAds.map((val, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{
                          width: 24, height: 24, borderRadius: '50%',
                          background: val.trim() ? 'var(--ki-success)' : 'var(--ki-bg-alt)',
                          color: val.trim() ? 'white' : 'var(--ki-text-tertiary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, flexShrink: 0,
                          transition: 'background var(--t-fast)',
                        }}>{i + 1}</span>
                        <input
                          className="input"
                          placeholder={`Stelle ${i + 1}: Jobtitel + Gehalt (z.B. Senior PM bei XING, 85.000 €)`}
                          value={val}
                          onChange={e => {
                            const next = [...jobAds];
                            next[i] = e.target.value;
                            setJobAds(next);
                          }}
                          style={{ flex: 1 }}
                        />
                      </div>
                    ))}
                    <button
                      className="btn btn-primary"
                      onClick={handleTaskComplete}
                      disabled={jobAds.filter(a => a.trim()).length < 3}
                      style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                      Aufgabe abschliessen
                    </button>
                    {jobAds.filter(a => a.trim()).length < 3 && (
                      <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>
                        Noch {3 - jobAds.filter(a => a.trim()).length} Einträge erforderlich
                      </p>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)' }}>
                    <span style={{ fontSize: 24 }}>✅</span>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>Aufgabe abgeschlossen!</div>
                      <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>
                        Du hast 3 Stellen analysiert. Nutze diese Daten als Argument in deiner nächsten Gehaltsverhandlung.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===================== SIMULATOR TAB ===================== */}
      {tab === 'simulator' && (
        <div>
          <div className="card" style={{ marginBottom: 24, borderTop: '3px solid var(--ki-red)', padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 36 }}>⚡</div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Was wäre wenn — Szenario-Rechner</h2>
                <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)' }}>
                  Aktiviere Szenarien und sieh in Echtzeit, wie sich dein Gehalt entwickeln könnte.
                </p>
              </div>
            </div>

            {/* Base salary input */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 8 }}>
                Dein aktuelles Bruttogehalt (Basis)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  className="input"
                  type="number"
                  value={scenarioBase}
                  onChange={e => setScenarioBase(+e.target.value || 0)}
                  style={{ maxWidth: 200 }}
                  placeholder="70000"
                />
                <span style={{ fontSize: 14, color: 'var(--ki-text-secondary)' }}>€ / Jahr brutto</span>
              </div>
            </div>

            {/* Scenario rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {SCENARIOS.map(s => {
                const isActive = !!activeScenarios[s.id];
                const effectivePct = s.type === 'slider' ? (sliderValues[s.id] ?? s.defaultValue) : s.pct;
                const singleImpact = Math.round(scenarioBase * effectivePct / 100);
                const barWidthPct = Math.max(Math.min((scenarioBase / scenarioMaxSalary) * 100, 100), 2);
                const barWithPct = Math.max(
                  Math.min(((scenarioBase * (1 + effectivePct / 100)) / scenarioMaxSalary) * 100, 100),
                  2
                );

                return (
                  <div
                    key={s.id}
                    className="card"
                    style={{
                      padding: '16px 20px',
                      border: isActive ? '1.5px solid var(--ki-red)' : '1.5px solid var(--ki-border)',
                      background: isActive ? 'rgba(204,20,38,0.03)' : 'var(--ki-card)',
                      transition: 'border-color var(--t-fast), background var(--t-fast)',
                      cursor: s.type === 'checkbox' ? 'pointer' : 'default',
                    }}
                    onClick={s.type === 'checkbox' ? () => setActiveScenarios(p => ({ ...p, [s.id]: !p[s.id] })) : undefined}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      {/* Toggle / Checkbox */}
                      <div
                        style={{
                          width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 2,
                          border: `2px solid ${isActive ? 'var(--ki-red)' : 'var(--ki-border)'}`,
                          background: isActive ? 'var(--ki-red)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all var(--t-fast)',
                          cursor: 'pointer',
                        }}
                        onClick={e => { e.stopPropagation(); setActiveScenarios(p => ({ ...p, [s.id]: !p[s.id] })); }}
                      >
                        {isActive && <span style={{ color: 'white', fontSize: 13, lineHeight: 1 }}>✓</span>}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 18 }}>{s.icon}</span>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{s.label}</span>
                          <span className="pill" style={{
                            fontSize: 11, fontWeight: 700, marginLeft: 'auto',
                            background: isActive ? 'var(--ki-red)' : 'var(--ki-bg-alt)',
                            color: isActive ? 'white' : 'var(--ki-text-secondary)',
                            transition: 'all var(--t-fast)',
                          }}>
                            {effectivePct > 0 ? '+' : ''}{effectivePct}%
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>{s.description}</p>

                        {/* Slider for variable scenarios */}
                        {s.type === 'slider' && (
                          <div style={{ marginBottom: 10 }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ki-text-tertiary)', marginBottom: 4 }}>
                              <span>{s.min}%</span>
                              <span style={{ fontWeight: 600, color: 'var(--ki-charcoal)' }}>
                                Eingestellt: {sliderValues[s.id] > 0 ? '+' : ''}{sliderValues[s.id]}%
                              </span>
                              <span>+{s.max}%</span>
                            </div>
                            <input
                              type="range"
                              min={s.min}
                              max={s.max}
                              value={sliderValues[s.id] ?? s.defaultValue}
                              onChange={e => {
                                const v = +e.target.value;
                                setSliderValues(p => ({ ...p, [s.id]: v }));
                                if (!activeScenarios[s.id]) setActiveScenarios(p => ({ ...p, [s.id]: true }));
                              }}
                              style={{ width: '100%', accentColor: 'var(--ki-red)' }}
                            />
                          </div>
                        )}

                        {/* Animated bar comparison */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {/* Base bar */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 10, color: 'var(--ki-text-tertiary)', width: 46, flexShrink: 0 }}>Aktuell</span>
                            <div style={{ flex: 1, height: 8, background: 'var(--ki-bg-alt)', borderRadius: 4, overflow: 'hidden' }}>
                              <div style={{
                                height: '100%', borderRadius: 4,
                                background: 'var(--ki-charcoal)',
                                width: `${barWidthPct}%`,
                                transition: 'width var(--t-med) var(--ease-apple)',
                              }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 600, width: 58, flexShrink: 0, textAlign: 'right' }}>
                              €{Math.round(scenarioBase / 1000)}k
                            </span>
                          </div>
                          {/* Potential bar */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 10, color: isActive ? 'var(--ki-red)' : 'var(--ki-text-tertiary)', width: 46, flexShrink: 0, fontWeight: isActive ? 700 : 400 }}>
                              Potenzial
                            </span>
                            <div style={{ flex: 1, height: 8, background: 'var(--ki-bg-alt)', borderRadius: 4, overflow: 'hidden' }}>
                              <div style={{
                                height: '100%', borderRadius: 4,
                                background: isActive ? 'var(--ki-red)' : 'var(--grey-4)',
                                width: `${isActive ? barWithPct : barWidthPct}%`,
                                transition: 'width var(--t-med) var(--ease-apple), background var(--t-fast)',
                              }} />
                            </div>
                            <span style={{
                              fontSize: 11, fontWeight: 700, width: 58, flexShrink: 0, textAlign: 'right',
                              color: isActive ? 'var(--ki-red)' : 'var(--ki-text-tertiary)',
                            }}>
                              {isActive ? `€${Math.round(scenarioBase * (1 + effectivePct / 100) / 1000)}k` : '—'}
                            </span>
                          </div>
                        </div>

                        {isActive && (
                          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--ki-success)', fontWeight: 600 }}>
                            + €{fmt(singleImpact)} / Jahr durch dieses Szenario
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Result summary card */}
          <div className="card" style={{
            marginBottom: 24,
            background: 'linear-gradient(135deg, var(--ki-charcoal) 0%, #1a2022 100%)',
            color: 'white',
            padding: 28,
          }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
              Geschätztes Zielgehalt mit allen aktiven Szenarien
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em' }}>
                €{fmt(scenarioResult)}
              </div>
              {scenarioDelta !== 0 && (
                <div style={{
                  fontSize: 18, fontWeight: 600,
                  color: scenarioDelta > 0 ? '#4ade80' : '#f87171',
                  marginBottom: 6,
                }}>
                  {scenarioDelta > 0 ? '+' : ''}€{fmt(scenarioDelta)}
                  <span style={{ fontSize: 14, marginLeft: 6, opacity: 0.8 }}>
                    ({scenarioDelta > 0 ? '+' : ''}{scenarioDeltaPct}%)
                  </span>
                </div>
              )}
            </div>

            {/* Total progress bar */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
                <span>Basis: €{fmt(scenarioBase)}</span>
                <span>Ziel: €{fmt(scenarioResult)}</span>
              </div>
              <div style={{ height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 5,
                  background: 'linear-gradient(90deg, var(--ki-red) 0%, #ff6b6b 100%)',
                  width: scenarioResult > 0 ? `${Math.min((scenarioBase / scenarioResult) * 100, 100)}%` : '0%',
                  transition: 'width var(--t-slow) var(--ease-apple)',
                }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(activeScenarios).filter(([, v]) => v).map(([id]) => {
                const s = SCENARIOS.find(x => x.id === id);
                if (!s) return null;
                const pct = s.type === 'slider' ? (sliderValues[id] ?? s.defaultValue) : s.pct;
                return (
                  <span key={id} className="pill" style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)', fontSize: 11 }}>
                    {s.icon} {pct > 0 ? '+' : ''}{pct}%
                  </span>
                );
              })}
              {Object.values(activeScenarios).every(v => !v) && (
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Noch keine Szenarien aktiv — wähle oben aus.</span>
              )}
            </div>
          </div>

          {/* CTA to masterclass */}
          <div className="card" style={{ marginBottom: 24, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 36, flexShrink: 0 }}>🎓</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Lerne, wie du diese Szenarien umsetzt</div>
              <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>
                Die Masterclass &quot;Die Kunst der Gehaltsverhandlung&quot; zeigt dir Schritt für Schritt, wie du diese Potenziale in echte Gehaltserhöhungen verwandelst.
              </div>
            </div>
            <button className="btn btn-primary" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
              onClick={() => setTab('search')}>
              Zur Masterclass ▶
            </button>
          </div>
        </div>
      )}

      {/* ===================== CONTRIBUTE TAB ===================== */}
      {tab === 'contribute' && (
        <div className="card" style={{ maxWidth: 600 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Dein Gehalt eintragen</h3>
          <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 20 }}>Anonymisiert und verschlüsselt. Du hilfst damit tausenden Fachkräften.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="grid-2" style={{ gap: 8 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Jobtitel *</label>
                <input className="input" value={form.job_title} onChange={e => setForm(p => ({ ...p, job_title: e.target.value }))} placeholder="z.B. Senior Projektmanager" />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Branche *</label>
                <select className="input" value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}>
                  <option value="">Wählen...</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>

            <div className="grid-3" style={{ gap: 8 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Seniority *</label>
                <select className="input" value={form.seniority} onChange={e => setForm(p => ({ ...p, seniority: e.target.value }))}>
                  {SENIORITIES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Region *</label>
                <select className="input" value={form.region} onChange={e => setForm(p => ({ ...p, region: e.target.value }))}>
                  <option value="">Wählen...</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Unternehmensgröße</label>
                <select className="input" value={form.company_size} onChange={e => setForm(p => ({ ...p, company_size: e.target.value }))}>
                  <option value="">Wählen...</option>
                  {COMPANY_SIZES.map(c => <option key={c} value={c}>{c} MA</option>)}
                </select>
              </div>
            </div>

            <div className="grid-2" style={{ gap: 8 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Grundgehalt (brutto/Jahr) *</label>
                <input className="input" type="number" value={form.base_salary} onChange={e => setForm(p => ({ ...p, base_salary: e.target.value }))} placeholder="75000" />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Bonus/Variable (brutto/Jahr)</label>
                <input className="input" type="number" value={form.bonus} onChange={e => setForm(p => ({ ...p, bonus: e.target.value }))} placeholder="10000" />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginBottom: 4, display: 'block' }}>Zufriedenheit (1-10): {form.satisfaction}</label>
              <input type="range" min={1} max={10} value={form.satisfaction} onChange={e => setForm(p => ({ ...p, satisfaction: +e.target.value }))} style={{ width: '100%', accentColor: 'var(--ki-red)' }} />
            </div>

            <div>
              <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginBottom: 6, display: 'block' }}>Benefits</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {BENEFITS.map(b => (
                  <button key={b}
                    className="pill"
                    style={{ cursor: 'pointer', border: 'none', background: form.benefits.includes(b) ? 'var(--ki-red)' : 'var(--ki-bg-alt)', color: form.benefits.includes(b) ? 'white' : 'var(--ki-charcoal)' }}
                    onClick={() => setForm(p => ({ ...p, benefits: p.benefits.includes(b) ? p.benefits.filter(x => x !== b) : [...p.benefits, b] }))}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: 12, background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.is_after_coaching} onChange={e => setForm(p => ({ ...p, is_after_coaching: e.target.checked }))} />
                <span style={{ fontSize: 13 }}>Dieses Gehalt habe ich nach dem Karriere-Institut Coaching erreicht</span>
              </label>
              {form.is_after_coaching && (
                <div style={{ marginTop: 8 }}>
                  <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Gehalt VOR dem Coaching</label>
                  <input className="input" type="number" value={form.previous_salary} onChange={e => setForm(p => ({ ...p, previous_salary: e.target.value }))} placeholder="65000" />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button className="btn btn-secondary" onClick={() => setTab('search')} style={{ flex: 1 }}>Abbrechen</button>
              <button className="btn btn-primary" onClick={handleContribute}
                disabled={!form.job_title || !form.industry || !form.region || !form.base_salary}
                style={{ flex: 1 }}>
                Anonymisiert beitragen (+50 KI-P)
              </button>
            </div>

            <p style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textAlign: 'center' }}>
              Deine Daten werden anonymisiert gespeichert. Kein Name, keine E-Mail, kein Unternehmen wird veröffentlicht.
            </p>
          </div>
        </div>
      )}

      {/* Contribute Modal (from header button) */}
      {showContribute && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={e => e.target === e.currentTarget && setShowContribute(false)}>
          <div className="card" style={{ width: 560, maxWidth: '90vw', maxHeight: '85vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Dein Gehalt eintragen</h3>
            <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 20 }}>Anonymisiert und verschlüsselt. Du hilfst damit tausenden Fachkräften.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="grid-2" style={{ gap: 8 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Jobtitel *</label>
                  <input className="input" value={form.job_title} onChange={e => setForm(p => ({ ...p, job_title: e.target.value }))} placeholder="z.B. Senior Projektmanager" />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Branche *</label>
                  <select className="input" value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}>
                    <option value="">Wählen...</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid-3" style={{ gap: 8 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Seniority *</label>
                  <select className="input" value={form.seniority} onChange={e => setForm(p => ({ ...p, seniority: e.target.value }))}>
                    {SENIORITIES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Region *</label>
                  <select className="input" value={form.region} onChange={e => setForm(p => ({ ...p, region: e.target.value }))}>
                    <option value="">Wählen...</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Unternehmensgröße</label>
                  <select className="input" value={form.company_size} onChange={e => setForm(p => ({ ...p, company_size: e.target.value }))}>
                    <option value="">Wählen...</option>
                    {COMPANY_SIZES.map(c => <option key={c} value={c}>{c} MA</option>)}
                  </select>
                </div>
              </div>

              <div className="grid-2" style={{ gap: 8 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Grundgehalt (brutto/Jahr) *</label>
                  <input className="input" type="number" value={form.base_salary} onChange={e => setForm(p => ({ ...p, base_salary: e.target.value }))} placeholder="75000" />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Bonus/Variable (brutto/Jahr)</label>
                  <input className="input" type="number" value={form.bonus} onChange={e => setForm(p => ({ ...p, bonus: e.target.value }))} placeholder="10000" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginBottom: 4, display: 'block' }}>Zufriedenheit (1-10): {form.satisfaction}</label>
                <input type="range" min={1} max={10} value={form.satisfaction} onChange={e => setForm(p => ({ ...p, satisfaction: +e.target.value }))} style={{ width: '100%', accentColor: 'var(--ki-red)' }} />
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginBottom: 6, display: 'block' }}>Benefits</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {BENEFITS.map(b => (
                    <button key={b}
                      className="pill"
                      style={{ cursor: 'pointer', border: 'none', background: form.benefits.includes(b) ? 'var(--ki-red)' : 'var(--ki-bg-alt)', color: form.benefits.includes(b) ? 'white' : 'var(--ki-charcoal)' }}
                      onClick={() => setForm(p => ({ ...p, benefits: p.benefits.includes(b) ? p.benefits.filter(x => x !== b) : [...p.benefits, b] }))}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: 12, background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_after_coaching} onChange={e => setForm(p => ({ ...p, is_after_coaching: e.target.checked }))} />
                  <span style={{ fontSize: 13 }}>Dieses Gehalt habe ich nach dem Karriere-Institut Coaching erreicht</span>
                </label>
                {form.is_after_coaching && (
                  <div style={{ marginTop: 8 }}>
                    <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Gehalt VOR dem Coaching</label>
                    <input className="input" type="number" value={form.previous_salary} onChange={e => setForm(p => ({ ...p, previous_salary: e.target.value }))} placeholder="65000" />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button className="btn btn-secondary" onClick={() => setShowContribute(false)} style={{ flex: 1 }}>Abbrechen</button>
                <button className="btn btn-primary" onClick={handleContribute}
                  disabled={!form.job_title || !form.industry || !form.region || !form.base_salary}
                  style={{ flex: 1 }}>
                  Anonymisiert beitragen (+50 KI-P)
                </button>
              </div>

              <p style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textAlign: 'center' }}>
                Deine Daten werden anonymisiert gespeichert. Kein Name, keine E-Mail, kein Unternehmen wird veröffentlicht.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
