import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { NavBar } from '@/components/NavBar'
import { Toaster } from '@/components/ui/Toaster'
import { Login } from '@/pages/Login'
import { ProductShowcase } from '@/pages/ProductShowcase'
import { EatAndSplit } from '@/pages/EatAndSplit'
import { FormSplitBill } from '@/components/eat-n-split/FormSplitBill'
import { PageNotFound } from '@/pages/PageNotFound'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <NavBar />

        <Routes>
          <Route path="/" element={<Navigate to="/eat-split" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/fetch" element={<ProductShowcase />} />
          <Route path="/eat-split" element={<EatAndSplit />}>
            <Route path=":friendId" element={<FormSplitBill />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>

        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  )
}
