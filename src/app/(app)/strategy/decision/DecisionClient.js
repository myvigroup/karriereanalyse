'use client';
import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { awardPoints } from '@/lib/gamification';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { Bird, Shield, Sprout, Users as UsersIcon, Trophy, Palette, Compass, Rocket, Handshake, DollarSign, Megaphone, Dumbbell, BookOpen, Anchor, Globe, Heart, Lightbulb, Scale, Crown, Target, CheckCircle2, Star, PartyPopper } from 'lucide-react';

const VALUES = [
  { id: 'freiheit',    label: 'Freiheit',           Icon: Bird, desc: 'Unabhängigkeit & selbstbestimmtes Handeln' },
  { id: 'sicherheit', label: 'Sicherheit',           Icon: Shield, desc: 'Stabilität, festes Einkommen, Verlässlichkeit' },
  { id: 'wachstum',   label: 'Wachstum',             Icon: Sprout, desc: 'Persönliche & berufliche Weiterentwicklung' },
  { id: 'familie',    label: 'Familie',               Icon: UsersIcon, desc: 'Zeit & Energie für die Menschen, die zählen' },
  { id: 'anerkennung',label: 'Anerkennung',           Icon: Trophy, desc: 'Respekt, Lob und sichtbare Wertschätzung' },
  { id: 'kreativitaet',label: 'Kreativität',          Icon: Palette, desc: 'Freiheit zu gestalten und Neues zu erschaffen' },
  { id: 'fuehrung',   label: 'Führung',               Icon: Compass, desc: 'Andere leiten, inspirieren und Verantwortung tragen' },
  { id: 'autonomie',  label: 'Autonomie',             Icon: Rocket, desc: 'Eigene Entscheidungen treffen ohne Fremdkontrolle' },
  { id: 'teamwork',   label: 'Teamwork',              Icon: Handshake, desc: 'Gemeinsam Ziele erreichen und voneinander lernen' },
  { id: 'geld',       label: 'Geld',                  Icon: DollarSign, desc: 'Finanzieller Erfolg und Wohlstand' },
  { id: 'einfluss',   label: 'Einfluss',              Icon: Megaphone, desc: 'Dinge bewegen und Entscheidungen prägen' },
  { id: 'gesundheit', label: 'Gesundheit',            Icon: Dumbbell, desc: 'Körperliches und mentales Wohlbefinden' },
  { id: 'lernen',     label: 'Lernen',                Icon: BookOpen, desc: 'Neues Wissen aufbauen und Fähigkeiten erweitern' },
  { id: 'stabilitaet',label: 'Stabilität',            Icon: Anchor, desc: 'Beständigkeit, Routine und klare Strukturen' },
  { id: 'abenteuer',  label: 'Abenteuer',             Icon: Globe, desc: 'Neue Orte, Herausforderungen und Erfahrungen' },
  { id: 'integritaet',label: 'Integrität',            Icon: Heart, desc: 'Ehrlichkeit, Aufrichtigkeit und Wertetreue' },
  { id: 'innovation', label: 'Innovation',            Icon: Lightbulb, desc: 'Zukunftsweisende Ideen und disruptives Denken' },
  { id: 'worklife',   label: 'Work-Life-Balance',     Icon: Scale, desc: 'Harmonie zwischen Beruf und Privatleben' },
  { id: 'macht',      label: 'Macht',                 Icon: Crown, desc: 'Kontrolle über Ressourcen und Ergebnisse' },
  { id: 'sinnhaftigkeit', label: 'Sinnhaftigkeit',   Icon: Target, desc: 'Arbeit, die einen echten Unterschied macht' },
];

const PHASE_LABELS = ['Werte wählen', 'Ranking', 'Entscheidungs-Matrix', 'Reflexion'];

