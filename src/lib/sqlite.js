import Database from 'better-sqlite3';

const db = new Database('dev.db');

// =========================
// TABLA USERS
// =========================
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    accessCode TEXT,
    arcadinaGalleryUrl TEXT,
    accessCount INTEGER DEFAULT 0
  )
`);

// =========================
// TABLA ACCESS LOGS
// =========================
db.exec(`
  CREATE TABLE IF NOT EXISTS access_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT,
    access_type TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// =========================
// TABLA PENDING CODES
// =========================
db.exec(`
  CREATE TABLE IF NOT EXISTS pending_codes (
    email TEXT PRIMARY KEY,
    code TEXT,
    name TEXT,
    expires_at INTEGER
  )
`);

// =========================
// AGREGAR CAMPO isMember (solo una vez)
// =========================
try {
  db.exec(`ALTER TABLE users ADD COLUMN isMember INTEGER DEFAULT 0`);
} catch (e) {
  // ya existe, no pasa nada
}

export default db;