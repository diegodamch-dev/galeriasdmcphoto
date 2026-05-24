"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from "react";
import AuthButtons from '@/componentes/AuthButtons';
import './globals.css';

export default function RootLayout({ children }) {
  const [lang, setLang] = useState("es");

useEffect(() => {
  const saved = localStorage.getItem("lang");
  if (saved) setLang(saved);
},[]);

const toggleLang = () => {
  const newLang = lang === "es" ? "en" : "es";
  setLang(newLang);
  localStorage.setItem("lang", newLang);
  window.location.reload();
};

return (
<html lang={lang}>
  <body>
    <header
     style={{
      position:'absolute',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 20,
      padding: "1rem 2rem",
      borderBottom: "none",
      backgroundColor: "transparent",
      display: "grid",
      gridTemplateColumns: " 1fr 1fr 1fr",
      alignItems: "center",
    }}
    >
      {/* LOGO */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="/">
              <Image
                src="/images/landing/logo2025 02.png"
                alt="Inicio"
                width={80}
                height={80}
                style={{
                  borderRadius: '50%',
                  cursor: 'pointer',
                  objectFit: 'cover',
                }}
              />
            </Link>
          </div>

          <div></div>
          {/* DERECHA */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              alignItems: 'center',
              width: "100%",
            }}
          >
            <AuthButtons />
          <span
            onClick={toggleLang}
            className="lang-switch"
          >
            <span className="lang-icon">🌍</span>
            {lang === 'es' ? 'EN' : 'ES'}
        </span>
            

          </div>
        </header>

        {children}
      </body>
    </html>
  );
}