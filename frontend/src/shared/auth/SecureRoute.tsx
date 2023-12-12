import { Navigate, Outlet } from 'react-router-dom'

import {
  ADMIN,
  getAuth,
  hasAdmin,
  hasRoot,
  hasUser,
  ROOT,
  USER
} from '@/shared/signals/auth'

type SecureRouteProps = {
  authority?: 'root' | 'admin' | 'user'
}

export function SecureRoute({ authority }: SecureRouteProps) {
  // 未登录，则跳转到登录页面
  const auth = getAuth()

  if (!auth) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />
  }

  // 若用户已登录，但未拥有组件的访问权限，则跳转到 403 页面
  if (
    (authority === ROOT.value && !hasRoot()) ||
    (authority === ADMIN.value && !hasAdmin()) ||
    (authority === USER.value && !hasUser())
  ) {
    return <Navigate to="/403" replace />
  }

  // 若用户已登录，且拥有组件的访问权限，则渲染子组件
  return <Outlet />
}
