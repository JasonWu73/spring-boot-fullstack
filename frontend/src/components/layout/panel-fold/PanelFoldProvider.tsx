import React, { createContext, useContext, useEffect, useState } from 'react'

type PanelFoldProviderState = {
  folded: boolean
  setFolded: React.Dispatch<React.SetStateAction<boolean>>
}

const initialState: PanelFoldProviderState = {
  folded: false,
  setFolded: () => null
}

const PanelFoldProviderContext = createContext(initialState)

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
  return useContext(PanelFoldProviderContext)
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
