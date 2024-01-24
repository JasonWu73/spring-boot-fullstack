import React from 'react'
import { ReloadIcon } from '@radix-ui/react-icons'

import { getVersionApi } from '@/shared/apis/backend/version'
import { useFetch } from '@/shared/hooks/use-fetch'
import { cn } from '@/shared/utils/helpers'
import { useSavedRef } from '@/shared/hooks/use-saved'

type FooterProps = React.ComponentPropsWithoutRef<'footer'>

export function Footer({ className, ...props }: FooterProps) {
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
    <footer
      className={cn('bg-gray-200/50 dark:bg-night-3 dark:text-snow', className)}
      {...props}
    >
      <div className="container mx-auto flex flex-col flex-wrap px-5 py-4">
        <p className="flex items-center justify-center gap-1 text-sm">
          <span>© {new Date().getFullYear()}</span>
          {loading && (
            <ReloadIcon className="mr-2 inline-block h-4 w-4 animate-spin"/>
          )}

          {!loading && error && (
            <span className="text-red-500 dark:text-red-600">{error}</span>
          )}

          {!loading && !error && versionInfo && (
            <span>
              {developer} {appName} {version}
            </span>
          )}
        </p>
      </div>
    </footer>
  )
}
