import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/auth/AuthProvider'

type SecureRouteProps = {
  authority?: 'root' | 'admin' | 'user'
}

function SecureRoute({ authority }: SecureRouteProps) {
  const { auth, isRoot, isAdmin, isUser } = useAuth()

  if (!auth) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />
  }

  if (authority === 'root' && !isRoot) {
    return <Navigate to="/404" replace />
  }

  if (authority === 'admin' && !isAdmin) {
    return <Navigate to="/404" replace />
  }

  if (authority === 'user' && !isUser) {
    return <Navigate to="/404" replace />
  }

  return <Outlet />
}

export { SecureRoute }
