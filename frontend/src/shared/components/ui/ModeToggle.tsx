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
        <Button onClick={() => setOpen(prev => !prev)} title="切换外观" className={className}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0"/>
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"/>
        </Button>
      }
      content={
        <ul className="flex flex-col gap-2 w-28">
          <li>
            <Button
              variant="ghost"
              onClick={() => handleChangeTheme('light')}
              className="w-full"
            >
              <Sun className="h-4 w-4 mr-2"/>
              浅色
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              onClick={() => handleChangeTheme('dark')}
              className="w-full"
            >
              <Moon className="h-4 w-4 mr-2"/>
              深色
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              onClick={() => handleChangeTheme('system')}
              className="w-full"
            >
              <Monitor className="h-4 w-4 mr-2"/>
              自动
            </Button>
          </li>
        </ul>
      }
    />
  )
}
