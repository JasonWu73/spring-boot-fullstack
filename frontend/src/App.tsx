import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Toaster } from '@/ui/shadcn-ui/Toaster'
import { wait } from '@/utils/helpers'
import { Spinner } from '@/ui/Spinner'
import { FriendProvider } from '@/features/eat-split/FriendProvider'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { SecureRoute } from '@/features/auth/SecureRoute'
import { ThemeProvider } from '@/ui/shadcn-ui/ThemeProvider'
import { PanelFoldProvider } from '@/ui/layout/panel-fold/PanelFoldProvider'
import { SpinnerFullPage } from '@/ui/SpinnerFullPage'

const MainLayout = lazy(() => import('@/ui/layout/MainLayout'))
const AdminLayout = lazy(() => import('@/ui/layout/AdminLayout'))
const LoginLayout = lazy(() => import('@/ui/layout/LoginLayout'))
const Login = lazy(() => import('@/features/auth/Login'))
const ProductShowcase = lazy(
  () => import('@/features/product-showcase/ProductShowcase')
)
const EatAndSplit = lazy(() => import('@/features/eat-split/EatAndSplit'))
const PageNotFound = lazy(() => import('@/ui/PageNotFound'))
const UserList = lazy(() => import('@/features/user/UserList'))
const ChildrenProp = lazy(() => import('@/features/performance/ChildrenProp'))
const MemoComponent = lazy(() => import('@/features/performance/MemoComponent'))
const UseMemo = lazy(() => import('@/features/performance/UseMemo'))
const UseCallback = lazy(() => import('@/features/performance/UseCallback'))

// ----- 开始：测试 React Router 懒加载（React Split Code 技术）-----
const FormSplitBill = lazy(() =>
  wait(1).then(() =>
    import('@/features/eat-split/FormSplitBill').then((module) => ({
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
