import { NextResponse } from 'next/server';
import db from '@/lib/sqlite';

export async function GET() {
  try {
    const logs = db.prepare('SELECT * FROM access_logs ORDER BY timestamp DESC LIMIT 100').all();
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}