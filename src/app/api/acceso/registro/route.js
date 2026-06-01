import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { nombre, email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'El email es obligatorio' },
        { status: 400 }
      );
    }

    // Generar código aleatorio
    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Preparar datos para Google Sheets
    const body = {
      email: email,
      codigo: codigo,
      evento: 'DMC Photo',
      nombre: nombre || ''
    };

    // Llamar a Google Apps Script desde el servidor (sin CORS)
    const response = await fetch('https://script.google.com/macros/s/AKfycbwHnTbls8sMHVo8sf9c-_zMaY1MfaWsORzYRmvQ_-p3JF86XAhtuXz0S_V0avVWO610Aw/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al guardar en Google Sheets');
    }

    return NextResponse.json({ 
      ok: true, 
      mensaje: 'Registro exitoso',
      codigo: codigo 
    });

  } catch (error) {
    console.error('Error en API:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}