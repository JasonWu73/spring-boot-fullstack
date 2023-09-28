import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { Toaster } from '@/components/ui/Toaster'
import { NavBar } from '@/components/NavBar'
import { EatAndSplit } from '@/components/demo/eat-n-split/EatAndSplit'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NavBar />

      <EatAndSplit />

      <Toaster />
    </ThemeProvider>
  )
}
