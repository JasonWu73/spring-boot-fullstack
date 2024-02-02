import React from 'react'
import { RefreshCcw } from 'lucide-react'

import { cn } from '@/shared/utils/helpers'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useSavedRef } from '@/shared/hooks/use-saved'
import { getVersionApi } from '@/shared/apis/backend/version'

type FooterProps = {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const {
    loading,
    data: versionInfo,
    error,
    fetchData: getVersion
  } = useFetch(getVersionApi)

  const getVersionRef = useSavedRef(getVersion)

  React.useEffect(() => {
    getVersionRef.current(null).then()
  }, [getVersionRef])

  const { developer, appName, version } = versionInfo ?? {}

  return (
    <footer className={cn('py-4 px-5 bg-slate-100 dark:bg-slate-700', className)}>
      <p className="flex items-center justify-center gap-1 text-sm">
        <span>© {new Date().getFullYear()}</span>

        {loading && (
          <RefreshCcw className="h-4 w-4 mr-2 animate-spin"/>
        )}

        {!loading && error && (
          <span className="text-rose-500">{error}</span>
        )}

        {!loading && !error && versionInfo && (
          <span>{developer} {appName} {version}</span>
        )}
      </p>
    </footer>
  )
}
