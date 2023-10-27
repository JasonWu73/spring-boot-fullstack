import React, { createContext, useContext } from 'react'

type PanelFoldProviderState = {
  folded: boolean
  setFolded: React.Dispatch<React.SetStateAction<boolean>>
}

const initialState: PanelFoldProviderState = {
  folded: false,
  setFolded: () => null
}

const PanelFoldProviderContext = createContext(initialState)

function usePanelFold() {
  return useContext(PanelFoldProviderContext)
}

export { PanelFoldProviderContext, usePanelFold, type PanelFoldProviderState }
