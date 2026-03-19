'use client';
import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { awardPoints } from '@/lib/gamification';
import InfoTooltip from '@/components/ui/InfoTooltip';

/* ─────────────────────────── Static Data ─────────────────────────── */

const DEFAULT_CHECKLIST = [
  { id: 'c1',  label: 'Kuendigungsfrist im Vertrag geprueft',            category: 'legal',     done: false },
  { id: 'c2',  label: 'Resturlaub berechnet',                            category: 'legal',     done: false },
  { id: 'c3',  label: 'Arbeitszeugnis angefordert (Zwischenzeugnis)',     category: 'documents', done: false },
  { id: 'c4',  label: 'Referenzen gesichert (2-3 Personen)',              category: 'network',   done: false },
  { id: 'c5',  label: 'LinkedIn-Profil aktualisiert',                    category: 'network',   done: false },
  { id: 'c6',  label: 'Persoenliche Dateien vom Firmen-Laptop gesichert', category: 'documents', done: false },
  { id: 'c7',  label: 'Sperrzeit-Risiko bei ALG geprueft',               category: 'finance',   done: false },
  { id: 'c8',  label: 'Finanzpuffer fuer 3-6 Monate berechnet',          category: 'finance',   done: false },
  { id: 'c9',  label: 'Abfindungsverhandlung vorbereitet',               category: 'finance',   done: false },
  { id: 'c10', label: 'Neuen Lebenslauf erstellt',                       category: 'documents', done: false },
  { id: 'c11', label: 'Mentoren/Vertrauenspersonen informiert',          category: 'mental',    done: false },
  { id: 'c12', label: 'Kuendigungsschreiben formuliert',                 category: 'legal',     done: false },
];

const BURNOUT_QUESTIONS = [
  { text: 'Ich fuehle mich morgens energielos',                            emoji: ['😊','😐','😟','😰','🤯'] },
  { text: 'Ich distanziere mich emotional von meiner Arbeit',              emoji: ['😊','😐','😟','😰','🤯'] },
  { text: 'Meine Leistungsfaehigkeit hat abgenommen',                      emoji: ['😊','😐','😟','😰','🤯'] },
  { text: 'Ich habe Schlafprobleme wegen der Arbeit',                      emoji: ['😊','😐','😟','😰','🤯'] },
  { text: 'Ich fuehle mich von Kollegen/Vorgesetzten nicht wertgeschaetzt',emoji: ['😊','😐','😟','😰','🤯'] },
];

const LEGAL_CHECKLIST = [
  {
    id: 'l1',
    title: 'Kuendigungsfristen pruefen',
    detail: 'Pruefe deinen Arbeitsvertrag und den geltenden Tarifvertrag auf die genauen Kuendigungsfristen. Gesetzlich: 4 Wochen zum 15. oder Monatsende. Nach laengerer Betriebszugehoerigkeit gelten verlaengerte Fristen.',
    mini: null,
  },
  {
    id: 'l2',
    title: 'Resturlaub berechnen',
    detail: 'Berechne deinen verbleibenden Urlaubsanspruch. Bei Kuendigung zur Jahreshaelfte stehen dir mindestens anteilig Urlaubstage zu. Nicht genommener Urlaub muss ausgezahlt werden.',
    mini: 'resturlaub',
  },
  {
    id: 'l3',
    title: 'Zeugnis anfordern',
    detail: 'Fordere fruehzeitig ein qualifiziertes Arbeitszeugnis an. Du hast einen gesetzlichen Anspruch darauf. Tipp: Fordere zuerst ein Zwischenzeugnis an, bevor du kuendigst.',
    mini: null,
  },
  {
    id: 'l4',
    title: 'Wettbewerbsklausel pruefen',
    detail: 'Pruefe, ob in deinem Vertrag ein nachvertragliches Wettbewerbsverbot enthalten ist. Falls ja, muss der Arbeitgeber eine Karenzentschaedigung zahlen (mind. 50% des letzten Gehalts). Ohne Entschaedigung ist die Klausel unwirksam.',
    mini: null,
  },
  {
    id: 'l5',
    title: 'Abfindungsrechner',
    detail: 'Faustformel: 0,5 Bruttomonatsgehaelter pro Beschaeftigungsjahr. Abfindungen sind steuerpflichtig (Fuenftelregelung beachten).',
    mini: 'abfindung',
  },
];

