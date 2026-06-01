'use client';

import { textos } from '@/idiomas/textos';
import { useEffect, useState } from 'react';

export default function PopupGaleria({
  isOpen,
  onClose,
  modo = 'register' // 'register' o 'login'
}) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [lang, setLang] = useState('es');

  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved) setLang(saved);

    const handleLanguageChange = (event) => {
      setLang(event.detail);
    };

    window.addEventListener('languageChanged', handleLanguageChange);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const t = textos[lang].popup;

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMsg('');

    try {
      let url = '';
      let body = {};

      if (modo === 'register') {
        // Registro: guarda nombre, email, contraseña
        url = 'https://script.google.com/macros/s/AKfycbzOpeK6CaZBOTsWpafxw-eaFnmBvvcoSRPFXHaM7sIXVyVrmQzPwbMkvYqNPAuYzQmqVw/exec';
        body = {
          action: 'registro',
          nombre: nombre,
          email: email,
          password: password,
          evento: 'DMC Photo',
          fecha: new Date().toISOString(),
          estado: 'pendiente' // pendiente de compra
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!response.ok) throw new Error('Error al registrar');

        const result = await response.json();
        console.log('Registro guardado:', result);

        // Enviar enlace de acceso por correo (simulado)
        const enlace = `https://dmcphotography.arcadina.com/lang/es/galeria?email=${encodeURIComponent(email)}`;
        
        setMsg(
          lang === 'es'
            ? `¡Registro exitoso! Revise su correo: ${email}. Enlace de acceso: ${enlace}`
            : `Registration successful! Check your email: ${email}. Access link: ${enlace}`
        );

        // Limpiar campos
        setNombre('');
        setEmail('');
        setPassword('');

        // Cerrar popup después de 3 segundos
        setTimeout(() => {
          onClose();
          setMsg('');
        }, 3000);

      } else if (modo === 'login') {
        // Login: verificar credenciales (necesita API adicional)
        // Por ahora simula éxito si el email tiene @ y password no está vacío
        if (!email.includes('@') || password.length < 3) {
          throw new Error('Credenciales inválidas');
        }

        setMsg(
          lang === 'es'
            ? `Acceso concedido. Redirigiendo a la galería...`
            : `Access granted. Redirecting to gallery...`
        );

        setTimeout(() => {
          window.location.href = `https://dmcphotography.arcadina.com/lang/es/galeria?email=${encodeURIComponent(email)}`;
        }, 1500);
      }

    } catch (err) {
      console.error(err);
      setMsg(
        lang === 'es'
          ? 'Error al procesar la solicitud'
          : 'Error processing request'
      );
    }

    setLoading(false);
  };

  const esRegistro = modo === 'register';

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="popup-close">×</button>

        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {esRegistro ? 'Registro para Galería Privada' : 'Acceso a Galería Privada'}
        </h2>

        <form onSubmit={handleSubmit}>
          {esRegistro && (
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="popup-input"
            />
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="popup-input"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="popup-input"
          />

          <button
            type="submit"
            className="popup-btn"
            disabled={loading}
          >
            {loading ? '...' : (esRegistro ? 'Registrarse' : 'Acceder')}
          </button>
        </form>

        {msg && (
          <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.85rem' }}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}