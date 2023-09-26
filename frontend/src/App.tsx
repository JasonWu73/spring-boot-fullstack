import { ThemeProvider } from '@/components/ui/ThemeProvider.tsx'
import { Toaster } from '@/components/ui/Toaster.tsx'
import { NavBar } from '@/NavBar.tsx'
import { StarRating } from '@/components/demo/StarRating.tsx'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NavBar />
      <StarRating />
      <Toaster />
    </ThemeProvider>
  )
}
