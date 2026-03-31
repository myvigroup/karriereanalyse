import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rateCheck = await checkRateLimit(supabase, user.id, 'generate-application');
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit erreicht. Versuche es später erneut.' }, { status: 429 });
    }

    const { company, position } = await request.json();
    if (!company || !position) {
      return NextResponse.json({ error: 'Company and position required' }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('name, first_name, last_name, industry, experience_years, current_salary')
      .eq('id', user.id)
      .single();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(getMockApplication(company, position, profile));
    }

    const prompt = `Erstelle ein professionelles Anschreiben auf Deutsch für folgende Bewerbung:

Firma: ${company}
Position: ${position}
Bewerber: ${profile?.first_name || ''} ${profile?.last_name || ''}
Branche: ${profile?.industry || 'nicht angegeben'}
Erfahrung: ${profile?.experience_years || 'nicht angegeben'} Jahre

Regeln:
- Maximal 300 Wörter
- Professionell aber persönlich
- Keine Floskeln wie "hiermit bewerbe ich mich"
- Konkreter Bezug zur Position
- Schließe mit einem klaren Call-to-Action

Gib auch eine Betreffzeile an.

Format:
BETREFF: [Betreffzeile]
---
[Anschreiben]`;

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
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const parts = text.split('---');
      const subjectLine = (parts[0] || '').replace('BETREFF:', '').trim();
      const coverLetter = (parts[1] || text).trim();
      return NextResponse.json({ cover_letter: coverLetter, subject_line: subjectLine });
    } catch {
      return NextResponse.json(getMockApplication(company, position, profile));
    }
  } catch (error) {
    console.error('Generate application error:', error);
    return NextResponse.json({ error: 'Fehler bei der Generierung' }, { status: 500 });
  }
}

function getMockApplication(company, position, profile) {
  const name = `${profile?.first_name || 'Max'} ${profile?.last_name || 'Mustermann'}`;
  return {
    cover_letter: `Sehr geehrte Damen und Herren,\n\nmit großem Interesse habe ich die Ausschreibung für die Position als ${position} bei ${company} gelesen. Mit ${profile?.experience_years || 'mehreren'} Jahren Berufserfahrung in der Branche ${profile?.industry || ''} bringe ich die idealen Voraussetzungen mit.\n\nIch freue mich auf ein persönliches Gespräch.\n\nMit freundlichen Grüßen\n${name}`,
    subject_line: `Bewerbung als ${position} bei ${company}`,
  };
}
