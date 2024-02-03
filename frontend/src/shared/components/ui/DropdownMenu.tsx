import React from 'react'

type DropdownMenuProps = {
  trigger: React.ReactNode
  content: React.ReactNode
}

export function DropdownMenu({ trigger, content }: DropdownMenuProps) {
  return (
    <div className="relative">
        {trigger}

      <div
        className="absolute right-0 z-50"
      >
        {content}
      </div>
    </div>
  )
}
