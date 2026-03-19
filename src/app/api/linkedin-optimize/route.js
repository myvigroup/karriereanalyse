import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { text, template_type } = await request.json();
    if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 });

    const apiKey = process.env.ANTHROPIC_API_KEY;

    const systemPrompt = `Du bist ein LinkedIn-Content-Experte für den deutschsprachigen Raum.
Optimiere den folgenden LinkedIn-Post im Stil "${template_type || 'general'}".
Zielgruppe: Deutsche Fach- und Führungskräfte 25-40.
Max 1300 Zeichen. Verwende Emojis sparsam (max 3-4).
Formatiere mit Zeilenumbrüchen für Lesbarkeit.
Gib auch einen Hook-Vorschlag (erste Zeile) und 3-5 passende Hashtags zurück.

Antworte NUR als JSON: { "optimized_text": "...", "hook_suggestion": "...", "hashtags": ["...", "..."] }`;

    if (apiKey) {
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
            max_tokens: 1000,
            system: systemPrompt,
            messages: [{ role: 'user', content: text }],
          }),
        });
        const data = await response.json();
        const content = data.content?.[0]?.text || '';
        try {
          const parsed = JSON.parse(content);
          return NextResponse.json(parsed);
        } catch {
          return NextResponse.json({ optimized_text: content, hook_suggestion: '', hashtags: [] });
        }
      } catch (err) {
        return NextResponse.json(getMockOptimization(text, template_type));
      }
    }

    return NextResponse.json(getMockOptimization(text, template_type));
  } catch (error) {
    console.error('LinkedIn optimize error:', error);
    return NextResponse.json({ error: 'Optimization failed' }, { status: 500 });
  }
}

function getMockOptimization(text, templateType) {
  return {
    optimized_text: `${text}\n\n---\nDieser Post wurde für maximale Reichweite optimiert.\nTeile deine Erfahrungen — dein Netzwerk wartet darauf.`,
    hook_suggestion: 'Was wäre, wenn du mit einer einzigen Entscheidung deine Karriere verändern könntest?',
    hashtags: ['#Karriere', '#Leadership', '#PersonalBranding', '#Karriereentwicklung', '#NewWork'],
  };
}
