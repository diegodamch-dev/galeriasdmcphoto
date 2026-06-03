import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { nombre, email, plan, timestamp } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'El email es obligatorio' },
        { status: 400 }
      );
    }

    // Guardar en Google Sheets
    const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwHnTbls8sMHVo8sf9c-_zMaY1MfaWsORzYRmvQ_-p3JF86XAhtuXz0S_V0avVWO610Aw/exec';
    
    const body = {
      nombre: nombre || '',
      email: email,
      plan: plan || '',
      timestamp: timestamp || new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' }),
      evento: 'Club DMC - Membresía'
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

    // Enviar correo de confirmación con Resend
    try {
      await resend.emails.send({
        from: 'DMC Photo <no-reply@dmcphoto.art>',
        to: email,
        subject: '🔐 Solicitud de membresía Club DMC 2026',
        html: `
          <h2>Hola ${nombre || 'cliente'},</h2>
          <p>Hemos recibido tu solicitud de membresía para el <strong>Club DMC 2026</strong>.</p>
          <p><strong>Plan seleccionado:</strong> ${plan}</p>
          <p>En las próximas horas recibirás instrucciones de pago y tus credenciales de acceso a la galería privada.</p>
          <p>Gracias por confiar en DMC Photo.</p>
          <hr>
          <p style="font-size: 12px; color: #666;">DMC Photo - Fotografía deportiva y de montaña</p>
        `
      });
    } catch (emailError) {
      console.error('Error al enviar correo:', emailError);
      // No fallamos la petición si solo falla el correo
    }

    return NextResponse.json({ 
      ok: true, 
      mensaje: 'Registro exitoso, revisa tu correo'
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}