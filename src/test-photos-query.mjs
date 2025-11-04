import { query, getConnection, closePool } from './db-connector.js';

async function run() {
  try {
    console.log('Running SELECT from photos...');
  const rows = await query("SELECT id, url AS imageUrl, character_name AS characterName, created_at AS createdAt FROM photos ORDER BY created_at DESC");
    console.log('Rows:', rows);
  } catch (err) {
    console.error('Query failed:', err && err.stack ? err.stack : err);
  } finally {
    await closePool();
  }
}

run();
