import React, { useEffect, useState } from 'react'

import {
  PanelFoldProviderContext,
  type PanelFoldProviderState
} from '@/ui/layout/panel-fold/PanelFoldContext'

type PanelFoldProviderProps = {
  children: React.ReactNode
}

function PanelFoldProvider({ children }: PanelFoldProviderProps) {
  const [folded, setFolded] = useState(false)

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
  }, [setFolded])
}

export { PanelFoldProvider }
