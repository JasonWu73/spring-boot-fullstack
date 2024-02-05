import React from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

import { DropdownMenu } from '@/shared/components/ui/DropdownMenu'
import { Button, buttonVariant } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/helpers'

export type Theme = 'dark' | 'light' | 'system'

type ModeToggleProps = {
  setTheme: (theme: Theme) => void
  className?: string
};

export function ModeToggle({ setTheme, className }: ModeToggleProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)

  // 通过键盘的上下箭头控制结果的选择，回车键确认
  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (!open) return

    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown' && event.key !== 'Enter') return

    // 禁用非回车键的默认行为
    if (event.key !== 'Enter') event.preventDefault()

    if (event.key === 'ArrowUp') {
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    }

    if (event.key === 'ArrowDown') {
      setSelectedIndex(prev => Math.min(prev + 1, 2))
    }

    if (event.key === 'Enter' && selectedIndex !== -1) {
      // 通过回车键确认选择
      const theme = selectedIndex === 0
        ? 'light'
        : selectedIndex === 1 ? 'dark' : 'system'
      setTheme(theme)

      // 重置选择，以免下次回车打开菜单时自动触发选择
      setSelectedIndex(-1)
    }
  }

  function delayClose() {
    // 延迟关闭下拉菜单，以便处理点击事件，延迟不能过短，否则有概率会导致点击事件无法触发
    setTimeout(() => setOpen(false), 200)
  }

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          title="切换外观"
          onClick={() => setOpen(prev => !prev)}
          onBlur={delayClose}
          onKeyDown={handleKeyDown}
          className={className}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0"/>
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"/>
        </Button>
      }
      content={
        // 这里不要使用 `<a>`、`<button>` 等会获取焦点的标签，因它会导致 `Tab` 导航丢失一次
        <ul className="w-24">
          <li
            onClick={() => setTheme('light')}
            onMouseEnter={() => setSelectedIndex(0)}
            className={cn(
              buttonVariant('ghost'),
              'grid grid-cols-[auto_1fr] gap-2 w-full text-left rounded-br-none rounded-bl-none',
              selectedIndex === 0 && 'bg-slate-100 dark:bg-slate-800'
            )}
          >
            <Sun className="h-4 w-4"/>
            浅色
          </li>
          <li
            onClick={() => setTheme('dark')}
            onMouseEnter={() => setSelectedIndex(1)}
            className={cn(
              buttonVariant('ghost'),
              'grid grid-cols-[auto_1fr] gap-2 w-full text-left rounded-none',
              selectedIndex === 1 && 'bg-slate-100 dark:bg-slate-800'
            )}
          >
            <Moon className="h-4 w-4"/>
            深色
          </li>
          <li
            onClick={() => setTheme('system')}
            onMouseEnter={() => setSelectedIndex(2)}
            className={cn(
              buttonVariant('ghost'),
              'grid grid-cols-[auto_1fr] gap-2 w-full text-left rounded-tr-none rounded-tl-none',
              selectedIndex === 2 && 'bg-slate-100 dark:bg-slate-800'
            )}
          >
            <Monitor className="h-4 w-4"/>
            自动
          </li>
        </ul>
      }
    />
  )
}
