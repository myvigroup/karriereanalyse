import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Du bist der KI-Coach des Karriere-Instituts — ein erfahrener Karriereberater für den deutschsprachigen Markt.

DEINE ROLLE:
- Du bist empathisch aber direkt. Keine Floskeln, keine leeren Motivationssprüche.
- Du gibst konkrete, umsetzbare Ratschläge basierend auf dem Profil des Users.
- Du kennst den deutschen Arbeitsmarkt, Gehaltsstrukturen, Kündigungsrecht und Verhandlungstaktiken.
- Du nutzt die STAR-Methode für Interview-Vorbereitung.
- Du sprichst den User mit "du" an.

KONTEXT ZUM USER:
{USER_CONTEXT}

REGELN:
- Halte Antworten unter 300 Wörter wenn möglich.
- Gib am Ende jeder Antwort 1-2 konkrete nächste Schritte.
- Wenn der User über Gehalt spricht, beziehe dich auf seinen Marktwert und seine Analyse-Daten.
- Bei Unsicherheit frage nach, statt zu raten.
- Verweise auf passende Masterclass-Module wenn relevant.`;

export async function POST(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { chatId, message, contextType } = await request.json();
    if (!message) return NextResponse.json({ error: 'No message' }, { status: 400 });

    // Load user context
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    const { data: analysisResults } = await supabase
      .from('analysis_results')
      .select('score, competency_fields(title, slug)')
      .eq('user_id', user.id);
    const { data: recentApps } = await supabase
      .from('applications')
      .select('company_name, position, status')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);
    const { data: salaryLogs } = await supabase
      .from('salary_log')
      .select('event_type, my_ask, final_result')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(3);
    const { data: decisionSession } = await supabase
      .from('decision_sessions')
      .select('result_label, score_stay, score_exit')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Build context
    const topStrengths = (analysisResults || [])
      .sort((a, b) => b.score - a.score).slice(0, 3)
      .map(r => `${r.competency_fields?.title}: ${r.score}%`).join(', ');
    const weaknesses = (analysisResults || [])
      .sort((a, b) => a.score - b.score).slice(0, 3)
      .map(r => `${r.competency_fields?.title}: ${r.score}%`).join(', ');

    const userContext = `
