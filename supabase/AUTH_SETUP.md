# Supabase Auth Setup

## 1. Email Auth aktivieren
- Supabase Dashboard → Authentication → Providers
- Email: aktiviert (default)
- "Confirm email" → DEAKTIVIEREN für Development

## 2. URL Configuration
- Supabase Dashboard → Authentication → URL Configuration
- Site URL: http://localhost:3000 (für Development)
- Redirect URLs: http://localhost:3000/auth/callback

## 3. Für Production (Vercel)
- Site URL: https://deine-app.vercel.app
- Redirect URLs: https://deine-app.vercel.app/auth/callback

## 4. Admin User erstellen
1. Öffne http://localhost:3000
2. Registriere dich mit Email + Passwort
3. Gehe zu Supabase → Table Editor → profiles
4. Finde deinen User
5. Setze: role = 'admin', phase = 'active'

## 5. Storage Bucket
- Der `career-documents` Bucket wird automatisch via Migration erstellt
- Falls nicht: Supabase → Storage → New Bucket → Name: "career-documents" → Private
