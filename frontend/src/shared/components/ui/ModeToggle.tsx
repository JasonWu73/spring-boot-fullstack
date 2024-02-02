import { Monitor, Moon, Sun } from 'lucide-react'

import { Button } from '@/shared/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/components/ui/DropdownMenu'

export type Theme = 'dark' | 'light' | 'system'

type ModeToggleProps = {
  setTheme: (theme: Theme) => void
  className?: string
};

export function ModeToggle({ setTheme, className }: ModeToggleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={className}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0"/>
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"/>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4"/>
          浅色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4"/>
          深色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4"/>
          自动
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
