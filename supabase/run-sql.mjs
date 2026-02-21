/**
 * Connects to the Supabase PostgreSQL database and runs schema.sql + seed.sql
 * Usage: node supabase/run-sql.mjs
 */
import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Try multiple connection methods
const password = encodeURIComponent('maGN57@#bane.');
const ref = 'lvuhqvitpwuwvndwtnnv';

const CONNECTIONS = [
  // Fly.io pooler (newer Supabase projects)
  { label: 'fly pooler eu-west-1 :5432', connStr: `postgresql://postgres.${ref}:${password}@fly-0-eu-west-1.pooler.supabase.com:5432/postgres` },
  { label: 'fly pooler eu-west-1 :6543', connStr: `postgresql://postgres.${ref}:${password}@fly-0-eu-west-1.pooler.supabase.com:6543/postgres` },
  // Fly.io pooler London
  { label: 'fly pooler lhr :5432', connStr: `postgresql://postgres.${ref}:${password}@fly-0-lhr.pooler.supabase.com:5432/postgres` },
  { label: 'fly pooler lhr :6543', connStr: `postgresql://postgres.${ref}:${password}@fly-0-lhr.pooler.supabase.com:6543/postgres` },
  // AWS pooler eu-west-1
  { label: 'aws pooler eu-west-1 :5432', connStr: `postgresql://postgres.${ref}:${password}@aws-0-eu-west-1.pooler.supabase.com:5432/postgres` },
  { label: 'aws pooler eu-west-1 :6543', connStr: `postgresql://postgres.${ref}:${password}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres` },
  // Direct IPv6
  { label: 'direct :5432', connStr: `postgresql://postgres:${password}@db.${ref}.supabase.co:5432/postgres` },
];

async function tryConnect() {
  for (const { label, connStr } of CONNECTIONS) {
    console.log(`Trying ${label}...`);
    const c = new pg.Client({ connectionString: connStr, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 6000 });
    try {
      await c.connect();
      console.log(`✅ Connected via ${label}\n`);
      return c;
    } catch (err) {
      console.log(`  ✗ ${err.message}`);
    }
  }
  throw new Error('Could not connect to any Supabase database endpoint');
}

async function run() {
  const client = await tryConnect();

  // Run schema.sql
  const schema = readFileSync(resolve(__dirname, 'schema.sql'), 'utf-8');
  console.log('Running schema.sql...');
  try {
    await client.query(schema);
    console.log('✅ schema.sql executed successfully!\n');
  } catch (err) {
    console.error('❌ schema.sql error:', err.message);
    // Continue to seed even if some schema already exists
  }

  // Run seed.sql
  const seed = readFileSync(resolve(__dirname, 'seed.sql'), 'utf-8');
  console.log('Running seed.sql...');
  try {
    await client.query(seed);
    console.log('✅ seed.sql executed successfully!\n');
  } catch (err) {
    console.error('❌ seed.sql error:', err.message);
  }

  // Verify tables
  console.log('Verifying tables...');
  const { rows } = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log('Tables in public schema:');
  rows.forEach(r => console.log(`  • ${r.table_name}`));

  await client.end();
  console.log('\nDone!');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
