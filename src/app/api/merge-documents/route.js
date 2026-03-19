import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { document_ids } = await request.json();
    if (!document_ids || document_ids.length === 0) {
      return NextResponse.json({ error: 'No documents selected' }, { status: 400 });
    }

    // Load document records
    const { data: docs } = await supabase
      .from('career_documents')
      .select('*')
      .in('id', document_ids)
      .eq('user_id', user.id);

    if (!docs || docs.length === 0) {
      return NextResponse.json({ error: 'No documents found' }, { status: 404 });
    }

    // Download files from Supabase Storage
    const pdfBuffers = [];
    for (const doc of docs) {
      if (!doc.file_path) continue;
      const { data, error } = await supabase.storage
        .from('career-documents')
        .download(doc.file_path);
      if (data) {
        const buffer = await data.arrayBuffer();
        pdfBuffers.push({ name: doc.doc_label, buffer: Buffer.from(buffer) });
      }
    }

    if (pdfBuffers.length === 0) {
      return NextResponse.json({ error: 'No downloadable files' }, { status: 400 });
    }

    // For now, return the first PDF if pdf-lib is not available
    // In production, use pdf-lib to merge
    try {
      const { PDFDocument } = await import('pdf-lib');
      const mergedPdf = await PDFDocument.create();

      for (const { buffer } of pdfBuffers) {
        try {
          const sourcePdf = await PDFDocument.load(buffer);
          const pages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
          pages.forEach(page => mergedPdf.addPage(page));
        } catch (e) {
          // Skip non-PDF files
          console.warn('Skipping non-PDF file:', e.message);
        }
      }

      const mergedBytes = await mergedPdf.save();
      return new NextResponse(mergedBytes, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Bewerbungsmappe.pdf"',
        },
      });
    } catch (e) {
      // pdf-lib not installed, return first file
      return new NextResponse(pdfBuffers[0].buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${pdfBuffers[0].name}.pdf"`,
        },
      });
    }
  } catch (error) {
    console.error('Merge error:', error);
    return NextResponse.json({ error: 'Merge failed' }, { status: 500 });
  }
}
