import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Toaster } from '@/components/ui/Toaster'
import { Login } from '@/pages/Login'
import { ProductShowcase } from '@/pages/ProductShowcase'
import { EatAndSplit } from '@/pages/EatAndSplit'
import { PageNotFound } from '@/pages/PageNotFound'
import { wait } from '@/lib/utils'
import { Loading } from '@/components/ui/Loading'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { FriendProvider } from '@/components/eat-n-split/FriendProvider'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { MainLayout } from '@/components/layout/MainLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { LoginLayout } from '@/components/layout/LoginLayout'

// ----- 开始：测试 React Router 懒加载（React Split Code 技术）-----
const FormSplitBill = lazy(() =>
  wait(1).then(() =>
    import('@/components/eat-n-split/FormSplitBill').then((module) => ({
      default: module.FormSplitBill
    }))
  )
)
// ----- 结束：测试 React Router 懒加载（React Split Code 技术）-----

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="demo-ui-theme">
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginLayout />}>
            <Route index element={<Login />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/eat-split" replace />} />
            <Route
              path="/fetch"
              element={
                <RequireAuth>
                  <ProductShowcase />
                </RequireAuth>
              }
            />

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
                  <Suspense fallback={<Loading />}>
                    <FormSplitBill />
                  </Suspense>
                }
              />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Route>

          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/users" replace />} />
            <Route path="/users" element={<h1>Users</h1>} />
          </Route>
        </Routes>

        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
