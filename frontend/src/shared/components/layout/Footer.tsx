import React from 'react'

import { cn } from '@/shared/utils/helpers'
import { useVersion } from '@/shared/version/VersionProvider'

type FooterProps = React.ComponentPropsWithoutRef<'footer'>

function Footer({ className, ...props }: FooterProps) {
  const { name, developer, version, builtAt } = useVersion()

  return (
    <footer
      className={cn('bg-slate-100 dark:bg-night-3 dark:text-snow', className)}
      {...props}
    >
      <div className="container mx-auto flex flex-col flex-wrap px-5 py-4">
        <Message>
          © {new Date().getFullYear()} {developer} {name} {version} 构建于：{builtAt}
        </Message>
      </div>
    </footer>
  )
}

type MessageProps = {
  children: React.ReactNode
}

function Message({ children }: MessageProps) {
  return <p className="text-center text-sm">{children}</p>
}

export { Footer }
