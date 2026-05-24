import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/sqlite';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    const pending = db.prepare('SELECT * FROM pending_codes WHERE email = ? AND code = ?').get(email, code);

    if (!pending) {
      return NextResponse.json({ error: 'Código incorrecto' }, { status: 401 });
    }

    const now = Math.floor(Date.now() / 1000);
    if (pending.expires_at < now) {
      db.prepare('DELETE FROM pending_codes WHERE email = ?').run(email);
      return NextResponse.json({ error: 'Código expirado' }, { status: 401 });
    }

    db.prepare('DELETE FROM pending_codes WHERE email = ?').run(email);

    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      const defaultPassword = bcrypt.hashSync(Math.random().toString(36), 10);
      const stmt = db.prepare(`
        INSERT INTO users (email, password, name, accessCode, arcadinaGalleryUrl, accessCount)
        VALUES (?, ?, ?, ?, ?, 0)
      `);
      stmt.run(email, defaultPassword, pending.name || '', code, 'https://dmcphotography.arcadina.com/lang/es/', 0);
      user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    }

    db.prepare('INSERT INTO access_logs (user_email, access_type) VALUES (?, ?)').run(email, 'popup');

    const arcadinaUrl = user.arcadinaGalleryUrl || 'https://dmcphotography.arcadina.com/lang/es/';
    return NextResponse.json({ success: true, redirectTo: arcadinaUrl });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}