import {Moon, Sun} from 'lucide-react'

import {Button} from '@/ui/shadcn-ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/ui/shadcn-ui/DropdownMenu'
import {useTheme} from '@/ui/shadcn-ui/ThemeProvider'

export function ModeToggle() {
  const {setTheme} = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun
            className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
          <Moon
            className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          亮色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          暗色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          跟随系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
