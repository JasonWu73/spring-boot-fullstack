import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { Toaster } from '@/components/ui/Toaster'
import { NavBar } from '@/components/NavBar'
import { ProductShowcase } from '@/components/demo/ProductShowcase'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from '@/components/Home'
import { EatAndSplit } from '@/components/demo/eat-n-split/EatAndSplit'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fetch" element={<ProductShowcase />} />
          <Route path="/eat-and-split" element={<EatAndSplit />} />
        </Routes>

        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  )
}
