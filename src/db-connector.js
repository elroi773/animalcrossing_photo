import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load .env from project root
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  user: process.env.DB_USER ?? 'photo_user',
  password: process.env.DB_PASS ?? 'yourPasswordHere',
  database: process.env.DB_NAME ?? 'photos_db',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONN_LIMIT ?? 10),
  queueLimit: 0,
});

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function getConnection() {
  return pool.getConnection();
}

export async function closePool() {
  await pool.end();
}

export default pool;
