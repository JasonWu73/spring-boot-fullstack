import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { Toaster } from '@/components/ui/Toaster'
import { NavBar } from '@/components/NavBar'
import Draft from '@/components/demo/draft/Draft'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NavBar />

      <Draft />

      <Toaster />
    </ThemeProvider>
  )
}
