import React from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '@/components/auth/AuthProvider'

type RequireAuthProps = {
  children: React.ReactNode
}

function RequireAuth({ children }: RequireAuthProps) {
  const { auth } = useAuth()

  if (!auth) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: window.location.pathname }}
      />
    )
  }

  return children
}

export { RequireAuth }
