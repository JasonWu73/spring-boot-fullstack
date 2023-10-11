import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { Toaster } from '@/components/ui/Toaster'

import { NavBar } from '@/components/NavBar'

import { EatAndSplit } from '@/pages/EatAndSplit'
import { Login } from '@/pages/Login'
import { PageNotFound } from '@/pages/PageNotFound'
import { ProductShowcase } from '@/pages/ProductShowcase'

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
