import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { Toaster } from '@/components/ui/Toaster'
import { NavBar } from '@/components/NavBar'
import { ProductShowcase } from '@/components/demo/ProductShowcase'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NavBar />

      <ProductShowcase />

      <Toaster />
    </ThemeProvider>
  )
}
