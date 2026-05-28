'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht angemeldet');
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') throw new Error('Keine Berechtigung');
  return { supabase, userId: user.id };
}

export async function createTicket(formData) {
  const { userId } = await requireAdmin();
  const admin = createAdminClient();

  const title = (formData.get('title') || '').toString().trim();
  if (!title) return { error: 'Titel fehlt' };

  const payload = {
    title,
    description: (formData.get('description') || '').toString().trim() || null,
    priority: formData.get('priority') || 'medium',
    category: (formData.get('category') || '').toString().trim() || null,
    assignee: (formData.get('assignee') || '').toString().trim() || null,
    created_by: userId,
  };

  const { error } = await admin.from('backlog_tickets').insert(payload);
  if (error) return { error: error.message };

  revalidatePath('/admin/backlog');
  return { ok: true };
}

export async function updateTicketStatus(ticketId, newStatus) {
  await requireAdmin();
  const admin = createAdminClient();

  const updates = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };
  if (newStatus === 'done' || newStatus === 'wont_do') {
    updates.completed_at = new Date().toISOString();
  } else {
    updates.completed_at = null;
  }

  const { error } = await admin.from('backlog_tickets').update(updates).eq('id', ticketId);
  if (error) return { error: error.message };

  revalidatePath('/admin/backlog');
  return { ok: true };
}

export async function updateTicket(ticketId, formData) {
  await requireAdmin();
  const admin = createAdminClient();

  const updates = {
    title: (formData.get('title') || '').toString().trim(),
    description: (formData.get('description') || '').toString().trim() || null,
    priority: formData.get('priority') || 'medium',
    category: (formData.get('category') || '').toString().trim() || null,
    assignee: (formData.get('assignee') || '').toString().trim() || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.from('backlog_tickets').update(updates).eq('id', ticketId);
  if (error) return { error: error.message };

  revalidatePath('/admin/backlog');
  return { ok: true };
}

export async function deleteTicket(ticketId) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from('backlog_tickets').delete().eq('id', ticketId);
  if (error) return { error: error.message };
  revalidatePath('/admin/backlog');
  return { ok: true };
}
