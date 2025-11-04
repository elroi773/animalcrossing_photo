import { query, getConnection, closePool } from './db-connector.js';

async function run() {
  try {
    console.log('Testing DB connection...');
    const rows = await query('SELECT 1 AS ok');
    console.log('Query result:', rows);

    const conn = await getConnection();
    try {
      const [now] = await conn.query('SELECT NOW() AS now');
      console.log('DB time:', now[0].now);
    } finally {
      conn.release();
    }

    console.log('DB test completed successfully.');
  } catch (err) {
    console.error('DB test failed:', err && err.message ? err.message : err);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
}

run();
