import React from 'react'

import { cn, truncate } from '@/shared/utils/helpers'

type TooltipProps = {
  children: React.ReactNode
  title?: string
}

export function Tooltip({ children, title }: TooltipProps) {
  const tooltipRef = React.useRef<HTMLDivElement>(null)

  if (!title) return <>{children}</>

  // 判断 Tooltip 显示在元素的上方还是下方
  function isAbove() {
    const tooltip = tooltipRef.current
    if (!tooltip) return true

    const rect = tooltip.getBoundingClientRect()
    const tooltipHeight = rect.height
    const offsetTop = rect.top
    return offsetTop > tooltipHeight
  }

  // 判断 Tooltip 显示在元素的左侧还是右侧
  function isOnRight() {
    const tooltip = tooltipRef.current
    if (!tooltip) return true

    const rect = tooltip.getBoundingClientRect()
    const tooltipWidth = rect.width
    const offsetRight = window.innerWidth - rect.right
    return offsetRight > tooltipWidth
  }

  const shortTitle = title.length < 10

  return (
    <div ref={tooltipRef} className="group relative max-w-fit">
      {children}

      <span
        className={cn(
          'group-hover:inline-block hidden absolute top-[140%] z-[100] py-2 px-4 text-sm text-nowrap text-gray-50 bg-slate-700 rounded shadow-md dark:text-gray-200',
          isAbove() && '-top-[140%]',
          isOnRight() ? 'left-0' : 'right-0'
        )}
      >
        <Arrow
          className={cn(
            isAbove() ? 'top-full' : '-top-2 rotate-180',
            isOnRight()
              ? (shortTitle ? 'left-1/4' : 'left-[8%]')
              : (shortTitle ? 'right-1/4' : 'right-[8%]')
          )}
        />

        {truncate(title, 20)}
      </span>
    </div>
  )
}

type ArrowProps = React.ComponentPropsWithoutRef<'svg'>

function Arrow({ className }: ArrowProps) {
  return (
    <svg
      className={cn(
        'absolute h-2 text-slate-700',
        className
      )}
      x="0px"
      y="0px"
      viewBox="0 0 255 255"
      xmlSpace="preserve"
    >
      <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
    </svg>
  )
}
