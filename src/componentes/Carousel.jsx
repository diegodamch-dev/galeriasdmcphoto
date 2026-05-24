'use client';
import { useState } from 'react';

export default function Carousel() {
  const images = [
    { src: '/images/landing/articles-611946_thumbnail.jpg', alt: 'Foto 1' },
    { src: '/images/landing/articles-612587_thumbnail.jpg', alt: 'Foto 2' },
    { src: '/images/landing/articles-612596_thumbnail.jpg', alt: 'Foto 3' },
    { src: '/images/landing/EMBUDO.jpg', alt: 'Foto 4' },
  ];
  
  const [index, setIndex] = useState(0);

  const next = () => setIndex((index + 1) % images.length);
  const prev = () => setIndex((index - 1 + images.length) % images.length);

  return (
    <section style={{ padding: '2rem 0' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Galería destacada</h2>
      <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
        <img 
          src={images[index].src} 
          alt={images[index].alt} 
          style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }} 
        />
        <button 
          onClick={prev} 
          style={{ 
            position: 'absolute', 
            left: '10px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '20px'
          }}
        >
          ❮
        </button>
        <button 
          onClick={next} 
          style={{ 
            position: 'absolute', 
            right: '10px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '20px'
          }}
        >
          ❯
        </button>
      </div>
    </section>
  );
}