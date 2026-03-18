'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { marketValueProgress } from '@/lib/career-logic';

// CountUp animation hook
function useCountUp(target, duration = 1500) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) cancelAnimationFrame(ref.current);
    const start = performance.now();
    const from = 0;
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target, duration]);
  return value;
}

// Simple SVG Area Chart
function AreaChart({ data, width = 600, height = 200 }) {
  if (!data || data.length < 2) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ki-text-tertiary)', fontSize: 14 }}>Noch keine Verlaufsdaten</div>;
  const values = data.map(d => d.total_value || d.base_value || 0);
  const min = Math.min(...values) * 0.95;
  const max = Math.max(...values) * 1.05;
  const range = max - min || 1;
  const px = 40, py = 20;
  const cw = width - px * 2, ch = height - py * 2;
  const points = values.map((v, i) => ({
    x: px + (i / (values.length - 1)) * cw,
    y: py + ch - ((v - min) / range) * ch,
  }));
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${height - py} L${points[0].x},${height - py} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ki-red)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--ki-red)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(pct => {
        const y = py + ch * (1 - pct);
        const val = min + range * pct;
        return (
          <g key={pct}>
            <line x1={px} y1={y} x2={width - px} y2={y} stroke="var(--grey-5)" strokeWidth="0.5" />
            <text x={px - 8} y={y + 4} textAnchor="end" style={{ fontSize: 10, fill: 'var(--ki-text-tertiary)', fontFamily: 'Instrument Sans' }}>
              €{Math.round(val / 1000)}k
            </text>
          </g>
        );
      })}
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke="var(--ki-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--ki-red)" opacity={i === points.length - 1 ? 1 : 0} />
      ))}
      {/* Date labels */}
      {data.filter((_, i) => i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2)).map((d, i) => {
        const idx = i === 0 ? 0 : i === 1 ? Math.floor(data.length / 2) : data.length - 1;
        return (
          <text key={idx} x={points[idx]?.x} y={height - 4} textAnchor="middle"
            style={{ fontSize: 10, fill: 'var(--ki-text-tertiary)', fontFamily: 'Instrument Sans' }}>
            {new Date(data[idx]?.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}
          </text>
        );
      })}
    </svg>
  );
}

export default function MarktwertClient({ profile, log, progress, courses, userId }) {
  const supabase = createClient();
  const baseSalary = profile?.current_salary || 50000;
  const targetSalary = profile?.target_salary || 120000;
  const skillBonus = (progress || []).reduce((s, p) => s + (p.lessons?.market_value_impact || 0), 0);
  const currentValue = baseSalary + skillBonus;
  const gap = targetSalary - currentValue;
  const pct = marketValueProgress(currentValue, baseSalary, targetSalary);
  const animatedValue = useCountUp(currentValue, 2000);
  const [editSalary, setEditSalary] = useState(false);
  const [salaryForm, setSalaryForm] = useState({ current: baseSalary, target: targetSalary });

  const totalPotential = (courses || []).reduce((s, c) => s + (c.market_value_impact || 0), 0);
  const remainingPotential = totalPotential - skillBonus;

  // Save salary settings
  const saveSalary = async () => {
    await supabase.from('profiles').update({
      current_salary: salaryForm.current, target_salary: salaryForm.target,
    }).eq('id', userId);
    setEditSalary(false);
    window.location.reload();
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Dein Marktwert</h1>
      <p className="page-subtitle" style={{ marginBottom: 32 }}>Jede Lektion steigert deinen Wert</p>

      {/* Hero Value */}
      <div className="card animate-in" style={{ textAlign: 'center', padding: 40, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
          Aktueller Marktwert
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--ki-text)' }}>
          €{animatedValue.toLocaleString('de-DE')}
        </div>
        <div style={{ marginTop: 8 }}>
          {gap > 0 ? (
            <span className="pill pill-red">Noch €{Math.round(gap).toLocaleString('de-DE')} bis €{targetSalary.toLocaleString('de-DE')}</span>
          ) : (
            <span className="pill pill-green">Ziel erreicht!</span>
          )}
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Gap Bar */}
        <div className="card animate-in">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Gehaltslücke</h3>
          <div style={{ position: 'relative', height: 32, background: 'var(--grey-6)', borderRadius: 'var(--r-pill)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, var(--ki-red), var(--ki-success))`, borderRadius: 'var(--r-pill)', transition: 'width 1s var(--ease-apple)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 13, fontWeight: 700, color: pct > 50 ? 'white' : 'var(--ki-text)' }}>
              {pct}%
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ki-text-secondary)', marginTop: 8 }}>
            <span>€{baseSalary.toLocaleString('de-DE')}</span>
            <span>€{targetSalary.toLocaleString('de-DE')}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="card animate-in">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Statistik</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ki-success)' }}>+€{skillBonus.toLocaleString('de-DE')}</div>
              <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Skill-Bonus verdient</div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ki-text-secondary)' }}>€{remainingPotential.toLocaleString('de-DE')}</div>
              <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Potenzial offen</div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{(progress || []).length}</div>
              <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Lektionen abgeschlossen</div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ki-red)' }}>{profile?.xp || 0}</div>
              <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>KI-Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card animate-in" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Marktwert-Verlauf</h3>
        <AreaChart data={log} />
      </div>

      {/* Completed Lessons with Impact */}
      {progress && progress.length > 0 && (
        <div className="card animate-in" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Abgeschlossene Lektionen</h3>
          {progress.sort((a, b) => (b.lessons?.market_value_impact || 0) - (a.lessons?.market_value_impact || 0)).slice(0, 10).map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--ki-border)', gap: 8 }}>
              <span style={{ color: 'var(--ki-success)' }}>✓</span>
              <span style={{ flex: 1, fontSize: 14 }}>{p.lessons?.title || 'Lektion'}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-success)' }}>+€{(p.lessons?.market_value_impact || 0).toLocaleString('de-DE')}</span>
            </div>
          ))}
        </div>
      )}

      {/* Salary Settings */}
      <div className="card animate-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Gehalt-Einstellungen</h3>
          <button className="btn btn-ghost" onClick={() => setEditSalary(!editSalary)} style={{ fontSize: 13 }}>
            {editSalary ? 'Abbrechen' : '✏️ Bearbeiten'}
          </button>
        </div>
        {editSalary ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ki-text-secondary)', marginBottom: 4, display: 'block' }}>Aktuelles Gehalt (€/Jahr)</label>
              <input className="input" type="number" value={salaryForm.current} onChange={e => setSalaryForm(p => ({ ...p, current: +e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ki-text-secondary)', marginBottom: 4, display: 'block' }}>Zielgehalt (€/Jahr)</label>
              <input className="input" type="number" value={salaryForm.target} onChange={e => setSalaryForm(p => ({ ...p, target: +e.target.value }))} />
            </div>
            <button className="btn btn-primary" onClick={saveSalary}>Speichern</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 24 }}>
            <div><span style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>Aktuell: </span><span style={{ fontWeight: 600 }}>€{baseSalary.toLocaleString('de-DE')}</span></div>
            <div><span style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>Ziel: </span><span style={{ fontWeight: 600 }}>€{targetSalary.toLocaleString('de-DE')}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
