import React from 'react'

type PanelFoldProviderState = {
  folded: boolean
  setFolded: React.Dispatch<React.SetStateAction<boolean>>
}

const PanelFoldProviderContext = React.createContext(
  undefined as unknown as PanelFoldProviderState
)

type PanelFoldProviderProps = {
  children: React.ReactNode
}

function PanelFoldProvider({ children }: PanelFoldProviderProps) {
  const [folded, setFolded] = React.useState(false)

  useScreenChange(setFolded)

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
  const context = React.useContext(PanelFoldProviderContext)

  if (context === undefined) {
    throw new Error('usePanelFold 必须在 PanelFoldProvider 中使用')
  }

  return context
}

function useScreenChange(setFolded: React.Dispatch<React.SetStateAction<boolean>>) {
  React.useEffect(() => {
    const largeScreen = window.matchMedia('(max-width: 1024px)')

    if (largeScreen.matches) {
      setFolded(true)
    }

    function handleScreenChange(largeScreenMatchEvent: MediaQueryListEvent) {
      setFolded(largeScreenMatchEvent.matches)
    }

    largeScreen.addEventListener('change', handleScreenChange)

    return () => largeScreen.removeEventListener('change', handleScreenChange)
  }, [setFolded])
}

export { PanelFoldProvider, usePanelFold }
