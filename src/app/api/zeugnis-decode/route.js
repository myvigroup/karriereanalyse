import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rateCheck = await checkRateLimit(supabase, user.id, 'zeugnis-decode');
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit erreicht. Versuche es später erneut.' }, { status: 429 });
    }

    const { text } = await request.json();
    if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(getMockDecode(text));
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [{
            role: 'user',
            content: `Analysiere das folgende deutsche Arbeitszeugnis und entschlüssle die Geheimcodes.

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
- "hat sich bemüht" = Note 6`,
          }],
        }),
      });
      const data = await response.json();
      const content = data.content?.[0]?.text || '';
      try {
        return NextResponse.json(JSON.parse(content));
      } catch {
        return NextResponse.json({ decoded_phrases: [], overall_grade: 0, summary: content });
      }
    } catch {
      return NextResponse.json(getMockDecode(text));
    }
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
  if (text.includes('bemüht')) phrases.push({ original: 'hat sich bemüht', meaning: 'Ungenügende Leistung', grade: 6 });
  return {
    decoded_phrases: phrases.length > 0 ? phrases : [{ original: 'Textanalyse', meaning: 'Detaillierte Analyse benötigt API-Key', grade: 0 }],
    overall_grade: phrases.length > 0 ? phrases[0].grade : 0,
    summary: 'Für eine detaillierte Analyse wird der API-Key benötigt.',
  };
}
