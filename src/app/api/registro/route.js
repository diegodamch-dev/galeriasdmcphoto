import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializar Resend solo si hay API key
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request) {
  try {
    const { nombre, email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'El email es obligatorio' },
        { status: 400 }
      );
    }

    // Generar código
    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Guardar en Google Sheets
    const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwHnTbls8sMHVo8sf9c-_zMaY1MfaWsORzYRmvQ_-p3JF86XAhtuXz0S_V0avVWO610Aw/exec';
    
    const body = {
      email: email,
      codigo: codigo,
      evento: 'DMC Photo',
      nombre: nombre || ''
    };

    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error('Error en Google Script:', await response.text());
      throw new Error('Error al guardar en Google Sheets');
    }

    // Enviar correo con Resend (solo si está configurado)
    if (resend) {
      try {
        const emailResult = await resend.emails.send({
          from: 'DMC Photo <no-reply@dmcphoto.art>',
          to: email,
          subject: '🔐 Código de acceso a galería DMC Photo',
          html: `
            <h2>Hola ${nombre || 'cliente'},</h2>
            <p>Tu código de acceso es: <strong>${codigo}</strong></p>
            <p>Accede en: <a href="https://dmcphotography.arcadina.com/lang/es/">dmcphotography.arcadina.com</a></p>
          `
        });
        console.log('Correo enviado:', emailResult);
      } catch (emailError) {
        console.error('Error al enviar correo:', emailError);
      }
    } else {
      console.error('RESEND_API_KEY no configurada');
    }

    return NextResponse.json({ 
      ok: true, 
      mensaje: 'Registro exitoso, revisa tu correo',
      codigo: codigo 
    });

  } catch (error) {
    console.error('Error general:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}