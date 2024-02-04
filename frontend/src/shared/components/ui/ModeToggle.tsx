import React from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

import { DropdownMenu } from '@/shared/components/ui/DropdownMenu'
import { Button } from '@/shared/components/ui/Button'

export type Theme = 'dark' | 'light' | 'system'

type ModeToggleProps = {
  setTheme: (theme: Theme) => void
  className?: string
};

export function ModeToggle({ setTheme, className }: ModeToggleProps) {
  const [open, setOpen] = React.useState(false)

  function handleChangeTheme(theme: Theme) {
    setTheme(theme)
    setOpen(false)
  }

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          title="切换外观"
          onClick={() => setOpen(prev => !prev)}
          className={className}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0"/>
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"/>
        </Button>
      }
      content={
        <ul className="space-y-0.5 w-24">
          <li>
            <Button
              variant="ghost"
              onClick={() => handleChangeTheme('light')}
              className="grid grid-cols-[auto_1fr] gap-2 w-full text-left"
            >
              <Sun className="h-4 w-4"/>
              浅色
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              onClick={() => handleChangeTheme('dark')}
              className="grid grid-cols-[auto_1fr] gap-2 w-full text-left"
            >
              <Moon className="h-4 w-4"/>
              深色
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              onClick={() => handleChangeTheme('system')}
              className="grid grid-cols-[auto_1fr] gap-2 w-full text-left"
            >
              <Monitor className="h-4 w-4"/>
              自动
            </Button>
          </li>
        </ul>
      }
    />
  )
}
