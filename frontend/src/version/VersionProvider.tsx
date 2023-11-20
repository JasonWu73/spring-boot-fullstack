import { useAuth } from '@/auth/AuthProvider'
import { useLoaded } from '@/shared/hooks/use-router'
import React from 'react'

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

  useLoaded(() => {
    ;(async function () {
      const { data } = await requestApi<Version>({ url: '/api/v1/version' })

      setVersion(data)
    })()
  })

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
