'use client';
import { useState } from 'react';
import Link from 'next/link';

const Ic = ({ d, size = 16, stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);

const icons = {
  target:  <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></>,
  play:    <><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l5.5-3.5z"/></>,
  doc:     <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h6"/></>,
  check:   <path d="M20 6L9 17l-5-5"/>,
  brief:   <><path d="M7 4h10l2 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8z"/><path d="M5 8h14"/><path d="M9 14h6"/></>,
  flame:   <path d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4-1 3 1 4 2 4 0-3-2-5 0-9z"/>,
  arrowUp: <path d="M7 14l5-5 5 5"/>,
  chevR:   <path d="M9 5l7 7-7 7"/>,
  warn:    <path d="M12 9v4M12 17v.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>,
  info:    <><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></>,
  bulb:    <><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.7.6 1 1.4 1 2.3v1h6v-1c0-.9.3-1.7 1-2.3A7 7 0 0 0 12 2z"/></>,
  okIc:    <><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></>,
  upload:  <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
  key:     <><circle cx="8" cy="8" r="4"/><path d="M12 8h8M18 10v-4"/></>,
};

const POSITIVE_KW = ['Guter','Gut ','Klarer','Übersichtlich','Vollständig','Professionell','Stark','Konsistent','Angemessen','Motivierend','Messbar','Relevante','Kompetenzen klar'];
const isPos = (text) => POSITIVE_KW.some(k => text.includes(k));

const CAT_MAP = {
  design:   'Design & Layout',
  struktur: 'Struktur & Lesbarkeit',
  inhalt:   'Inhalt & Wirkung',
  wirkung:  'Keywords & ATS',
};

function catScore(cat) {
  if (!cat) return null;
  if (cat.rating > 0) return Math.round((cat.rating / 5) * 100);
  const total = cat.presets.length;
  if (total === 0) return null;
  return Math.round((cat.presets.filter(isPos).length / total) * 100);
}

function catTag(score) {
  if (score === null) return { tag: 'Kein Feedback', cls: 'mid' };
  if (score >= 70) return { tag: 'Stark', cls: 'good' };
  if (score >= 50) return { tag: 'Mittel', cls: 'mid' };
  return { tag: 'Schwach', cls: 'low' };
}

function Ring({ value = 78, size = 180, thick = 12, trackColor = 'rgba(255,255,255,0.15)', fillColor = '#fff' }) {
  const r = (size - thick) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={thick}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={fillColor} strokeWidth={thick}
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"/>
    </svg>
  );
}

function SmRing({ value = 71, size = 64, color = 'var(--ki-red)' }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={6}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"/>
    </svg>
  );
}

function Silhouette() {
  return (
    <svg viewBox="0 0 100 130" preserveAspectRatio="xMidYMid slice"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.65, zIndex:1 }}>
      <defs>
        <linearGradient id="cvsilg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55"/>
          <stop offset="1" stopColor="#fff" stopOpacity="0.15"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="45" r="18" fill="url(#cvsilg)"/>
      <path d="M15 130 C 15 90, 35 75, 50 75 C 65 75, 85 90, 85 130 Z" fill="url(#cvsilg)"/>
    </svg>
  );
}

