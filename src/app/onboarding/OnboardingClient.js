'use client';
import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const INDUSTRIES = [
  { id: 'it', label: 'IT/Tech', icon: '\u{1F4BB}' },
  { id: 'finance', label: 'Finance', icon: '\u{1F4CA}' },
  { id: 'consulting', label: 'Consulting', icon: '\u{1F3AF}' },
  { id: 'marketing', label: 'Marketing', icon: '\u{1F4F1}' },
  { id: 'industry', label: 'Industrie', icon: '\u2699\uFE0F' },
  { id: 'healthcare', label: 'Healthcare', icon: '\u{1F3E5}' },
  { id: 'legal', label: 'Recht', icon: '\u2696\uFE0F' },
  { id: 'other', label: 'Sonstiges', icon: '\u{1F52E}' },
];

const OBSTACLES = [
  { id: 'worth', label: 'Ich wei\u00DF nicht, was ich wert bin', icon: '\u{1F937}' },
  { id: 'selling', label: 'Ich kann mich nicht verkaufen', icon: '\u{1F5E3}\uFE0F' },
  { id: 'plan', label: 'Mir fehlt ein Plan', icon: '\u{1F5FA}\uFE0F' },
  { id: 'stuck', label: 'Ich bin unzufrieden aber stecke fest', icon: '\u{1F512}' },
];

const QUICK_QUESTIONS = [
  'Ich kann meine Stärken klar benennen und kommunizieren.',
  'Ich fühle mich in Verhandlungssituationen sicher.',
  'Ich habe einen klaren Plan für meine nächsten Karriereschritte.',
];

const FIELD_LABELS = ['Selbstkenntnis', 'Verhandlung', 'Strategie'];

const MODULE_RECOMMENDATIONS = {
  worth: { label: 'Karriereanalyse', path: '/analyse' },
  selling: { label: 'LinkedIn & Branding', path: '/branding' },
  plan: { label: 'Entscheidungs-Kompass', path: '/strategy/decision' },
  stuck: { label: 'Exit-Strategie', path: '/strategy/exit' },
};

