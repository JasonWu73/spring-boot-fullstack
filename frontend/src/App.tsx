import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { Toaster } from '@/components/ui/Toaster'
import { NavBar } from '@/components/NavBar'
import { FormSplitBill } from '@/components/eat-n-split/FormSplitBill'
import { Login } from '@/pages/Login'
import { ProductShowcase } from '@/pages/ProductShowcase'
import { EatAndSplit } from '@/pages/EatAndSplit'
import { PageNotFound } from '@/pages/PageNotFound'
import { Page } from '@/components/Page'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="react-ui-theme">
        <NavBar />

        <Routes>
          <Route path="/" element={<Navigate to="/eat-split" replace />} />
          <Route
            path="/login"
            element={
              <Page>
                <Login />
              </Page>
            }
          />
          <Route
            path="/fetch"
            element={
              <Page>
                <ProductShowcase />
              </Page>
            }
          />
          <Route
            path="/eat-split"
            element={
              <Page>
                <EatAndSplit />
              </Page>
            }
          >
            <Route path=":friendId" element={<FormSplitBill />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>

        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  )
}
