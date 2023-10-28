import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Toaster } from '@/components/ui/Toaster'
import { wait } from '@/lib/utils'
import { Spinner } from '@/components/ui/Spinner'
import { FriendProvider } from '@/components/eat-split/FriendProvider'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { SecureRoute } from '@/components/auth/SecureRoute'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { PanelFoldProvider } from '@/components/layout/panel-fold/PanelFoldProvider'
import { SpinnerFullPage } from '@/components/ui/SpinnerFullPage'

const MainLayout = lazy(() => import('@/components/layout/MainLayout'))
const AdminLayout = lazy(() => import('@/components/layout/AdminLayout'))
const LoginLayout = lazy(() => import('@/components/layout/LoginLayout'))
const Login = lazy(() => import('@/pages/Login'))
const ProductShowcase = lazy(() => import('@/pages/ProductShowcase'))
const EatAndSplit = lazy(() => import('@/pages/EatAndSplit'))
const PageNotFound = lazy(() => import('@/pages/PageNotFound'))
const UserList = lazy(() => import('@/pages/UserList'))
const ChildrenProp = lazy(() => import('@/pages/ChildrenProp'))
const MemoComponent = lazy(() => import('@/pages/MemoComponent'))
const UseMemo = lazy(() => import('@/pages/UseMemo'))
const UseCallback = lazy(() => import('@/pages/UseCallback'))

// ----- 开始：测试 React Router 懒加载（React Split Code 技术）-----
const FormSplitBill = lazy(() =>
  wait(1).then(() =>
    import('@/components/eat-split/FormSplitBill').then((module) => ({
      default: module.FormSplitBill
    }))
  )
)
// ----- 结束：测试 React Router 懒加载（React Split Code 技术）-----

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="demo-ui-theme">
      <AuthProvider>
        <Suspense fallback={<SpinnerFullPage />}>
          <Routes>
            <Route path="/login" element={<LoginLayout />}>
              <Route index element={<Login />} />
            </Route>

            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/eat-split" replace />} />

              <Route element={<SecureRoute />}>
                <Route path="/fetch" element={<ProductShowcase />} />
              </Route>

              <Route
                path="/eat-split"
                element={
                  <FriendProvider>
                    <EatAndSplit />
                  </FriendProvider>
                }
              >
                <Route
                  path=":friendId"
                  element={
                    <Suspense fallback={<Spinner />}>
                      <FormSplitBill />
                    </Suspense>
                  }
                />
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Route>

            <Route
              element={
                <PanelFoldProvider>
                  <AdminLayout />
                </PanelFoldProvider>
              }
            >
              <Route element={<SecureRoute />}>
                <Route
                  path="/admin"
                  element={<Navigate to="/users" replace />}
                />
                <Route path="/users" element={<UserList />} />
                <Route path="/children" element={<ChildrenProp />} />
                <Route path="/memo" element={<MemoComponent />} />
                <Route path="/use-memo" element={<UseMemo />} />
                <Route path="/use-callback" element={<UseCallback />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>

        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
