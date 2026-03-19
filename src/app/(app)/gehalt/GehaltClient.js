'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import InfoTooltip from '@/components/ui/InfoTooltip';
import EmptyState from '@/components/ui/EmptyState';
import {
  GEHALTSDATEN,
  BUNDESLAENDER,
  ERFAHRUNGSSTUFEN,
  UNTERNEHMENSGROESSEN,
} from '@/lib/gehaltsdaten';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(val) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(val);
}

function fmtK(val) {
  return (
    new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(val) +
    ' \u20AC'
  );
}

function erfahrungLabel(key) {
  const map = {
    '0-2': '0\u20132 Jahre',
    '3-5': '3\u20135 Jahre',
    '6-10': '6\u201310 Jahre',
    '10+': '\u00DCber 10 Jahre',
  };
  return map[key] || key;
}

/** Classify a Bundesland as top / mid / bottom by salary rank */
function regionTier(land, regionData) {
  const sorted = [...BUNDESLAENDER].sort(
    (a, b) => (regionData[b] || 0) - (regionData[a] || 0)
  );
  const idx = sorted.indexOf(land);
  if (idx < 4) return 'top';
  if (idx >= 12) return 'bottom';
  return 'mid';
}

// ── SVG Quartile Bar ──────────────────────────────────────────────────────────

function QuartileBar({ p25, median, p75, maxVal }) {
  const W = 520;
  const H = 82;
  const PAD_L = 12;
  const PAD_R = 12;
  const BAR_Y = 30;
  const BAR_H = 24;
  const usable = W - PAD_L - PAD_R;

  const scale = (v) => PAD_L + (v / maxVal) * usable;

  const x25 = scale(p25);
  const xMed = scale(median);
  const x75 = scale(p75);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', maxWidth: 520, height: 'auto' }}
      role="img"
      aria-label={`Gehaltsverteilung: P25 ${p25}, Median ${median}, P75 ${p75}`}
    >
      {/* background bar */}
      <rect
        x={PAD_L}
        y={BAR_Y}
        width={usable}
        height={BAR_H}
        rx={6}
        fill="var(--card-border, #e2e8f0)"
      />
      {/* colored range p25\u2013p75 */}
      <rect
        x={x25}
        y={BAR_Y}
        width={x75 - x25}
        height={BAR_H}
        rx={4}
        fill="var(--accent, #c0392b)"
        opacity={0.22}
      />
      {/* p25 marker line */}
      <line
        x1={x25}
        y1={BAR_Y}
        x2={x25}
        y2={BAR_Y + BAR_H}
        stroke="var(--accent, #c0392b)"
        strokeWidth={1.5}
        opacity={0.5}
      />
      {/* p75 marker line */}
      <line
        x1={x75}
        y1={BAR_Y}
        x2={x75}
        y2={BAR_Y + BAR_H}
        stroke="var(--accent, #c0392b)"
        strokeWidth={1.5}
        opacity={0.5}
      />
      {/* median marker line */}
      <line
        x1={xMed}
        y1={BAR_Y - 5}
        x2={xMed}
        y2={BAR_Y + BAR_H + 5}
        stroke="var(--accent, #c0392b)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* median diamond */}
      <polygon
        points={`${xMed},${BAR_Y - 8} ${xMed + 7},${BAR_Y - 1} ${xMed},${BAR_Y + 6} ${xMed - 7},${BAR_Y - 1}`}
        fill="var(--accent, #c0392b)"
      />
      {/* label: P25 */}
      <text
        x={x25}
        y={BAR_Y + BAR_H + 16}
        textAnchor="middle"
        fontSize={11}
        fill="var(--foreground-muted, #64748b)"
      >
        P25: {fmtK(p25)}
      </text>
      {/* label: Median (above) */}
      <text
        x={xMed}
        y={BAR_Y - 14}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        fill="var(--foreground, #1e293b)"
      >
        {fmtK(median)}
      </text>
      {/* label: P75 */}
      <text
        x={x75}
        y={BAR_Y + BAR_H + 16}
        textAnchor="middle"
        fontSize={11}
        fill="var(--foreground-muted, #64748b)"
      >
        P75: {fmtK(p75)}
      </text>
    </svg>
  );
}

