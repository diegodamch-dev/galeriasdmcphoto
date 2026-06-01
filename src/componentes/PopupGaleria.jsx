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

  // Generar token único para enlace mágico
  const generarToken = () => {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMsg('');

    try {
      const token = generarToken();
      const magicLink = `https://dmcphoto.art/api/acceso?token=${token}&email=${encodeURIComponent(email)}`;
      
      // Enlace real a la galería externa (se enviará por correo)
      const galeriaUrl = 'https://dmcphotography.arcadina.com/lang/es/';
      
      let body = {
        action: modo,
        nombre: nombre,
        email: email,
        token: token,
        evento: 'DMC Photo',
        fecha: new Date().toISOString(),
        estado: 'pendiente'
      };

      const url = 'https://script.google.com/macros/s/AKfycbwHnTbls8sMHVo8sf9c-_zMaY1MfaWsORzYRmvQ_-p3JF86XAhtuXz0S_V0avVWO610Aw/exec';

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Error al guardar');

      const result = await response.json();
      console.log('Guardado:', result);

      // Aquí debería enviar el correo con el enlace mágico
      // Por ahora simulamos el envío
      console.log('Enlace mágico (simulado):', magicLink);
      
      setMsg(
        lang === 'es'
          ? `¡Registro exitoso! Hemos enviado un enlace mágico a ${email}. Revise su correo (incluso spam).`
          : `Registration successful! We've sent a magic link to ${email}. Check your inbox (including spam).`
      );

      setNombre('');
      setEmail('');

      setTimeout(() => {
        onClose();
        setMsg('');
      }, 4000);

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
          {esRegistro ? 'Acceso a Galería Privada' : 'Iniciar Sesión'}
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

          <button
            type="submit"
            className="popup-btn"
            disabled={loading}
          >
            {loading ? 'Enviando...' : (esRegistro ? 'Enviar enlace mágico' : 'Enviar enlace de acceso')}
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