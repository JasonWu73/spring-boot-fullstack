import { Navigate, Outlet, useLocation } from 'react-router-dom'

import ErrorPage from '@/shared/components/ui/ErrorPage'
import { ADMIN, getAuth, hasAdmin, hasRoot, hasUser, ROOT, USER } from '@/shared/auth/auth-signals'

type SecureRouteProps = {
  authority?: 'root' | 'admin' | 'user'
}

export function SecureRoute({ authority }: SecureRouteProps) {
  const location = useLocation()
  const auth = getAuth()

  // ----- 未登录，则跳转到登录页面 -----
  // 记录当前页面的路径，以便登录后跳转到该页面
  if (!auth) return <Navigate to="/login" replace state={{ from: location.pathname }}/>

  // ----- 已登录，则判断是否拥有组件的访问权限 -----
  if (
    (authority === ROOT.value && !hasRoot()) ||
    (authority === ADMIN.value && !hasAdmin()) ||
    (authority === USER.value && !hasUser())
  ) {
    return <ErrorPage forbidden/>
  }

  // ----- 已登录，且拥有组件的访问权限，则渲染组件 -----
  return <Outlet/>
}
