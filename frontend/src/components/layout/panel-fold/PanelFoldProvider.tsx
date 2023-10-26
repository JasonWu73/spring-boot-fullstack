import React, { createContext, useContext, useEffect, useState } from 'react'

type PanelFoldProviderState = {
  folded: boolean
  setFolded: React.Dispatch<React.SetStateAction<boolean>>
}

const PanelFoldProviderContext = createContext<
  PanelFoldProviderState | undefined
>(undefined)

type PanelFoldProviderProps = {
  children: React.ReactNode
}

function PanelFoldProvider({ children }: PanelFoldProviderProps) {
  const [folded, setFolded] = useState(false)

  useSmallScreenFold(setFolded)

  const value = {
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
  const context = useContext(PanelFoldProviderContext)

  if (context === undefined) {
    throw new Error('usePanelFold 必须在 PanelFoldProvider 中使用')
  }

  return context
}

function useSmallScreenFold(
  setFolded: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    const largeScreen = window.matchMedia('(max-width: 1024px)')

    if (largeScreen.matches) {
      setFolded(true)
    }

    function handleScreenChange(event: MediaQueryListEvent) {
      setFolded(event.matches)
    }

    largeScreen.addEventListener('change', handleScreenChange)

    return () => {
      largeScreen.removeEventListener('change', handleScreenChange)
    }
  }, [])
}

export { PanelFoldProvider, usePanelFold }
