'use client';

import { useState, useEffect } from 'react';
import PopupGaleria from './popupgaleria';

export default function AuthButtons() {
  const [popupAbierto, setPopupAbierto] = useState(false);
  const [modoPopup, setModoPopup] = useState('register'); // 'register' o 'login'
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    setLogged(!!localStorage.getItem('token'));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.href = '/';
  };

  const abrirPopup = (modo) => {
    setModoPopup(modo);
    setPopupAbierto(true);
  };

  const cerrarPopup = () => {
    setPopupAbierto(false);
    setModoPopup('register');
  };

  if (logged) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={logout} className="btn btn-primary">
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button onClick={() => abrirPopup('login')} className="btn btn-primary">
          Login
        </button>

        <button onClick={() => abrirPopup('register')} className="btn btn-primary">
          Register
        </button>

        <button 
          onClick={() => abrirPopup('register')} 
          className="btn btn-primary"
          style={{ background: 'var(--color-accent)', fontWeight: 'bold' }}
        >
          Acceder a Galería Privada
        </button>
      </div>

      <PopupGaleria 
        isOpen={popupAbierto} 
        onClose={cerrarPopup} 
        modo={modoPopup}
      />
    </>
  );
}