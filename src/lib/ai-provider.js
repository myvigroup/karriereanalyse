/**
 * KARRIERE-INSTITUT — AI Provider
 *
 * Unterstützt Claude (Anthropic) und ChatGPT (OpenAI).
 * Priorität: ANTHROPIC_API_KEY → OPENAI_API_KEY → Mock
 */

// ============================================================
// PROVIDER DETECTION
// ============================================================
function getProvider() {
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return null;
}

// ============================================================
// UNIFIED COMPLETION CALL
// ============================================================
async function callAI({ system, userMessage, maxTokens = 2000 }) {
  const provider = getProvider();

  if (provider === 'anthropic') {
    return callAnthropic({ system, userMessage, maxTokens });
  }
  if (provider === 'openai') {
    return callOpenAI({ system, userMessage, maxTokens });
  }
  return null;
}

async function callAnthropic({ system, userMessage, maxTokens }) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });
    if (!response.ok) {
      const errBody = await response.text();
      console.error('[ai-provider] Anthropic HTTP', response.status, errBody);
      return null;
    }
    const data = await response.json();
    return data.content?.[0]?.text || null;
  } catch (e) {
    console.error('[ai-provider] Anthropic error:', e);
    return null;
  }
}

async function callOpenAI({ system, userMessage, maxTokens }) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userMessage },
        ],
      }),
    });
    if (!response.ok) {
      const errBody = await response.text();
      console.error('[ai-provider] OpenAI HTTP', response.status, errBody);
      return null;
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (e) {
    console.error('[ai-provider] OpenAI error:', e);
    return null;
  }
}

function parseJSON(text) {
  if (!text) return null;
  try {
    const clean = text.replace(/```json[\s\S]*?```|```[\s\S]*?```/g, m =>
      m.replace(/```json|```/g, '')
    ).trim();
    return JSON.parse(clean);
  } catch {
    return null;
  }
}

// ============================================================
// CV-ANALYSE FÜR MESSE / SELF-UPLOAD (Struktur/Inhalt/Design/Wirkung)
// ============================================================
export async function analyzeCVForFair(cvText, targetPosition) {
  const provider = getProvider();
  if (!provider) {
    console.warn('[ai-provider] Kein API-Key — verwende Mock-Analyse');
    return getMockFairAnalysis();
  }

  const system = `Du bist ein erfahrener Karrierecoach auf einer Karrieremesse. Du bist kompetent in ALLEN Branchen — von MINT/Technik (IT, Ingenieurwesen, Naturwissenschaften, Mathematik) bis BWL, Soziales und Kreativberufe. Analysiere den Lebenslauf${targetPosition ? ` speziell im Hinblick auf die Zielstelle "${targetPosition}"` : ''} branchenspezifisch und gib strukturiertes Feedback.

Antworte NUR als valides JSON-Objekt ohne Markdown-Backticks. Format:
{
  "overallRating": 3,
  "summary": "2-3 Sätze Gesamteinschätzung",
  "categories": {
    "struktur": { "rating": 3, "selectedPresets": ["Klarer chronologischer Aufbau"], "comment": "Kurzer Kommentar" },
    "inhalt": { "rating": 3, "selectedPresets": ["Relevante Erfahrungen gut hervorgehoben"], "comment": "Kurzer Kommentar" },
    "design": { "rating": 3, "selectedPresets": ["Professionelles, modernes Layout"], "comment": "Kurzer Kommentar" },
    "wirkung": { "rating": 3, "selectedPresets": ["Starker erster Eindruck"], "comment": "Kurzer Kommentar" }
  }
}

WICHTIG: selectedPresets NUR aus dieser Liste:
Struktur: "Klarer chronologischer Aufbau", "Chronologische Lücken vorhanden", "Übersichtliche Gliederung", "Zu unübersichtlich / überladen", "Kontaktdaten vollständig", "Kontaktdaten unvollständig", "Gute Länge (1-2 Seiten)", "Zu lang / zu kurz"
Inhalt: "Relevante Erfahrungen gut hervorgehoben", "Wichtige Erfahrungen fehlen oder sind versteckt", "Kompetenzen klar formuliert", "Kompetenzen zu vage beschrieben", "Messbare Erfolge genannt", "Keine konkreten Ergebnisse / Zahlen", "Gute Keyword-Optimierung", "Keywords für Zielbranche fehlen", "Technische Skills gut dargestellt", "Fachspezifische Zertifizierungen/Tools fehlen", "Projekterfahrung konkret beschrieben", "Branchenspezifische Fachbegriffe fehlen"
Design: "Professionelles, modernes Layout", "Layout veraltet oder unprofessionell", "Gute Lesbarkeit und Schriftgröße", "Schwer lesbar / zu kleine Schrift", "Konsistente Formatierung", "Inkonsistente Formatierung", "Angemessenes Foto", "Foto fehlt oder unvorteilhaft"
Wirkung: "Starker erster Eindruck", "Erster Eindruck verbesserungswürdig", "Persönlichkeit kommt rüber", "Wirkt austauschbar / generisch", "Klare Positionierung erkennbar", "Positionierung unklar", "Motivierender Gesamteindruck", "Gesamteindruck eher schwach"

Ratings 1-5. Sei ehrlich aber konstruktiv.`;

  const userMessage = `Analysiere diesen Lebenslauf${targetPosition ? ` für die Zielstelle: "${targetPosition}"` : ''}:\n\n${cvText.substring(0, 8000)}`;

  const text = await callAI({ system, userMessage, maxTokens: 2500 });
  const result = parseJSON(text);
  return result || getMockFairAnalysis();
}

