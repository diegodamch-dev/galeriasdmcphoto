'use client';
import { useState, useEffect } from 'react';

export default function Popup({ message, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: 'var(--color-primary)',
      color: 'white',
      padding: '1rem',
      borderRadius: 'var(--border-radius)',
      boxShadow: 'var(--box-shadow)',
      zIndex: 1000
    }}>
      <p>{message}</p>

      <button 
        onClick={() => setIsVisible(false)}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          position: 'absolute',
          top: '5px',
          right: '10px',
          cursor: 'pointer',
          fontSize: '1.2rem'
        }}
      >
        ×
      </button>
    </div>
  );
}