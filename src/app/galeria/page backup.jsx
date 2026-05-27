'use client';

import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from "next/navigation";
import PopupGaleria from '@/componentes/PopupGaleria';

function GaleriaContenido() {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const searchParams = useSearchParams();
  const modo = searchParams.get("modo") || 'magic';

  useEffect(() => {
    const checkUser = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    setShowPopup(true);
    return;
  }

  setUser(session.user);

  window.location.href =
    "https://diegodamchgmailcom.pic-time.com/client";
};

checkUser();
  }, []);

  if (!user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundImage: 'url("/images/landing/DMC_26_29_011772.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          filter: 'grayscale(100%) contrast(1.25)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.72)',
          }}
        />

        {showPopup && (
          <PopupGaleria
            isOpen={true}
            modoInicial={modo}
            onClose={() => {
              setShowPopup(false);
              window.location.href = '/';
            }}
          />
        )}
      </div>
    );
  }

  return null;
}

export default function GaleriaPage() {
  return (
    <Suspense fallback={null}>
      <GaleriaContenido />
    </Suspense>
  );
}