// ============================================================
// CV-ANALYSE MIT KI (Stärken / Verbesserungen / Keywords)
// ============================================================
export async function analyzeCVWithAI(cvText, careerGoal, analysisScores = {}) {
  const provider = getProvider();
  if (!provider) {
    console.warn('[ai-provider] Kein API-Key — verwende Mock-Analyse');
    return getMockCVAnalysis(careerGoal);
  }

  const system = `Du bist ein erfahrener Executive-Headhunter und Karrierecoach für den deutschsprachigen Markt.
Analysiere Lebensläufe strategisch und gib konkretes, umsetzbares Feedback.
Antworte NUR als valides JSON-Objekt ohne Markdown-Backticks.
Format:
{
  "strengths": ["Stärke 1", "Stärke 2", "Stärke 3"],
  "improvements": ["Verbesserung 1 mit konkretem Tipp", "Verbesserung 2"],
  "missingKeywords": ["Keyword 1", "Keyword 2", "Keyword 3"],
  "summary": "2-3 Sätze Gesamtbewertung",
  "score": 65
}`;

  const userMessage = `Analysiere diesen Lebenslauf für das Karriereziel "${careerGoal || 'Führungsposition'}".\n\nLEBENSLAUF:\n${cvText.substring(0, 8000)}\n\nGib mir:\n1. Die 3 größten Stärken\n2. Die 3 wichtigsten Verbesserungsvorschläge\n3. 5 fehlende Keywords für ATS-Systeme\n4. Eine Gesamtbewertung (2-3 Sätze)\n5. Einen Score von 0-100\n\nNur JSON.`;

  const text = await callAI({ system, userMessage, maxTokens: 2000 });
  const result = parseJSON(text);
  return result || getMockCVAnalysis(careerGoal);
}

// ============================================================
// COACHING INSIGHTS
// ============================================================
export async function generateCoachingInsights(analysisResults, profile) {
  const provider = getProvider();
  if (!provider) return getMockCoachingInsights(analysisResults);

  const scores = analysisResults.map(r => `${r.title}: ${r.score}%`).join('\n');
  const system = 'Du bist ein Karrierecoach. Gib strategische Empfehlungen basierend auf dem Kompetenzprofil. Antworte NUR als JSON.';
  const userMessage = `Kompetenzprofil von ${profile?.name || 'Coachee'}:\n${scores}\n\nKarriereziel: ${profile?.career_goal || 'Nicht definiert'}\n\nJSON-Format:\n{\n  "recommendations": ["3 strategische Empfehlungen"],\n  "nextSteps": ["3 konkrete nächste Schritte"],\n  "focusAreas": ["Die 2 wichtigsten Fokus-Bereiche"]\n}`;

  const text = await callAI({ system, userMessage, maxTokens: 1500 });
  const result = parseJSON(text);
  return result || getMockCoachingInsights(analysisResults);
}

