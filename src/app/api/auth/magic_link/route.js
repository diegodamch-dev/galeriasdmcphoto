import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/sqlite';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/?error=missing_token', request.url));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (error) {
      return NextResponse.redirect(new URL('/?error=invalid_token', request.url));
    }

    const { userId, email } = decoded;

    db.prepare('INSERT INTO access_logs (user_email, access_type) VALUES (?, ?)').run(email, 'magic_link');

    const user = db.prepare('SELECT arcadinaGalleryUrl FROM users WHERE id = ?').get(userId);
    const arcadinaUrl = user?.arcadinaGalleryUrl || 'https://dmcphotography.arcadina.com/lang/es/';

    return NextResponse.redirect(arcadinaUrl);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.redirect(new URL('/?error=server_error', request.url));
  }
}