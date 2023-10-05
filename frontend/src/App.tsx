import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { Toaster } from '@/components/ui/Toaster'
import { NavBar } from '@/components/NavBar'
import { ClassyWeather } from '@/components/classy-weather/ClassyWeather'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NavBar />

      <ClassyWeather />

      <Toaster />
    </ThemeProvider>
  )
}
