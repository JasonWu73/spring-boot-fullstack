import { ThemeProvider } from '@/components/ui/ThemeProvider.tsx'
import { Toaster } from '@/components/ui/Toaster.tsx'
import { NavBar } from '@/NavBar.tsx'
import { StarRating } from '@/components/demo/StarRating.tsx'
import { Card } from '@/components/ui/Card.tsx'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NavBar />

      <Card className="mx-auto mt-8 max-w-lg p-4">
        <StarRating defaultRating={0.5} />
      </Card>

      <Toaster />
    </ThemeProvider>
  )
}
