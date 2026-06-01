'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CallbackContent() {
  const searchParams = useSearchParams();
  
  // Aquí va la lógica que ya tenía
  // Por ahora solo muestra un mensaje
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Procesando autenticación...</h1>
      <p>Redirigiendo...</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CallbackContent />
    </Suspense>
  );
}