function TitleBlock({ doc }) {
  const now = new Date();
  const wd = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'][now.getDay()];
  const mo = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'][now.getMonth()];
  const h = now.getHours();
  const greet = h < 11 ? 'Guten Morgen' : h < 18 ? 'Guten Tag' : 'Guten Abend';
  const vDate = doc?.created_at
    ? new Date(doc.created_at).toLocaleDateString('de-DE', { day:'2-digit', month:'long', hour:'2-digit', minute:'2-digit' })
    : '—';
  return (
    <>
      <div style={{ fontSize:13, color:'var(--ki-text-secondary)', fontWeight:500, display:'flex', alignItems:'center', gap:7, marginBottom:12 }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--ki-success)', boxShadow:'0 0 0 3px rgba(36,138,61,0.2)', display:'inline-block', flexShrink:0 }}/>
        {wd}, {now.getDate()}. {mo} · {greet}
      </div>
      <h1 style={{ fontFamily:"'Instrument Sans',sans-serif", fontWeight:600, fontSize:44, letterSpacing:'-0.035em', lineHeight:1.05, margin:'0 0 10px', color:'var(--ki-text)' }}>
        Lebenslauf-Check.{' '}
        <span style={{ color:'var(--ki-text-secondary)' }}>Was wirklich beim Recruiter ankommt.</span>
      </h1>
      <p style={{ fontSize:17, color:'var(--ki-text-secondary)', maxWidth:'58ch', lineHeight:1.45, fontWeight:400, letterSpacing:'-0.015em', margin:'0 0 26px' }}>
        Wir scannen deinen CV in 6 Sekunden — was Recruiter sehen, in welcher Reihenfolge, was sie überspringen.
      </p>
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:28, flexWrap:'wrap' }}>
        <Link href="/cv-check/upload" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 18px', borderRadius:980, background:'var(--ki-text)', color:'#fff', fontWeight:600, fontSize:14, textDecoration:'none', letterSpacing:'-0.01em' }}>
          <Ic d={icons.upload} size={14} stroke={2}/> Neue Version hochladen
        </Link>
        <span style={{ fontSize:12.5, color:'var(--ki-text-secondary)', fontWeight:500 }}>
          Version analysiert: {vDate}
          {doc?.file_name && ` · ${doc.file_name}`}
        </span>
      </div>
    </>
  );
}

function ScoreHero({ score, feedback }) {
  const displayScore = score ?? 0;
  const headline = displayScore >= 75
    ? 'Starke Basis. Zwei Hebel für die Spitze.'
    : displayScore >= 55
    ? 'Solide Basis. Drei Hebel für den Sprung in die Top-Liga.'
    : 'Klarer Handlungsbedarf — und klare Hebel dafür.';
  const note = feedback?.summary ||
    'Recruiter scannen 6 Sekunden. Deine ersten zwei Zeilen tragen — danach verlierst du sie. Wir wissen wo.';
  const sinceV = '+12 Punkte seit Version 1';

  return (
    <div style={{
      position:'relative', borderRadius:18, padding:'32px', overflow:'hidden',
      background:'radial-gradient(500px 240px at 85% 20%, rgba(214,48,72,0.35), transparent 70%), radial-gradient(420px 260px at 10% 110%, rgba(130,3,28,0.9), transparent 70%), linear-gradient(160deg, #1d1d1f 0%, #2b1114 55%, #82031C 100%)',
      color:'#fff',
      boxShadow:'0 20px 50px rgba(130,3,28,0.2), 0 2px 4px rgba(0,0,0,0.06)',
    }}>
      {/* grain */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0.4, backgroundImage:'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize:'3px 3px' }}/>
      <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:32, alignItems:'center', position:'relative' }}>
        {/* Ring */}
        <div style={{ position:'relative', width:180, height:180, flexShrink:0 }}>
          <Ring value={displayScore} />
          <div style={{ position:'absolute', inset:0, display:'grid', placeItems:'center', textAlign:'center' }}>
            <div>
              <div style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:56, fontWeight:600, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>
                {displayScore}
              </div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', marginTop:4, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.08em' }}>
                von 100
              </div>
            </div>
          </div>
        </div>
        {/* Meta */}
        <div>
          <div style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(255,255,255,0.7)', fontWeight:600 }}>Dein CV-Score</div>
          <h2 style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:28, fontWeight:600, lineHeight:1.15, margin:'8px 0 12px', color:'#fff', letterSpacing:'-0.02em' }}>
            {headline}
          </h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.78)', lineHeight:1.5, maxWidth:'44ch', margin:'0 0 20px', letterSpacing:'-0.01em' }}>
            {note}
          </p>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.1)', padding:'6px 12px', borderRadius:980, fontSize:12.5, fontWeight:500, backdropFilter:'blur(12px)', border:'0.5px solid rgba(255,255,255,0.18)' }}>
            <span style={{ color:'#6BFF9E' }}>↗</span> {sinceV}
          </span>
        </div>
      </div>
    </div>
  );
}

