'use client';
import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

const INDUSTRIES = ['IT & Software', 'Finanzen & Versicherung', 'Beratung & Consulting', 'Industrie & Produktion', 'Pharma & Medizin', 'Medien & Marketing', 'Handel & E-Commerce', 'Energie & Umwelt', 'Bildung & Forschung', 'Öffentlicher Dienst', 'Sonstige'];
const SENIORITIES = [
  { key: 'junior', label: 'Junior (0-2 J.)' }, { key: 'mid', label: 'Mid-Level (3-5 J.)' },
  { key: 'senior', label: 'Senior (6-10 J.)' }, { key: 'lead', label: 'Lead/Team Lead' },
  { key: 'head', label: 'Head of / VP' }, { key: 'director', label: 'Director' }, { key: 'c_level', label: 'C-Level' },
];
const REGIONS = ['Berlin', 'München', 'Hamburg', 'Frankfurt', 'Köln/Düsseldorf', 'Stuttgart', 'Nordrhein-Westfalen', 'Bayern', 'Baden-Württemberg', 'Niedersachsen', 'Hessen', 'Remote/Deutschland-weit', 'Sonstige'];
const COMPANY_SIZES = ['1-50', '51-200', '201-1000', '1001-5000', '5000+'];
const BENEFITS = ['Homeoffice', 'Firmenwagen', 'Aktien/ESOP', 'Weiterbildungsbudget', 'Bonus', '30+ Urlaubstage', 'Betriebliche AV', 'Gym/Fitness', 'Sabbatical'];

export default function GehaltClient({ benchmarks: initial, stats, userId, profile }) {
  const supabase = createClient();
  const [tab, setTab] = useState('search'); // search, contribute, my
  const [searchFilters, setSearchFilters] = useState({ job_title: '', industry: '', seniority: '', region: '' });
  const [results, setResults] = useState(initial || []);
  const [searching, setSearching] = useState(false);
  const [showContribute, setShowContribute] = useState(false);
  const [myEntries, setMyEntries] = useState([]);
  const [form, setForm] = useState({
    job_title: profile?.position || '', industry: '', seniority: 'mid', region: '',
    company_size: '', education: '', base_salary: profile?.current_salary || '',
    bonus: '', benefits: [], satisfaction: 7, is_after_coaching: false, previous_salary: '',
  });

  // Search
  const handleSearch = async () => {
    setSearching(true);
    let query = supabase.from('salary_benchmarks').select('*').eq('is_public', true);
    if (searchFilters.job_title) query = query.ilike('job_title', `%${searchFilters.job_title}%`);
    if (searchFilters.industry) query = query.eq('industry', searchFilters.industry);
    if (searchFilters.seniority) query = query.eq('seniority', searchFilters.seniority);
    if (searchFilters.region) query = query.eq('region', searchFilters.region);
    const { data } = await query.order('total_compensation', { ascending: false }).limit(50);
    setResults(data || []);
    setSearching(false);
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
    };
  }, [results]);

  const userSalary = profile?.current_salary || 0;
  const userPercentile = computedStats && userSalary
    ? Math.round(results.filter(r => (r.total_compensation || r.base_salary) <= userSalary).length / results.length * 100)
    : null;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Gehaltsdatenbank</h1>
          <p className="page-subtitle">Anonyme Gehaltsvergleiche — von Fach- und Führungskräften für Fach- und Führungskräfte.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowContribute(true)}>+ Mein Gehalt eintragen</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[['search', '🔍 Suchen'], ['contribute', '📊 Beitragen']].map(([key, label]) => (
          <button key={key} className={`btn ${tab === key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab(key)} style={{ fontSize: 13, padding: '8px 16px' }}>{label}</button>
        ))}
      </div>

      {/* Search */}
      <div className="card animate-in" style={{ marginBottom: 24 }}>
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
        <div className="grid-4" style={{ marginBottom: 24 }}>
          <div className="card animate-in" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>25. Perzentil</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>€{Math.round(computedStats.p25 / 1000)}k</div>
          </div>
          <div className="card animate-in" style={{ textAlign: 'center', padding: 16, borderTop: '3px solid var(--ki-red)' }}>
            <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Median</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ki-red)' }}>€{Math.round(computedStats.median / 1000)}k</div>
          </div>
          <div className="card animate-in" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>75. Perzentil</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>€{Math.round(computedStats.p75 / 1000)}k</div>
          </div>
          <div className="card animate-in" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Datenpunkte</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{computedStats.count}</div>
          </div>
        </div>
      )}

      {/* Your Position */}
      {userPercentile !== null && computedStats && (
        <div className="card animate-in" style={{ marginBottom: 24, padding: 20, borderLeft: '3px solid var(--ki-red)' }}>
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
        <div className="card animate-in" style={{ overflow: 'hidden' }}>
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
                {results.slice(0, 20).map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--ki-border)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>{r.job_title}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--ki-text-secondary)' }}>{r.industry}</td>
                    <td style={{ padding: '10px 12px' }}><span className="pill pill-grey">{SENIORITIES.find(s => s.key === r.seniority)?.label || r.seniority}</span></td>
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
          {results.length > 20 && <div style={{ padding: 12, textAlign: 'center', fontSize: 13, color: 'var(--ki-text-secondary)' }}>Zeige 20 von {results.length} Ergebnissen</div>}
        </div>
      )}

      {results.length === 0 && tab === 'search' && (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Starte deine Gehaltsrecherche</h3>
          <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 16 }}>Wähle Jobtitel, Branche und Region — und vergleiche dein Gehalt mit dem Markt.</p>
          <p style={{ fontSize: 13, color: 'var(--ki-text-tertiary)' }}>Je mehr User beitragen, desto präziser werden die Daten. Trage auch dein Gehalt ein!</p>
        </div>
      )}

      {/* Contribute Modal */}
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
                    <button key={b} className={`pill ${form.benefits.includes(b) ? 'pill-red' : 'pill-grey'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
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
