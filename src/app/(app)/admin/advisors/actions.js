'use server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
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

function defaultSlugFor(payload) {
  if (payload.email) return slugify(payload.email.split('@')[0]);
  return slugify(payload.display_name);
}

function randomPassword() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(36)).join('').slice(0, 18) + '!aZ9';
}

export async function saveAdvisor(payload) {
  await requireAdmin();
  if (!payload.display_name) throw new Error('Name fehlt');
  if (!payload.email) throw new Error('E-Mail fehlt');

  const admin = createAdminClient();
  const email = payload.email.trim().toLowerCase();

  // Slug bestimmen + unique-check
  let slug = (payload.slug || '').trim().toLowerCase();
  if (!slug) slug = defaultSlugFor({ ...payload, email });
  let finalSlug = slug;
  let attempt = 1;
  while (true) {
    const { data: clash } = await admin
      .from('advisors').select('id').ilike('slug', finalSlug)
      .neq('id', payload.id || '00000000-0000-0000-0000-000000000000')
      .maybeSingle();
    if (!clash) break;
    attempt += 1;
    finalSlug = `${slug}-${attempt}`;
  }

  // === UPDATE bestehender Berater ===
  if (payload.id) {
    const { error } = await admin.from('advisors').update({
      display_name: payload.display_name,
      email,
      phone: payload.phone || null,
      status: payload.status || 'active',
      slug: finalSlug,
    }).eq('id', payload.id);
    if (error) throw new Error(error.message);
    revalidatePath('/admin/advisors');
    return { ok: true, slug: finalSlug };
  }

  // === NEUER BERATER: auth.users + profile + advisor anlegen ===

  // 1) User-Account: suchen oder neu anlegen
  let userId;
  const { data: existingUsers } = await admin.auth.admin.listUsers({ perPage: 500 });
  const existing = (existingUsers?.users || []).find(u => u.email?.toLowerCase() === email);

  if (existing) {
    userId = existing.id;
  } else {
    const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
      email,
      password: randomPassword(),
      email_confirm: true,
      user_metadata: {
        first_name: payload.display_name.split(' ')[0] || '',
        last_name: payload.display_name.split(' ').slice(1).join(' ') || '',
      },
    });
    if (createErr) throw new Error(`Account-Erstellung fehlgeschlagen: ${createErr.message}`);
    userId = newUser.user.id;
  }

  // 2) Profile-Eintrag (Upsert)
  const firstName = payload.display_name.split(' ')[0] || '';
  const lastName = payload.display_name.split(' ').slice(1).join(' ') || '';
  const { error: profileErr } = await admin.from('profiles').upsert({
    id: userId,
    email,
    first_name: firstName,
    last_name: lastName,
    name: payload.display_name,
    avatar_initials: ((firstName[0] || 'U') + (lastName[0] || 'X')).toUpperCase(),
    role: 'advisor',
    onboarding_complete: true,
  }, { onConflict: 'id' });
  if (profileErr) throw new Error(`Profil-Erstellung fehlgeschlagen: ${profileErr.message}`);

  // 3) Advisor-Eintrag — falls schon existent (Email-Match), update statt insert
  const { data: existingAdvisor } = await admin
    .from('advisors').select('id').eq('user_id', userId).maybeSingle();

  if (existingAdvisor) {
    const { error } = await admin.from('advisors').update({
      display_name: payload.display_name,
      email,
      phone: payload.phone || null,
      status: payload.status || 'active',
      slug: finalSlug,
    }).eq('id', existingAdvisor.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.from('advisors').insert({
      user_id: userId,
      display_name: payload.display_name,
      email,
      phone: payload.phone || null,
      status: payload.status || 'active',
      slug: finalSlug,
    });
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/advisors');
  return {
    ok: true,
    slug: finalSlug,
    note: existing
      ? 'Bestehender Account verknüpft.'
      : 'Account angelegt. Berater muss „Passwort vergessen?" nutzen um sich einzuloggen.',
  };
}

export async function deleteAdvisor(advisorId) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from('advisors').delete().eq('id', advisorId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/advisors');
  return { ok: true };
}

export async function toggleAdvisorStatus(advisorId, status) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from('advisors').update({ status }).eq('id', advisorId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/advisors');
  return { ok: true };
}
