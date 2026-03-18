import { createClient } from '@/lib/supabase/server';
import { calculatePriorities, classifyScore, getLevel, calculateTotalMarketValue } from '@/lib/career-logic';
import { NextResponse } from 'next/server';

/**
 * Generiert einen Karriere-Report als HTML (für PDF-Konvertierung)
 * 
 * In Produktion: Puppeteer oder @react-pdf/renderer nutzen
 * Für MVP: HTML-Response die der Client als window.print() druckt
 */
export async function GET(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Alle Daten laden
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    const { data: results } = await supabase
      .from('analysis_results')
      .select('*, competency_fields(title, icon, slug, description)')
      .eq('user_id', user.id)
      .order('score', { ascending: true });
    const { data: session } = await supabase
      .from('analysis_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();
    const { data: progress } = await supabase
      .from('lesson_progress')
      .select('*, lessons(title, market_value_impact)')
      .eq('user_id', user.id)
      .eq('completed', true);
    const { data: cvDoc } = await supabase
      .from('career_documents')
      .select('ai_analysis')
      .eq('user_id', user.id)
      .eq('doc_type', 'cv')
      .single();

    if (!results || results.length === 0) {
      return NextResponse.json({ error: 'Keine Analyse-Ergebnisse vorhanden' }, { status: 400 });
    }

    const priorities = calculatePriorities(results.map(r => ({
      fieldId: r.field_id,
      score: r.score,
      title: r.competency_fields?.title,
    })));
    const overallScore = session?.overall_score || 0;
    const level = getLevel(profile?.xp || 0);
    const marketValue = calculateTotalMarketValue(
      profile?.current_salary || 50000,
      (progress || []).map(p => p.lessons)
    );
    const cvAnalysis = cvDoc?.ai_analysis;

    const html = generateReportHTML({
      profile, results, overallScore, priorities, level, marketValue, progress, cvAnalysis,
      generatedAt: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }),
    });

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({ error: 'Report generation failed' }, { status: 500 });
  }
}

