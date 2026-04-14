import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { callAI } from '@/lib/ai-provider';

export async function POST(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rateCheck = await checkRateLimit(supabase, user.id, 'generate-application');
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit erreicht. Versuche es sp\u00E4ter erneut.' }, { status: 429 });
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
      const text = await callAI({ system: 'Du bist ein erfahrener Bewerbungscoach.', userMessage: prompt, maxTokens: 1024 });
      if (text) {
        const parts = text.split('---');
        const subjectLine = (parts[0] || '').replace('BETREFF:', '').trim();
        const coverLetter = (parts[1] || text).trim();
        return NextResponse.json({ cover_letter: coverLetter, subject_line: subjectLine });
      }
      return NextResponse.json(getMockApplication(company, position, profile));
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
    cover_letter: `Sehr geehrte Damen und Herren,\n\nmit gro\u00DFem Interesse habe ich die Ausschreibung f\u00FCr die Position als ${position} bei ${company} gelesen. Mit ${profile?.experience_years || 'mehreren'} Jahren Berufserfahrung in der Branche ${profile?.industry || ''} bringe ich die idealen Voraussetzungen mit.\n\nIch freue mich auf ein pers\u00F6nliches Gespr\u00E4ch.\n\nMit freundlichen Gr\u00FC\u00DFen\n${name}`,
    subject_line: `Bewerbung als ${position} bei ${company}`,
  };
}