// ============================================================
// IMAGE TEXT EXTRACTION (Vision)
// ============================================================
export async function extractTextFromImageAI(buffer, filename) {
  const base64 = buffer.toString('base64');
  const ext = filename?.split('.')?.pop()?.toLowerCase();
  const mediaType = ext === 'png' ? 'image/png' : 'image/jpeg';

  // Try Anthropic Vision
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
              { type: 'text', text: 'Extrahiere den kompletten Text aus diesem Lebenslauf-Bild. Nur den Text, keine Kommentare.' },
            ],
          }],
        }),
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      if (text.length > 20) return text;
    } catch (e) {
      console.error('[ai-provider] Anthropic vision error:', e);
    }
  }

  // Try OpenAI Vision
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: `data:${mediaType};base64,${base64}` } },
              { type: 'text', text: 'Extrahiere den kompletten Text aus diesem Lebenslauf-Bild. Nur den Text, keine Kommentare.' },
            ],
          }],
        }),
      });
      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (e) {
      console.error('[ai-provider] OpenAI vision error:', e);
    }
  }

  return '';
}

// ============================================================
// MOCK RESPONSES
// ============================================================
function getMockFairAnalysis() {
  return {
    overallRating: 3,
    summary: 'Der Lebenslauf bietet eine solide Basis, hat aber Optimierungspotenzial in Struktur und Wirkung.',
    categories: {
      struktur: { rating: 3, selectedPresets: ['Klarer chronologischer Aufbau', 'Gute Länge (1-2 Seiten)'], comment: 'Grundstruktur ist vorhanden, könnte aber übersichtlicher sein.' },
      inhalt: { rating: 3, selectedPresets: ['Relevante Erfahrungen gut hervorgehoben', 'Keine konkreten Ergebnisse / Zahlen'], comment: 'Erfahrungen sind relevant, aber es fehlen messbare Erfolge.' },
      design: { rating: 3, selectedPresets: ['Gute Lesbarkeit und Schriftgröße'], comment: 'Design ist funktional, könnte moderner wirken.' },
      wirkung: { rating: 3, selectedPresets: ['Erster Eindruck verbesserungswürdig', 'Positionierung unklar'], comment: 'Der CV wirkt noch etwas generisch.' },
    },
  };
}

function getMockCVAnalysis(careerGoal) {
  return {
    strengths: [
      'Klare Struktur und chronologischer Aufbau',
      'Relevante Berufserfahrung für die Zielposition',
      'Messbare Erfolge in bisherigen Positionen',
    ],
    improvements: [
      'Executive Summary ergänzen: Beginne mit einem 3-Satz-Profil, das dein Alleinstellungsmerkmal beschreibt.',
      'Erfolge quantifizieren: Statt "Umsatz gesteigert" → "Umsatz um 35% in 12 Monaten gesteigert".',
      'Keywords für ATS optimieren: Branchenspezifische Begriffe aus aktuellen Stellenausschreibungen einbauen.',
    ],
    missingKeywords: ['Stakeholder Management', 'P&L Verantwortung', 'Digital Transformation', 'OKR / KPI Framework', 'Change Management'],
    summary: `Der Lebenslauf bietet eine solide Basis für ${careerGoal || 'eine Führungsposition'}. Mit gezielter Optimierung der Keywords steigt die Einladungsquote deutlich.`,
    score: 62,
  };
}

function getMockCoachingInsights(analysisResults) {
  const sorted = [...(analysisResults || [])].sort((a, b) => a.score - b.score);
  const weakest = sorted[0]?.title || 'Verhandlung';
  const secondWeakest = sorted[1]?.title || 'Selbstmarketing';
  return {
    recommendations: [
      `Priorität auf ${weakest} legen — hier liegt das größte Steigerungspotenzial.`,
      `${secondWeakest} parallel entwickeln, da beide Felder synergetisch wirken.`,
      'LinkedIn-Profil optimieren — schnellster Hebel für Sichtbarkeit.',
    ],
    nextSteps: [
      `Masterclass-Modul "${weakest}" diese Woche starten`,
      'Lebenslauf mit den KI-Empfehlungen überarbeiten',
      '3 relevante Kontakte auf LinkedIn ansprechen',
    ],
    focusAreas: [weakest, secondWeakest],
  };
}

export { callAI, parseJSON };
export default { callAI, parseJSON, analyzeCVWithAI, analyzeCVForFair, generateCoachingInsights, extractTextFromImageAI };
