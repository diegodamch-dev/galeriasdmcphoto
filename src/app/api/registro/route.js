import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Precios por foto según plan
const PRECIOS_POR_FOTO = {
  'Cóndor Early Bird': 1250,
  'Cóndor': 1250,
  'Caracara': 1750,
  'Jilguero': 2250
};

// Montos de membresía según plan
const MONTOS_MEMBRESIA = {
  'Cóndor Early Bird': 40000,
  'Cóndor': 32500,
  'Caracara': 27500,
  'Jilguero': 20000
};

// Códigos de cupón según plan
const CODIGOS_CUPON = {
  'Cóndor Early Bird': 'DESCUENTO_CONDOR',
  'Cóndor': 'DESCUENTO_CONDOR',
  'Caracara': 'DESCUENTO_CARACARA',
  'Jilguero': 'SIN_DESCUENTO'
};

export async function POST(request) {
  try {
    const { nombre, email, plan, timestamp } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'El email es obligatorio' },
        { status: 400 }
      );
    }

    if (!plan) {
      return NextResponse.json(
        { error: 'Debes seleccionar un plan' },
        { status: 400 }
      );
    }

    // URL CORRECTA de Google Sheets
    const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwHnTbls8sMHVo8sf9c-_zMaY1MfaWsORzYRmvQ_-p3JF86XAhtuXz0S_V0avVWO610Aw/exec';
    
    const body = {
      nombre: nombre || '',
      email: email,
      plan: plan,
      timestamp: timestamp || new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' }),
      evento: 'Club DMC - Membresía',
      precioFoto: PRECIOS_POR_FOTO[plan] || 2250,
      montoMembresia: MONTOS_MEMBRESIA[plan] || 20000,
      codigoCupon: CODIGOS_CUPON[plan] || 'SIN_DESCUENTO'
    };

    // Enviar a Google Sheets
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const googleResult = await response.json();
    console.log('Respuesta de Google Sheets:', googleResult);

    if (!response.ok) {
      throw new Error('Error al guardar en Google Sheets');
    }

    // Enviar correo de confirmación
    const emailResult = await resend.emails.send({
      from: 'DMC Photo <no-reply@dmcphoto.art>',
      to: email,
      subject: '🔐 Solicitud de membresía Club DMC 2026',
      html: `
        <h2>Hola ${nombre || 'cliente'},</h2>
        
        <p>Hemos recibido tu solicitud de membresía para el <strong>Club DMC 2026</strong>.</p>
        
        <p><strong>Plan seleccionado:</strong> ${plan}</p>
        <p><strong>Monto a transferir:</strong> $${MONTOS_MEMBRESIA[plan].toLocaleString()}</p>
        
        <h3>📌 Datos para la transferencia bancaria:</h3>
        <p>
          Banco: Bancoestado<br>
          Titular: DMCPhoto<br>
          RUT: 76061484k<br>
          Email: dmcphoto2002@yahoo.com<br>
          Número de cuenta: 27070042806<br>
          <strong>Monto:</strong> $${MONTOS_MEMBRESIA[plan].toLocaleString()}
        </p>
        
        <h3>🔗 Instrucciones para acceder a la galería:</h3>
        <p>
          Una vez realizada la transferencia, accede a la galería con estos datos:<br><br>
          <strong>Enlace:</strong> <a href="https://dmcphotography.arcadina.com/galeria/prueba-club-junio-2026">https://dmcphotography.arcadina.com/galeria/prueba-club-junio-2026</a><br>
          <strong>Usuario:</strong> cliente.${plan.toLowerCase().replace(' ', '')}<br>
          <strong>Contraseña:</strong> ${plan}2026
        </p>
        
        <h3>🏷️ Código de descuento para fotos extras:</h3>
        <p>
          <strong style="background-color: #f0f0f0; padding: 8px 16px; border-radius: 5px; font-size: 18px;">
            ${CODIGOS_CUPON[plan]}
          </strong>
        </p>
        <p><strong>Precio por foto con descuento:</strong> $${PRECIOS_POR_FOTO[plan].toLocaleString()}</p>
        
        <hr>
        <p style="font-size: 12px;">DMC Photo - Fotografía deportiva y de montaña</p>
        <p style="font-size: 12px;">Envía el comprobante de transferencia a dmcphoto2002@yahoo.com para activar tu cuenta.</p>
      `
    });

    console.log('Correo enviado:', emailResult);

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