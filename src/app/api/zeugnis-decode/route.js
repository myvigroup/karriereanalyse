import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { callAI, parseJSON } from '@/lib/ai-provider';

export async function POST(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rateCheck = await checkRateLimit(supabase, user.id, 'zeugnis-decode');
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit erreicht. Versuche es sp\u00E4ter erneut.' }, { status: 429 });
    }

    const { text } = await request.json();
    if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 });

    const userPrompt = `Analysiere das folgende deutsche Arbeitszeugnis und entschlüssle die Geheimcodes.

Arbeitszeugnis-Text:
${text}

Antworte NUR als JSON:
{
  "decoded_phrases": [
    { "original": "Originalformulierung", "meaning": "Tatsächliche Bedeutung", "grade": 1-6 }
  ],
  "overall_grade": 1-6,
  "summary": "Zusammenfassung in 2-3 Sätzen"
}

Bekannte Codes:
- "stets zu unserer vollsten Zufriedenheit" = Note 1
- "stets zu unserer vollen Zufriedenheit" = Note 2
- "zu unserer vollen Zufriedenheit" = Note 3
- "zu unserer Zufriedenheit" = Note 4
- "im Großen und Ganzen zu unserer Zufriedenheit" = Note 5
- "hat sich bemüht" = Note 6`;

    try {
      const content = await callAI({ system: 'Du bist ein Experte für deutsche Arbeitszeugnisse.', userMessage: userPrompt, maxTokens: 1500 });
      if (content) {
        const parsed = parseJSON(content);
        if (parsed) return NextResponse.json(parsed);
        return NextResponse.json({ decoded_phrases: [], overall_grade: 0, summary: content });
      }
    } catch { /* fallback below */ }

    return NextResponse.json(getMockDecode(text));
  } catch (error) {
    console.error('Zeugnis decode error:', error);
    return NextResponse.json({ error: 'Decode failed' }, { status: 500 });
  }
}

function getMockDecode(text) {
  const phrases = [];
  if (text.includes('vollsten Zufriedenheit')) phrases.push({ original: 'stets zu unserer vollsten Zufriedenheit', meaning: 'Hervorragende Leistung', grade: 1 });
  if (text.includes('vollen Zufriedenheit')) phrases.push({ original: 'zu unserer vollen Zufriedenheit', meaning: 'Gute Leistung', grade: 2 });
  if (text.includes('Zufriedenheit')) phrases.push({ original: 'zu unserer Zufriedenheit', meaning: 'Befriedigende Leistung', grade: 3 });
  if (text.includes('bem\u00FCht')) phrases.push({ original: 'hat sich bem\u00FCht', meaning: 'Ungen\u00FCgende Leistung', grade: 6 });
  return {
    decoded_phrases: phrases.length > 0 ? phrases : [{ original: 'Textanalyse', meaning: 'Detaillierte Analyse ben\u00F6tigt API-Key', grade: 0 }],
    overall_grade: phrases.length > 0 ? phrases[0].grade : 0,
    summary: 'F\u00FCr eine detaillierte Analyse wird der API-Key ben\u00F6tigt.',
  };
}
