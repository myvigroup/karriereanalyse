/**
 * KARRIERE-INSTITUT — AI Provider
 * 
 * Verbindung zur Claude API für:
 * - Lebenslauf-Analyse (CV Check)
 * - Karriere-Empfehlungen
 * - Coaching-Insights
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Analysiert einen Lebenslauf-Text mit Claude
 * @param {string} cvText - Extrahierter Text aus dem CV-PDF
 * @param {string} careerGoal - Das Karriereziel des Users
 * @param {Object} analysisScores - Kompetenz-Scores für Kontext
 * @returns {Object} { strengths: string[], improvements: string[], missingKeywords: string[], summary: string }
 */
export async function analyzeCVWithAI(cvText, careerGoal, analysisScores = {}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY nicht gesetzt — verwende Mock-Analyse');
    return getMockCVAnalysis(careerGoal);
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: `Du bist ein erfahrener Executive-Headhunter und Karrierecoach für den deutschsprachigen Markt.
Analysiere Lebensläufe strategisch und gib konkretes, umsetzbares Feedback.
Antworte NUR als valides JSON-Objekt ohne Markdown-Backticks.
Format:
{
  "strengths": ["Stärke 1", "Stärke 2", "Stärke 3"],
  "improvements": ["Verbesserung 1 mit konkretem Tipp", "Verbesserung 2"],
  "missingKeywords": ["Keyword 1", "Keyword 2", "Keyword 3"],
  "summary": "2-3 Sätze Gesamtbewertung",
  "score": 65
}`,
        messages: [{
          role: 'user',
          content: `Analysiere diesen Lebenslauf für das Karriereziel "${careerGoal || 'Führungsposition'}".

LEBENSLAUF:
${cvText.substring(0, 8000)}

Gib mir:
1. Die 3 größten Stärken des CVs
2. Die 3 wichtigsten Verbesserungsvorschläge (konkret und umsetzbar)
3. 5 fehlende Keywords die für ATS-Systeme und Headhunter wichtig wären
4. Eine Gesamtbewertung (2-3 Sätze)
5. Einen Score von 0-100

Antworte NUR als JSON-Objekt.`
        }],
      }),
    });

    if (!response.ok) {
      console.error('AI API Error:', response.status);
      return getMockCVAnalysis(careerGoal);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error('AI Analysis failed:', error);
    return getMockCVAnalysis(careerGoal);
  }
}

/**
 * Generiert Coaching-Empfehlungen basierend auf Analyse-Ergebnissen
 * @param {Object[]} analysisResults - Kompetenz-Scores
 * @param {Object} profile - User-Profil
 * @returns {Object} { recommendations: string[], nextSteps: string[], focusAreas: string[] }
 */
export async function generateCoachingInsights(analysisResults, profile) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return getMockCoachingInsights(analysisResults);
  }

  try {
    const scores = analysisResults.map(r => `${r.title}: ${r.score}%`).join('\n');

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: 'Du bist ein Karrierecoach. Gib strategische Empfehlungen basierend auf dem Kompetenzprofil. Antworte NUR als JSON.',
        messages: [{
          role: 'user',
          content: `Kompetenzprofil von ${profile?.name || 'Coachee'}:
${scores}

Karriereziel: ${profile?.career_goal || 'Nicht definiert'}
Aktuelles Gehalt: €${profile?.current_salary || 'Unbekannt'}
Zielgehalt: €${profile?.target_salary || 'Unbekannt'}

Gib mir als JSON:
{
  "recommendations": ["3 strategische Empfehlungen"],
  "nextSteps": ["3 konkrete nächste Schritte"],
  "focusAreas": ["Die 2 wichtigsten Fokus-Bereiche"]
}`
        }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (error) {
    return getMockCoachingInsights(analysisResults);
  }
}

// ============================================================
// MOCK RESPONSES (Wenn kein API Key vorhanden)
// ============================================================

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
    missingKeywords: [
      'Stakeholder Management',
      'P&L Verantwortung',
      'Digital Transformation',
      'OKR / KPI Framework',
      'Change Management',
    ],
    summary: `Der Lebenslauf bietet eine solide Basis für ${careerGoal || 'eine Führungsposition'}. Die Berufserfahrung ist relevant, allerdings fehlt eine klare Positionierung als Führungskraft. Mit gezielter Optimierung der Keywords und einer stärkeren Quantifizierung der Erfolge steigt die Einladungsquote deutlich.`,
    score: 62,
  };
}

function getMockCoachingInsights(analysisResults) {
  const sorted = [...(analysisResults || [])].sort((a, b) => a.score - b.score);
  const weakest = sorted[0]?.title || 'Verhandlung';
  const secondWeakest = sorted[1]?.title || 'Selbstmarketing';

  return {
    recommendations: [
      `Priorität auf ${weakest} legen — hier liegt das größte Steigerungspotenzial für deinen Marktwert.`,
      `${secondWeakest} parallel entwickeln, da beide Felder synergetisch wirken.`,
      'LinkedIn-Profil innerhalb der nächsten 7 Tage optimieren — das ist der schnellste Hebel für Sichtbarkeit.',
    ],
    nextSteps: [
      `Masterclass-Modul "${weakest}" diese Woche starten`,
      'Lebenslauf mit den KI-Empfehlungen überarbeiten',
      '3 relevante Kontakte auf LinkedIn identifizieren und ansprechen',
    ],
    focusAreas: [weakest, secondWeakest],
  };
}

export default {
  analyzeCVWithAI,
  generateCoachingInsights,
};
