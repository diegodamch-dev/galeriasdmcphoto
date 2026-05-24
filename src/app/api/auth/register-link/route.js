import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/sqlite';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    // crear usuario si no existe
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      db.prepare('INSERT INTO users (email) VALUES (?)').run(email);
    }

    // generar token
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    return NextResponse.json({ token });

  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}