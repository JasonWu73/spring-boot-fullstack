import { ThemeProvider } from '@/components/ui/ThemeProvider.tsx'
import { Toaster } from '@/components/ui/Toaster.tsx'
import { NavBar } from '@/NavBar.tsx'
import Draft from '@/components/demo/draft/Draft.tsx'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NavBar />

      <Draft />

      <Toaster />
    </ThemeProvider>
  )
}
