# Phase 3+4 Build Status

## Phase 3 — KOMPLETT (alle 30 Steps erledigt)

## Phase 4 — IN PROGRESS

### Block 1: Setup
- [x] Step 1: SQL Migration 008_phase4_monetization.sql
- [x] Step 2: npm install stripe @stripe/stripe-js resend
- [x] Step 3: .env.local mit Stripe/Resend/Calendly Platzhaltern

### Block 2: Stripe (Kern-Monetarisierung)
- [x] Step 4: A1 Stripe Config (dynamische Preise aus env)
- [x] Step 5: A2 Angebote-Seite (5 Produkte, Interval-Toggle)
- [x] Step 6: A3 Checkout Flow (Trial, Invoice, MwSt)
- [x] Step 7: A4 Webhook Handler (Signatur-Verifiziert, Idempotent)
- [x] Step 8: A5 Success Pages (pro Produkt, Calendly für Coaching)
- [x] Step 9: A6 Paywall + Access Control + UpgradePrompt
- [x] Step 10: A7 Billing im Profil (Abo, Portal, Trial-Banner)
- [x] Bonus: Widerrufs-Seite + AGB-Seite + Billing-Portal API

### Block 3: Community
- [x] Step 11: Sidebar Navigation (Community-Link)
- [x] Step 12: Achievement-Wall (Feed, Likes, Filter, Paywall)
- [x] Step 13: Peer-Matching (Score-basiert, Anfragen, Accept)
- [x] Step 14: Erfolgs-Stories (Vorher/Nachher, Moderation, Likes)

### Block 4: Email
- [x] Step 15: Email Service (Resend, Mock-Fallback)
- [x] Step 16: 12 Email-Templates (HTML, branded, CTA-Buttons)
- [x] Step 17: Cron-Jobs (täglich + wöchentlich, Duplikat-Schutz)
- [x] Step 18: Unsubscribe (1-Klick, DSGVO-konform, vercel.json)

### Block 5: Multi-Tenant
- [x] Step 19: Org-Admin Dashboard (KPIs, Mitglieder, Seat-Counter)
- [x] Step 20: Invite Flow (Email-Einladung, Seat-Limit, Auto-Add)

### Block 6: Dark Mode + PWA
- [x] Step 21: Dark Mode (CSS Variables, ThemeToggle in Sidebar)
- [x] Step 22: PWA (Manifest, Service Worker, Meta Tags, Install Prompt, SVG Icons)

### Block 7: Advanced
- [x] Step 23: Streak-Freeze (Freeze-Tokens, 7d-Streak = +1 Freeze, max 3)
- [x] Step 24: Smart Recommendations (Priorität-basiert, Top-3 auf Dashboard)
- [x] Step 25: Coaching Marketplace (Coach-Cards, Calendly, Reviews)
- [x] Step 26: Changelog (Timeline, "Neu" Badge, Auto-Mark-Seen)
- [x] Step 27: Admin Content Management (Quiz-Editor, Praxis-Aufgaben)
- [x] Step 28: Rechtliche Seiten (Landing Page Branding, Footer-Links)

### Block 8: Git
- [ ] Steps 29-30: Build + Commit