function CoachCard() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:16, alignItems:'center', padding:'18px 18px 18px 22px', background:'#fff', border:'0.5px solid var(--ki-border-light)', borderRadius:14, boxShadow:'var(--sh-sm)' }}>
      <div style={{ width:52, height:52, borderRadius:'50%', overflow:'hidden', flexShrink:0, boxShadow:'0 3px 10px rgba(204,20,38,0.18)', background:'linear-gradient(135deg,#F2D5D9,#E8BAC1)', position:'relative' }}>
        <Silhouette/>
      </div>
      <div>
        <div style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:14, fontWeight:600, color:'var(--ki-text)' }}>Florian Fritsch</div>
        <div style={{ fontSize:12, color:'var(--ki-text-secondary)', margin:'1px 0 8px' }}>Karriere-Coach · 12 Jahre PM-Hiring</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <Link href="/coach" style={{ display:'inline-flex', alignItems:'center', padding:'6px 12px', borderRadius:980, background:'var(--ki-red)', color:'#fff', fontWeight:600, fontSize:12.5, textDecoration:'none', boxShadow:'0 1px 2px rgba(204,20,38,0.3)', gap:4 }}>
            CV-Termin buchen · 30 Min
          </Link>
          <Link href="/coach" style={{ display:'inline-flex', alignItems:'center', padding:'6px 12px', borderRadius:980, background:'transparent', border:'0.5px solid var(--ki-border)', color:'var(--ki-text)', fontWeight:500, fontSize:12.5, textDecoration:'none' }}>
            Profil ansehen
          </Link>
        </div>
      </div>
    </div>
  );
}

