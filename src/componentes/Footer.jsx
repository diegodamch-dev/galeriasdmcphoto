'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-container" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={scrollToTop}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: 0
            }}
            aria-label="Volver arriba"
          >
            <Image 
              src="/images/landing/DMC logo 2025.png" 
              alt="Logo" 
              width={60} 
              height={60} 
              style={{ borderRadius: '50%' }} 
            />
          </button>
          <p>&copy; {new Date().getFullYear()} DMCPhoto</p>
        </div>
      </div>
    </footer>
  );
}