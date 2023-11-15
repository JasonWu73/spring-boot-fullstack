import React from 'react'

type PanelFoldProviderState = {
  folded: boolean
  setFolded: React.Dispatch<React.SetStateAction<boolean>>
}

const initialState: PanelFoldProviderState = {
  folded: false,
  setFolded: () => null
}

const PanelFoldProviderContext = React.createContext(initialState)

type PanelFoldProviderProps = {
  children: React.ReactNode
}

function PanelFoldProvider({ children }: PanelFoldProviderProps) {
  const [folded, setFolded] = React.useState(false)

  useSmallScreenFold(setFolded)

  const value: PanelFoldProviderState = {
    folded,
    setFolded
  }

  return (
    <PanelFoldProviderContext.Provider value={value}>
      {children}
    </PanelFoldProviderContext.Provider>
  )
}

function usePanelFold() {
  return React.useContext(PanelFoldProviderContext)
}

function useSmallScreenFold(
  setFolded: React.Dispatch<React.SetStateAction<boolean>>
) {
  React.useEffect(() => {
    const largeScreen = window.matchMedia('(max-width: 1024px)')
    largeScreen.matches && setFolded(true)

    function handleScreenChange(largeScreenMatchEvent: MediaQueryListEvent) {
      setFolded(largeScreenMatchEvent.matches)
    }

    largeScreen.addEventListener('change', handleScreenChange)

    return () => largeScreen.removeEventListener('change', handleScreenChange)
  }, [setFolded])
}

export { PanelFoldProvider, usePanelFold }