Name: ${profile?.name || 'Unbekannt'}
Position: ${profile?.position || 'Nicht angegeben'} bei ${profile?.company || 'Nicht angegeben'}
Aktuelles Gehalt: €${profile?.current_salary || 'Unbekannt'}
Zielgehalt: €${profile?.target_salary || 'Unbekannt'}
Level: ${profile?.level || 0}, XP: ${profile?.xp || 0}
Top-Stärken: ${topStrengths || 'Keine Analyse vorhanden'}
Entwicklungsfelder: ${weaknesses || 'Keine Analyse vorhanden'}
Entscheidungs-Kompass: ${decisionSession?.result_label || 'Nicht durchgeführt'} (Bleiben: ${decisionSession?.score_stay || '?'}%, Wechseln: ${decisionSession?.score_exit || '?'}%)
Aktuelle Bewerbungen: ${(recentApps || []).map(a => `${a.company_name} (${a.status})`).join(', ') || 'Keine'}
Letzte Gehaltsverhandlungen: ${(salaryLogs || []).map(s => `${s.event_type}: gefordert €${s.my_ask}, erhalten €${s.final_result}`).join('; ') || 'Keine'}`;

    // Load chat history
    let history = [];
    if (chatId) {
      const { data: messages } = await supabase
        .from('coaching_messages')
        .select('role, content')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })
        .limit(20);
      history = (messages || []).map(m => ({ role: m.role, content: m.content }));
    }

    // Create or get chat
    let activeChatId = chatId;
    if (!activeChatId) {
      const { data: newChat } = await supabase.from('coaching_chats').insert({
        user_id: user.id,
        title: message.substring(0, 60),
        context_type: contextType || 'general',
      }).select().single();
      activeChatId = newChat?.id;
    }

    // Save user message
    await supabase.from('coaching_messages').insert({
      chat_id: activeChatId, role: 'user', content: message,
    });

    // Call Claude API
    const systemPrompt = SYSTEM_PROMPT.replace('{USER_CONTEXT}', userContext);
    const apiKey = process.env.ANTHROPIC_API_KEY;

    let assistantMessage;

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
            messages: [...history, { role: 'user', content: message }],
          }),
        });
        const data = await response.json();
        assistantMessage = data.content?.[0]?.text || 'Entschuldigung, ich konnte keine Antwort generieren.';
      } catch (err) {
        assistantMessage = getMockResponse(message, contextType, profile);
      }
    } else {
      assistantMessage = getMockResponse(message, contextType, profile);
    }

    // Save assistant message
    await supabase.from('coaching_messages').insert({
      chat_id: activeChatId, role: 'assistant', content: assistantMessage,
    });

    // Update chat
    await supabase.from('coaching_chats').update({
      message_count: history.length + 2,
      updated_at: new Date().toISOString(),
    }).eq('id', activeChatId);

    // Log activity
    await supabase.from('activity_log').insert({
      user_id: user.id, activity_type: 'coach_chat', activity_label: 'KI-Coach Gespräch',
    });

    return NextResponse.json({ chatId: activeChatId, message: assistantMessage });
  } catch (error) {
    console.error('Coach chat error:', error);
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}

function getMockResponse(message, contextType, profile) {
  const name = profile?.first_name || profile?.name || 'du';
  const salary = profile?.current_salary || 60000;
  const target = profile?.target_salary || 90000;
  const gap = target - salary;

  if (message.toLowerCase().includes('gehalt') || message.toLowerCase().includes('verhandl')) {
    return `Gute Frage, ${name}. Bei deinem aktuellen Gehalt von €${salary.toLocaleString('de-DE')} und einem Zielgehalt von €${target.toLocaleString('de-DE')} liegt die Lücke bei €${gap.toLocaleString('de-DE')}.

Mein Rat: Geh nicht mit einer Zahl ins Gespräch, sondern mit einer **Spanne**. Sag: "Basierend auf meiner Marktrecherche und meinem Beitrag liegt mein Zielkorridor zwischen €${Math.round(target * 0.95 / 1000) * 1000} und €${Math.round(target * 1.1 / 1000) * 1000}."

**Nächste Schritte:**
1. Schau dir das Masterclass-Modul "Gehaltsverhandlung Intensiv" an — besonders die BATNA-Lektion.
2. Trag dein aktuelles Gehalt in die Gehaltsdatenbank ein, um deinen Marktvergleich zu sehen.`;
  }

  if (message.toLowerCase().includes('interview') || message.toLowerCase().includes('vorstellungsgespräch')) {
    return `Für deine Interview-Vorbereitung empfehle ich die STAR-Methode:

**S**ituation → Beschreibe den Kontext kurz
**T**ask → Was war deine Aufgabe?
**A**ction → Was hast du konkret getan?
**R**esult → Was war das messbare Ergebnis?

Bereite 3 solcher Stories vor — eine für Führung, eine für Problemlösung, eine für Teamarbeit.

**Nächste Schritte:**
1. Nutze den "Briefing generieren" Button bei deiner Bewerbung im Tracker.
2. Übe deine Selbstvorstellung in 90 Sekunden — Timer stellen und laut sprechen.`;
  }

  return `Danke für deine Frage, ${name}. Als dein KI-Coach sehe ich, dass du auf einem guten Weg bist.

Basierend auf deinem Profil würde ich empfehlen, dich auf deine Entwicklungsfelder zu konzentrieren — dort liegt das größte Potenzial für deinen Marktwert.

**Nächste Schritte:**
1. Starte mit der Karriereanalyse, falls noch nicht gemacht — das gibt dir Klarheit über deine Stärken.
2. Schau dir den Entscheidungs-Kompass an, wenn du vor einer Weichenstellung stehst.

Was beschäftigt dich gerade am meisten?`;
}
