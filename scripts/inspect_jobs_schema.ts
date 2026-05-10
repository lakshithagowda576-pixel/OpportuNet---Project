import 'dotenv/config';
import pg from 'pg';

async function main() {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false");
  const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='jobs' ORDER BY ordinal_position");
  console.log(res.rows);
  await client.end();
}

main().catch((err) => { console.error(err); process.exit(1); });
