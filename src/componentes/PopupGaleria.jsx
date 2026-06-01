'use client';

import { textos } from '@/idiomas/textos';
import { useEffect, useState } from 'react';

export default function PopupGaleria({
  isOpen,
  onClose,
  modo = 'register'
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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMsg('');

    try {
      // Llamar a nuestra propia API (no directamente a Google)
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre,
          email: email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar');
      }

      console.log('Respuesta:', data);

      setMsg(
        lang === 'es'
          ? `¡Registro exitoso! Hemos enviado un código a ${email}. Revise su correo (incluyendo spam).`
          : `Registration successful! We've sent a code to ${email}. Check your inbox (including spam).`
      );

      setNombre('');
      setEmail('');

      setTimeout(() => {
        onClose();
        setMsg('');
      }, 4000);

    } catch (err) {
      console.error('Error:', err);
      setMsg(
        lang === 'es'
          ? `Error: ${err.message}`
          : `Error: ${err.message}`
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

          <button
            type="submit"
            className="popup-btn"
            disabled={loading}
          >
            {loading ? 'Enviando...' : (esRegistro ? 'Registrarse' : 'Acceder')}
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