export default function DecisionClient({ userId, existingSession }) {
  const supabase = createClient();

  const [phase, setPhase] = useState(existingSession ? 4 : 1);
  const [selectedValues, setSelectedValues] = useState(existingSession?.selected_values || []);
  const [rankedValues, setRankedValues]     = useState(existingSession?.ranked_values   || []);
  const [decision, setDecision]             = useState(existingSession?.decision_question || '');
  const [optionAName, setOptionAName]       = useState(existingSession?.option_a_name   || 'Option A');
  const [optionBName, setOptionBName]       = useState(existingSession?.option_b_name   || 'Option B');
  const [ratingsA, setRatingsA]             = useState(existingSession?.ratings_a       || {});
  const [ratingsB, setRatingsB]             = useState(existingSession?.ratings_b       || {});
  const [surprised, setSurprised]           = useState(null);   // true | false | null
  const [nextStep, setNextStep]             = useState('');
  const [saving, setSaving]                 = useState(false);
  const [saved, setSaved]                   = useState(false);
  const [result, setResult]                 = useState(existingSession?.result_data     || null);

  // ── helpers ──────────────────────────────────────────────────────────────
  const toggleValue = (val) => {
    setSelectedValues(prev => {
      if (prev.find(v => v.id === val.id)) return prev.filter(v => v.id !== val.id);
      if (prev.length >= 5) return prev;
      return [...prev, val];
    });
  };

  const moveUp = (i) => {
    if (i === 0) return;
    setRankedValues(prev => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  };

  const moveDown = (i) => {
    if (i === rankedValues.length - 1) return;
    setRankedValues(prev => {
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  };

  const goToPhase2 = () => {
    setRankedValues([...selectedValues]);
    setPhase(2);
  };

  const goToPhase3 = () => {
    const init = {};
    rankedValues.forEach(v => { init[v.id] = 5; });
    if (Object.keys(ratingsA).length === 0) setRatingsA(init);
    if (Object.keys(ratingsB).length === 0) setRatingsB(init);
    setPhase(3);
  };

  // Live calculation
  const liveResult = useMemo(() => {
    if (!rankedValues.length) return null;
    // weights: rank 1 → 5, rank 2 → 4, …, rank 5 → 1
    const weights = rankedValues.map((_, i) => 5 - i);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let scoreA = 0;
    let scoreB = 0;
    const details = rankedValues.map((val, i) => {
      const w   = weights[i];
      const rA  = ratingsA[val.id] ?? 5;
      const rB  = ratingsB[val.id] ?? 5;
      scoreA   += rA * w;
      scoreB   += rB * w;
      return { val, weight: w, rA, rB };
    });
    const maxPossible = totalWeight * 10;
    const pctA = Math.round((scoreA / maxPossible) * 100);
    const pctB = Math.round((scoreB / maxPossible) * 100);
    const winner = scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : 'tie';
    return { scoreA, scoreB, pctA, pctB, details, winner };
  }, [rankedValues, ratingsA, ratingsB]);

  const finishMatrix = () => {
    setResult(liveResult);
    setPhase(4);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = liveResult;
    const winnerLabel =
      res.winner === 'A' ? optionAName :
      res.winner === 'B' ? optionBName :
      'Unentschieden';

    await supabase.from('value_assessments').insert({
      user_id:         userId,
      selected_values: selectedValues.map(v => v.id),
      ranked_values:   rankedValues.map(v => v.id),
      decision_question: decision,
      option_a_name:   optionAName,
      option_b_name:   optionBName,
      ratings_a:       ratingsA,
      ratings_b:       ratingsB,
      score_a:         res.pctA,
      score_b:         res.pctB,
      winner:          res.winner,
      surprised,
      next_step:       nextStep,
    });

    await supabase.from('decision_sessions').upsert({
      user_id:            userId,
      result:             res.winner,
      result_label:       winnerLabel,
      result_description: `Werte-Assessment: ${optionAName} (${res.pctA}%) vs ${optionBName} (${res.pctB}%)`,
      score_stay:         res.pctA,
      score_exit:         res.pctB,
      answers: {
        selected_values:   selectedValues.map(v => v.id),
        ranked_values:     rankedValues.map(v => v.id),
        decision_question: decision,
        option_a_name:     optionAName,
        option_b_name:     optionBName,
        ratings_a:         ratingsA,
        ratings_b:         ratingsB,
      },
    });

    await awardPoints(userId, 150, 'decision_assessment');

    setSaving(false);
    setSaved(true);
  };

  const restart = () => {
    setPhase(1);
    setSelectedValues([]);
    setRankedValues([]);
    setDecision('');
    setOptionAName('Option A');
    setOptionBName('Option B');
    setRatingsA({});
    setRatingsB({});
    setSurprised(null);
    setNextStep('');
    setSaved(false);
    setResult(null);
  };

  // ── shared header ─────────────────────────────────────────────────────────
  const PhaseHeader = () => (
    <div style={{ marginBottom: 32 }}>
      {/* progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
        {PHASE_LABELS.map((label, idx) => {
          const n = idx + 1;
          const active  = phase === n;
          const done    = phase > n;
          return (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: done ? 'var(--ki-success)' : active ? 'var(--ki-red)' : 'var(--ki-bg-alt)',
                border: active ? '2px solid var(--ki-red)' : done ? 'none' : '2px solid var(--ki-border)',
                color: (done || active) ? '#fff' : 'var(--ki-text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                transition: 'all 0.25s ease',
              }}>
                {done ? '✓' : n}
              </div>
              <span style={{
                fontSize: 10, fontWeight: active ? 700 : 400,
                color: active ? 'var(--ki-red)' : 'var(--ki-text-secondary)',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* connecting line */}
      <div style={{ position: 'relative', height: 4, background: 'var(--ki-border)', borderRadius: 2, margin: '0 auto', maxWidth: 360, marginBottom: 8 }}>
        <div style={{
          position: 'absolute', inset: 0,
          width: `${((phase - 1) / 3) * 100}%`,
          background: 'var(--ki-red)', borderRadius: 2,
          transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // PHASE 1 — Werte wählen
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === 1) return (
    <div className="page-container" style={{ maxWidth: 800 }}>
      <PhaseHeader />

      {/* Video placeholder */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 28, border: '1.5px solid var(--ki-border)' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--ki-charcoal) 0%, #1a1a2e 100%)',
          padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 20,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'var(--ki-red)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, cursor: 'pointer',
          }}>
            <span style={{ fontSize: 20 }}>▶</span>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ki-red)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              Video-Einheit
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>
              Werte-basierte Entscheidungen treffen
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
              8 Min · Karriere Institut Akademie
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 className="page-title" style={{ marginBottom: 8 }}>Welche Werte leiten dich?<InfoTooltip moduleId="decision" profile={null} /></h1>
        <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', lineHeight: 1.7 }}>
          Wähle bis zu <strong>5 Kernwerte</strong>, die für deine aktuelle Karrieresituation am wichtigsten sind.
        </p>
      </div>

      {/* Count badge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{
          padding: '8px 20px', borderRadius: 'var(--r-pill)',
          background: selectedValues.length === 5 ? 'var(--ki-success)' : 'var(--ki-bg-alt)',
          color: selectedValues.length === 5 ? '#fff' : 'var(--ki-text-secondary)',
          fontSize: 14, fontWeight: 700, transition: 'all 0.25s ease',
          border: selectedValues.length === 5 ? 'none' : '1.5px solid var(--ki-border)',
        }}>
          {selectedValues.length}/5 gewählt {selectedValues.length === 5 ? <CheckCircle2 size={16} strokeWidth={1.7} style={{ display: 'inline', verticalAlign: 'middle' }} /> : ''}
        </div>
      </div>

      <div className="grid-4" style={{ gap: 12, marginBottom: 32 }}>
        {VALUES.map(val => {
          const isSelected = !!selectedValues.find(v => v.id === val.id);
          const isDisabled = !isSelected && selectedValues.length >= 5;
          return (
            <div
              key={val.id}
              className="card"
              onClick={() => !isDisabled && toggleValue(val)}
              style={{
                padding: '18px 12px 14px',
                textAlign: 'center',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.38 : 1,
                border: isSelected
                  ? '2px solid var(--ki-red)'
                  : '2px solid transparent',
                background: isSelected ? 'rgba(220,38,38,0.06)' : 'var(--ki-card)',
                transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 0.2s ease',
                position: 'relative',
                userSelect: 'none',
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'var(--ki-red)', color: '#fff',
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  ✓
                </div>
              )}
              <div style={{ marginBottom: 8 }}>{val.Icon && <val.Icon size={28} strokeWidth={1.5} />}</div>
              <div style={{
                fontSize: 12, fontWeight: 700,
                color: isSelected ? 'var(--ki-red)' : 'var(--ki-text)',
                marginBottom: 5, lineHeight: 1.2,
              }}>
                {val.label}
              </div>
              <div style={{
                fontSize: 10, color: 'var(--ki-text-secondary)',
                lineHeight: 1.4,
              }}>
                {val.desc}
              </div>
              {isSelected && (
                <div style={{
                  marginTop: 8, fontSize: 10, fontWeight: 700,
                  color: 'var(--ki-red)',
                }}>
                  Wichtig <CheckCircle2 size={12} strokeWidth={1.7} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          className="btn btn-primary"
          disabled={selectedValues.length !== 5}
          onClick={goToPhase2}
          style={{
            padding: '14px 48px', fontSize: 15,
            opacity: selectedValues.length !== 5 ? 0.45 : 1,
          }}
        >
          Weiter zur Priorisierung →
        </button>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // PHASE 2 — Ranking
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === 2) return (
    <div className="page-container" style={{ maxWidth: 560 }}>
      <PhaseHeader />

      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 className="page-title" style={{ marginBottom: 8 }}>Priorität festlegen</h1>
        <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', lineHeight: 1.7 }}>
          Bringe deine 5 Werte in die richtige Reihenfolge.
          Platz 1 hat das höchste Gewicht (5×), Platz 5 das geringste (1×).
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        {rankedValues.map((val, i) => {
          const weight = 5 - i;
          const isTop = i === 0;
          return (
            <div
              key={val.id}
              className="card"
              style={{
                padding: '16px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
                border: isTop ? '2px solid var(--ki-red)' : '2px solid transparent',
                background: isTop ? 'rgba(220,38,38,0.04)' : 'var(--ki-card)',
                transition: 'all 0.2s ease',
              }}
            >
              {/* rank badge */}
              <div style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: isTop ? 'var(--ki-red)' : 'var(--ki-bg-alt)',
                color: isTop ? '#fff' : 'var(--ki-text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: isTop ? 16 : 14, fontWeight: 700,
              }}>
                {isTop ? '👑' : i + 1}
              </div>

              {/* emoji + name */}
              <span style={{ flexShrink: 0 }}>{val.Icon && <val.Icon size={24} strokeWidth={1.5} />}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: isTop ? 'var(--ki-red)' : 'var(--ki-text)' }}>
                  {val.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ki-text-secondary)', marginTop: 2 }}>
                  {val.desc}
                </div>
              </div>

              {/* weight pill */}
              <span className="pill" style={{
                fontSize: 11, flexShrink: 0,
                background: isTop ? 'var(--ki-red)' : 'var(--ki-bg-alt)',
                color: isTop ? '#fff' : 'var(--ki-text-secondary)',
                border: 'none',
              }}>
                Gewicht {weight}×
              </span>

              {/* arrows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  style={{
                    padding: '2px 9px', fontSize: 13, lineHeight: 1,
                    opacity: i === 0 ? 0.25 : 1, minWidth: 0,
                  }}
                >▲</button>
                <button
                  className="btn btn-secondary"
                  onClick={() => moveDown(i)}
                  disabled={i === rankedValues.length - 1}
                  style={{
                    padding: '2px 9px', fontSize: 13, lineHeight: 1,
                    opacity: i === rankedValues.length - 1 ? 0.25 : 1, minWidth: 0,
                  }}
                >▼</button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn btn-secondary" onClick={() => setPhase(1)}>← Zurück</button>
        <button className="btn btn-primary" onClick={goToPhase3} style={{ padding: '14px 40px', fontSize: 15 }}>
          Zur Entscheidungs-Matrix →
        </button>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // PHASE 3 — Entscheidungs-Matrix
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === 3) {
    const res = liveResult;
    const maxPct = res ? Math.max(res.pctA, res.pctB, 1) : 100;

    return (
      <div className="page-container" style={{ maxWidth: 720 }}>
        <PhaseHeader />

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 className="page-title" style={{ marginBottom: 8 }}>Entscheidungs-Matrix</h1>
          <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', lineHeight: 1.7 }}>
            Bewertet, wie gut jede Option zu deinen Kernwerten passt (1 = schlecht, 10 = perfekt).
          </p>
        </div>

        {/* Decision question + options */}
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ki-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>
            Welche Entscheidung steht an?
          </label>
          <textarea
            className="input"
            value={decision}
            onChange={e => setDecision(e.target.value)}
            placeholder="z.B. Soll ich zur Firma X wechseln oder in meiner jetzigen Stelle bleiben?"
            rows={2}
            style={{ width: '100%', resize: 'vertical', marginBottom: 16 }}
          />
          <div className="grid-2" style={{ gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ki-red)', marginBottom: 6, display: 'block' }}>
                Option A
              </label>
              <input
                className="input"
                value={optionAName}
                onChange={e => setOptionAName(e.target.value)}
                placeholder="z.B. Neue Stelle"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#5856D6', marginBottom: 6, display: 'block' }}>
                Option B
              </label>
              <input
                className="input"
                value={optionBName}
                onChange={e => setOptionBName(e.target.value)}
                placeholder="z.B. Aktuelle Stelle"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Sliders per value */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {rankedValues.map((val, i) => {
            const weight = 5 - i;
            const rA = ratingsA[val.id] ?? 5;
            const rB = ratingsB[val.id] ?? 5;
            return (
              <div key={val.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span>{val.Icon && <val.Icon size={22} strokeWidth={1.5} />}</span>
                  <span style={{ fontWeight: 700, fontSize: 14, flex: 1 }}>{val.label}</span>
                  <span className="pill" style={{
                    fontSize: 10, background: i === 0 ? 'var(--ki-red)' : 'var(--ki-bg-alt)',
                    color: i === 0 ? '#fff' : 'var(--ki-text-secondary)', border: 'none',
                  }}>
                    {i === 0 ? '👑 ' : ''}{weight}× Gewicht
                  </span>
                </div>

                <div className="grid-2" style={{ gap: 20 }}>
                  {/* Option A */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ki-red)' }}>{optionAName}</span>
                      <span style={{
                        fontSize: 18, fontWeight: 800, color: 'var(--ki-red)',
                        width: 28, textAlign: 'center',
                      }}>{rA}</span>
                    </div>
                    <input
                      type="range" min="1" max="10" step="1"
                      value={rA}
                      onChange={e => setRatingsA(prev => ({ ...prev, [val.id]: parseInt(e.target.value) }))}
                      style={{ width: '100%', accentColor: 'var(--ki-red)', cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--ki-text-secondary)', marginTop: 2 }}>
                      <span>1 — Schlecht</span><span>10 — Perfekt</span>
                    </div>
                  </div>
                  {/* Option B */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#5856D6' }}>{optionBName}</span>
                      <span style={{
                        fontSize: 18, fontWeight: 800, color: '#5856D6',
                        width: 28, textAlign: 'center',
                      }}>{rB}</span>
                    </div>
                    <input
                      type="range" min="1" max="10" step="1"
                      value={rB}
                      onChange={e => setRatingsB(prev => ({ ...prev, [val.id]: parseInt(e.target.value) }))}
                      style={{ width: '100%', accentColor: '#5856D6', cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--ki-text-secondary)', marginTop: 2 }}>
                      <span>1 — Schlecht</span><span>10 — Perfekt</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live bar chart */}
        {res && (
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ki-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>
              Live-Ergebnis
            </div>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'flex-end', minHeight: 140 }}>
              {/* Bar A */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--ki-red)' }}>{res.pctA}%</span>
                <div style={{
                  width: '80%', minHeight: 32,
                  height: Math.max(32, (res.pctA / maxPct) * 100),
                  background: res.winner === 'A' ? 'var(--ki-red)' : 'var(--ki-bg-alt)',
                  borderRadius: '6px 6px 0 0',
                  border: res.winner !== 'A' ? '2px solid var(--ki-border)' : 'none',
                  transition: 'all 0.3s ease',
                }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-red)' }}>{optionAName}</span>
                {res.winner === 'A' && (
                  <span className="pill" style={{ fontSize: 10, background: 'var(--ki-success)', color: '#fff', border: 'none' }}>
                    Empfohlen ✓
                  </span>
                )}
              </div>
              {/* Bar B */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#5856D6' }}>{res.pctB}%</span>
                <div style={{
                  width: '80%', minHeight: 32,
                  height: Math.max(32, (res.pctB / maxPct) * 100),
                  background: res.winner === 'B' ? '#5856D6' : 'var(--ki-bg-alt)',
                  borderRadius: '6px 6px 0 0',
                  border: res.winner !== 'B' ? '2px solid var(--ki-border)' : 'none',
                  transition: 'all 0.3s ease',
                }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#5856D6' }}>{optionBName}</span>
                {res.winner === 'B' && (
                  <span className="pill" style={{ fontSize: 10, background: 'var(--ki-success)', color: '#fff', border: 'none' }}>
                    Empfohlen ✓
                  </span>
                )}
              </div>
            </div>

            {/* Recommendation text */}
            <div style={{
              marginTop: 16, padding: '12px 16px', borderRadius: 8,
              background: 'var(--ki-bg-alt)',
              fontSize: 14, fontWeight: 600, textAlign: 'center',
              color: res.winner === 'tie' ? 'var(--ki-warning)' : 'var(--ki-text)',
            }}>
              {res.winner === 'tie'
                ? <><Scale size={16} strokeWidth={1.7} style={{ display: 'inline', verticalAlign: 'middle' }} /> Gleichstand — beide Optionen passen gleich gut zu deinen Werten.</>
                : res.winner === 'A'
                  ? `Deine Werte sprechen für "${optionAName}" — um ${res.pctA - res.pctB} Prozentpunkte vorne.`
                  : `Deine Werte sprechen für "${optionBName}" — um ${res.pctB - res.pctA} Prozentpunkte vorne.`}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => setPhase(2)}>← Zurück</button>
          <button
            className="btn btn-primary"
            onClick={finishMatrix}
            disabled={!decision.trim()}
            style={{ padding: '14px 40px', fontSize: 15, opacity: !decision.trim() ? 0.45 : 1 }}
          >
            Zur Reflexion →
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PHASE 4 — Reflexion
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === 4) {
    const res = result || liveResult;
    if (!res) return null;
    const maxPct = Math.max(res.pctA, res.pctB, 1);
    const winnerName =
      res.winner === 'A' ? optionAName :
      res.winner === 'B' ? optionBName : null;
    const winnerColor = res.winner === 'A' ? 'var(--ki-red)' : res.winner === 'B' ? '#5856D6' : 'var(--ki-warning)';

    return (
      <div className="page-container" style={{ maxWidth: 680 }}>
        <PhaseHeader />

        {/* Result summary */}
        <div className="card" style={{
          padding: 32, textAlign: 'center', marginBottom: 20,
          borderTop: `4px solid ${winnerColor}`,
        }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>
            {res.winner === 'tie' ? <Scale size={44} strokeWidth={1.5} /> : <Trophy size={44} strokeWidth={1.5} />}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
            Deine werte-basierte Empfehlung
          </h2>
          {decision && (
            <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
              {decision}
            </p>
          )}
          {res.winner !== 'tie' ? (
            <div style={{ fontSize: 20, fontWeight: 800, color: winnerColor, marginBottom: 24 }}>
              {winnerName} passt besser zu deinen Werten!
            </div>
          ) : (
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--ki-warning)', marginBottom: 24 }}>
              Gleichstand — beide Optionen sind gleichwertig
            </div>
          )}

          {/* Bar chart */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'flex-end', minHeight: 160, padding: '0 24px', marginBottom: 20 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--ki-red)' }}>{res.pctA}%</span>
              <div style={{
                width: '70%', minHeight: 24,
                height: Math.max(24, (res.pctA / maxPct) * 120),
                background: res.winner === 'A' ? 'var(--ki-red)' : 'var(--ki-bg-alt)',
                borderRadius: '6px 6px 0 0',
                border: res.winner !== 'A' ? '2px solid var(--ki-border)' : 'none',
              }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-red)' }}>{optionAName}</span>
              {res.winner === 'A' && (
                <span className="pill" style={{ fontSize: 10, background: 'var(--ki-success)', color: '#fff', border: 'none' }}>
                  Empfohlen ✓
                </span>
              )}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: '#5856D6' }}>{res.pctB}%</span>
              <div style={{
                width: '70%', minHeight: 24,
                height: Math.max(24, (res.pctB / maxPct) * 120),
                background: res.winner === 'B' ? '#5856D6' : 'var(--ki-bg-alt)',
                borderRadius: '6px 6px 0 0',
                border: res.winner !== 'B' ? '2px solid var(--ki-border)' : 'none',
              }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#5856D6' }}>{optionBName}</span>
              {res.winner === 'B' && (
                <span className="pill" style={{ fontSize: 10, background: 'var(--ki-success)', color: '#fff', border: 'none' }}>
                  Empfohlen ✓
                </span>
              )}
            </div>
          </div>

          {/* Clear recommendation */}
          <div style={{
            padding: '14px 20px', borderRadius: 8,
            background: 'var(--ki-bg-alt)', fontSize: 14, fontWeight: 600,
          }}>
            {res.winner === 'tie'
              ? 'Beide Optionen erfüllen deine Werte gleich gut. Höre auf deine Intuition.'
              : res.winner === 'A'
                ? `"${optionAName}" überzeugt bei deinen Top-Werten stärker. Das ist dein wertebasiertes Signal.`
                : `"${optionBName}" überzeugt bei deinen Top-Werten stärker. Das ist dein wertebasiertes Signal.`}
          </div>
        </div>

        {/* Value detail breakdown */}
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ki-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 }}>
            Detailanalyse nach Werten
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(res.details || []).map((d, i) => {
              const val  = d.val || d.value;
              const rA   = d.rA  ?? d.ratingA ?? 5;
              const rB   = d.rB  ?? d.ratingB ?? 5;
              const w    = d.weight;
              return (
                <div key={val.id || i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ flexShrink: 0 }}>{val.Icon && <val.Icon size={20} strokeWidth={1.5} />}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{val.label}</span>
                      <span className="pill" style={{ fontSize: 9, background: 'var(--ki-bg-alt)', border: 'none', color: 'var(--ki-text-secondary)' }}>
                        {w}×
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <div style={{ flex: 1, height: 7, borderRadius: 4, background: 'var(--ki-bg-alt)', overflow: 'hidden' }}>
                        <div style={{ width: `${rA * 10}%`, height: '100%', background: 'var(--ki-red)', borderRadius: 4, transition: 'width 0.3s ease' }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ki-red)', width: 18, textAlign: 'center' }}>{rA}</span>
                      <span style={{ fontSize: 9, color: 'var(--ki-text-secondary)' }}>vs</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#5856D6', width: 18, textAlign: 'center' }}>{rB}</span>
                      <div style={{ flex: 1, height: 7, borderRadius: 4, background: 'var(--ki-bg-alt)', overflow: 'hidden' }}>
                        <div style={{ width: `${rB * 10}%`, height: '100%', background: '#5856D6', borderRadius: 4, transition: 'width 0.3s ease' }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reflexion questions */}
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18 }}>Reflexion</div>

          {/* Surprised? */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
              Überrascht dich das Ergebnis?
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className={surprised === true ? 'btn btn-primary' : 'btn btn-secondary'}
                onClick={() => setSurprised(true)}
                style={{ flex: 1, fontSize: 14 }}
              >
                Ja, überraschend
              </button>
              <button
                className={surprised === false ? 'btn btn-primary' : 'btn btn-secondary'}
                onClick={() => setSurprised(false)}
                style={{ flex: 1, fontSize: 14 }}
              >
                Nein, erwartet
              </button>
            </div>
            {surprised === true && (
              <div style={{
                marginTop: 10, padding: '10px 14px', borderRadius: 8,
                background: 'rgba(255,149,0,0.08)', border: '1px solid var(--ki-warning)',
                fontSize: 13, color: 'var(--ki-text-secondary)',
              }}>
                Interessant! Überraschungen zeigen oft verborgene Prioritäten. Was hat dich überrascht?
              </div>
            )}
            {surprised === false && (
              <div style={{
                marginTop: 10, padding: '10px 14px', borderRadius: 8,
                background: 'rgba(52,199,89,0.08)', border: '1px solid var(--ki-success)',
                fontSize: 13, color: 'var(--ki-text-secondary)',
              }}>
                Gut — Klarheit ist wertvoll. Deine Werte geben dir eine solide Entscheidungsgrundlage.
              </div>
            )}
          </div>

          {/* Next step */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>
              Was ist dein nächster Schritt?
            </label>
            <textarea
              className="input"
              value={nextStep}
              onChange={e => setNextStep(e.target.value)}
              placeholder="z.B. Ich werde ein Gespräch mit meinem Manager führen und meine Entscheidung in 2 Wochen treffen..."
              rows={3}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>
        </div>

        {/* XP + Save */}
        {!saved ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 20px', borderRadius: 'var(--r-pill)',
              background: 'rgba(255,204,0,0.1)', border: '1.5px solid var(--ki-warning)',
            }}>
              <span><Star size={20} strokeWidth={1.5} color="var(--ki-warning)" /></span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ki-warning)' }}>
                +150 XP für das Abschließen dieses Assessments
              </span>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving || surprised === null || !nextStep.trim()}
              style={{
                padding: '14px 48px', fontSize: 15,
                opacity: (saving || surprised === null || !nextStep.trim()) ? 0.45 : 1,
              }}
            >
              {saving ? 'Wird gespeichert...' : 'Assessment speichern & +150 XP erhalten'}
            </button>
            {(surprised === null || !nextStep.trim()) && (
              <p style={{ fontSize: 12, color: 'var(--ki-text-secondary)', textAlign: 'center' }}>
                Beantworte beide Reflexionsfragen, um zu speichern.
              </p>
            )}
          </div>
        ) : (
          <div className="card" style={{
            padding: 28, textAlign: 'center', marginBottom: 20,
            border: '2px solid var(--ki-success)',
            background: 'rgba(52,199,89,0.05)',
          }}>
            <div style={{ marginBottom: 10 }}><PartyPopper size={36} strokeWidth={1.5} /></div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ki-success)', marginBottom: 6 }}>
              Assessment gespeichert!
            </div>
            <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 4 }}>
              Du hast <strong style={{ color: 'var(--ki-warning)' }}>+150 XP</strong> erhalten.
            </div>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>
              Deine Entscheidungsmatrix wurde gespeichert.
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => setPhase(3)}>← Zurück zur Matrix</button>
          <button className="btn btn-secondary" onClick={restart}>Neues Assessment starten</button>
        </div>
      </div>
    );
  }

  return null;
}
