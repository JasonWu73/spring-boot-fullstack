import React from 'react'

import { cn } from '@/shared/utils/helpers'
import { useVersion } from '@/version/VersionProvider'

type FooterProps = React.ComponentPropsWithoutRef<'footer'>

function Footer({ className, ...props }: FooterProps) {
  const { name, version, builtAt } = useVersion()

  return (
    <footer
      className={cn('bg-slate-100 dark:bg-night-3 dark:text-snow', className)}
      {...props}
    >
      <div className="container mx-auto flex flex-col flex-wrap px-5 py-4">
        <Message>
          © {new Date().getFullYear()} 吴仙杰 {name} {version} 构建于：{builtAt}
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
