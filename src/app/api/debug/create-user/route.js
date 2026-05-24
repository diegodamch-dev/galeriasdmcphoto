import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/sqlite';

export async function GET() {
  const email = 'test@dmcphoto.cl';
  const password = '123456';

  const hash = bcrypt.hashSync(password, 10);

  try {
    db.prepare(`
      INSERT INTO users (email, password, name)
      VALUES (?, ?, ?)
    `).run(email, hash, 'Test User');

    return NextResponse.json({ ok: true, email, password });

  } catch (e) {
    return NextResponse.json({ error: 'Usuario ya existe probablemente' });
  }
}