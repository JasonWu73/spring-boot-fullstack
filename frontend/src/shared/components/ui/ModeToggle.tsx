import { Monitor, Moon, Sun } from 'lucide-react'

import { DropdownMenu } from '@/shared/components/ui/DropdownMenu'
import { Button } from '@/shared/components/ui/Button'

export type Theme = 'dark' | 'light' | 'system'

type ModeToggleProps = {
  setTheme: (theme: Theme) => void
  className?: string
};

export function ModeToggle({ setTheme, className }: ModeToggleProps) {
  return (
    <DropdownMenu
      trigger={
        <Button title="切换外观" className={className}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0"/>
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"/>
        </Button>
      }
      content={
        <ul className="flex flex-col gap-2 p-2 bg-slate-100 rounded">
          <li>
            <Button variant="link" onClick={() => setTheme('light')}>
              <Sun className="h-4 w-4 mr-2"/>
              浅色
            </Button>
          </li>
          <li>
            <Button variant="link"onClick={() => setTheme('dark')}>
              <Moon className="h-4 w-4 mr-2"/>
              深色
            </Button>
          </li>
          <li>
            <Button variant="link"onClick={() => setTheme('system')}>
              <Monitor className="h-4 w-4 mr-2"/>
              自动
            </Button>
          </li>
        </ul>
      }
    >
    </DropdownMenu>
  )
}

/*
export function ModeToggle({ setTheme, className }: ModeToggleProps) {
  return (
    <ShadDropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button title="切换外观" className={className}>
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
    </ShadDropdownMenu>
  )
}
*/
