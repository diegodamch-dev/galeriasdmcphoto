'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PopupGaleria from './PopupGaleria';
import useMobile from '@/hooks/useMobile';
import { textos } from '@/idiomas/textos';

export default function Hero() {
  const router = useRouter();
  const isMobile = useMobile();
  const [showPopup, setShowPopup] = useState(false);
  const [lang, setLang] = useState('es');
  
  
  const scrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  const images = [
    '/images/landing/articles-611946_thumbnail.jpg',
    '/images/landing/articles-612587_thumbnail.jpg',
    '/images/landing/articles-612596_thumbnail.jpg',
    '/images/landing/EMBUDO.jpg',
    '/images/landing/DMC_26_29_011763.jpg',
    '/images/landing/DMC_26_29_011767.jpg',
    '/images/landing/DMC_26_29_011768.jpg',
    '/images/landing/DMC_26_29_011769.jpg',
    '/images/landing/DMC_26_29_011771.jpg',
    '/images/landing/DMC_26_29_011772.jpg',
    '/images/landing/DMC_26_29_011774.jpg',
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [prevImage, setPrevImage] = useState(0);

  

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
  const randomStart = Math.floor(Math.random() * images.length);
  setCurrentImage(randomStart);
  setPrevImage(randomStart);
}, [images.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevImage(currentImage);
      setCurrentImage((prev) => (prev +1) % images.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [currentImage, images.length]);

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

const t = textos[lang].hero;

  return (
    <>
      <section 
        className="hero" 
        style={{
          minHeight: '100vh',
          paddingTop: '90px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
  style={{
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${images[prevImage]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 0,
  }}
/>

<div
  key={currentImage}
  style={{
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${images[currentImage]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 1,
    transition: 'opacity 1.6s ease-in-out',
    zIndex: 0,
  }}
/>

<div
  style={{
    position: 'absolute',
    inset: 0,
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'grayscale(100%) contrast(0.95)',
    zIndex: 1,
  }}
/>  

<div className="overlay"></div>

<div
  className="hero-container"
  style={{
    position: 'relative',
    zIndex: 3,
    ...(isMobile
      ? { display: 'flex', flexDirection: 'column-reverse', gap: '2rem' }
      : {}),
  }}
>
          <div className="hero-col-left" style={isMobile ? { marginLeft: '0', justifyContent: 'center' } : {}}>
            <div className="hero-buttons" style={isMobile ? { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' } : undefined}>
              <button
  onClick={scrollToContact}
  className="btn btn-primary"
  style={isMobile ? { width: '220px', margin: '0 auto' } : undefined}
>
  {t.contacto}
</button>

<button
  onClick={() => setShowPopup(true)}
  className="btn btn-primary"
  style={isMobile ? { width: '220px', margin: '0 auto' } : undefined}
>
  {t.acceder}
</button>
            </div>
          </div>
       
          <div className="hero-col-right">
            <h1 className="hero-title">
              <span style={{ fontSize: isMobile ? '2.6rem' : '3.55rem', 
                display: 'block', 
                color: 'var(--color-primary)',
                fontWeight: 600,
                letterSpacing: '0.01em',
                WebkitTextStroke: '0.4px var(--color-white)',
                }}
                >
                  {t.titulo1}
                </span>
              <span style={{ fontSize: isMobile ? '2.5rem' : '3rem', fontWeight: 'normal' }}>DMCPhoto</span>
            </h1>
            <p className="hero-subtitle"
              style={{ 
                color: 'var(--color-primary)',
              fontSize: isMobile ? '1.4rem' : '1.8rem',
              lineHeight: isMobile ? '1.65' : '1.85',
              fontWeight: 500,
              WebkitTextStroke: '0.1px var(--color-white)',
              }}
              >
              {t.subtitulo}
            </p>
          </div>
        </div>
      </section>
      {showPopup && <PopupGaleria isOpen={showPopup} onClose={() => setShowPopup(false)} />}
    </>
  );
}