#!/usr/bin/env node
/**
 * Stripe Setup Script
 * Legt alle Produkte & Preise an und trägt die IDs in .env.local ein.
 * 
 * Voraussetzung: STRIPE_SECRET_KEY in .env.local
 * Aufruf: node scripts/setup-stripe.mjs
 */

import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');

// .env.local lesen
const envContent = fs.readFileSync(envPath, 'utf8');
const getEnv = (key) => {
  const match = envContent.match(new RegExp(`^${key}=(.+)$`, 'm'));
  return match?.[1]?.trim();
};

const secretKey = getEnv('STRIPE_SECRET_KEY');
if (!secretKey || secretKey === 'sk_live_...' || secretKey === 'sk_test_...') {
  console.error('❌ Bitte zuerst STRIPE_SECRET_KEY in .env.local eintragen!');
  process.exit(1);
}

const stripe = new Stripe(secretKey, { apiVersion: '2024-04-10' });
const isLive = secretKey.startsWith('sk_live_');
console.log(`\n🔑 Modus: ${isLive ? '🟢 Live' : '🟡 Test'}\n`);

async function findOrCreate(type, finder, creator, label) {
  const existing = await finder();
  if (existing) {
    console.log(`  ✓ ${label} existiert bereits (${existing.id})`);
    return existing;
  }
  const created = await creator();
  console.log(`  ✅ ${label} erstellt (${created.id})`);
  return created;
}

async function main() {
  console.log('🚀 Stripe Setup startet...\n');

  // ── 1. Premium-Mitgliedschaft ──────────────────────────────────────
  console.log('📦 Premium-Mitgliedschaft');
  const existingProducts = await stripe.products.list({ limit: 100 });

  const premiumProduct = await findOrCreate(
    'product',
    () => existingProducts.data.find(p => p.name === 'Premium-Mitgliedschaft' && p.active),
    () => stripe.products.create({
      name: 'Premium-Mitgliedschaft',
      description: '1 Seminar/Monat + alle Masterclasses + KI-Coach + Karriere-Analyse',
      metadata: { product_key: 'MASTERCLASS' },
    }),
    'Produkt Premium-Mitgliedschaft'
  );

  // Monatlicher Preis
  const existingPrices = await stripe.prices.list({ product: premiumProduct.id, limit: 20 });

  const monthlyPrice = await findOrCreate(
    'price',
    () => existingPrices.data.find(p => p.recurring?.interval === 'month' && p.unit_amount === 1500 && p.active),
    () => stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 1500,
      currency: 'eur',
      recurring: { interval: 'month' },
      nickname: 'Monatlich 15€',
      metadata: { product_key: 'MASTERCLASS', interval: 'monthly' },
    }),
    'Preis 15€/Monat'
  );

  // Jährlicher Preis
  const yearlyPrice = await findOrCreate(
    'price',
    () => existingPrices.data.find(p => p.recurring?.interval === 'year' && p.unit_amount === 14400 && p.active),
    () => stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 14400,
      currency: 'eur',
      recurring: { interval: 'year' },
      nickname: 'Jährlich 144€ (12€/Monat)',
      metadata: { product_key: 'MASTERCLASS', interval: 'yearly' },
    }),
    'Preis 144€/Jahr'
  );

  // ── 2. Seminar ────────────────────────────────────────────────────
  console.log('\n📦 Seminar');

  const seminarProduct = await findOrCreate(
    'product',
    () => existingProducts.data.find(p => p.name === 'Seminar' && p.active),
    () => stripe.products.create({
      name: 'Seminar',
      description: 'Einzelnes Online-Seminar (samstags, 09:30–12:00 Uhr)',
      metadata: { product_key: 'SEMINAR' },
    }),
    'Produkt Seminar'
  );

  const seminarPrices = await stripe.prices.list({ product: seminarProduct.id, limit: 10 });
  const seminarPrice = await findOrCreate(
    'price',
    () => seminarPrices.data.find(p => p.unit_amount === 9900 && p.active),
    () => stripe.prices.create({
      product: seminarProduct.id,
      unit_amount: 9900,
      currency: 'eur',
      nickname: 'Einmalig 99€',
      metadata: { product_key: 'SEMINAR' },
    }),
    'Preis 99€ einmalig'
  );

  // ── 3. .env.local aktualisieren ───────────────────────────────────
  console.log('\n📝 .env.local wird aktualisiert...');

  const updates = {
    STRIPE_PRICE_MASTERCLASS_MONTHLY: monthlyPrice.id,
    STRIPE_PRICE_MASTERCLASS_YEARLY: yearlyPrice.id,
    STRIPE_PRICE_SEMINAR: seminarPrice.id,
  };

  let newEnv = envContent;
  for (const [key, value] of Object.entries(updates)) {
    if (newEnv.includes(`${key}=`)) {
      newEnv = newEnv.replace(new RegExp(`^${key}=.*$`, 'm'), `${key}=${value}`);
    } else {
      newEnv += `\n${key}=${value}`;
    }
  }
  fs.writeFileSync(envPath, newEnv);

  console.log('\n✅ Fertig! Folgende Price IDs wurden eingetragen:\n');
  for (const [key, value] of Object.entries(updates)) {
    console.log(`  ${key}=${value}`);
  }

  console.log('\n⚠️  Noch manuell erledigen:');
  console.log('  1. Webhook in Stripe Dashboard anlegen:');
  console.log(`     URL: ${getEnv('NEXT_PUBLIC_APP_URL') || 'https://app.daskarriereinstitut.de'}/api/webhooks/stripe`);
  console.log('     Events: checkout.session.completed, customer.subscription.updated,');
  console.log('             customer.subscription.deleted, invoice.payment_failed');
  console.log('  2. STRIPE_WEBHOOK_SECRET aus dem Webhook in .env.local eintragen');
  console.log('  3. Alle Keys auch in Vercel Environment Variables eintragen\n');
}

main().catch(err => {
  console.error('❌ Fehler:', err.message);
  process.exit(1);
});