function generateReportHTML({ profile, results, overallScore, priorities, level, marketValue, progress, cvAnalysis, generatedAt }) {
  const scoreBar = (score) => {
    const cls = classifyScore(score);
    return `<div style="display:flex;align-items:center;gap:12px">
      <div style="flex:1;height:8px;background:#E5E5EA;border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${score}%;background:${cls.color};border-radius:4px"></div>
      </div>
      <span style="font-weight:600;color:${cls.color};min-width:40px;text-align:right">${Math.round(score)}%</span>
    </div>`;
  };

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Karriere-Report — ${profile?.name || 'Teilnehmer'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Instrument Sans', -apple-system, sans-serif; color: #1D1D1F; line-height: 1.6; background: white; }
    .page { max-width: 800px; margin: 0 auto; padding: 48px; }
    h1 { font-size: 32px; font-weight: 700; letter-spacing: -0.03em; margin-bottom: 8px; }
    h2 { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin: 40px 0 16px; padding-bottom: 8px; border-bottom: 2px solid #CC1426; }
    h3 { font-size: 17px; font-weight: 600; margin: 16px 0 8px; }
    .header { text-align: center; padding-bottom: 32px; border-bottom: 1px solid #E5E5EA; margin-bottom: 32px; }
    .logo { font-size: 12px; font-weight: 600; letter-spacing: 0.12em; color: #CC1426; text-transform: uppercase; margin-bottom: 16px; }
    .meta { color: #86868B; font-size: 14px; }
    .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }
    .stat { background: #F5F5F7; border-radius: 12px; padding: 16px; text-align: center; }
    .stat-value { font-size: 28px; font-weight: 700; letter-spacing: -0.03em; }
    .stat-label { font-size: 12px; color: #86868B; margin-top: 4px; }
    .field-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #F2F2F7; }
    .field-icon { font-size: 20px; width: 32px; text-align: center; }
    .field-title { flex: 1; font-weight: 500; font-size: 15px; }
    .prio-badge { display: inline-block; padding: 2px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; background: rgba(204,20,38,0.08); color: #CC1426; }
    .recommendation { background: #F5F5F7; border-radius: 12px; padding: 16px; margin: 8px 0; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #E5E5EA; text-align: center; color: #AEAEB2; font-size: 12px; }
    @media print { body { -webkit-print-color-adjust: exact; } .page { padding: 24px; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo">Karriere-Institut</div>
      <h1>Karriere-Report</h1>
      <div class="meta">${profile?.name || 'Teilnehmer'} — ${generatedAt}</div>
    </div>

    <div class="stat-grid">
      <div class="stat">
        <div class="stat-value" style="color:#CC1426">${Math.round(overallScore)}%</div>
        <div class="stat-label">Gesamtscore</div>
      </div>
      <div class="stat">
        <div class="stat-value">€${Math.round(marketValue / 1000)}k</div>
        <div class="stat-label">Marktwert</div>
      </div>
      <div class="stat">
        <div class="stat-value">${(progress || []).length}</div>
        <div class="stat-label">Lektionen</div>
      </div>
      <div class="stat">
        <div class="stat-value">${level.icon}</div>
        <div class="stat-label">${level.title}</div>
      </div>
    </div>

    <h2>Kompetenzprofil</h2>
    ${(results || []).map((r, i) => `
      <div class="field-row">
        <div class="field-icon">${r.competency_fields?.icon || '○'}</div>
        <div class="field-title">${r.competency_fields?.title || 'Feld'}</div>
        ${i < 3 ? `<span class="prio-badge">PRIO ${i + 1}</span>` : ''}
        <div style="width:200px">${scoreBar(r.score)}</div>
      </div>
    `).join('')}

    <h2>Fokus-Empfehlungen</h2>
    ${priorities.prio1 ? `<div class="recommendation">
      <h3>🔴 PRIO 1: ${priorities.prio1.title} (${Math.round(priorities.prio1.score)}%)</h3>
      <p>Dieses Feld hat das größte Verbesserungspotenzial und den höchsten Impact auf deinen Marktwert. Starte hier mit dem Masterclass-Modul.</p>
    </div>` : ''}
    ${priorities.prio2 ? `<div class="recommendation">
      <h3>🟡 PRIO 2: ${priorities.prio2.title} (${Math.round(priorities.prio2.score)}%)</h3>
      <p>Parallel zu PRIO 1 entwickeln — beide Felder verstärken sich gegenseitig.</p>
    </div>` : ''}
    ${priorities.prio3 ? `<div class="recommendation">
      <h3>🟢 PRIO 3: ${priorities.prio3.title} (${Math.round(priorities.prio3.score)}%)</h3>
      <p>Solide Basis vorhanden — mit gezieltem Training auf Top-Niveau bringbar.</p>
    </div>` : ''}

    ${cvAnalysis ? `
    <h2>Lebenslauf-Analyse (KI)</h2>
    <div class="recommendation">
      <h3>✅ Stärken</h3>
      <ul>${(cvAnalysis.strengths || []).map(s => `<li>${s}</li>`).join('')}</ul>
    </div>
    <div class="recommendation">
      <h3>🔧 Optimierungspotenzial</h3>
      <ul>${(cvAnalysis.improvements || []).map(s => `<li>${s}</li>`).join('')}</ul>
    </div>
    <div class="recommendation">
      <h3>🔑 Fehlende Keywords</h3>
      <p>${(cvAnalysis.missingKeywords || []).join(', ')}</p>
    </div>
    ` : ''}

    <h2>Marktwert-Entwicklung</h2>
    <div class="recommendation">
      <p><strong>Aktuelles Gehalt:</strong> €${(profile?.current_salary || 50000).toLocaleString('de-DE')}</p>
      <p><strong>Aktueller Marktwert:</strong> €${Math.round(marketValue).toLocaleString('de-DE')}</p>
      <p><strong>Zielgehalt:</strong> €${(profile?.target_salary || 120000).toLocaleString('de-DE')}</p>
      <p><strong>Skill-Bonus durch Masterclass:</strong> +€${Math.round(marketValue - (profile?.current_salary || 50000)).toLocaleString('de-DE')}</p>
    </div>

    <div class="footer">
      <div class="logo">Karriere-Institut</div>
      <p>Dieser Report wurde automatisch generiert basierend auf deiner Karriereanalyse.</p>
      <p>© ${new Date().getFullYear()} Karriere-Institut — daskarriereinstitut.de</p>
    </div>
  </div>
</body>
</html>`;
}
