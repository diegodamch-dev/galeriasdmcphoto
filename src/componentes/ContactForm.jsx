'use client';
import { useState, useEffect } from 'react';
import { textos } from '@/idiomas/textos';
import useMobile from '@/hooks/useMobile';

export default function ContactForm() {
  const isMobile = useMobile();  // ← Agrega esta línea
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);

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

const t = textos[lang].contacto;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
    setFormData({ nombre: '', email: '', mensaje: '' });
    setTimeout(() => setEnviado(false), 5000);
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem 1.5rem',
    borderRadius: '50px',
    border: '1px solid var(--color-accent)',
    fontSize: '1rem',
    boxSizing: 'border-box',
    backgroundColor: 'white',
    outline: 'none'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical'
  };

  return (
    <section className="contact" id="contacto">
      <div className="contact-container" style={isMobile ? { display: 'flex', flexDirection: 'column', gap: '2rem' } : {}}>
        <div className="contact-info">
          <h2 className="contact-title">{t.titulo}</h2>
          <p className="contact-description">
            {t.linea1}<br />
            {t.linea2}<br />
            {t.linea3}
          </p>
          <ul className="contact-details">
            <li>
              <span className="contact-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </span>
              <a href="mailto:dmcphoto2002@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                dmcphoto2002@gmail.com
              </a>
            </li>
            <li>
              <span className="contact-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.032 2.001c-5.523 0-10 4.477-10 10 0 1.826.49 3.536 1.338 5.01L2 22l5.146-1.334c1.43.796 3.06 1.23 4.79 1.23 5.522 0 10-4.477 10-10s-4.478-10-10-10zm0 18.197c-1.5 0-2.965-.41-4.236-1.173l-.316-.188-3.058.793.814-2.962-.2-.33a7.98 7.98 0 0 1-1.224-4.258c0-4.405 3.582-7.987 7.987-7.987s7.987 3.582 7.987 7.987-3.582 7.987-7.987 7.987zm4.288-5.715c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.64-1.19-1.42-1.33-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.4-.54-.42-.14-.02-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.68 2.56 4.06 3.6.57.24 1.01.39 1.36.5.57.18 1.09.15 1.5.09.46-.06 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/>
                </svg>
              </span>
              <a href="https://wa.me/56964193557" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                +56 9 6419 3557
              </a>
            </li>
            <li>
              <span className="contact-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </span>
              Santiago, Chile
            </li>
          </ul>

          <div className="contact-social">
            <a href="https://www.instagram.com/dmc.photography.art" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/dmcphotography" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="contact-form-wrapper">
          <form onSubmit={handleSubmit} className="contact-form">
            <h3 className="contact-form-title">{t.formTitulo}</h3>
            
            <div className="contact-field">
              <label htmlFor="nombre" style={{ marginBottom: '0.5rem', display: 'block' }}>{t.nombre}</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div className="contact-field">
              <label htmlFor="email" style={{ marginBottom: '0.5rem', display: 'block' }}>{t.email}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div className="contact-field">
              <label htmlFor="mensaje" style={{ marginBottom: '0.5rem', display: 'block' }}>{t.mensaje}</label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                required
                rows="5"
                style={textareaStyle}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              {t.boton}
            </button>
            {enviado && <p className="contact-success">{t.exito}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}