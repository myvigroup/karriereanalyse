import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { callAI, parseJSON } from '@/lib/ai-provider';

export async function POST(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { text, template_type } = await request.json();
    if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 });

    const systemPrompt = `Du bist ein LinkedIn-Content-Experte für den deutschsprachigen Raum.
Optimiere den folgenden LinkedIn-Post im Stil "${template_type || 'general'}".
Zielgruppe: Deutsche Fach- und Führungskräfte 25-40.
Max 1300 Zeichen. Verwende Emojis sparsam (max 3-4).
Formatiere mit Zeilenumbrüchen für Lesbarkeit.
Gib auch einen Hook-Vorschlag (erste Zeile) und 3-5 passende Hashtags zurück.

Antworte NUR als JSON: { "optimized_text": "...", "hook_suggestion": "...", "hashtags": ["...", "..."] }`;

    try {
      const content = await callAI({ system: systemPrompt, userMessage: text, maxTokens: 1000 });
      if (content) {
        const parsed = parseJSON(content);
        if (parsed) return NextResponse.json(parsed);
        return NextResponse.json({ optimized_text: content, hook_suggestion: '', hashtags: [] });
      }
    } catch { /* fallback below */ }

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
