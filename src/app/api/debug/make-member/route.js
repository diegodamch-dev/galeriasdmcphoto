import { NextResponse } from 'next/server';
import db from '@/lib/sqlite';

export async function GET() {
  const email = 'test@dmcphoto.cl';

  db.prepare(`
    UPDATE users
    SET isMember = 1
    WHERE email = ?
  `).run(email);

  return NextResponse.json({ ok: true, email });
}