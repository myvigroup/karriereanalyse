'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht angemeldet');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'coach'].includes(profile.role)) throw new Error('Keine Berechtigung');
  return supabase;
}

export async function togglePinPost(postId, pinned) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from('community_posts').update({ pinned }).eq('id', postId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/community');
  revalidatePath('/community');
  return { ok: true };
}

export async function deletePost(postId) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from('community_posts').delete().eq('id', postId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/community');
  revalidatePath('/community');
  return { ok: true };
}

export async function updatePeerRequestStatus(requestId, status) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from('peer_requests').update({ status }).eq('id', requestId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/community');
  return { ok: true };
}

export async function deletePeerMatch(matchId) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from('peer_matches').delete().eq('id', matchId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/community');
  return { ok: true };
}
