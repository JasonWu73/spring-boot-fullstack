import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/components/auth/AuthProvider'

type RequireAuthProps = {
  children: React.ReactNode
}

function RequireAuth({ children }: RequireAuthProps) {
  const { auth } = useAuth()
  const location = useLocation()

  if (!auth) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export { RequireAuth }
