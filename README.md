# Karriere-Institut OS

Karriereanalyse, Masterclass, Bewerbungs-Tracker & Coaching — für Fach- und Führungskräfte.

**Tech-Stack:** Next.js 14 + Supabase (PostgreSQL, Auth, Storage) + Vercel

---

## Schnellstart

### 1. Supabase einrichten
1. [supabase.com](https://supabase.com/dashboard/new/new-project) → Neues Projekt → Region **Frankfurt**
2. SQL Editor → `supabase/migrations/001_initial_schema.sql` einfügen → **Run**
3. SQL Editor → `supabase/migrations/002_seed_data.sql` einfügen → **Run**
4. Settings → API Keys → **Publishable Key** und **Project URL** kopieren

### 2. App konfigurieren
```bash
cp .env.local.example .env.local
```
Keys eintragen:
```
NEXT_PUBLIC_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...dein-key
```

### 3. Starten
```bash
npm install
npm run dev
# → http://localhost:3000
```

### 4. Ersten Admin anlegen
1. Registriere dich über `/auth/register`
2. Supabase → Table Editor → `profiles` → dein Eintrag → `role` auf `admin` setzen, `phase` auf `active`
3. Refresh → Admin-Navigation erscheint

### 5. Vercel deployen
1. Code auf GitHub pushen
2. [vercel.com/new](https://vercel.com/new) → Repo importieren
3. Environment Variables eintragen (gleiche wie .env.local)
4. Deploy
5. Supabase → Auth → URL Configuration → Site URL + Redirect URL auf Vercel-Domain setzen

---

## Projektstruktur

```
karriere-institut/
├── src/
│   ├── app/
│   │   ├── auth/           # Login, Register, Callback
│   │   ├── (app)/          # Geschützter Bereich (mit Sidebar)
│   │   │   ├── dashboard/  # Haupt-Dashboard
│   │   │   ├── analyse/    # 13-Felder Karriereanalyse
│   │   │   ├── masterclass/# Kurse & Video-Player
│   │   │   ├── pre-coaching/# Dokumenten-Safe
│   │   │   ├── applications/# Bewerbungs-Kanban
│   │   │   ├── marktwert/  # ROI-Cockpit
│   │   │   ├── career/     # Karrierepfad & Badges
│   │   │   ├── profile/    # Profil & Einstellungen
│   │   │   └── admin/      # Coaching, Users, Courses
│   │   ├── globals.css     # Design-System (Apple-Ästhetik)
│   │   └── layout.js       # Root Layout
│   ├── components/
│   │   └── layout/
│   │       └── Sidebar.js  # Navigation
│   ├── hooks/              # Custom Hooks
│   ├── lib/supabase/       # Server + Client
│   └── middleware.js        # Auth-Schutz
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql  # Alle Tabellen + RLS
│       └── 002_seed_data.sql       # Kompetenzfelder, Kurse, Badges
├── claude-code-prompt-1-analyse-masterclass.md
├── claude-code-prompt-2-tools.md
├── claude-code-prompt-3-admin.md
└── package.json
```

---

## Datenbank-Übersicht

| Tabelle | Inhalt | RLS |
|---------|--------|-----|
| profiles | User-Daten, Level, XP, Gehalt | ✅ User=eigene, Admin=alle |
| competency_fields | 13 Kompetenzfelder | ✅ Lesen=alle |
| competency_questions | 65 Fragen (5/Feld) | ✅ Lesen=alle |
| analysis_results | Scores pro User + Feld | ✅ User=eigene |
| analysis_sessions | Gesamtscore + PRIOs | ✅ User=eigene |
| courses | 13 Kurse mit Marktwert | ✅ Published=alle |
| modules | Module pro Kurs | ✅ Lesen=alle |
| lessons | Lektionen mit Video-URL | ✅ Lesen=alle |
| lesson_progress | Abschluss + Notizen | ✅ User=eigene |
| career_documents | Upload-Status + KI-Analyse | ✅ User=eigene |
| applications | Bewerbungs-Kanban | ✅ User=eigene |
| market_value_log | Marktwert-Tracking | ✅ User=eigene |
| coaching_sessions | Coach-Sessions | ✅ Coach=alle |
| badges | Badge-Definitionen | ✅ Lesen=alle |
| user_badges | Verdiente Badges | ✅ User=eigene |

**Automatische Trigger:**
- `on_auth_user_created` → Profil + 5 Dokument-Einträge erstellen
- `on_lesson_completed` → market_value_log aktualisieren
- `on_xp_update` → XP +25 pro Lektion

---

## Claude Code Prompts

3 Prompt-Dateien für parallele Agents:

| Datei | Inhalt | Priorität |
|-------|--------|-----------|
| `claude-code-prompt-1-analyse-masterclass.md` | Karriereanalyse (65 Fragen, Radar-Chart) + Masterclass (Video-Player, Fortschritt) | 🔴 Zuerst |
| `claude-code-prompt-2-tools.md` | Dokumenten-Safe, Bewerbungs-Kanban, Marktwert-Cockpit, Profil | 🟡 Parallel |
| `claude-code-prompt-3-admin.md` | Coaching-Dashboard, Nutzerverwaltung, Kursverwaltung | 🟢 Danach |

**Start:**
```bash
cd ~/karriere-institut
npx @anthropic-ai/claude-code
# → Prompt 1 reinkopieren
```

Für parallele Agents: 2-3 Terminal-Fenster öffnen, je einen Prompt.

---

## Design-System

- **Font:** Instrument Sans (Google Fonts)
- **Primärfarbe:** #CC1426 (Karriere-Institut Rot)
- **Text:** #353A3B (Charcoal)
- **Background:** #FBFBFD (Fast-Weiß)
- **Cards:** Weiß + subtile Schatten, borderRadius 16px
- **Buttons:** Pill-Form (borderRadius 980px)
- **Animationen:** cubic-bezier(.25, 1, .5, 1)
