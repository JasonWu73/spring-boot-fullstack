import { Navigate, Outlet, useLocation } from "react-router-dom";

import ForbiddenPage from "@/shared/components/ui/ForbiddenPage";
import {
  ADMIN,
  getAuth,
  hasAdmin,
  hasRoot,
  hasUser,
  ROOT,
  USER,
} from "@/shared/auth/auth-signals";

type SecureRouteProps = {
  authority?: "root" | "admin" | "user";
};

export function SecureRoute({ authority }: SecureRouteProps) {
  const location = useLocation();
  const auth = getAuth();

  // 未登录，则跳转到登录页面
  if (!auth) {
    // 记录当前页面的路径，以便登录后跳转到该页面
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // 若用户已登录，但未拥有组件的访问权限，则跳转到 403 页面
  if (
    (authority === ROOT.value && !hasRoot()) ||
    (authority === ADMIN.value && !hasAdmin()) ||
    (authority === USER.value && !hasUser())
  ) {
    return <ForbiddenPage />;
  }

  // 若用户已登录，且拥有组件的访问权限，则渲染子组件
  return <Outlet />;
}
