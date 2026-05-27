'use client';

import { textos } from '@/idiomas/textos';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function PopupGaleria({ isOpen, onClose, modoInicial ='magic' }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [lang, setLang] = useState('es');

  const [modo, setModo] = useState(modoInicial);
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');

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
    setLoading(true);
    setMsg('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: 'https://dmcphoto.art/auth/callback'}
});

if (error) throw error;

setMsg(
  lang === 'es'
    ? 'Revisa tu correo para ingresar'
    : 'Check your email to login'
);
    } catch (err) {
      setMsg(lang === 'es' ? 'Error al acceder' : 'Access error');
    }

    setLoading(false);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <button
          onClick={onClose}
          className="popup-close"
        >
          ×
        </button>

        <h2>{t.accederGaleria}</h2>

        {modo === 'magic' && (
          <>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="popup-input"
              />

              <button className="popup-btn">
                {loading ? '...' : t.accederBtn}
              </button>
            </form>

            <div className="popup-links">
              <button
                type="button"
                className="popup-link"
                onClick={() => setModo('login')}
              >
                Login
              </button>

              <button
                type="button"
                className="popup-link"
                onClick={() => setModo('register')}
              >
                Registro
              </button>
            </div>
          </>
        )}

        {modo === 'login' && (
          <>
            <form>
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="popup-input"
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="popup-input"
              />

              <button className="popup-btn">
                Entrar
              </button>
            </form>

            <div className="popup-links">
              <button
                type="button"
                className="popup-link"
                onClick={() => setModo('magic')}
              >
                ← volver
              </button>
            </div>
          </>
        )}

        {modo === 'register' && (
          <>
            <form>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="popup-input"
              />

              <input
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="popup-input"
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="popup-input"
              />

              <button className="popup-btn">
                Crear cuenta
              </button>
            </form>

            <div className="popup-links">
              <button
                type="button"
                className="popup-link"
                onClick={() => setModo('magic')}
              >
                ← volver
              </button>
            </div>
          </>
        )}

        {msg && (
          <p style={{ marginTop: 10 }}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}