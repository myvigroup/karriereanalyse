import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  // Auth + Admin-Check
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

  const admin = createAdminClient();
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (!['admin', 'coach'].includes(profile?.role)) {
    return NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const courseId = formData.get('courseId');

  if (!file || !courseId) {
    return NextResponse.json({ error: 'Datei und courseId erforderlich' }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Datei zu groß (max. 5 MB)' }, { status: 400 });
  }

  const ext = file.name.split('.').pop().toLowerCase();
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return NextResponse.json({ error: 'Nur JPG, PNG oder WebP' }, { status: 400 });
  }

  try {
    const path = `course-thumbnails/${courseId}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await admin.storage
      .from('public-assets')
      .upload(path, buffer, { upsert: true, contentType: file.type });

    if (upErr) throw new Error(upErr.message);

    const { data: urlData } = admin.storage.from('public-assets').getPublicUrl(path);
    const publicUrl = urlData?.publicUrl + '?v=' + Date.now();

    await admin.from('courses').update({ thumbnail_url: publicUrl }).eq('id', courseId);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('Thumbnail upload error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
