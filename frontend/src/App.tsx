import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { Toaster } from '@/components/ui/Toaster'
import { NavBar } from '@/components/NavBar'
import { ProductShowcase } from '@/pages/ProductShowcase'
import { EatAndSplit } from '@/pages/EatAndSplit'
import { PageNotFound } from '@/pages/PageNotFound'
import { Login } from '@/pages/Login'

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
            <Route path="split" element={<div>split</div>} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>

        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  )
}
