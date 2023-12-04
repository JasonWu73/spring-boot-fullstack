import React from 'react'

import { useAuth } from '@/shared/auth/AuthProvider'
import { useFetch } from '@/shared/hooks/use-api'
import { useInitial } from '@/shared/hooks/use-refresh'

type Version = {
  name: string
  version: string
  developer: string
  builtAt: string
}

type VersionProviderState = Version

const VersionProviderContext = React.createContext(
  undefined as unknown as VersionProviderState
)

type VersionProviderProps = {
  children: React.ReactNode
}

function VersionProvider({ children }: VersionProviderProps) {
  const [version, setVersion] = React.useState<Version>()

  const { requestApi } = useAuth()
  const { requestData, discardRequest } = useFetch(requestApi<Version>)

  const url = '/api/v1/public/version'

  useInitial(() => {
    const timestamp = Date.now()

    getVersion().then(({ data }) => {
      if (data) {
        setVersion(data)
      }
    })

    return () => discardRequest({ url: url }, timestamp)
  })

  async function getVersion() {
    return await requestData({ url: url })
  }

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
