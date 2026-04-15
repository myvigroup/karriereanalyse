import { stripe, PRODUCTS } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

    const { productKey, interval, seminarId } = await req.json();
    const product = PRODUCTS[productKey];
    if (!product) return NextResponse.json({ error: 'Produkt nicht gefunden' }, { status: 400 });

    const priceId = product.type === 'subscription'
      ? (interval === 'yearly' ? product.stripePriceYearly : product.stripePriceMonthly)
      : product.stripePrice;

    if (!priceId || priceId.includes('PLACEHOLDER')) {
      return NextResponse.json({ error: 'Produkt noch nicht konfiguriert. Bitte kontaktiere den Support.' }, { status: 400 });
    }

    const sessionParams = {
      mode: product.type === 'subscription' ? 'subscription' : 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/angebote`,
      customer_email: user.email,
      metadata: { user_id: user.id, product_key: productKey, ...(seminarId ? { seminar_id: seminarId } : {}) },
      locale: 'de',
      allow_promotion_codes: true,
    };

    // Trial for Masterclass
    if (product.trialDays && product.type === 'subscription') {
      sessionParams.subscription_data = { trial_period_days: product.trialDays };
    }

    // Invoice for one-time payments
    if (product.type === 'payment') {
      sessionParams.invoice_creation = { enabled: true };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout fehlgeschlagen' }, { status: 500 });
  }
}
