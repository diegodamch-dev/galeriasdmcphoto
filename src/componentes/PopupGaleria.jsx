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
  const [plan, setPlan] = useState('');
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

  // Verificar si Early Bird sigue vigente (hasta 15 de junio de 2026)
  const esEarlyBirdValido = () => {
    const hoy = new Date();
    const fechaLimite = new Date(2026, 6, 20); // 15 de junio de 2026 (mes 6 = junio)
    return hoy <= fechaLimite;
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMsg('');

    const timestamp = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });

    try {
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre,
          email: email,
          plan: plan,
          timestamp: timestamp
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar');
      }

      setMsg(
        lang === 'es'
          ? `✅ ¡Registro exitoso! Pronto recibirás tu código de acceso al club.`
          : `✅ Registration successful! You will soon receive your club access code.`
      );

      setNombre('');
      setEmail('');
      setPlan('');

      setTimeout(() => {
        onClose();
        setMsg('');
      }, 4000);

    } catch (err) {
      console.error('Error:', err);
      setMsg(
        lang === 'es'
          ? `❌ Error: ${err.message}`
          : `❌ Error: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const esRegistro = modo === 'register';

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="popup-close">×</button>

        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--color-primary)' }}>
          {esRegistro ? 'Únete al Club DMC 2026' : 'Iniciar Sesión'}
        </h2>

        <form onSubmit={handleSubmit}>
          {esRegistro && (
            <>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="popup-input"
              />

              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="popup-input"
              />

              <select
                name="plan"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                required
                className="popup-input"
                style={{ cursor: 'pointer' }}
              >
                <option value="">Selecciona tu plan</option>
                {esEarlyBirdValido() && (
                  <option value="Cóndor Early Bird">Cóndor Early Bird - $40.000 (hasta 15 junio)</option>
                )}
                <option value="Cóndor">Cóndor - $32.500 (hasta 30 junio)</option>
                <option value="Cáraza">Cáraza - $27.500 (hasta 30 junio)</option>
                <option value="Jilguero">Jilguero - $20.000 (hasta 30 junio)</option>
              </select>
            </>
          )}

          <button
            type="submit"
            className="popup-btn"
            disabled={loading}
          >
            {loading ? 'Enviando...' : (esRegistro ? 'Registrarse' : 'Acceder')}
          </button>
        </form>

        {msg && (
          <p style={{ 
            marginTop: '15px', 
            textAlign: 'center', 
            fontSize: '0.9rem',
            color: msg.includes('✅') ? 'var(--color-success)' : 'var(--color-error)',
            fontWeight: '500'
          }}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}