import { NextResponse } from 'next/server';
import db from '@/lib/sqlite';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ isMember: 0 });
    }

    const user = db
      .prepare('SELECT isMember FROM users WHERE email = ?')
      .get(email);

    return NextResponse.json(user || { isMember: 0 });

  } catch (error) {
    console.error('ERROR /api/auth/me:', error);
    return NextResponse.json({ isMember: 0 });
  }
}