import React, { memo, useMemo } from 'react'

import { ScrollArea } from '@/components/ui/ScrollArea'
import { Separator } from '@/components/ui/Separator'

type TooMuchComponent = {
  info?: {
    name: string
    version: string
  }
}

function TooMuchComponent({ info }: TooMuchComponent) {
  const tags = useMemo(
    () => Array.from({ length: 5_000 }, (_, i) => `v0.0.1-beta.${i}`),
    []
  )

  return (
    <ScrollArea className="h-72 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">
          {info?.name || '大量标签'}：{info?.version || 'v0.0.1'}
        </h4>

        <p className="mb-4">构建于：{new Date().toLocaleString()}</p>

        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">{tag}</div>

            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  )
}

const MemoizedTooMuchComponent = memo(TooMuchComponent)

MemoizedTooMuchComponent.displayName = 'MemoizedTooMuchComponent'

export { MemoizedTooMuchComponent }
