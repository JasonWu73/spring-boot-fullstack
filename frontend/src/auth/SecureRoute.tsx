import { Navigate, Outlet } from 'react-router-dom'

import { ADMIN, ROOT, USER, useAuth, type Authority } from '@/auth/AuthProvider'

type SecureRouteProps = {
  authority?: Authority
}

function SecureRoute({ authority }: SecureRouteProps) {
  const { auth, isRoot, isAdmin, isUser } = useAuth()

  if (!auth) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />
  }

  if (authority === ROOT.value && !isRoot) {
    return <Navigate to="/404" replace />
  }

  if (authority === ADMIN.value && !isAdmin) {
    return <Navigate to="/404" replace />
  }

  if (authority === USER.value && !isUser) {
    return <Navigate to="/404" replace />
  }

  return <Outlet />
}

export { SecureRoute }