function CatBreakdown({ byCategory, targetPosition }) {
  const CATS = [
    { key:'design',   label:'Design & Layout' },
    { key:'struktur', label:'Struktur & Lesbarkeit' },
    { key:'inhalt',   label:'Inhalt & Wirkung' },
    { key:'wirkung',  label:'Keywords & ATS' },
  ];

  const allScores = CATS.map(c => catScore(byCategory[c.key])).filter(s => s !== null);
  const avgScore = allScores.length ? Math.round(allScores.reduce((a,b) => a+b, 0) / allScores.length) : null;

  const barColor = { good:'linear-gradient(90deg,#30D158,#248A3D)', mid:'linear-gradient(90deg,#FF9F0A,#C76B00)', low:'linear-gradient(90deg,#FF453A,#cc1426)' };
  const tagStyle = {
    good: { background:'rgba(48,209,88,0.12)', color:'var(--ki-success)' },
    mid:  { background:'rgba(255,159,10,0.12)', color:'var(--ki-warning)' },
    low:  { background:'rgba(255,69,58,0.12)', color:'var(--ki-red)' },
  };

  return (
    <div style={{ background:'#fff', borderRadius:14, padding:22, boxShadow:'var(--sh-sm)', border:'0.5px solid var(--ki-border-light)', display:'flex', flexDirection:'column', gap:0 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, marginBottom:18 }}>
        <h3 style={{ fontFamily:"'Instrument Sans',sans-serif", fontWeight:600, fontSize:18, letterSpacing:'-0.02em', margin:0, color:'var(--ki-text)', display:'flex', alignItems:'center', gap:10 }}>
          Kategorien
          <span style={{ fontSize:11, fontWeight:500, padding:'2px 8px', borderRadius:980, color:'var(--ki-text-secondary)', background:'var(--ki-bg-alt)', letterSpacing:0 }}>4 Bereiche</span>
        </h3>
        <span style={{ fontSize:13, color:'var(--ki-text-secondary)', fontWeight:500 }}>Methodik</span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {CATS.map(({ key, label }) => {
          const sc = catScore(byCategory[key]);
          const { tag, cls } = catTag(sc);
          return (
            <div key={key} style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'6px 16px', alignItems:'baseline' }}>
              <span style={{ fontSize:14, fontWeight:500, color:'var(--ki-text)' }}>{label}</span>
              <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:980, textTransform:'uppercase', letterSpacing:'0.05em', ...tagStyle[cls] }}>{tag}</span>
                {sc !== null && (
                  <span style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:16, fontWeight:600, fontVariantNumeric:'tabular-nums', color:'var(--ki-text)' }}>
                    {sc}<span style={{ fontSize:13, color:'var(--ki-text-tertiary)', fontWeight:500 }}>/100</span>
                  </span>
                )}
              </span>
              <div style={{ gridColumn:'1/-1', height:6, background:'var(--ki-bg-alt)', borderRadius:980, overflow:'hidden' }}>
                {sc !== null && (
                  <div style={{ height:'100%', width:`${sc}%`, borderRadius:980, background:barColor[cls], transition:'width .4s ease' }}/>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Job match ring */}
      {avgScore !== null && (
        <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:16, alignItems:'center', padding:18, background:'var(--ki-bg-alt)', borderRadius:12, marginTop:16 }}>
          <div style={{ position:'relative', width:64, height:64, flexShrink:0 }}>
            <SmRing value={avgScore}/>
            <div style={{ position:'absolute', inset:0, display:'grid', placeItems:'center', fontFamily:"'Instrument Sans',sans-serif", fontSize:18, fontWeight:600, color:'var(--ki-text)', fontVariantNumeric:'tabular-nums' }}>
              {avgScore}%
            </div>
          </div>
          <div>
            <div style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--ki-text-secondary)', fontWeight:600 }}>Ø Gesamt-Score</div>
            {targetPosition && <div style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:16, fontWeight:600, color:'var(--ki-text)', margin:'2px 0 4px' }}>{targetPosition}</div>}
            <div style={{ fontSize:13, color:'var(--ki-text-secondary)', lineHeight:1.4 }}>
              {avgScore >= 70 ? 'Starke Grundlage — verfeinere die Details.' : avgScore >= 50 ? 'Gute Basis mit klaren Optimierungsfeldern.' : 'Mehrere Bereiche brauchen Aufmerksamkeit.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DocPreview({ previewUrl, fileName, fileType }) {
  const [view, setView] = useState('original');

  const btnStyle = (active) => ({
    background: active ? 'var(--ki-red)' : 'var(--ki-bg-alt)',
    color: active ? '#fff' : 'var(--ki-text-secondary)',
    border: 0, padding:'4px 10px', borderRadius:6,
    fontSize:12, fontWeight:500, cursor:'pointer',
  });

  return (
    <div style={{ background:'#fff', borderRadius:14, boxShadow:'var(--sh-sm)', border:'0.5px solid var(--ki-border-light)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ display:'flex', gap:8, padding:'8px 16px', borderBottom:'0.5px solid var(--ki-border-light)', alignItems:'center' }}>
        <span style={{ fontSize:12.5, fontWeight:600, color:'var(--ki-text-secondary)', flex:1 }}>{fileName || 'Lebenslauf'}</span>
        <div style={{ display:'flex', gap:4 }}>
          <button style={btnStyle(view==='original')} onClick={() => setView('original')}>Original</button>
          {previewUrl && <a href={previewUrl} download style={{ background:'var(--ki-bg-alt)', color:'var(--ki-text-secondary)', border:0, padding:'4px 10px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', textDecoration:'none' }}>↓ Download</a>}
        </div>
      </div>
      <div style={{ flex:1, minHeight:560, background:'var(--ki-bg-alt)', position:'relative' }}>
        {previewUrl && fileType === 'pdf' ? (
          <iframe src={previewUrl} style={{ width:'100%', height:'100%', minHeight:560, border:'none', display:'block' }} title="CV Vorschau"/>
        ) : previewUrl && fileType === 'image' ? (
          <div style={{ padding:20 }}>
            <img src={previewUrl} alt="CV" style={{ maxWidth:'100%', borderRadius:8 }}/>
          </div>
        ) : (
          <div style={{ display:'grid', placeItems:'center', height:'100%', minHeight:400, color:'var(--ki-text-secondary)' }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ marginBottom:12, opacity:0.4 }}><Ic d={icons.doc} size={48} stroke={1}/></div>
              <p style={{ margin:'0 0 16px', fontSize:14 }}>Vorschau nicht verfügbar</p>
              {previewUrl && (
                <a href={previewUrl} download style={{ color:'var(--ki-red)', fontWeight:600, fontSize:13 }}>Datei herunterladen</a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FeedbackList({ byCategory, feedback }) {
  const sevIcon = {
    crit: <path d="M12 9v4M12 17v.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>,
    imp:  <><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></>,
    tip:  <><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.7.6 1 1.4 1 2.3v1h6v-1c0-.9.3-1.7 1-2.3A7 7 0 0 0 12 2z"/></>,
    ok:   <><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></>,
  };
  const sevStyle = {
    crit: { background:'rgba(255,69,58,0.1)', color:'#cc1426' },
    imp:  { background:'rgba(255,159,10,0.12)', color:'var(--ki-warning)' },
    tip:  { background:'rgba(0,113,227,0.1)', color:'#0071E3' },
    ok:   { background:'rgba(48,209,88,0.12)', color:'var(--ki-success)' },
  };

  // Build feedback items from real data
  const items = [];
  if (feedback?.summary) {
    items.push({ sev:'tip', where:'Gesamt-Einschätzung', text: feedback.summary });
  }
  Object.entries(byCategory || {}).forEach(([key, cat]) => {
    const label = CAT_MAP[key] || key;
    cat.presets.filter(p => !isPos(p)).forEach(p => items.push({ sev:'imp', where:label, text:p }));
    if (cat.freetext) items.push({ sev:'tip', where:label, text:cat.freetext });
    cat.presets.filter(p => isPos(p)).forEach(p => items.push({ sev:'ok', where:label, text:p }));
  });

  // Fallback if no feedback
  if (items.length === 0) {
    items.push(
      { sev:'tip', where:'Analyse', text:'Sobald dein Lebenslauf analysiert wurde, erscheint das detaillierte Feedback hier.' },
      { sev:'ok',  where:'Status', text:'Dein Lebenslauf wurde erfolgreich hochgeladen.' },
    );
  }

  const displayed = items.slice(0, 8);

  return (
    <div style={{ background:'#fff', borderRadius:14, padding:22, boxShadow:'var(--sh-sm)', border:'0.5px solid var(--ki-border-light)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, marginBottom:18 }}>
        <h3 style={{ fontFamily:"'Instrument Sans',sans-serif", fontWeight:600, fontSize:18, letterSpacing:'-0.02em', margin:0, color:'var(--ki-text)', display:'flex', alignItems:'center', gap:10 }}>
          Feedback im Detail
          <span style={{ fontSize:11, fontWeight:500, padding:'2px 8px', borderRadius:980, color:'var(--ki-text-secondary)', background:'var(--ki-bg-alt)', letterSpacing:0 }}>{displayed.length} Punkte</span>
        </h3>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
        {displayed.map((it, i) => (
          <div key={i} style={{ padding:'14px 0', borderTop: i === 0 ? 0 : '0.5px solid var(--ki-border-light)', display:'grid', gridTemplateColumns:'auto 1fr', gap:14, alignItems:'start' }}>
            <div style={{ width:32, height:32, borderRadius:8, display:'grid', placeItems:'center', flexShrink:0, ...sevStyle[it.sev] }}>
              <Ic d={sevIcon[it.sev]} size={15} stroke={2}/>
            </div>
            <div style={{ display:'grid', gap:4, minWidth:0 }}>
              <div style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--ki-text-secondary)', fontWeight:600 }}>{it.where}</div>
              <div style={{ fontSize:14, color:'var(--ki-text)', lineHeight:1.5, letterSpacing:'-0.01em' }}>{it.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Todos({ byCategory }) {
  const [done, setDone] = useState({});
  const toggle = (k) => setDone(d => ({ ...d, [k]: !d[k] }));

  // Build todos from negative feedback items
  const negItems = [];
  Object.entries(byCategory || {}).forEach(([key, cat]) => {
    const label = CAT_MAP[key] || key;
    cat.presets.filter(p => !isPos(p)).forEach(p => {
      negItems.push({ text: p, where: label, impact: 'Hoch' });
    });
  });

  const groups = negItems.length > 0 ? [
    {
      label: 'Sofort umsetzbar',
      sub: '15–30 Min · selbst erledigen',
      items: negItems.slice(0, 3).map(it => ({ ...it, action: 'Details ansehen' })),
    },
    ...(negItems.length > 3 ? [{
      label: 'Diese Woche',
      sub: 'Etwas mehr Aufwand',
      items: negItems.slice(3, 6).map(it => ({ ...it, action: 'Angehen' })),
    }] : []),
    {
      label: 'Mit Coach klären',
      sub: 'Im nächsten 1:1-Termin besprechen',
      items: [
        { text: 'Positionierung und roten Faden im CV besprechen', where: 'Strategie', impact: 'Hoch', action: 'Termin buchen' },
        { text: 'Formulierungen für wichtigste Stationen schärfen', where: 'Inhalt & Wirkung', impact: 'Mittel', action: 'Termin buchen' },
      ],
    },
  ] : [
    {
      label: 'Allgemeine Empfehlungen',
      sub: 'Gute Ausgangsbasis — letzte Feinheiten',
      items: [
        { text: 'CV auf maximal 2 Seiten kürzen', where: 'Struktur', impact: 'Mittel', action: 'Prüfen' },
        { text: 'LinkedIn-URL und Kontaktdaten aktualisieren', where: 'Design & Layout', impact: 'Niedrig', action: 'Anleitung' },
        { text: 'Keywords der Ziel-Stellenanzeige einpflegen', where: 'Keywords & ATS', impact: 'Hoch', action: 'Wizard starten' },
      ],
    },
  ];

  const allKeys = groups.flatMap((g, gi) => g.items.map((_, i) => `${gi}-${i}`));
  const openCount = allKeys.filter(k => !done[k]).length;

  const impStyle = {
    'Hoch':    { background:'rgba(204,20,38,0.08)', color:'var(--ki-red)' },
    'Mittel':  { background:'rgba(255,159,10,0.12)', color:'var(--ki-warning)' },
    'Niedrig': { background:'var(--ki-bg-alt)', color:'var(--ki-text-secondary)' },
  };

  return (
    <div style={{ background:'#fff', borderRadius:14, padding:22, boxShadow:'var(--sh-sm)', border:'0.5px solid var(--ki-border-light)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, marginBottom:18 }}>
        <h3 style={{ fontFamily:"'Instrument Sans',sans-serif", fontWeight:600, fontSize:18, letterSpacing:'-0.02em', margin:0, color:'var(--ki-text)', display:'flex', alignItems:'center', gap:10 }}>
          Verbesserungs-Plan
          <span style={{ fontSize:11, fontWeight:500, padding:'2px 8px', borderRadius:980, color:'var(--ki-text-secondary)', background:'var(--ki-bg-alt)', letterSpacing:0 }}>{openCount} offen</span>
        </h3>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
        {groups.map((g, gi) => (
          <div key={gi} style={{ marginTop: gi > 0 ? 14 : 0, paddingTop: gi > 0 ? 14 : 0, borderTop: gi > 0 ? '0.5px solid var(--ki-border-light)' : 0 }}>
            <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:4 }}>
              <span style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:13, fontWeight:600, color:'var(--ki-text)', letterSpacing:'-0.005em' }}>{g.label}</span>
              <span style={{ fontSize:11.5, color:'var(--ki-text-secondary)', fontWeight:500 }}>{g.sub}</span>
            </div>
            {g.items.map((it, i) => {
              const k = `${gi}-${i}`;
              const isDone = done[k];
              return (
                <div key={k} style={{ display:'grid', gridTemplateColumns:'auto 1fr auto auto', gap:12, alignItems:'center', padding:'10px 4px', borderTop: i === 0 ? 0 : '0.5px solid var(--ki-border-light)' }}>
                  <div onClick={() => toggle(k)} style={{ width:20, height:20, borderRadius:'50%', border:`1.5px solid ${isDone ? 'var(--ki-success)' : 'var(--ki-text-tertiary)'}`, display:'grid', placeItems:'center', cursor:'pointer', background: isDone ? 'var(--ki-success)' : 'transparent', color:'#fff', flexShrink:0, transition:'all .15s ease' }}>
                    {isDone && <Ic d={icons.check} size={11} stroke={3}/>}
                  </div>
                  <div style={{ fontSize:13.5, color: isDone ? 'var(--ki-text-secondary)' : 'var(--ki-text)', fontWeight:500, textDecoration: isDone ? 'line-through' : 'none' }}>{it.text}</div>
                  <span style={{ fontSize:12, fontWeight:500, color:'var(--ki-red)', cursor:'pointer', whiteSpace:'nowrap' }}>{it.action} →</span>
                  <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:980, textTransform:'uppercase', letterSpacing:'0.05em', ...impStyle[it.impact] }}>{it.impact}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function PasswordBanner() {
  return (
    <div style={{ background:'linear-gradient(135deg,#FFF7ED,#FEF3C7)', border:'1px solid #FCD34D', borderRadius:14, padding:'16px 20px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:'rgba(217,119,6,0.12)', display:'grid', placeItems:'center', flexShrink:0 }}>
          <Ic d={icons.key} size={16} stroke={2} style={{ color:'#D97706' }}/>
        </div>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:'#92400E' }}>Eigenes Passwort setzen</div>
          <div style={{ fontSize:13, color:'#78350F', lineHeight:1.4 }}>Du hast ein temporäres Passwort. Bitte ändere es jetzt, um deinen Account zu sichern.</div>
        </div>
      </div>
      <Link href="/auth/set-password?returnTo=/cv-check" style={{ padding:'10px 18px', background:'#D97706', color:'#fff', borderRadius:980, textDecoration:'none', fontWeight:600, fontSize:13, whiteSpace:'nowrap', flexShrink:0 }}>
        Passwort ändern →
      </Link>
    </div>
  );
}

export default function CvCheckClient({ doc, feedback, byCategory, previewUrl, analysisSession, needsPasswordSetup, targetPosition }) {
  const score = feedback?.overall_rating ? Math.round((feedback.overall_rating / 5) * 100) : null;

  return (
    <div style={{ padding:'40px 48px 80px', maxWidth:1200, width:'100%' }}>
      {needsPasswordSetup && <PasswordBanner/>}
      <TitleBlock doc={doc}/>

      {/* Row 1: Score hero + Coach | Category breakdown */}
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:18, marginBottom:18, alignItems:'stretch' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <ScoreHero score={score} feedback={feedback}/>
          <CoachCard/>
        </div>
        <CatBreakdown byCategory={byCategory} targetPosition={targetPosition}/>
      </div>

      {/* Row 2: Real PDF preview | Feedback items */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18, marginBottom:18, alignItems:'start' }}>
        <DocPreview previewUrl={previewUrl} fileName={doc?.file_name} fileType={doc?.file_type}/>
        <FeedbackList byCategory={byCategory} feedback={feedback}/>
      </div>

      {/* Row 3: Improvement plan (full width) */}
      <Todos byCategory={byCategory}/>
    </div>
  );
}
