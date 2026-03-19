// scripts/setup-supabase.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.argv[2];
const SERVICE_ROLE_KEY = process.argv[3];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Usage: node scripts/setup-supabase.mjs <SUPABASE_URL> <SERVICE_ROLE_KEY>');
  console.error('');
  console.error('Example:');
  console.error('  node scripts/setup-supabase.mjs https://xxxxx.supabase.co eyJhbGciOiJI...');
  process.exit(1);
}

const migrations = [
  '001_initial_schema.sql',
  '002_seed_data.sql',
  '003_additional_modules.sql',
  '004_monopoly_modules.sql',
  '005_phase2_extensions.sql',
];

async function runSQL(sql, filename) {
  console.log(`\n🔄 Running ${filename}...`);

  // Split SQL into individual statements for better error handling
  const statements = sql
    .split(/;\s*$/m)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  let successCount = 0;
  let errorCount = 0;

  for (const stmt of statements) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ query: stmt + ';' })
      });

      if (res.ok) {
        successCount++;
      } else {
        // Try via the SQL endpoint
        const sqlRes = await fetch(`${SUPABASE_URL}/pg/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({ query: stmt + ';' })
        });
        if (sqlRes.ok) {
          successCount++;
        } else {
          errorCount++;
        }
      }
    } catch (e) {
      errorCount++;
    }
  }

  if (errorCount === 0) {
    console.log(`✅ ${filename} done! (${successCount} statements)`);
    return true;
  } else if (successCount > 0) {
    console.log(`⚠️  ${filename} partially done (${successCount} OK, ${errorCount} errors)`);
    return false;
  } else {
    console.error(`❌ ${filename} failed. Please run manually in Supabase SQL Editor.`);
    return false;
  }
}

async function main() {
  console.log('🚀 Karriere-Institut OS — Supabase Setup');
  console.log(`📡 Connecting to ${SUPABASE_URL}...\n`);

  let allSuccess = true;

  for (const file of migrations) {
    const filePath = path.join(__dirname, '..', 'supabase', 'migrations', file);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      allSuccess = false;
      continue;
    }

    const sql = fs.readFileSync(filePath, 'utf-8');
    const success = await runSQL(sql, file);
    if (!success) allSuccess = false;
  }

  if (allSuccess) {
    console.log('\n🎉 Alle Migrationen erfolgreich!');
    console.log('👉 Nächster Schritt: npm run dev && registriere dich → setze role=admin in Supabase Table Editor');
  } else {
    console.log('\n⚠️  Einige Migrationen sind fehlgeschlagen.');
    console.log('👉 Öffne den Supabase SQL Editor und führe die SQL-Dateien manuell aus:');
    console.log('   Oder nutze: supabase/COMPLETE_SETUP.sql (alles in einer Datei)');
    migrations.forEach(f => console.log(`   - supabase/migrations/${f}`));
  }
}

main().catch(console.error);
