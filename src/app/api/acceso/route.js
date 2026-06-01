import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (!token || !email) {
    return new NextResponse('Token o email faltante', { status: 400 });
  }

  // Aquí puede verificar el token contra Google Sheets si lo desea
  // Por ahora, redirige directamente a la galería externa

  const galeriaUrl = `https://dmcphotography.arcadina.com/lang/es/?email=${encodeURIComponent(email)}&token=${token}`;

  // Redirección HTTP 302
  return NextResponse.redirect(galeriaUrl);
}