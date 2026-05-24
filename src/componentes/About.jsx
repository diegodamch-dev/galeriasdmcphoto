'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { textos } from '@/idiomas/textos';
import useMobile from '@/hooks/useMobile';

export default function About() {
  const isMobile = useMobile();
  const router = useRouter();
  const [lang, setLang] = useState("es");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);

    const handleLanguageChanged = (event) => {
      setLang(event.detail);
    };

     window.addEventListener("languageChanged", handleLanguageChanged);
    
    return () => {
      window.removeEventListener("languageChanged", handleLanguageChanged);
    };
  }, []);
   
  const t= textos[lang].about;

  return (
    <section className="about" id="sobre-mi">
      <div className="about-container" style={isMobile ? { display: 'flex', flexDirection: 'column', gap: '2rem' } : {}}>
        <div className="about-content" style={isMobile ? { width: '100%', padding: '0 0.5rem', textAlign: 'center' } : {}}>
          <h2 className="about-title" style={isMobile ? { textAlign: 'left', display: 'block' } : {}}>DMCPhoto</h2>
          <p className="about-descripcion" style={isMobile ? { fontSize: '1rem', textAlign: 'justify' } : {}}>
            {t.descripcion1}
          </p>
          <p className="about-descripcion" style={isMobile ? { fontSize: '1rem', textAlign: 'justify' } : {}}>
          {t.descripcion2}  
          </p>
          <button 
  onClick={() => router.push('/galeria')} 
  className="btn btn-primary"
>
  {t.boton}
</button>
        </div>
        <div className="about-image-wrapper">
          <Image
            src="/images/landing/DMC logo 2025.png"
            alt="DMCphoto"
            width={600}
            height={600}
            className="about-image"
          />
        </div>
      </div>
    </section>
  );
}