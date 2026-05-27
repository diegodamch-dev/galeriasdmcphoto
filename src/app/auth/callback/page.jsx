'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {

    const handleAuth = async () => {

      const code = searchParams.get('code')

      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      console.log('SESSION:', data)
      console.log('ERROR:', error)

      router.replace('/galeria')
    }

    handleAuth()

  }, [router, searchParams])

  return <p>Ingresando...</p>
}