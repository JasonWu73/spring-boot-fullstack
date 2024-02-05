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
  const modes = [
    { icon: <Sun className="h-4 w-4"/>, theme: 'light',  text: '浅色' },
    { icon: <Moon className="h-4 w-4"/>, theme: 'dark', text: '深色' },
    { icon: <Monitor className="h-4 w-4"/>, theme: 'system', text: '自动' }
  ] as const

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
      setSelectedIndex(prev => Math.min(prev + 1, modes.length - 1))
    }

    if (event.key === 'Enter' && selectedIndex !== -1) {
      // 通过回车键确认选择
      setTheme(modes[selectedIndex].theme)

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
          {modes.map((mode, index) => (
            <MenuItem
              key={index}
              selected={selectedIndex === index}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => setTheme(mode.theme)}
              className={cn(
                index === 0 && 'rounded-br-none rounded-bl-none',
                index === modes.length - 1 && 'rounded-tr-none rounded-tl-none',
                index !== 0 && index !== modes.length - 1 && 'rounded-none'
              )}
            >
              {mode.icon}
              {mode.text}
            </MenuItem>
          ))}
        </ul>
      }
    />
  )
}

type MenuItemProps = React.ComponentPropsWithoutRef<'li'> & {
  selected: boolean
  className?: string
}

function MenuItem({ children, selected, className, ...props }: MenuItemProps) {
  return (
    <li
      {...props}
      className={cn(
        buttonVariant('ghost'),
        'grid grid-cols-[auto_1fr] gap-2 w-full text-left',
        selected && 'bg-slate-100 dark:bg-slate-800',
        className
      )}
    >
      {children}
    </li>
  )
}
