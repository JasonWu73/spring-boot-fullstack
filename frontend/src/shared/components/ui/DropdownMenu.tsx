import React from 'react'

import { cn } from '@/shared/utils/helpers'

type DropdownMenuProps = {
  trigger: React.ReactNode
  content: React.ReactNode
}

export function DropdownMenu({ trigger, content }: DropdownMenuProps) {
  const contentRef = React.useRef<HTMLDivElement>(null)

  // 判断下拉框内容区域是显示在元素的左侧还是右侧
  function isOnRight() {
    const content = contentRef.current
    if (!content) return true

    const rect = content.getBoundingClientRect()
    const tooltipWidth = rect.width
    const offsetRight = window.innerWidth - rect.right
    return offsetRight > tooltipWidth
  }

  return (
    <div className="relative">
      {trigger}

      <div
        ref={contentRef}
        className={cn(
          'absolute top-[120%] z-50 p-2 bg-white rounded ring-1 ring-slate-900 ring-opacity-5 shadow-lg dark:bg-one-dark-2',
          isOnRight() ? 'left-0' : 'right-0'
        )}
      >
        {content}
      </div>
    </div>
  )
}
