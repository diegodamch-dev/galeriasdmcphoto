'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {

  const router = useRouter()

  useEffect(() => {

    const handleAuth = async () => {

      const { data, error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      )

      console.log(data)
      console.log(error)

      router.push('/galeria')
    }

    handleAuth()

  }, [router])

  return <p>Ingresando...</p>
}