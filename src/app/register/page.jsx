'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrarse');
      router.push('/login?registered=true');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Registro</h1>
        
        {error && (
          <div className="register-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-field">
            <label className="register-label">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="register-input"
              placeholder="Tu nombre"
            />
          </div>
          
          <div className="register-field">
            <label className="register-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="register-input"
              placeholder="tu@email.com"
            />
          </div>
          
          <div className="register-field">
            <label className="register-label">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="register-input"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="register-button"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        
        <p className="register-footer">
          ¿Ya tienes cuenta? <Link href="/login" className="register-link">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}