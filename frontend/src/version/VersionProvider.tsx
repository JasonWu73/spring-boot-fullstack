import type { Version } from '@/shared/apis/backend/types'
import { getVersionApi } from '@/shared/apis/backend/version-api'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useSavedRef } from '@/shared/hooks/use-saved'
import React from 'react'

type VersionProviderState = Version

const initialState: VersionProviderState = {
  name: '',
  developer: '',
  version: '',
  builtAt: ''
}

const VersionProviderContext = React.createContext(initialState)

type VersionProviderProps = {
  children: React.ReactNode
}

function VersionProvider({ children }: VersionProviderProps) {
  const { data: version, fetchData: getVersion } = useFetch(getVersionApi)

  const getVersionRef = useSavedRef(getVersion)

  React.useEffect(() => {
    const abort = getVersionRef.current()

    return () => abort()
  }, [getVersionRef])

  const value: VersionProviderState = {
    name: version?.name || '',
    developer: version?.developer || '',
    version: version?.version || '',
    builtAt: version?.builtAt || ''
  }

  return (
    <VersionProviderContext.Provider value={value}>
      {children}
    </VersionProviderContext.Provider>
  )
}

function useVersion() {
  return React.useContext(VersionProviderContext)
}

export { VersionProvider, useVersion }
