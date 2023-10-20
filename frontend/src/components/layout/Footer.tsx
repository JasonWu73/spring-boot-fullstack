import React from 'react'

import { cn } from '@/lib/utils'

type FooterProps = React.ComponentPropsWithoutRef<'header'>

function Footer({ className, ...props }: FooterProps) {
  return (
    <footer
      className={cn(
        'dark:bg-night-2 sticky top-[100vh] bg-slate-100 dark:text-snow-1',
        className
      )}
      {...props}
    >
      <div className="container mx-auto flex flex-col flex-wrap px-5 py-4">
        <p className="text-center text-sm">
          © {new Date().getFullYear()} 吴仙杰 v0.0.1
        </p>
      </div>
    </footer>
  )
}

export { Footer }
