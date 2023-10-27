import { createContext, useContext } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null
}

const ThemeProviderContext = createContext(initialState)

/**
 * {@link https://ui.shadcn.com/docs/dark-mode/vite | Vite - shadcn/ui}
 */
function useTheme() {
  return useContext(ThemeProviderContext)
}

export { ThemeProviderContext, useTheme, type ThemeProviderState, type Theme }
