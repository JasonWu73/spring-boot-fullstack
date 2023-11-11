import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/features/auth/AuthProvider'

function SecureRoute() {
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

  return <Outlet />
}

export { SecureRoute }