const CATEGORIES = [
  { key: 'legal',     label: 'Rechtliches', color: 'var(--ki-red)' },
  { key: 'documents', label: 'Dokumente',   color: 'var(--ki-warning)' },
  { key: 'finance',   label: 'Finanzen',    color: 'var(--ki-success)' },
  { key: 'network',   label: 'Netzwerk',    color: '#5856D6' },
  { key: 'mental',    label: 'Mindset',     color: 'var(--ki-text-secondary)' },
];

/* ─────────────────────────── Component ─────────────────────────── */

export default function ExitClient({ userId, existingPlan, profile }) {
  const supabase = createClient();

  /* ── Plan state ── */
  const [plan, setPlan] = useState(
    existingPlan || {
      checklist: DEFAULT_CHECKLIST,
      annual_salary: 0,
      years_employed: 0,
      notice_period_months: 3,
      current_employer: '',
    }
  );
  const [saving, setSaving] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);
  const [toast, setToast] = useState(null);

  /* ── Finanz-Runway ── */
  const [monthlyExpenses, setMonthlyExpenses] = useState(profile?.monthly_expenses || 1500);
  const [savings, setSavingsState] = useState(profile?.savings || 0);
  const [monthlySavingsExtra, setMonthlySavingsExtra] = useState(0);

  const severance = useMemo(() => {
    if (!plan.annual_salary || !plan.years_employed) return 0;
    return Math.round((plan.annual_salary / 12) * 0.5 * plan.years_employed);
  }, [plan.annual_salary, plan.years_employed]);

  const totalBuffer = savings + severance;
  const runway = monthlyExpenses > 0
    ? Math.round(((totalBuffer + monthlySavingsExtra * 6) / monthlyExpenses) * 10) / 10
    : 0;

  const runwayColor =
    runway > 6 ? 'var(--ki-success)' : runway >= 3 ? 'var(--ki-warning)' : 'var(--ki-error)';
  const runwayPillClass =
    runway > 6 ? 'pill pill-green' : runway >= 3 ? 'pill pill-gold' : 'pill pill-red';
  const runwayPercent = Math.min((runway / 12) * 100, 100);

  /* ── Burnout ── */
  const [burnoutScores, setBurnoutScores] = useState([1, 1, 1, 1, 1]);
  const burnoutTotal = burnoutScores.reduce((a, b) => a + b, 0);
  const burnoutLevel = burnoutTotal <= 9 ? 'green' : burnoutTotal <= 18 ? 'yellow' : 'red';
  const [burnoutSaved, setBurnoutSaved] = useState(false);

  /* ── Legal accordion ── */
  const [openLegal, setOpenLegal] = useState(null);

  /* ── Mini-calculators ── */
  const [resturlaub, setResturlaub] = useState({ tage: 0, tagessatz: 0 });
  const resturlaubAuszahlung = resturlaub.tage * resturlaub.tagessatz;

  const [abfindungCalc, setAbfindungCalc] = useState({ monatsgehalt: 0, jahre: 0 });
  const abfindungErgebnis = abfindungCalc.monatsgehalt * 0.5 * abfindungCalc.jahre;

  /* ── Checklist ── */
  const checkDone  = (plan.checklist || []).filter(c => c.done).length;
  const checkTotal = (plan.checklist || []).length;

  const toggleCheck = (id) => {
    setPlan(p => ({
      ...p,
      checklist: p.checklist.map(c => c.id === id ? { ...c, done: !c.done } : c),
    }));
  };

  /* ── Helpers ── */
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Save actions ── */
  const savePlan = async () => {
    setSaving(true);
    await supabase.from('exit_plans').upsert(
      { user_id: userId, ...plan, estimated_severance: severance, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );

    if (!xpAwarded && checkDone === checkTotal && checkTotal > 0) {
      const result = await awardPoints(supabase, userId, 'EXIT_PLAN_COMPLETE');
      setXpAwarded(true);
      showToast(`+${result.awarded} XP! Exit-Plan abgeschlossen.`);
    } else {
      showToast('Plan gespeichert!');
    }
    setSaving(false);
  };

  const saveFinancials = async () => {
    setSaving(true);
    await supabase.from('profiles').update({
      monthly_expenses: monthlyExpenses,
      savings: savings,
    }).eq('id', userId);
    setSaving(false);
    showToast('Finanzdaten gespeichert!');
  };

  const saveBurnout = async () => {
    if (burnoutSaved) return;
    setSaving(true);
    await supabase.from('burnout_assessments').insert({
      user_id:     userId,
      scores:      burnoutScores,
      total_score: burnoutTotal,
      level:       burnoutLevel,
      assessed_at: new Date().toISOString(),
    });
    setBurnoutSaved(true);
    setSaving(false);
    showToast('Burnout-Einschaetzung gespeichert!');
  };

  /* ══════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════ */
  return (
    <div className="page-container" style={{ maxWidth: 700 }}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: toast.type === 'success' ? 'var(--ki-success)' : 'var(--ki-error)',
          color: 'white', padding: '12px 20px', borderRadius: 'var(--r-md)',
          fontWeight: 600, fontSize: 14, boxShadow: 'var(--sh-lg)',
          animation: 'fadeIn 0.3s var(--ease-apple)',
        }}>
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <h1 className="page-title">Exit-Strategie <InfoTooltip moduleId="exit" profile={profile} /></h1>
      <p className="page-subtitle" style={{ marginBottom: 32 }}>
        Dein strukturierter Plan fuer den Wechsel — kein Detail vergessen.
      </p>

      {/* ── XP Banner ── */}
      <div className="card animate-in" style={{
        marginBottom: 24,
        background: 'linear-gradient(135deg, rgba(204,20,38,0.06) 0%, rgba(45,106,79,0.06) 100%)',
        border: '1px solid var(--ki-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>🏆</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>+200 XP fuer deinen Exit-Plan</div>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>
              Fulle alle Bereiche aus und speichere deinen Plan, um XP zu erhalten.
            </div>
          </div>
          {xpAwarded && <span className="pill pill-green" style={{ marginLeft: 'auto' }}>Verdient!</span>}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          1. FINANZ-RUNWAY-RECHNER
      ════════════════════════════════════════════════════════════ */}
      <div className="card animate-in" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>💰 Finanz-Runway-Rechner</h3>
        <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 20 }}>
          Wie lange kannst du ohne Einkommen ueberbruecken?
        </p>

        {/* Slider: Monatliche Kosten */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ fontSize: 13, color: 'var(--ki-text-secondary)', fontWeight: 600 }}>
              Monatliche Fixkosten
            </label>
            <span style={{ fontSize: 14, fontWeight: 700 }}>
              {monthlyExpenses.toLocaleString('de-DE')} EUR
            </span>
          </div>
          <input
            type="range" min={500} max={5000} step={50}
            value={monthlyExpenses}
            onChange={e => setMonthlyExpenses(+e.target.value)}
            style={{ width: '100%', accentColor: 'var(--ki-red)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ki-text-tertiary)', marginTop: 2 }}>
            <span>500 EUR</span><span>5.000 EUR</span>
          </div>
        </div>

        {/* Slider: Ersparnisse */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ fontSize: 13, color: 'var(--ki-text-secondary)', fontWeight: 600 }}>
              Aktuelle Ersparnisse
            </label>
            <span style={{ fontSize: 14, fontWeight: 700 }}>
              {savings.toLocaleString('de-DE')} EUR
            </span>
          </div>
          <input
            type="range" min={0} max={100000} step={500}
            value={savings}
            onChange={e => setSavingsState(+e.target.value)}
            style={{ width: '100%', accentColor: 'var(--ki-red)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ki-text-tertiary)', marginTop: 2 }}>
            <span>0 EUR</span><span>100.000 EUR</span>
          </div>
        </div>

        {/* Abfindungs-Anspruch (calculated) */}
        {severance > 0 && (
          <div style={{
            padding: '10px 14px', background: 'rgba(45,106,79,0.06)',
            borderRadius: 'var(--r-md)', marginBottom: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>
              Abfindungs-Anspruch (0,5 × Monatsgehalt × Jahre)
            </span>
            <span style={{ fontWeight: 700, color: 'var(--ki-success)' }}>
              +{severance.toLocaleString('de-DE')} EUR
            </span>
          </div>
        )}

        {/* Spar-Szenario */}
        <div style={{ marginBottom: 20, padding: '14px 16px', background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ fontSize: 13, color: 'var(--ki-text-secondary)', fontWeight: 600 }}>
              💡 Szenario: Was wenn ich zusaetzlich spare?
            </label>
            <span style={{ fontSize: 14, fontWeight: 700 }}>
              +{monthlySavingsExtra.toLocaleString('de-DE')} EUR/Monat
            </span>
          </div>
          <input
            type="range" min={0} max={2000} step={50}
            value={monthlySavingsExtra}
            onChange={e => setMonthlySavingsExtra(+e.target.value)}
            style={{ width: '100%', accentColor: '#5856D6' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ki-text-tertiary)', marginTop: 2 }}>
            <span>0 EUR</span><span>2.000 EUR/Monat (ueber 6 Monate)</span>
          </div>
        </div>

        {/* Runway Output */}
        {monthlyExpenses > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Du kannst</span>
              <span className={runwayPillClass} style={{ fontSize: 15, fontWeight: 700 }}>
                {runway} Monate ueberbruecken
              </span>
            </div>
            <div className="progress-bar" style={{ height: 10, marginBottom: 10 }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${runwayPercent}%`,
                  background: runwayColor,
                  transition: 'width 0.4s ease, background 0.4s ease',
                }}
              />
            </div>
            {runway < 3 && (
              <p style={{ fontSize: 13, color: 'var(--ki-error)', marginTop: 4 }}>
                Kritisch: Weniger als 3 Monate Puffer. Baue deine Ruecklagen auf, bevor du kuendigst.
              </p>
            )}
            {runway >= 3 && runway <= 6 && (
              <p style={{ fontSize: 13, color: 'var(--ki-warning)', marginTop: 4 }}>
                Ausreichend, aber knapp. Empfehlung: Mindestens 6 Monate Puffer vor einem Wechsel.
              </p>
            )}
            {runway > 6 && (
              <p style={{ fontSize: 13, color: 'var(--ki-success)', marginTop: 4 }}>
                Solide Basis. Du hast genuegend Puffer fuer einen entspannten Wechsel.
              </p>
            )}
          </div>
        )}

        <button
          className="btn btn-secondary"
          onClick={saveFinancials}
          disabled={saving}
          style={{ width: '100%', marginTop: 16 }}
        >
          {saving ? 'Speichern...' : 'Finanzdaten speichern'}
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════
          2. BURNOUT-CHECK
      ════════════════════════════════════════════════════════════ */}
      <div className="card animate-in delay-1" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>🧠 Burnout-Check</h3>
        <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 20 }}>
          Beantworte jede Frage ehrlich — von 😊 (trifft nicht zu) bis 🤯 (trifft voll zu).
        </p>

        {BURNOUT_QUESTIONS.map((q, idx) => (
          <div
            key={idx}
            className="card"
            style={{
              marginBottom: 12,
              padding: '14px 16px',
              background: 'var(--ki-bg-alt)',
              boxShadow: 'none',
              border: '1px solid var(--ki-border)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
              {idx + 1}. {q.text}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {q.emoji.map((em, valIdx) => {
                const val = valIdx + 1;
                const selected = burnoutScores[idx] === val;
                return (
                  <button
                    key={val}
                    onClick={() => {
                      const next = [...burnoutScores];
                      next[idx] = val;
                      setBurnoutScores(next);
                      setBurnoutSaved(false);
                    }}
                    style={{
                      fontSize: 22,
                      padding: '6px 10px',
                      borderRadius: 'var(--r-md)',
                      border: selected ? '2px solid var(--ki-red)' : '2px solid transparent',
                      background: selected ? 'rgba(204,20,38,0.08)' : 'var(--ki-card)',
                      cursor: 'pointer',
                      transition: 'all var(--t-fast)',
                      transform: selected ? 'scale(1.15)' : 'scale(1)',
                    }}
                    title={`${val} — ${['Stimme nicht zu', 'Eher nicht', 'Teils teils', 'Eher ja', 'Stimme voll zu'][valIdx]}`}
                  >
                    {em}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Score */}
        <div style={{
          padding: 16,
          borderRadius: 'var(--r-md)',
          marginBottom: 16,
          background:
            burnoutLevel === 'green'  ? 'rgba(45,106,79,0.06)' :
            burnoutLevel === 'yellow' ? 'rgba(212,160,23,0.08)' :
                                        'rgba(204,20,38,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Dein Score</span>
            <span className={
              burnoutLevel === 'green'  ? 'pill pill-green' :
              burnoutLevel === 'yellow' ? 'pill pill-gold'  : 'pill pill-red'
            }>
              {burnoutTotal} / 25
            </span>
          </div>

          {burnoutLevel === 'green' && (
            <p style={{ fontSize: 13, color: 'var(--ki-success)' }}>
              Alles im gruenen Bereich. Keine akuten Burnout-Anzeichen erkennbar.
            </p>
          )}

          {burnoutLevel === 'yellow' && (
            <>
              <p style={{ fontSize: 13, color: 'var(--ki-warning)', marginBottom: 8 }}>
                Erhoehte Belastung erkennbar. Empfehlungen:
              </p>
              <ul style={{ fontSize: 13, color: 'var(--ki-text-secondary)', paddingLeft: 18, lineHeight: 1.8 }}>
                <li>Setze klare Grenzen zwischen Arbeit und Freizeit</li>
                <li>Plane regelmaessige Erholungsphasen ein</li>
                <li>Sprich mit einer Vertrauensperson ueber deine Situation</li>
              </ul>
            </>
          )}

          {burnoutLevel === 'red' && (
            <>
              <p style={{ fontSize: 13, color: 'var(--ki-error)', fontWeight: 700, marginBottom: 8 }}>
                Akuter Handlungsbedarf! Deine Werte deuten auf starke Belastung hin.
              </p>
              <ul style={{ fontSize: 13, color: 'var(--ki-text-secondary)', paddingLeft: 18, lineHeight: 1.8, marginBottom: 12 }}>
                <li>Suche professionelle Unterstuetzung (Betriebsarzt, Therapeut)</li>
                <li>Informiere dich ueber Krankschreibung und Auszeit-Optionen</li>
                <li>Dein Exit-Plan sollte Prioritaet haben — warte nicht zu lange</li>
              </ul>
              <a href="/coach">
                <button className="btn btn-primary" style={{ width: '100%' }}>
                  Sprich mit deinem Coach
                </button>
              </a>
            </>
          )}
        </div>

        <button
          className="btn btn-secondary"
          onClick={saveBurnout}
          disabled={saving || burnoutSaved}
          style={{ width: '100%' }}
        >
          {burnoutSaved ? '✓ Gespeichert' : saving ? 'Speichern...' : 'Burnout-Einschaetzung speichern'}
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════
          3. KUENDIGUNGS-CHECKLISTE (Accordion)
      ════════════════════════════════════════════════════════════ */}
      <div className="card animate-in delay-2" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>⚖️ Kuendigungs-Checkliste</h3>
        <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
          Rechtliche und praktische Schritte rund um deine Kuendigung.
        </p>

        {LEGAL_CHECKLIST.map(item => (
          <div key={item.id} style={{ borderBottom: '1px solid var(--ki-border)' }}>
            <div
              onClick={() => setOpenLegal(openLegal === item.id ? null : item.id)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0', cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600 }}>{item.title}</span>
              <span style={{
                fontSize: 16, color: 'var(--ki-text-secondary)',
                transform: openLegal === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease', display: 'inline-block',
              }}>▾</span>
            </div>

            {openLegal === item.id && (
              <div style={{ paddingBottom: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', lineHeight: 1.7, marginBottom: 14 }}>
                  {item.detail}
                </p>

                {/* Mini-Calculator: Resturlaub */}
                {item.mini === 'resturlaub' && (
                  <div style={{
                    padding: 14, background: 'var(--ki-bg-alt)',
                    borderRadius: 'var(--r-md)', marginBottom: 4,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
                      Resturlaub-Rechner
                    </div>
                    <div className="grid-2" style={{ gap: 10, marginBottom: 10 }}>
                      <div>
                        <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 4 }}>
                          Verbleibende Urlaubstage
                        </label>
                        <input
                          className="input"
                          type="number"
                          value={resturlaub.tage || ''}
                          onChange={e => setResturlaub(r => ({ ...r, tage: +e.target.value }))}
                          placeholder="15"
                          style={{ fontSize: 14 }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 4 }}>
                          Tagessatz brutto (EUR)
                        </label>
                        <input
                          className="input"
                          type="number"
                          value={resturlaub.tagessatz || ''}
                          onChange={e => setResturlaub(r => ({ ...r, tagessatz: +e.target.value }))}
                          placeholder="250"
                          style={{ fontSize: 14 }}
                        />
                      </div>
                    </div>
                    {resturlaubAuszahlung > 0 && (
                      <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>
                          Auszahlungsanspruch
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ki-success)' }}>
                          {resturlaubAuszahlung.toLocaleString('de-DE')} EUR
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Mini-Calculator: Abfindung */}
                {item.mini === 'abfindung' && (
                  <div style={{
                    padding: 14, background: 'var(--ki-bg-alt)',
                    borderRadius: 'var(--r-md)', marginBottom: 4,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
                      Abfindungs-Rechner
                    </div>
                    <div className="grid-2" style={{ gap: 10, marginBottom: 10 }}>
                      <div>
                        <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 4 }}>
                          Bruttomonatsgehalt (EUR)
                        </label>
                        <input
                          className="input"
                          type="number"
                          value={abfindungCalc.monatsgehalt || ''}
                          onChange={e => setAbfindungCalc(a => ({ ...a, monatsgehalt: +e.target.value }))}
                          placeholder="5000"
                          style={{ fontSize: 14 }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 4 }}>
                          Jahre im Unternehmen
                        </label>
                        <input
                          className="input"
                          type="number"
                          step="0.5"
                          value={abfindungCalc.jahre || ''}
                          onChange={e => setAbfindungCalc(a => ({ ...a, jahre: +e.target.value }))}
                          placeholder="5"
                          style={{ fontSize: 14 }}
                        />
                      </div>
                    </div>
                    {abfindungErgebnis > 0 && (
                      <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>
                          Geschaetzte Abfindung (0,5 × Monatsgehalt × Jahre)
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ki-success)' }}>
                          {abfindungErgebnis.toLocaleString('de-DE')} EUR
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', marginTop: 4 }}>
                          Steuerpflichtig — Fuenftelregelung pruefen
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════
          4. EXIT-CHECKLISTE mit Checkboxen
      ════════════════════════════════════════════════════════════ */}
      <div className="card animate-in delay-2" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>✅ Exit-Checkliste</h3>
          <span className={checkDone === checkTotal ? 'pill pill-green' : 'pill pill-grey'}>
            {checkDone} / {checkTotal}
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
          Klicke auf einen Punkt, um ihn als erledigt zu markieren.
        </p>

        <div className="progress-bar" style={{ marginBottom: 20 }}>
          <div
            className="progress-bar-fill"
            style={{
              width: `${checkTotal > 0 ? (checkDone / checkTotal) * 100 : 0}%`,
              background: checkDone === checkTotal ? 'var(--ki-success)' : 'var(--ki-red)',
            }}
          />
        </div>

        {CATEGORIES.map(cat => {
          const items = (plan.checklist || []).filter(c => c.category === cat.key);
          if (items.length === 0) return null;
          return (
            <div key={cat.key} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: cat.color, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {cat.label}
              </div>
              {items.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 0', cursor: 'pointer',
                    borderBottom: '1px solid var(--ki-border)',
                    transition: 'opacity var(--t-fast)',
                  }}
                >
                  {/* Custom checkbox */}
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                    border: item.done ? 'none' : '2px solid var(--grey-4)',
                    background: item.done ? 'var(--ki-success)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all var(--t-fast)',
                  }}>
                    {item.done && (
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span style={{
                    fontSize: 14,
                    textDecoration: item.done ? 'line-through' : 'none',
                    color: item.done ? 'var(--ki-text-tertiary)' : 'var(--ki-text)',
                    transition: 'all var(--t-fast)',
                  }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════
          5. ABFINDUNGS-SIMULATOR (full)
      ════════════════════════════════════════════════════════════ */}
      <div className="card animate-in delay-3" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>🧮 Abfindungs-Simulator</h3>
        <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
          Berechne deinen moeglichen Abfindungsanspruch — wird auch im Runway beruecksichtigt.
        </p>

        <div className="grid-2" style={{ gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 4, display: 'block' }}>
              Jahresgehalt brutto (EUR)
            </label>
            <input
              className="input"
              type="number"
              value={plan.annual_salary || ''}
              onChange={e => setPlan(p => ({ ...p, annual_salary: +e.target.value }))}
              placeholder="80.000"
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 4, display: 'block' }}>
              Jahre im Unternehmen
            </label>
            <input
              className="input"
              type="number"
              step="0.5"
              value={plan.years_employed || ''}
              onChange={e => setPlan(p => ({ ...p, years_employed: +e.target.value }))}
              placeholder="5"
            />
          </div>
        </div>

        {severance > 0 && (
          <div style={{
            padding: 20, background: 'rgba(45,106,79,0.06)',
            borderRadius: 'var(--r-md)', textAlign: 'center', marginBottom: 16,
          }}>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 6 }}>
              Geschaetzte Abfindung (Faustformel: 0,5 Monatsgehaelter × Jahre)
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--ki-success)' }}>
              {severance.toLocaleString('de-DE')} EUR
            </div>
            <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 6 }}>
              Steuerpflichtig — Fuenftelregelung beim Finanzamt pruefen
            </div>
          </div>
        )}

        <div className="grid-2" style={{ gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 4, display: 'block' }}>
              Kuendigungsfrist (Monate)
            </label>
            <input
              className="input"
              type="number"
              value={plan.notice_period_months || 3}
              onChange={e => setPlan(p => ({ ...p, notice_period_months: +e.target.value }))}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 4, display: 'block' }}>
              Aktueller Arbeitgeber
            </label>
            <input
              className="input"
              value={plan.current_employer || ''}
              onChange={e => setPlan(p => ({ ...p, current_employer: e.target.value }))}
              placeholder="Unternehmen GmbH"
            />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          6. VIDEO-PLATZHALTER
      ════════════════════════════════════════════════════════════ */}
      <div className="card animate-in delay-3" style={{ marginBottom: 24 }}>
        <div style={{
          aspect: '16/9',
          background: 'linear-gradient(135deg, var(--ki-charcoal) 0%, #1a1a2e 100%)',
          borderRadius: 'var(--r-md)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 32, textAlign: 'center',
          marginBottom: 16,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(204,20,38,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16, cursor: 'pointer',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <div style={{ color: 'white', fontWeight: 700, fontSize: 17, marginBottom: 6 }}>
            Plan B: Nie wieder Angst vor Kuendigung
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
            Masterclass · 18 Min · Strategie &amp; Mindset
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', lineHeight: 1.7 }}>
          Lerne, wie du Kuendigungen nicht als Bedrohung, sondern als strategisches Werkzeug einsetzt — mit konkreten Techniken fuer Gehaltsverhandlungen, Outplacement und mentale Staerke.
        </p>
      </div>

      {/* ── Save CTA ── */}
      <button
        className="btn btn-primary"
        onClick={savePlan}
        disabled={saving}
        style={{ width: '100%', fontSize: 16, padding: '16px 24px' }}
      >
        {saving ? 'Speichern...' : xpAwarded ? '✓ Plan gespeichert (+200 XP)' : 'Plan speichern & XP verdienen'}
      </button>
    </div>
  );
}
