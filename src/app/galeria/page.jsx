'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PopupGaleria from '@/componentes/PopupGaleria'

function GaleriaContenido() {
  const [user, setUser] = useState(null)
  const [showPopup, setShowPopup] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  const modo = searchParams.get("modo") || 'magic'

  useEffect(() => {
    const checkSession = async () => {

      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setShowPopup(true)
        return
      }

      const email = session.user.email

      setUser({
        email,
        name: email?.split('@')[0] || 'Usuario'
      })

      // Si hay sesión, ir a Pic-Time
      window.location.href =
        "https://diegodamchgmailcom.pic-time.com/client"
    }

    checkSession()
  }, [])

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
              setShowPopup(false)
              router.push('/')
            }}
          />
        )}
      </div>
    )
  }

  return null
}

export default function GaleriaPage() {
  return (
    <Suspense fallback={null}>
      <GaleriaContenido />
    </Suspense>
  )
}