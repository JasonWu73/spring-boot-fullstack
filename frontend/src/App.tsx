import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Toaster } from '@/components/ui/Toaster'
import { Login } from '@/pages/Login'
import { ProductShowcase } from '@/pages/ProductShowcase'
import { EatAndSplit } from '@/pages/EatAndSplit'
import { PageNotFound } from '@/pages/PageNotFound'
import { wait } from '@/lib/utils'
import { Loading } from '@/components/ui/Loading'
import { FriendProvider } from '@/components/eat-split/FriendProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { SecureRoute } from '@/components/auth/SecureRoute'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { MainLayout } from '@/components/layout/MainLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { LoginLayout } from '@/components/layout/LoginLayout'
import { UserList } from '@/pages/UserList'
import { ChildrenProp } from '@/pages/ChildrenProp'
import { MemoComponent } from '@/pages/MemoComponent'
import { UseMemo } from '@/pages/UseMemo'
import { UseCallback } from '@/pages/UseCallback'

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
                  <Suspense fallback={<Loading />}>
                    <FormSplitBill />
                  </Suspense>
                }
              />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Route>

          <Route element={<AdminLayout />}>
            <Route element={<SecureRoute />}>
              <Route path="/admin" element={<Navigate to="/users" replace />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/children" element={<ChildrenProp />} />
              <Route path="/memo" element={<MemoComponent />} />
              <Route path="/use-memo" element={<UseMemo />} />
              <Route path="/use-callback" element={<UseCallback />} />
            </Route>
          </Route>
        </Routes>

        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