// ── Horizontal Bar ────────────────────────────────────────────────────────────

function HBar({ label, value, maxVal, color }) {
  const pct = maxVal > 0 ? Math.round((value / maxVal) * 100) : 0;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10,
      }}
    >
      <span
        style={{
          width: 120,
          fontSize: 13,
          color: 'var(--foreground-muted, #64748b)',
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          background: 'var(--card-border, #e2e8f0)',
          borderRadius: 5,
          height: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color || 'var(--accent, #c0392b)',
            borderRadius: 5,
            transition: 'width 0.4s ease',
          }}
        />
      </div>
      <span
        style={{
          width: 90,
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--foreground, #1e293b)',
          flexShrink: 0,
        }}
      >
        {fmtK(value)}
      </span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export default function GehaltClient({ benchmarks, stats, userId, profile }) {
  const supabase = createClient();

  // ── State ─────────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBeruf, setSelectedBeruf] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('Deutschland');
  const [selectedErfahrung, setSelectedErfahrung] = useState('3-5');
  const [showResults, setShowResults] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  // ── Autocomplete ──────────────────────────────────────────────────────
  const filteredBerufe = useMemo(() => {
    if (!searchTerm || searchTerm.length < 1) return [];
    const term = searchTerm.toLowerCase();
    return GEHALTSDATEN.berufe
      .filter(
        (b) =>
          b.titel.toLowerCase().includes(term) ||
          b.berufsgruppe.toLowerCase().includes(term)
      )
      .slice(0, 8);
  }, [searchTerm]);

  // ── Computed salary for current selection ─────────────────────────────
  const gehaltData = useMemo(() => {
    if (!selectedBeruf) return null;
    const erfahrung = selectedBeruf.gehalt_nach_erfahrung[selectedErfahrung];
    if (!erfahrung) return null;

    let p25 = erfahrung.p25;
    let median = erfahrung.median;
    let p75 = erfahrung.p75;

    // Apply regional adjustment when a specific Bundesland is selected
    if (selectedRegion !== 'Deutschland') {
      const regionMedian = selectedBeruf.gehalt_nach_region[selectedRegion];
      if (regionMedian) {
        const avgRegion =
          Object.values(selectedBeruf.gehalt_nach_region).reduce(
            (a, b) => a + b,
            0
          ) / 16;
        const factor = regionMedian / avgRegion;
        p25 = Math.round(p25 * factor);
        median = Math.round(median * factor);
        p75 = Math.round(p75 * factor);
      }
    }

    return { p25, median, p75 };
  }, [selectedBeruf, selectedRegion, selectedErfahrung]);

  // ── Max values for chart scaling ──────────────────────────────────────
  const maxErfahrung = useMemo(() => {
    if (!selectedBeruf) return 1;
    return Math.max(
      ...ERFAHRUNGSSTUFEN.map(
        (e) => selectedBeruf.gehalt_nach_erfahrung[e]?.median || 0
      )
    );
  }, [selectedBeruf]);

  const maxGroesse = useMemo(() => {
    if (!selectedBeruf) return 1;
    return Math.max(
      ...UNTERNEHMENSGROESSEN.map(
        (g) => selectedBeruf.gehalt_nach_groesse[g] || 0
      )
    );
  }, [selectedBeruf]);

  const maxRegion = useMemo(() => {
    if (!selectedBeruf) return 1;
    return Math.max(...Object.values(selectedBeruf.gehalt_nach_region));
  }, [selectedBeruf]);

  // ── Handlers ──────────────────────────────────────────────────────────
  function handleSearch() {
    if (!selectedBeruf) return;
    setShowResults(true);
    setShowAutocomplete(false);
  }

  function handleSelectBeruf(beruf) {
    setSelectedBeruf(beruf);
    setSearchTerm(beruf.titel);
    setShowAutocomplete(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredBerufe.length === 1) {
        handleSelectBeruf(filteredBerufe[0]);
      }
      if (selectedBeruf) handleSearch();
    }
  }

  // ── Experience bar colors (light to dark) ─────────────────────────────
  const erfahrungColors = ['#e8a4a0', '#d4736e', '#c0392b', '#962d22'];

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="module-container">
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="module-header">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <h1 className="module-title">Gehaltsdatenbank</h1>
          <InfoTooltip moduleId="gehalt" />
        </div>
        <p className="module-subtitle">Was verdient man in Deutschland?</p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          GEHALTSRECHERCHE (Search Form)
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 className="card-title" style={{ marginBottom: 16 }}>
          Gehaltsrecherche
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 16,
          }}
        >
          {/* Beruf / Jobtitel (autocomplete) */}
          <div style={{ position: 'relative' }}>
            <label className="form-label">Beruf / Jobtitel</label>
            <input
              type="text"
              className="form-input"
              placeholder="z.B. Software-Entwickler..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowAutocomplete(true);
                if (!e.target.value) {
                  setSelectedBeruf(null);
                  setShowResults(false);
                }
              }}
              onFocus={() => {
                if (searchTerm.length >= 1) setShowAutocomplete(true);
              }}
              onBlur={() => {
                setTimeout(() => setShowAutocomplete(false), 200);
              }}
              onKeyDown={handleKeyDown}
            />

            {/* Autocomplete dropdown */}
            {showAutocomplete && filteredBerufe.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'var(--card-bg, #fff)',
                  border: '1px solid var(--card-border, #e2e8f0)',
                  borderRadius: 8,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  zIndex: 50,
                  maxHeight: 280,
                  overflowY: 'auto',
                }}
              >
                {filteredBerufe.map((b, i) => (
                  <button
                    key={b.titel}
                    type="button"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 14px',
                      border: 'none',
                      background:
                        i % 2 === 0
                          ? 'transparent'
                          : 'var(--card-border, #f8fafc)',
                      cursor: 'pointer',
                      fontSize: 14,
                      color: 'var(--foreground, #1e293b)',
                      borderBottom:
                        i < filteredBerufe.length - 1
                          ? '1px solid var(--card-border, #f1f5f9)'
                          : 'none',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectBeruf(b);
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{b.titel}</span>
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--foreground-muted, #94a3b8)',
                        flexShrink: 0,
                        marginLeft: 8,
                      }}
                    >
                      {b.berufsgruppe}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Region */}
          <div>
            <label className="form-label">Region</label>
            <select
              className="form-input"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="Deutschland">Deutschland (gesamt)</option>
              {BUNDESLAENDER.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Berufserfahrung */}
          <div>
            <label className="form-label">Berufserfahrung</label>
            <select
              className="form-input"
              value={selectedErfahrung}
              onChange={(e) => setSelectedErfahrung(e.target.value)}
            >
              {ERFAHRUNGSSTUFEN.map((e) => (
                <option key={e} value={e}>
                  {erfahrungLabel(e)}
                </option>
              ))}
            </select>
          </div>

          {/* Branche (read-only) */}
          <div>
            <label className="form-label">Branche</label>
            <input
              type="text"
              className="form-input"
              value={selectedBeruf?.berufsgruppe || '\u2014'}
              readOnly
              style={{
                background: 'var(--card-border, #f1f5f9)',
                cursor: 'default',
              }}
            />
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={!selectedBeruf}
          style={{ minWidth: 220 }}
        >
          \uD83D\uDD0D Gehalt recherchieren
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          EMPTY STATE
          ═══════════════════════════════════════════════════════════════════ */}
      {!showResults && (
        <EmptyState
          icon="\uD83D\uDCB0"
          title="Gehaltsvergleich starten"
          description="W\u00E4hle einen Beruf aus unserer Datenbank mit \u00FCber 35 Berufsbildern und vergleiche Geh\u00E4lter nach Region, Erfahrung und Unternehmensgr\u00F6\u00DFe."
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          RESULTS
          ═══════════════════════════════════════════════════════════════════ */}
      {showResults && selectedBeruf && gehaltData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* ─────────────────────────────────────────────────────────────
              3. ERGEBNIS (Main result card)
              ───────────────────────────────────────────────────────────── */}
          <div className="card">
            <h2 className="card-title" style={{ marginBottom: 4 }}>
              {selectedBeruf.titel} &middot; {selectedRegion} &middot;{' '}
              {erfahrungLabel(selectedErfahrung)}
            </h2>
            <p
              style={{
                fontSize: 13,
                color: 'var(--foreground-muted, #64748b)',
                marginBottom: 20,
              }}
            >
              Brutto-Monatsgehalt (Vollzeit)
            </p>

            {/* Quartile SVG visualization */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <QuartileBar
                p25={gehaltData.p25}
                median={gehaltData.median}
                p75={gehaltData.p75}
                maxVal={Math.round(gehaltData.p75 * 1.35)}
              />
            </div>

            {/* Big median number */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: 'var(--accent, #c0392b)',
                  lineHeight: 1.1,
                }}
              >
                {fmtK(gehaltData.median)}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: 'var(--foreground-muted, #64748b)',
                  marginTop: 4,
                }}
              >
                Brutto pro Monat (Median)
              </div>
            </div>

            {/* Jahresgehalt + Spanne */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
              }}
            >
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--foreground-muted, #64748b)',
                    marginBottom: 4,
                  }}
                >
                  Jahresgehalt (Median)
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: 'var(--foreground, #1e293b)',
                  }}
                >
                  {fmt(gehaltData.median * 12)}
                </div>
              </div>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--foreground-muted, #64748b)',
                    marginBottom: 4,
                  }}
                >
                  Spanne (P25\u2013P75)
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: 'var(--foreground, #1e293b)',
                  }}
                >
                  {fmt(gehaltData.p25 * 12)} \u2013 {fmt(gehaltData.p75 * 12)}
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              4. GEHALT NACH ERFAHRUNG
              ───────────────────────────────────────────────────────────── */}
          <div className="card">
            <h2 className="card-title" style={{ marginBottom: 16 }}>
              Gehalt nach Erfahrung
            </h2>
            <p
              style={{
                fontSize: 13,
                color: 'var(--foreground-muted, #64748b)',
                marginBottom: 16,
              }}
            >
              Median-Bruttogeh\u00E4lter f\u00FCr {selectedBeruf.titel} nach
              Berufserfahrung
            </p>
            {ERFAHRUNGSSTUFEN.map((stufe, i) => {
              const med =
                selectedBeruf.gehalt_nach_erfahrung[stufe]?.median || 0;
              return (
                <HBar
                  key={stufe}
                  label={erfahrungLabel(stufe)}
                  value={med}
                  maxVal={maxErfahrung}
                  color={erfahrungColors[i]}
                />
              );
            })}
            <p
              style={{
                fontSize: 12,
                color: 'var(--foreground-muted, #94a3b8)',
                marginTop: 8,
              }}
            >
              Werte: Deutschland gesamt, Median-Bruttolohn pro Monat
            </p>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              5. GEHALT NACH UNTERNEHMENSGR\u00D6SSE
              ───────────────────────────────────────────────────────────── */}
          <div className="card">
            <h2 className="card-title" style={{ marginBottom: 16 }}>
              Gehalt nach Unternehmensgr\u00F6\u00DFe
            </h2>
            <p
              style={{
                fontSize: 13,
                color: 'var(--foreground-muted, #64748b)',
                marginBottom: 16,
              }}
            >
              Wie die Firmengr\u00F6\u00DFe das Gehalt beeinflusst
            </p>
            {UNTERNEHMENSGROESSEN.map((gr) => {
              const val = selectedBeruf.gehalt_nach_groesse[gr] || 0;
              return (
                <HBar
                  key={gr}
                  label={gr}
                  value={val}
                  maxVal={maxGroesse}
                  color="var(--accent, #c0392b)"
                />
              );
            })}
            <p
              style={{
                fontSize: 12,
                color: 'var(--foreground-muted, #94a3b8)',
                marginTop: 8,
              }}
            >
              Median-Bruttolohn pro Monat, alle Erfahrungsstufen
            </p>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              6. GEHALT NACH REGION
              ───────────────────────────────────────────────────────────── */}
          <div className="card">
            <h2 className="card-title" style={{ marginBottom: 16 }}>
              Gehalt nach Region
            </h2>
            <p
              style={{
                fontSize: 13,
                color: 'var(--foreground-muted, #64748b)',
                marginBottom: 16,
              }}
            >
              Median-Bruttogeh\u00E4lter f\u00FCr {selectedBeruf.titel} in
              allen 16 Bundesl\u00E4ndern
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
                gap: 10,
              }}
            >
              {BUNDESLAENDER.map((land) => {
                const val = selectedBeruf.gehalt_nach_region[land] || 0;
                const tier = regionTier(
                  land,
                  selectedBeruf.gehalt_nach_region
                );
                const isSelected = selectedRegion === land;

                let bgColor = 'var(--card-bg, #fff)';
                let borderColor = 'var(--card-border, #e2e8f0)';
                const textColor = 'var(--foreground, #1e293b)';

                if (tier === 'top') {
                  bgColor = 'rgba(34,197,94,0.07)';
                  borderColor = 'rgba(34,197,94,0.3)';
                } else if (tier === 'bottom') {
                  bgColor = 'rgba(239,68,68,0.05)';
                  borderColor = 'rgba(239,68,68,0.22)';
                }

                if (isSelected) {
                  borderColor = 'var(--accent, #c0392b)';
                  bgColor = 'rgba(192,57,43,0.08)';
                }

                return (
                  <div
                    key={land}
                    role="button"
                    tabIndex={0}
                    aria-label={`${land}: ${fmtK(val)}`}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: `2px solid ${borderColor}`,
                      background: bgColor,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                    }}
                    onClick={() => setSelectedRegion(land)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedRegion(land);
                      }
                    }}
                    title={`Klicken um ${land} auszuw\u00E4hlen`}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        color: textColor,
                        fontWeight: isSelected ? 700 : 400,
                      }}
                    >
                      {land}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: textColor,
                      }}
                    >
                      {fmtK(val)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div
              style={{
                display: 'flex',
                gap: 16,
                marginTop: 14,
                fontSize: 12,
                color: 'var(--foreground-muted, #94a3b8)',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: 'rgba(34,197,94,0.3)',
                    display: 'inline-block',
                  }}
                />
                Top 4
              </span>
              <span
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: 'var(--card-border, #e2e8f0)',
                    display: 'inline-block',
                  }}
                />
                Mittelfeld
              </span>
              <span
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: 'rgba(239,68,68,0.22)',
                    display: 'inline-block',
                  }}
                />
                Untere 4
              </span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              7. WAS BEDEUTET DAS F\u00DCR DICH? (Personalized)
              ───────────────────────────────────────────────────────────── */}
          <div
            className="card"
            style={{
              background:
                'linear-gradient(135deg, rgba(192,57,43,0.03), rgba(192,57,43,0.09))',
              border: '1px solid rgba(192,57,43,0.18)',
            }}
          >
            <h2 className="card-title" style={{ marginBottom: 12 }}>
              Was bedeutet das f\u00FCr dich?
            </h2>

            {profile?.industry || profile?.position ? (
              <p
                style={{
                  fontSize: 14,
                  color: 'var(--foreground, #1e293b)',
                  marginBottom: 12,
                  lineHeight: 1.65,
                }}
              >
                Basierend auf deinem Profil
                {profile.position ? ` als ${profile.position}` : ''}
                {profile.industry
                  ? ` in der Branche ${profile.industry}`
                  : ''}
                {' '}liegst du im direkten Vergleich mit dem
                Mediangehalt von{' '}
                <strong>{fmtK(gehaltData.median)}</strong> brutto/Monat.
                Das entspricht einem Jahresbruttogehalt von{' '}
                <strong>{fmt(gehaltData.median * 12)}</strong>.
              </p>
            ) : (
              <p
                style={{
                  fontSize: 14,
                  color: 'var(--foreground, #1e293b)',
                  marginBottom: 12,
                  lineHeight: 1.65,
                }}
              >
                Vervollst\u00E4ndige dein Profil, um eine personalisierte
                Gehaltseinsch\u00E4tzung basierend auf deiner Branche und
                Position zu erhalten.
              </p>
            )}

            <div
              style={{
                padding: '14px 18px',
                background: 'var(--card-bg, #fff)',
                borderRadius: 10,
                border: '1px solid var(--card-border, #e2e8f0)',
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: 'var(--foreground, #1e293b)',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                <strong>Tipp:</strong> Mit unseren Zertifikaten und
                Weiterbildungen hebst du dich von anderen Bewerbern ab
                \u2014 das obere Quartil (ab{' '}
                {fmtK(gehaltData.p75)}/Monat) wird dadurch realistisch
                erreichbar. Investiere in deine Qualifikation und steigere
                deinen Marktwert nachhaltig.
              </p>
            </div>

            <a
              href="/marktwert"
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                textDecoration: 'none',
              }}
            >
              Marktwert berechnen \u2192
            </a>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              8. OFFIZIELLE QUELLEN
              ───────────────────────────────────────────────────────────── */}
          <div className="card">
            <h2 className="card-title" style={{ marginBottom: 12 }}>
              Offizielle Quellen
            </h2>
            <p
              style={{
                fontSize: 13,
                color: 'var(--foreground-muted, #64748b)',
                marginBottom: 16,
                lineHeight: 1.6,
              }}
            >
              Die dargestellten Gehaltsdaten basieren auf \u00F6ffentlich
              zug\u00E4nglichen Statistiken und dienen als Orientierung.
              Individuelle Geh\u00E4lter k\u00F6nnen je nach Qualifikation,
              Verhandlungsgeschick und Unternehmenskontext abweichen.
            </p>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              {/* Entgeltatlas */}
              <a
                href="https://entgeltatlas.arbeitsagentur.de"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--card-border, #e2e8f0)',
                  background: 'var(--card-bg, #fff)',
                  textDecoration: 'none',
                  color: 'var(--foreground, #1e293b)',
                  fontSize: 14,
                  transition: 'border-color 0.2s',
                }}
              >
                <span style={{ fontSize: 20 }}>\uD83C\uDFE2</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>
                    Entgeltatlas der Bundesagentur f\u00FCr Arbeit
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--foreground-muted, #94a3b8)',
                    }}
                  >
                    entgeltatlas.arbeitsagentur.de
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 16,
                    color: 'var(--foreground-muted, #94a3b8)',
                  }}
                >
                  \u2197
                </span>
              </a>

              {/* Destatis */}
              <a
                href="https://www.destatis.de/DE/Themen/Arbeit/Verdienste/_inhalt.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--card-border, #e2e8f0)',
                  background: 'var(--card-bg, #fff)',
                  textDecoration: 'none',
                  color: 'var(--foreground, #1e293b)',
                  fontSize: 14,
                  transition: 'border-color 0.2s',
                }}
              >
                <span style={{ fontSize: 20 }}>\uD83D\uDCCA</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>
                    Statistisches Bundesamt (Destatis)
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--foreground-muted, #94a3b8)',
                    }}
                  >
                    destatis.de \u2014 Verdienste &amp; Arbeitskosten
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 16,
                    color: 'var(--foreground-muted, #94a3b8)',
                  }}
                >
                  \u2197
                </span>
              </a>
            </div>

            <p
              style={{
                fontSize: 11,
                color: 'var(--foreground-muted, #94a3b8)',
                marginTop: 16,
                lineHeight: 1.55,
              }}
            >
              Hinweis: Alle Gehaltsangaben sind Brutto-Werte und basieren
              auf Vollzeitbesch\u00E4ftigung. Die Daten dienen
              ausschlie\u00DFlich der Orientierung und stellen keine
              Gehaltsgarantie dar. Quelle: Entgeltatlas der Bundesagentur
              f\u00FCr Arbeit, Statistisches Bundesamt, eigene Berechnung.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
