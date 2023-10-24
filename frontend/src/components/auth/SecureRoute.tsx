import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/contexts/AuthContext'

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
