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
  'Cóndor Early Bird': 'CLa8AhGnOd',
  'Cóndor': 'CLa8AhGnOd',
  'Caracara': 'AJeKHCvX5L',
  'Jilguero': 'SIN_DESCUENTO'
};

// Función para generar usuario (email sin dominio)
function generarUsuario(email) {
  return email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Función para generar contraseña aleatoria de 8 caracteres
function generarContraseña() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let contraseña = '';
  for (let i = 0; i < 8; i++) {
    contraseña += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return contraseña;
}

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

    // Generar usuario y contraseña
    const usuario = generarUsuario(email);
    const contraseña = generarContraseña();

    // URL de Google Sheets
    const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbyl3hCuqQ3tnotpMV42QSqjKUE5L4qYOZtqZlOkNetop7DhLhriqIOZuwh7x857ARBUhw/exec';

    const body = {
      nombre: nombre || '',
      email: email,
      plan: plan,
      usuario: usuario,
      contraseña: contraseña,
      timestamp: timestamp || new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' }),
      evento: 'Club DMC - Membresía',
      precioFoto: PRECIOS_POR_FOTO[plan] || 0,
      montoMembresia: MONTOS_MEMBRESIA[plan] || 0,
      codigoCupon: CODIGOS_CUPON[plan] || 'SIN_DESCUENTO'
    };

    // Enviar a Google Sheets
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error('Error en Google Script:', await response.text());
      throw new Error('Error al guardar en Google Sheets');
    }

    const monto = MONTOS_MEMBRESIA[plan] || 0;
    const precioFoto = PRECIOS_POR_FOTO[plan] || 0;
    const codigo = CODIGOS_CUPON[plan] || 'SIN_DESCUENTO';

    // Enviar correo de confirmación
    await resend.emails.send({
      from: 'DMC Photo <no-reply@dmcphoto.art>',
      to: email,
      subject: '🔐 Solicitud de membresía Club DMC 2026',
      html: `
        <h2>Hola ${nombre || 'cliente'},</h2>
        
        <p>Hemos recibido tu solicitud de membresía para el <strong>Club DMC 2026</strong>.</p>
        
        <p><strong>Plan seleccionado:</strong> ${plan}</p>
        <p><strong>Monto a transferir:</strong> $${monto.toLocaleString()}</p>
        
        <h3>📌 Datos para la transferencia bancaria:</h3>
        <p>
          Banco: Bancoestado<br>
          Titular: DMCPhoto<br>
          RUT: 76061484k<br>
          Email: dmcphoto2002@yahoo.com<br>
          Número de cuenta: 27070042806<br>
          <strong>Monto:</strong> $${monto.toLocaleString()}
        </p>
        
        <h3>🔗 Tus credenciales de acceso a la galería:</h3>
        <p>
          <strong>Usuario:</strong> ${usuario}<br>
          <strong>Contraseña:</strong> ${contraseña}<br><br>
          <strong>Enlace:</strong> <a href="https://dmcphotography.arcadina.com/lang/es/cmi-26">https://dmcphotography.arcadina.com/lang/es/cmi-26</a>
        </p>
        
        <h3>🏷️ Código de descuento para fotos extras:</h3>
        <p>
          <strong style="background-color: #f0f0f0; padding: 8px 16px; border-radius: 5px; font-size: 18px;">
            ${codigo}
          </strong>
        </p>
        <p><strong>Precio por foto con descuento:</strong> $${precioFoto.toLocaleString()}</p>
        <p><strong>Instrucciones:</strong> Al momento de pagar en el carrito, ingresa este código en el campo "Cupón de descuento".</p>
        
        <hr>
        <p style="font-size: 12px;">DMC Photo - Fotografía deportiva y de montaña</p>
        <p style="font-size: 12px;">Envía el comprobante de transferencia a dmcphoto2002@yahoo.com para activar tu cuenta.</p>
      `
    });

    return NextResponse.json({ 
      ok: true, 
      mensaje: 'Registro exitoso, revisa tu correo',
      usuario: usuario,
      contraseña: contraseña
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}