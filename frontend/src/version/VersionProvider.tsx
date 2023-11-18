import type { Version } from '@/shared/apis/backend/types'
import { getVersionApi } from '@/shared/apis/backend/version-api'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useSavedRef } from '@/shared/hooks/use-saved'
import React from 'react'

type VersionProviderState = Version

const VersionProviderContext = React.createContext(
  undefined as unknown as VersionProviderState
)

type VersionProviderProps = {
  children: React.ReactNode
}

function VersionProvider({ children }: VersionProviderProps) {
  const { data: version, fetchData: getVersion } = useFetch(getVersionApi)

  const getVersionRef = useSavedRef(getVersion)

  React.useEffect(() => {
    const ignore = getVersionRef.current()

    return () => ignore()
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
  const context = React.useContext(VersionProviderContext)
  if (context === undefined) {
    throw new Error('useVersion 必须在 VersionProvider 中使用')
  }
  return context
}

export { VersionProvider, useVersion }
