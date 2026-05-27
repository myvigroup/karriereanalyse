'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht angemeldet');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin'].includes(profile.role)) throw new Error('Keine Berechtigung (nur Admin)');
  return supabase;
}

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function saveAdvisor(payload) {
  const supabase = await requireAdmin();
  if (!payload.display_name) throw new Error('Name fehlt');
  if (!payload.email) throw new Error('E-Mail fehlt');

  let slug = (payload.slug || '').trim().toLowerCase();
  if (!slug) slug = slugify(payload.display_name);

  // Unique-Check: falls Slug schon belegt (von anderem Berater), -2 etc. anhängen
  let finalSlug = slug;
  let attempt = 1;
  while (true) {
    const { data: clash } = await supabase
      .from('advisors').select('id').ilike('slug', finalSlug)
      .neq('id', payload.id || '00000000-0000-0000-0000-000000000000')
      .maybeSingle();
    if (!clash) break;
    attempt += 1;
    finalSlug = `${slug}-${attempt}`;
  }

  const dbPayload = {
    display_name: payload.display_name,
    email: payload.email,
    phone: payload.phone || null,
    status: payload.status || 'active',
    slug: finalSlug,
  };

  if (payload.id) {
    const { error } = await supabase.from('advisors').update(dbPayload).eq('id', payload.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('advisors').insert(dbPayload);
    if (error) throw new Error(error.message);
  }
  revalidatePath('/admin/advisors');
  return { ok: true, slug: finalSlug };
}

export async function deleteAdvisor(advisorId) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from('advisors').delete().eq('id', advisorId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/advisors');
  return { ok: true };
}

export async function toggleAdvisorStatus(advisorId, status) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from('advisors').update({ status }).eq('id', advisorId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/advisors');
  return { ok: true };
}
