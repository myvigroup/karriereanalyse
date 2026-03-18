# Karriere-Institut OS — Architektur-Übersicht (v3 — Monopol-Edition)

## Alle Module (20 Routen)

| # | Modul | Route | Status |
|---|-------|-------|--------|
| 1 | Auth (Login, Register, Reset, Callback) | /auth/* | ✅ |
| 2 | Dashboard (Stat-Cards, Progress, Momentum) | /dashboard | ✅ |
| 3 | **KI-Coach Bot** (Kontextbasierter Chat) | /coach | ✅ NEU |
| 4 | Entscheidungs-Kompass (Bleiben/Gehen) | /strategy/decision | ✅ |
| 5 | Karriereanalyse (65 Fragen, Radar, PRIO) | /analyse | ✅ |
| 6 | Masterclass (13 Kurse, ROI, Audio-Bridge) | /masterclass | ✅ |
| 7 | **Gehaltsdatenbank** (Benchmarks, Perzentile) | /gehalt | ✅ NEU |
| 8 | Bewerbungs-Kanban (5 Spalten, Drag&Drop) | /applications | ✅ |
| 9 | Marktwert-Cockpit (CountUp, Chart) | /marktwert | ✅ |
| 10 | Gehalts-Tagebuch (Verhandlungs-Log) | /salary-log | ✅ |
| 11 | Dokumenten-Safe (Upload, KI-CV-Check) | /pre-coaching | ✅ |
| 12 | Networking CRM (Stakeholder, Re-Connect) | /network | ✅ |
| 13 | LinkedIn & Branding (Headline, Score) | /branding | ✅ |
| 14 | Exit-Strategie (Abfindung, Checkliste) | /strategy/exit | ✅ |
| 15 | Karrierepfad (Level, Badges) | /career | 🔨 CC |
| 16 | Profil (Settings, Alumni Check-in) | /profile | 🔨 CC |
| 17 | Admin Coaching-Cockpit | /admin/coaching | 🔨 CC |
| 18 | Admin Nutzerverwaltung | /admin/users | 🔨 CC |
| 19 | Admin Kursverwaltung | /admin/courses | 🔨 CC |
| 20 | Report Sharing (öffentlicher Link) | /shared/[token] | 🔨 CC |

## Datenbank (27+ Tabellen über 4 Migrationen)

### Migration 001 — Kern (15 Tabellen)
profiles, competency_fields, competency_questions, analysis_results, analysis_sessions,
courses, modules, lessons, lesson_progress, career_documents, applications,
market_value_log, coaching_sessions, badges, user_badges

### Migration 002 — Seed-Daten
13 Kompetenzfelder, 65 Fragen, 13 Kurse, 8 Lektionen, 10 Badges

### Migration 003 — Strategie-Module (9 Tabellen)
decision_sessions, contacts, salary_log, exit_plans, shared_reports,
activity_log, interview_briefings, alumni_checkins, linkedin_analysis

### Migration 004 — Monopol-Module (7 Tabellen + Views)
**salary_benchmarks** + salary_benchmark_stats View (Gehaltsdatenbank)
**coaching_chats** + **coaching_messages** (KI-Coach Bot)
**certificates** (Karriere-Institut Zertifikate)
**notifications** (In-App + Welcome-Trigger)
**organizations** + org_dashboard_stats View (B2B Multi-Tenant)
**peer_matches** (Accountability-Paare)
**xp_history** (Gamification-Log)
coaching_roi_stats View (Marketing-Aggregation)

## API Routes (6 Endpunkte)

| Route | Methode | Funktion |
|-------|---------|----------|
| /api/analyze-cv | POST | KI-Lebenslauf-Check |
| /api/generate-report | GET | PDF-Report (HTML) |
| /api/linkedin-analyze | POST | LinkedIn Score + Headlines |
| /api/interview-briefing | POST | Gesprächs-Vorbereitung |
| /api/coach-chat | POST | KI-Coach (Claude API, kontextbasiert) |
| /api/salary-search | POST | Gehaltsbenchmark-Suche |

## Monopol-Strategie (7 Hebel)

1. **Gehaltsdatenbank** → Netzwerk-Effekt (je mehr User, desto wertvoller)
2. **KI-Coach** → Tägliche Nutzung → Gewohnheit → Lock-in
3. **Zertifikate** → Externe Anerkennung bei Arbeitgebern
4. **Organizations** → B2B-Skalierung (50-500 User pro Kunde)
5. **Peer-Matching** → Sozialer Lock-in durch Beziehungen
6. **Alumni-Tracking** → Datenbasierte Marketing-Aussagen
7. **Notifications** → Retention durch personalisierte Nudges

## Tech-Stack
- Frontend: Next.js 14 (App Router)
- Backend: Supabase (PostgreSQL, Auth, Storage, RLS)
- Hosting: Vercel
- KI: Claude API (CV-Analyse, Coach-Bot, Interview-Briefing)
- Design: Apple-Ästhetik, Instrument Sans, #CC1426

## Claude Code Prompts (5 Dateien)
| # | Datei | Inhalt |
|---|-------|--------|
| 1 | prompt-1-analyse-masterclass.md | Analyse-Flow + Masterclass-Player |
| 2 | prompt-2-tools.md | Dokumente, Kanban, Marktwert, Profil |
| 3 | prompt-3-admin.md | Admin Coaching, Users, Courses |
| 4 | prompt-4-strategic.md | Briefing, Sharing, Impostor, Momentum, Audio |
| 5 | prompt-5-monopoly.md | Zertifikate, Notifications, Orgs, Peer-Matching |
