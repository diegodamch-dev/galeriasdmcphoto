'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PopupGaleria from '@/componentes/PopupGaleria'

function GaleriaContenido() {
  const [user, setUser] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()
  const modo = searchParams.get('modo') || 'magic'

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession()

      console.log('SESSION:', session)
      console.log('ERROR:', error)

      if (!session) {
        setShowPopup(true)
        setLoading(false)
        return
      }

      setUser({
        email: session.user.email,
        name: session.user.email.split('@')[0] || 'Usuario'
      })

      if (!sessionStorage.getItem('redirected')) {
        sessionStorage.setItem('redirected', '1')

        window.location.href =
          'https://diegodamchgmailcom.pic-time.com/client'
      }

      setLoading(false)
    }

    checkAuth()
  }, [])

  if (loading) return null

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
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  )
}

export default function GaleriaPage() {
  return (
    <Suspense fallback={null}>
      <GaleriaContenido />
    </Suspense>
  )
}