import React from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

import { setTheme, type Theme } from '@/shared/components/ui/theme-signals'
import { DropdownMenu } from '@/shared/components/ui/DropdownMenu'
import { Button, buttonVariant } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/helpers'

const MODES = [
  { theme: 'light', icon: <Sun className="h-4 w-4"/>, text: '浅色' },
  { theme: 'dark', icon: <Moon className="h-4 w-4"/>, text: '深色' },
  { theme: 'system', icon: <Monitor className="h-4 w-4"/>, text: '自动' }
] as const


type ModeToggleProps = {
  className?: string
};

export function ModeToggle({ className }: ModeToggleProps) {
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
      setSelectedIndex(prev => Math.min(prev + 1, MODES.length - 1))
    }

    if (event.key === 'Enter' && selectedIndex !== -1) {
      // 通过回车键确认选择
      handleChangeMode(MODES[selectedIndex].theme)
    }
  }

  function handleChangeMode(theme: Theme) {
    setTheme(theme)

    // 重置选择
    setSelectedIndex(-1)
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
        <ul className="min-w-24">
          {MODES.map((mode, index) => (
            <ModeItem
              key={index}
              selected={selectedIndex === index}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => handleChangeMode(mode.theme)}
              className={cn(
                index === 0 && 'rounded-br-none rounded-bl-none',
                index === MODES.length - 1 && 'rounded-tr-none rounded-tl-none',
                index !== 0 && index !== MODES.length - 1 && 'rounded-none'
              )}
            >
              {mode.icon}
              {mode.text}
            </ModeItem>
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

function ModeItem({ children, selected, className, ...props }: MenuItemProps) {
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
