import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(req) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { email, organizationId } = await req.json();
    if (!email || !organizationId) {
      return NextResponse.json({ error: 'Email und Organization-ID erforderlich' }, { status: 400 });
    }

    // Verify caller is org admin
    const { data: membership } = await supabase
      .from('org_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .eq('role', 'admin')
      .maybeSingle();

    if (!membership) {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 });
    }

    // Check seat limit
    const { data: org } = await supabase
      .from('organizations')
      .select('name, max_seats')
      .eq('id', organizationId)
      .single();

    const { count: currentMembers } = await supabase
      .from('org_members')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId);

    if ((currentMembers || 0) >= (org?.max_seats || 10)) {
      return NextResponse.json({ error: 'Maximale Teamgröße erreicht' }, { status: 400 });
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      // Add existing user directly
      const { error: insertError } = await supabase
        .from('org_members')
        .insert({ organization_id: organizationId, user_id: existingUser.id, role: 'member' });

      if (insertError?.code === '23505') {
        return NextResponse.json({ error: 'Mitglied bereits im Team' }, { status: 400 });
      }

      await supabase.from('profiles')
        .update({ organization_id: organizationId })
        .eq('id', existingUser.id);
    }

    // Send invitation email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.daskarriereinstitut.de';
    await sendEmail({
      to: email,
      subject: `Einladung zum Team "${org?.name || 'Karriere-Institut'}"`,
      html: `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:32px">
        <h2>Du wurdest eingeladen!</h2>
        <p>Du wurdest zum Team <strong>${org?.name}</strong> beim Karriere-Institut eingeladen.</p>
        <a href="${appUrl}/auth/register" style="display:inline-block;padding:12px 24px;background:#CC1426;color:white;border-radius:8px;text-decoration:none;margin-top:16px">
          ${existingUser ? 'Zum Dashboard' : 'Jetzt registrieren'}
        </a>
      </body></html>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Org invite error:', error);
    return NextResponse.json({ error: 'Einladung fehlgeschlagen' }, { status: 500 });
  }
}