export default function OnboardingClient({ profile, userId }) {
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 2
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [birthYear, setBirthYear] = useState('');

  // Step 3
  const [industry, setIndustry] = useState('');
  const [experience, setExperience] = useState(5);
  const [position, setPosition] = useState('');

  // Step 4
  const [currentSalary, setCurrentSalary] = useState(50000);
  const [targetSalary, setTargetSalary] = useState(75000);
  const [obstacle, setObstacle] = useState('');

  // Step 5
  const [answers, setAnswers] = useState([3, 3, 3]);

  // DSGVO
  const [dsgvoConsent, setDsgvoConsent] = useState(false);

  // Confetti state
  const [showConfetti, setShowConfetti] = useState(false);

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const canNext = () => {
    if (step === 1) return dsgvoConsent;
    if (step === 2) return firstName.trim() && lastName.trim() && birthYear;
    if (step === 3) return industry && position.trim();
    if (step === 4) return obstacle;
    return true;
  };

  const next = () => {
    if (step === 5) {
      setStep(6);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      return;
    }
    setStep(s => s + 1);
  };

  const prev = () => setStep(s => Math.max(1, s - 1));

  const finish = useCallback(async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email || '';

      // upsert statt update – funktioniert auch wenn Trigger das Profil noch nicht angelegt hat
      const { error } = await supabase.from('profiles').upsert({
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`.trim(),
        avatar_initials: ((firstName[0] || '') + (lastName[0] || 'X')).toUpperCase(),
        role: 'user',
        phase: 'pre_coaching',
        industry,
        current_salary: currentSalary,
        target_salary: targetSalary,
        career_obstacle: obstacle,
        experience_years: experience,
        onboarding_complete: true,
        total_points: 50,
        dsgvo_consent_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      if (error) throw error;
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Onboarding save failed:', err);
      setSaving(false);
    }
  }, [supabase, userId, firstName, lastName, industry, currentSalary, targetSalary, obstacle, experience]);

  // Radar chart SVG
  const RadarChart = ({ values, labels, size = 200 }) => {
    const cx = size / 2, cy = size / 2, r = size * 0.38;
    const n = values.length;
    const points = values.map((v, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const dist = (v / 5) * r;
      return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist };
    });
    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {gridLevels.map((gl, gi) => (
          <polygon key={gi} points={Array.from({ length: n }, (_, i) => {
            const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
            return `${cx + Math.cos(angle) * r * gl},${cy + Math.sin(angle) * r * gl}`;
          }).join(' ')} fill="none" stroke="var(--grey-4)" strokeWidth="1" />
        ))}
        {Array.from({ length: n }, (_, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(angle) * r} y2={cy + Math.sin(angle) * r} stroke="var(--grey-4)" strokeWidth="1" />;
        })}
        <polygon points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(204,20,38,0.15)" stroke="var(--ki-red)" strokeWidth="2" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--ki-red)" />
        ))}
        {labels.map((label, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          const lx = cx + Math.cos(angle) * (r + 24);
          const ly = cy + Math.sin(angle) * (r + 24);
          return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 11, fontWeight: 600, fill: 'var(--ki-text-secondary)' }}>{label}</text>;
        })}
      </svg>
    );
  };

  const recommendation = MODULE_RECOMMENDATIONS[obstacle] || MODULE_RECOMMENDATIONS.plan;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, var(--ki-bg) 0%, var(--ki-bg-alt) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>

      {/* Confetti */}
      {showConfetti && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
          {Array.from({ length: 60 }, (_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: '-10px',
              width: `${6 + Math.random() * 8}px`,
              height: `${6 + Math.random() * 8}px`,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              background: ['var(--ki-red)', 'var(--ki-warning)', 'var(--ki-success)', '#6366f1', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 6)],
              animation: `confettiFall ${2 + Math.random() * 2}s ease-in forwards`,
              animationDelay: `${Math.random() * 1.5}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }} />
          ))}
          <style>{`
            @keyframes confettiFall {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* Progress Dots */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
        {[1, 2, 3, 4, 5, 6].map(s => (
          <div key={s} style={{
            width: s === step ? 32 : 10, height: 10, borderRadius: 5,
            background: s <= step ? 'var(--ki-red)' : 'var(--grey-4)',
            transition: 'all 0.3s var(--ease-apple)',
          }} />
        ))}
      </div>

      {/* Card */}
      <div className="card" style={{ maxWidth: 560, width: '100%', padding: 40, animation: 'fadeIn 0.4s var(--ease-apple) both' }}>

        {/* Step 1: Willkommen */}
        {step === 1 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>
              <span style={{ display: 'inline-block', width: 80, height: 80, borderRadius: '50%', background: 'rgba(204,20,38,0.08)', lineHeight: '80px', fontSize: 40 }}>K</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 8 }}>Willkommen beim Karriere-Institut</h1>
            <p style={{ fontSize: 16, color: 'var(--ki-text-secondary)', marginBottom: 32 }}>In 2 Minuten richten wir alles für dich ein</p>
            <div style={{ fontSize: 24, marginBottom: 24, animation: 'bounce 2s infinite' }}>{'\u2193'}</div>
            <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }`}</style>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: 'left', marginBottom: 20, cursor: 'pointer', fontSize: 13, color: 'var(--ki-text-secondary)', lineHeight: 1.5 }}>
              <input type="checkbox" checked={dsgvoConsent} onChange={e => setDsgvoConsent(e.target.checked)} style={{ marginTop: 3, accentColor: 'var(--ki-red)', width: 16, height: 16, flexShrink: 0 }} />
              <span>Ich stimme der Verarbeitung meiner Daten gemäß der{' '}
                <a href="/datenschutz" target="_blank" rel="noopener" style={{ color: 'var(--ki-red)', textDecoration: 'underline' }}>Datenschutzerklärung</a> zu.
              </span>
            </label>

            <button className="btn btn-primary" onClick={next} disabled={!dsgvoConsent} style={{ width: '100%', padding: '14px 24px', fontSize: 16, opacity: dsgvoConsent ? 1 : 0.5 }}>
              Los geht's
            </button>
          </div>
        )}

        {/* Step 2: Persönliche Daten */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Persönliche Daten</h2>
            <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 24 }}>Wie dürfen wir dich ansprechen?</p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: initials ? 'var(--ki-red)' : 'var(--grey-5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 24, fontWeight: 700, transition: 'all var(--t-med)' }}>
                {initials || '?'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <input className="input" placeholder="Vorname" value={firstName} onChange={e => setFirstName(e.target.value)} />
              <input className="input" placeholder="Nachname" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>

            <select className="input" value={birthYear} onChange={e => setBirthYear(e.target.value)} style={{ marginBottom: 24, color: birthYear ? 'var(--ki-text)' : 'var(--ki-text-tertiary)' }}>
              <option value="">Geburtsjahr wählen</option>
              {Array.from({ length: 81 }, (_, i) => 2005 - i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" onClick={prev} style={{ flex: 1 }}>Zurück</button>
              <button className="btn btn-primary" onClick={next} disabled={!canNext()} style={{ flex: 2, opacity: canNext() ? 1 : 0.5 }}>Weiter</button>
            </div>
          </div>
        )}

        {/* Step 3: Berufliche Situation */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Berufliche Situation</h2>
            <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 24 }}>In welcher Branche arbeitest du?</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
              {INDUSTRIES.map(ind => (
                <button key={ind.id} onClick={() => setIndustry(ind.id)} style={{
                  padding: '16px 8px', borderRadius: 'var(--r-md)', border: industry === ind.id ? '2px solid var(--ki-red)' : '2px solid var(--ki-border)',
                  background: industry === ind.id ? 'rgba(204,20,38,0.04)' : 'var(--ki-card)', cursor: 'pointer', textAlign: 'center', transition: 'all var(--t-fast)',
                }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{ind.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: industry === ind.id ? 'var(--ki-red)' : 'var(--ki-text-secondary)' }}>{ind.label}</div>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 8 }}>Berufserfahrung: {experience} Jahre</label>
              <input type="range" min="0" max="20" value={experience} onChange={e => setExperience(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--ki-red)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ki-text-tertiary)' }}>
                <span>0</span><span>10</span><span>20+</span>
              </div>
            </div>

            <input className="input" placeholder="Aktuelle Position (z.B. Senior Consultant)" value={position} onChange={e => setPosition(e.target.value)} style={{ marginBottom: 24 }} />

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" onClick={prev} style={{ flex: 1 }}>Zurück</button>
              <button className="btn btn-primary" onClick={next} disabled={!canNext()} style={{ flex: 2, opacity: canNext() ? 1 : 0.5 }}>Weiter</button>
            </div>
          </div>
        )}

        {/* Step 4: Gehalt & Ziele */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Gehalt & Ziele</h2>
            <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 24 }}>Wo stehst du und wo willst du hin?</p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 8 }}>
                Aktuelles Jahresgehalt (brutto): <strong style={{ color: 'var(--ki-text)', fontSize: 16 }}>{currentSalary.toLocaleString('de-DE')}€</strong>
              </label>
              <input type="range" min="25000" max="200000" step="5000" value={currentSalary} onChange={e => setCurrentSalary(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--ki-red)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ki-text-tertiary)' }}>
                <span>25k</span><span>100k</span><span>200k</span>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 8 }}>
                Ziel-Gehalt in 2 Jahren: <strong style={{ color: 'var(--ki-success)', fontSize: 16 }}>{targetSalary.toLocaleString('de-DE')}€</strong>
              </label>
              <input type="range" min="30000" max="300000" step="5000" value={targetSalary} onChange={e => setTargetSalary(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--ki-success)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ki-text-tertiary)' }}>
                <span>30k</span><span>150k</span><span>300k</span>
              </div>
            </div>

            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Was ist dein größtes Karriere-Hindernis?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {OBSTACLES.map(ob => (
                <button key={ob.id} onClick={() => setObstacle(ob.id)} style={{
                  padding: '14px 16px', borderRadius: 'var(--r-md)', border: obstacle === ob.id ? '2px solid var(--ki-red)' : '2px solid var(--ki-border)',
                  background: obstacle === ob.id ? 'rgba(204,20,38,0.04)' : 'var(--ki-card)', cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 12, transition: 'all var(--t-fast)',
                }}>
                  <span style={{ fontSize: 20 }}>{ob.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: obstacle === ob.id ? 600 : 400, color: obstacle === ob.id ? 'var(--ki-red)' : 'var(--ki-text)' }}>{ob.label}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" onClick={prev} style={{ flex: 1 }}>Zurück</button>
              <button className="btn btn-primary" onClick={next} disabled={!canNext()} style={{ flex: 2, opacity: canNext() ? 1 : 0.5 }}>Weiter</button>
            </div>
          </div>
        )}

        {/* Step 5: Quick-Analyse */}
        {step === 5 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Quick-Analyse</h2>
            <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 24 }}>Wie schätzt du dich ein? (1 = gar nicht, 5 = voll und ganz)</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
              {QUICK_QUESTIONS.map((q, i) => (
                <div key={i}>
                  <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>{q}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[1, 2, 3, 4, 5].map(v => (
                      <button key={v} onClick={() => { const a = [...answers]; a[i] = v; setAnswers(a); }} style={{
                        flex: 1, padding: '10px 0', borderRadius: 'var(--r-sm)', border: answers[i] === v ? '2px solid var(--ki-red)' : '2px solid var(--ki-border)',
                        background: answers[i] === v ? 'rgba(204,20,38,0.08)' : 'var(--ki-card)', cursor: 'pointer', fontWeight: 600, fontSize: 14,
                        color: answers[i] === v ? 'var(--ki-red)' : 'var(--ki-text-secondary)', transition: 'all var(--t-fast)',
                      }}>{v}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <RadarChart values={answers} labels={FIELD_LABELS} size={220} />
            </div>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 24 }}>
              Dein erster Karriere-Snapshot — die vollständige Analyse wartet im Dashboard.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" onClick={prev} style={{ flex: 1 }}>Zurück</button>
              <button className="btn btn-primary" onClick={next} style={{ flex: 2 }}>Analyse abschließen</button>
            </div>
          </div>
        )}

        {/* Step 6: Fertig */}
        {step === 6 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>{'\u{1F389}'}</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 8 }}>Dein Profil ist bereit!</h1>
            <p style={{ fontSize: 16, color: 'var(--ki-text-secondary)', marginBottom: 24 }}>
              Basierend auf deinen Angaben empfehlen wir dir: <strong style={{ color: 'var(--ki-red)' }}>{recommendation.label}</strong>
            </p>

            <div className="card" style={{ background: 'var(--ki-bg-alt)', marginBottom: 24, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--ki-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20, fontWeight: 700 }}>{initials}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{firstName} {lastName}</div>
                  <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>{INDUSTRIES.find(i => i.id === industry)?.label || ''} · {experience} Jahre Erfahrung</div>
                </div>
                <span className="pill pill-green" style={{ marginLeft: 'auto' }}>+50 XP</span>
              </div>
            </div>

            <button className="btn btn-primary" onClick={finish} disabled={saving} style={{ width: '100%', padding: '14px 24px', fontSize: 16, opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Wird gespeichert...' : 'Zum Dashboard'}
            </button>
          </div>
        )}
      </div>

      {/* Step indicator text */}
      <div style={{ marginTop: 16, fontSize: 13, color: 'var(--ki-text-tertiary)' }}>
        Schritt {step} von 6
      </div>
    </div>
  );
}
