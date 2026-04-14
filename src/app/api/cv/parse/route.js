import { runCVAnalysis } from '@/lib/cv-analysis-worker';
import { NextResponse } from 'next/server';



export const maxDuration = 60;

export async function POST(request) {
  try {
    const { documentId, feedbackId, targetPosition } = await request.json();
    if (!documentId) {
      return NextResponse.json({ error: 'documentId fehlt' }, { status: 400 });
    }

    const result = await runCVAnalysis({ documentId, feedbackId, targetPosition });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('CV Parse Error:', error);
    return NextResponse.json({ error: 'Parsing fehlgeschlagen: ' + error.message }, { status: 500 });
  }
}
