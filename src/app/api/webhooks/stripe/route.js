import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'info@daskarriereinstitut.de';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Ung\u00FCltige Signatur' }, { status: 400 });
  }

  // IDEMPOTENZ: Pr\u00FCfe ob Event schon verarbeitet
  const { data: existing } = await supabaseAdmin
    .from('stripe_events')
    .select('id')
    .eq('stripe_event_id', event.id)
    .maybeSingle();

  if (existing) return NextResponse.json({ received: true });

  // Event loggen
  await supabaseAdmin.from('stripe_events').insert({
    stripe_event_id: event.id,
    type: event.type,
    data: event.data,
  });

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const productKey = session.metadata?.product_key;
        if (!userId) break;

        const updates = { stripe_customer_id: session.customer };

        if (session.mode === 'subscription') {
          updates.subscription_plan = productKey;
          updates.stripe_subscription_id = session.subscription;
          updates.subscription_status = 'active';
        } else {
          // Einmalzahlung: Produkt freischalten
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('purchased_products')
            .eq('id', userId)
            .single();

          const purchased = profile?.purchased_products || [];
          if (!purchased.includes(productKey)) {
            purchased.push(productKey);
          }
          updates.purchased_products = purchased;
        }

        await supabaseAdmin.from('profiles').update(updates).eq('id', userId);

        // Transaktion loggen
        await supabaseAdmin.from('transactions').insert({
          user_id: userId,
          stripe_session_id: session.id,
          amount: session.amount_total,
          currency: session.currency,
          product_key: productKey,
          status: 'completed',
        });

        // Notification
        await supabaseAdmin.from('notifications').insert({
          user_id: userId,
          title: 'Kauf erfolgreich!',
          content: `Dein Zugang ist freigeschaltet.`,
          type: 'achievement',
        });

        // Seminar-Buchung: Registrierung + Admin-Benachrichtigung
        if (productKey === 'SEMINAR' && session.metadata?.seminar_id) {
          try {
            const { data: seminar } = await supabaseAdmin
              .from('seminars')
              .select('id, title, next_date')
              .eq('id', session.metadata.seminar_id)
              .single();

            if (seminar) {
              const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('first_name, last_name, name, email, phone')
                .eq('id', userId)
                .single();

              // Registrierung speichern
              await supabaseAdmin.from('webinar_registrations').insert({
                user_id: userId,
                seminar_id: seminar.id,
                stripe_session_id: session.id,
              });

              // Admin per E-Mail benachrichtigen
              const userName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || profile?.name || 'Unbekannt';
              const userEmail = profile?.email || session.customer_email;
              const seminarDate = seminar.next_date
                ? new Date(seminar.next_date + 'T00:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : 'Termin offen';

              await sendEmail({
                to: ADMIN_EMAIL,
                subject: `Neue Seminar-Buchung (Stripe): ${seminar.title}`,
                html: `
                  <h2>Neue Seminar-Buchung via Stripe</h2>
                  <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
                    <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Seminar:</td><td>${seminar.title}</td></tr>
                    <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Termin:</td><td>${seminarDate}</td></tr>
                    <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Name:</td><td>${userName}</td></tr>
                    <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">E-Mail:</td><td><a href="mailto:${userEmail}">${userEmail}</a></td></tr>
                    <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Telefon:</td><td>${profile?.phone || '—'}</td></tr>
                    <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Betrag:</td><td>${(session.amount_total / 100).toFixed(2)} €</td></tr>
                  </table>
                  <p style="margin-top:20px;font-size:13px;color:#666;">Bitte den Webinar-Link manuell an den Teilnehmer senden.</p>
                `,
              });
            }
          } catch (err) {
            console.error('Seminar booking notification failed (non-fatal):', err);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await supabaseAdmin.from('profiles')
          .update({ subscription_plan: 'FREE', subscription_status: 'canceled' })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const updates = { subscription_status: sub.status };
        if (sub.current_period_end) {
          updates.subscription_ends_at = new Date(sub.current_period_end * 1000).toISOString();
        }
        await supabaseAdmin.from('profiles')
          .update(updates)
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await supabaseAdmin.from('profiles')
          .update({ subscription_status: 'past_due' })
          .eq('stripe_customer_id', invoice.customer);
        break;
      }
    }
  } catch (err) {
    console.error('Webhook processing error:', err);
  }

  return NextResponse.json({ received: true });
}
