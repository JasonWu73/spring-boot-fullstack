import React from 'react'

import { cn } from '@/shared/utils/helpers'

type TooltipProps = {
  children: React.ReactNode
  title?: string
  className?: string
}

export function Tooltip({ children, title, className }: TooltipProps) {
  const tooltipRef = React.useRef<HTMLDivElement>(null)

  if (!title) return <>{children}</>

  const { width, maxWidth, isAbove, isOnRight } = getTooltipAttribute()

  function getTooltipAttribute() {
    const tooltip = tooltipRef.current
    if (!tooltip) return { width: 0, maxWidth: 0, isAbove: true, isOnRight: true }

    const rect = tooltip.getBoundingClientRect()

    // ----- Tooltip 显示在元素的上方还是下方 -----
    const tooltipHeight = rect.height
    const offsetTop = rect.top
    const isAbove = offsetTop > tooltipHeight

    // ----- Tooltip 显示在元素的左侧还是右侧 -----
    const tooltipWidth = rect.width
    const offsetRight = window.innerWidth - rect.right
    const isOnRight = offsetRight > tooltipWidth

    // Tooltip 的最大宽度
    const tooltipMaxWidth = isOnRight
      ? tooltipWidth + offsetRight - 8
      : rect.right - 8

    return {
      width: tooltipWidth,
      maxWidth: tooltipMaxWidth,
      isAbove,
      isOnRight
    }
  }

  return (
    <div ref={tooltipRef} className={cn('group relative max-w-fit', className)}>
      {children}

      <span
        style={{ maxWidth }}
        className={cn(
          'group-hover:flex hidden absolute top-[140%] z-[100] py-2 px-4 text-sm text-nowrap text-slate-50 bg-slate-700 rounded shadow-md dark:text-slate-200',
          isAbove && '-top-[140%]',
          isOnRight ? 'left-0' : 'right-0'
        )}
      >
        <Arrow
          style={{
            left: isOnRight ? `${Math.floor((width - 10) / 2)}px` : 'auto',
            right: isOnRight ? 'auto' : `${Math.floor((width - 10) / 2)}px`
          }}
          className={cn(
            isAbove ? 'top-full' : '-top-2 rotate-180'
          )}
        />

        <span className="inline-block max-w-full truncate">{title}</span>
      </span>
    </div>
  )
}

type ArrowProps = React.ComponentPropsWithoutRef<'svg'>

function Arrow({ className, ...props }: ArrowProps) {
  return (
    <svg
      {...props}
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
