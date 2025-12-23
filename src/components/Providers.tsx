'use client'

import { useState, useEffect } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Render children immediately but mark as mounted after hydration
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
