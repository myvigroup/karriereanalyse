'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  ensureDemoAdvisor,
  seedDemoData,
  wipeDemoData,
  resetDemo,
} from '@/lib/demo';

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht angemeldet');
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') throw new Error('Keine Berechtigung (nur Admin)');
  return supabase;
}

export async function setupDemoAction() {
  await requireAdmin();
  await ensureDemoAdvisor();
  const result = await seedDemoData();
  revalidatePath('/admin/demo');
  return result;
}

export async function resetDemoAction() {
  await requireAdmin();
  const result = await resetDemo();
  revalidatePath('/admin/demo');
  return result;
}

export async function wipeDemoAction() {
  await requireAdmin();
  const result = await wipeDemoData();
  revalidatePath('/admin/demo');
  return result;
}
