import React from 'react'

import { cn } from '@/shared/utils/helpers'
import { useKeypress } from '@/shared/hooks/use-keypress'

type DropdownMenuProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: React.ReactNode
  content: React.ReactNode
  className?: string
}

export function DropdownMenu({
  open,
  onOpenChange,
  trigger,
  content,
  className
}: DropdownMenuProps) {
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // 按下键盘 `Esc` 键关闭下拉框
  useKeypress({ key: 'Escape' }, () => onOpenChange(false))

  // 创建点击外部区域关闭下拉框的事件监听
  React.useEffect(() => {
    const dropdown = dropdownRef.current
    if (!dropdown || !open) return

    document.addEventListener('click', handleClickOutside)

    function handleClickOutside(event: MouseEvent) {
      if (!dropdown) return

      // 点击的是下拉框子元素，不做处理
      if (dropdown.contains(event.target as Node)) return

      // 点击的是下拉框虚拟子元素（通过 `state` 进行判断渲染），不做处理
      const target = event.target as HTMLElement
      const rect = target.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0 && rect.x === 0 && rect.y === 0) return

      onOpenChange(false)
    }

    return () => document.removeEventListener('click', handleClickOutside)
  }, [open])

  // 判断下拉框内容区域是显示在元素的左侧还是右侧
  function isOnRight() {
    const dropdown = dropdownRef.current
    if (!dropdown) return true

    const rect = dropdown.getBoundingClientRect()
    const tooltipWidth = rect.width
    const offsetRight = window.innerWidth - rect.right
    return offsetRight > tooltipWidth
  }

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {trigger}

      <div
        className={cn(
          'hidden absolute top-[120%] z-50 min-w-full text-slate-900 bg-white rounded ring-1 ring-slate-900 ring-opacity-5 shadow-lg dark:text-slate-200 dark:bg-slate-900',
          isOnRight() ? 'left-0' : 'right-0',
          open && 'block'
        )}
      >
        {content}
      </div>
    </div>
  )
}
