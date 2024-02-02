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

  // 根据元素到页面底部的距离判断显示 Tooltip 显示在元素的上方还是下方
  function showUp() {
    const tooltip = tooltipRef.current
    if (!tooltip) return false

    const tooltipHeight = tooltip.offsetHeight
    const distanceToTop = tooltip.offsetTop + tooltipHeight
    const distanceToBottom = window.innerHeight - distanceToTop
    return distanceToBottom < tooltipHeight
  }

  return (
    <div ref={tooltipRef} className="group relative flex items-center">
      {children}

      <span
        className={cn(
          'group-hover:inline-block hidden absolute top-[140%] left-0 z-50 py-2 px-4 text-sm text-gray-50 bg-slate-700 rounded shadow-md',
          showUp() && '-top-[140%]'
        )}
      >
        <Arrow
          className={cn(
            !showUp() && '-top-2 rotate-180',
            className
          )}
        />

        {title}
      </span>
    </div>
  )
}

type ArrowProps = React.ComponentPropsWithoutRef<'svg'>

function Arrow({ className }: ArrowProps) {
  return (
    <svg
      className={cn(
        'absolute top-full left-0 h-2 w-full text-slate-700',
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
