'use client';

import { useEffect, useState } from 'react';

export default function AuthButtons() {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    setLogged(!!localStorage.getItem('token'));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const goGaleria = (modo) => {
    window.location.href = `/galeria?modo=${modo}`;
  };

  if (logged) {
    return (
      <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <button onClick={logout} 
      className="btn btn-primary"
      >
        Logout
      </button>
      </div>
    );
  }

  return (
    <>
      <button onClick={() => goGaleria('login')}
        className="btn btn-primary"
        >
        Login
      </button>

      <button onClick={() => goGaleria('register')}
      className="btn btn-primary"
      >
        Register
      </button>
    </>
  );
}