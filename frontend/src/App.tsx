import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Toaster } from '@/components/ui/Toaster'
import { NavBar } from '@/components/navbar/NavBar'
import { Login } from '@/pages/Login'
import { ProductShowcase } from '@/pages/ProductShowcase'
import { EatAndSplit } from '@/pages/EatAndSplit'
import { PageNotFound } from '@/pages/PageNotFound'
import { wait } from '@/lib/utils'
import { Loading } from '@/components/ui/Loading'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { FriendProvider } from '@/components/eat-n-split/FriendProvider'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { ThemeProvider } from '@/components/ui/ThemeProvider'

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
        <div className="flex h-screen flex-col justify-between">
          <NavBar />

          <Routes>
            <Route path="/" element={<Navigate to="/eat-split" replace />} />
            <Route path="/login" element={<Login />} />
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
          </Routes>

          <Footer />
        </div>

        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
