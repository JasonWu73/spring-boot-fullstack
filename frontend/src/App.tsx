import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { Toaster } from '@/components/ui/Toaster'
import { NavBar } from '@/components/NavBar'
import { ProductShowcase } from '@/pages/ProductShowcase'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { EatAndSplit } from '@/pages/EatAndSplit'
import { PageNotFound } from '@/pages/PageNotFound'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <NavBar />

        <Routes>
          <Route path="/" element={<ProductShowcase />} />
          <Route path="/fetch" element={<ProductShowcase />} />
          <Route path="/eat-and-split" element={<EatAndSplit />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>

        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  )
}
