import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { Toaster } from '@/components/ui/Toaster'
import { NavBar } from '@/components/navbar/NavBar'
import { Login } from '@/pages/Login'
import { ProductShowcase } from '@/pages/ProductShowcase'
import { EatAndSplit } from '@/pages/EatAndSplit'
import { PageNotFound } from '@/pages/PageNotFound'
import { wait } from '@/lib/utils'
import { Loading } from '@/components/ui/Loading'

// ----- Start: 测试 React Router 懒加载 (React Split Code 技术) -----
const FormSplitBill = lazy(() =>
  wait(1).then(() =>
    import('@/components/eat-n-split/FormSplitBill').then((module) => ({
      default: module.FormSplitBill
    }))
  )
)
// ----- End: 测试 React Router 懒加载 (React Split Code 技术) -----

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="react-ui-theme">
        <NavBar />

        <Routes>
          <Route path="/" element={<Navigate to="/eat-split" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/fetch" element={<ProductShowcase />} />
          <Route path="/eat-split" element={<EatAndSplit />}>
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

        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  )
}
