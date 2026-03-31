import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-04-10',
});

export const PRODUCTS = {
  MASTERCLASS: {
    name: 'Masterclass',
    type: 'subscription',
    stripePriceMonthly: process.env.STRIPE_PRICE_MASTERCLASS_MONTHLY,
    stripePriceYearly: process.env.STRIPE_PRICE_MASTERCLASS_YEARLY,
    trialDays: 7,
    features: ['Alle Kurs-Module', 'Quiz & Praxis-Aufgaben', 'Zertifikate', 'Community-Zugang'],
    description: 'Kurse zu Gehaltsverhandlung, Rhetorik, Leadership und mehr',
  },
  SEMINAR: {
    name: 'Seminare',
    type: 'one_time',
    stripePrice: process.env.STRIPE_PRICE_SEMINAR,
    features: ['Ganztägiges Intensiv-Seminar', 'Arbeitsmaterialien', 'Teilnahme-Zertifikat'],
    description: 'Ganztägige Workshops mit erfahrenen Coaches',
  },
  COACHING: {
    name: 'Privat-Coaching',
    type: 'one_time',
    stripePrice: process.env.STRIPE_PRICE_COACHING,
    features: ['60 Min. 1:1 Session', 'Persönlicher Aktionsplan', 'Follow-up Email'],
    description: 'Persönliches Coaching mit zertifiziertem Karriere-Coach',
    calendlyUrl: process.env.CALENDLY_COACHING_URL,
  },
  ANALYSE_STUDENT: {
    name: 'Karriere-Analyse (Studierende)',
    type: 'one_time',
    stripePrice: process.env.STRIPE_PRICE_ANALYSE_STUDENT,
    features: ['65 Fragen Assessment', '50+ Seiten Report', 'Radar-Chart', 'Handlungsempfehlungen'],
    description: 'Lege den Grundstein für deine Karriere',
  },
  ANALYSE_PRO: {
    name: 'Karriere-Analyse (Berufstätige)',
    type: 'one_time',
    stripePrice: process.env.STRIPE_PRICE_ANALYSE_PRO,
    features: ['65 Fragen Assessment', '50+ Seiten Report', 'Coach-Auswertung', 'Karriere-Roadmap'],
    description: 'Dein Karriere-Blutbild: Fundierter Überblick über deinen Ist-Zustand',
  },
};

export async function getProductPrices() {
  const prices = {};
  for (const [key, product] of Object.entries(PRODUCTS)) {
    const priceId = product.stripePriceMonthly || product.stripePrice;
    if (priceId && !priceId.includes('PLACEHOLDER')) {
      try {
        const price = await stripe.prices.retrieve(priceId);
        prices[key] = {
          amount: price.unit_amount,
          currency: price.currency,
          interval: price.recurring?.interval,
          formatted: new Intl.NumberFormat('de-DE', {
            style: 'currency', currency: price.currency,
          }).format(price.unit_amount / 100),
        };
      } catch {
        prices[key] = null;
      }
    }
  }
  return prices;
}
