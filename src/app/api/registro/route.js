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

// Códigos de cupón según plan (CORREGIDOS)
const CODIGOS_CUPON = {
  'Cóndor Early Bird': 'UmLIwuHH7L',
  'Cóndor': 'UmLIwuHH7L',
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

// Función para calcular fecha límite de pago (48 horas después)
function fechaLimitePago() {
  const fecha = new Date();
  fecha.setHours(fecha.getHours() + 48);
  return fecha.toLocaleString('es-CL', { 
    timeZone: 'America/Santiago',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
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
    const fechaLimite = fechaLimitePago();

    // Enviar correo de confirmación
    await resend.emails.send({
      from: 'DMC Photo <no-reply@dmcphoto.art>',
      to: email,
      subject: 'Bienvenido al Club DMC 2026 - Completa tu membresía',
      html: `
        <h2>Hola ${nombre || 'cliente'},</h2>
        
        <p>¡Gracias por confiar en DMC Photo y querer ser parte del <strong>Club DMC 2026</strong>!</p>
        
        <h3>📌 Resumen de tu solicitud:</h3>
        <ul>
          <li><strong>Plan seleccionado:</strong> ${plan}</li>
          <li><strong>Precio por foto (con descuento):</strong> $${precioFoto.toLocaleString()}</li>
          <li><strong>Monto de membresía a pagar:</strong> $${monto.toLocaleString()}</li>
        </ul>
        
        <h3>📌 ¿Cómo activar tu membresía?</h3>
        <p>
          1. Realiza una transferencia bancaria por el monto de <strong>$${monto.toLocaleString()}</strong> a los siguientes datos:<br><br>
          <strong>Banco:</strong> Bancoestado<br>
          <strong>Titular:</strong> DMCPhoto<br>
          <strong>RUT:</strong> 76061484k<br>
          <strong>Email:</strong> dmcphoto2002@yahoo.com<br>
          <strong>Número de cuenta:</strong> 27070042806
        </p>
        <p>
          2. Envía el comprobante de transferencia a: <strong>dmcphoto2002@yahoo.com</strong>
        </p>
        <p>
          3. Espera nuestra confirmación (en un plazo máximo de 48 horas hábiles).
        </p>
        
        <p><strong>📅 Fecha límite para pagar tu membresía:</strong> ${fechaLimite}</p>
        <p>Si no realizas el pago antes de esta fecha, tu solicitud será cancelada.</p>
        
        <p>Una vez que acreditemos tu pago, te enviaremos un segundo correo con tu <strong>enlace de acceso directo</strong> a la galería privada y tu <strong>código de descuento personal</strong>.</p>
        
        <p>¡Gracias por ser parte de esta comunidad!</p>
        
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