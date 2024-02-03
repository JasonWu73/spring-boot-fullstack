import React from 'react'

import { cn } from '@/shared/utils/helpers'
import { useKeypress } from '@/shared/hooks/use-keypress'

type DropdownMenuProps = {
  trigger: React.ReactNode
  content: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DropdownMenu({ trigger, content, open, onOpenChange }: DropdownMenuProps) {
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // 按下键盘 `Esc` 键关闭下拉框
  useKeypress({ key: 'Escape' }, () => onOpenChange(false))

  // 创建点击外部区域关闭下拉框的事件监听
  React.useEffect(() => {
    const dropdown = dropdownRef.current
    if (!dropdown || !open) return

    document.addEventListener('click', handleClickOutside)

    function handleClickOutside(event: MouseEvent) {
      if (!dropdown!.contains(event.target as Node)) {
        onOpenChange(false)
      }
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
    <div ref={dropdownRef} className="relative">
      {trigger}

      <div
        className={cn(
          'hidden absolute top-[120%] z-50 p-2 bg-white rounded ring-1 ring-slate-900 ring-opacity-5 shadow-lg dark:bg-one-dark-2',
          isOnRight() ? 'left-0' : 'right-0',
          open && 'block'
        )}
      >
        {content}
      </div>
    </div>
  )
}
