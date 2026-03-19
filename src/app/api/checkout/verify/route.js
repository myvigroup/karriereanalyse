import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');
  if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      product_key: session.metadata?.product_key,
      status: session.payment_status,
      customer_email: session.customer_email,
    });
  } catch {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }
}
