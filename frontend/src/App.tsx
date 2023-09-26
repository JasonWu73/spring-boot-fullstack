import { EatAndSplit } from '@/components/demo/eat-n-split/EatAndSplit.tsx'
import { ThemeProvider } from '@/components/ui/ThemeProvider.tsx'
import { Toaster } from '@/components/ui/Toaster.tsx'
import { NavBar } from '@/NavBar.tsx'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NavBar />
      <EatAndSplit />
      <Toaster />
    </ThemeProvider>
  )
}
