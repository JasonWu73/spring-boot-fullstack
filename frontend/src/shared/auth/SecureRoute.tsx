import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/shared/auth/AuthProvider'
import { ADMIN, ROOT, USER } from '@/shared/auth/constants'

type SecureRouteProps = {
  authority?: 'root' | 'admin' | 'user'
}

function SecureRoute({ authority }: SecureRouteProps): React.JSX.Element {
  const { auth, isRoot, isAdmin, isUser } = useAuth()

  // 未登录，则跳转到登录页面
  if (!auth) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />
  }

  // 若用户已登录，但未拥有组件的访问权限，则跳转到 404 页面
  if (authority === ROOT.value && !isRoot) {
    return <Navigate to="/404" replace />
  }

  if (authority === ADMIN.value && !isAdmin) {
    return <Navigate to="/404" replace />
  }

  if (authority === USER.value && !isUser) {
    return <Navigate to="/404" replace />
  }

  // 若用户已登录，且拥有组件的访问权限，则渲染子组件
  return <Outlet />
}

export { SecureRoute }
