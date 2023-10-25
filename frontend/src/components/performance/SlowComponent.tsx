import { memo } from 'react'

import { cn } from '@/lib/utils'

type SlowComponentProps = {
  className?: string
}

function SlowComponent({ className }: SlowComponentProps) {
  let sum = 0

  Array.from({ length: 2_000_000 }, (_, i) => {
    sum += i
  })

  return (
    <div className={cn('rounded-md border p-4', className)}>
      <h2 className="mb-4 font-medium leading-none">慢组件</h2>
      <p className="text-xs">累加值：{sum}</p>
    </div>
  )
}

const MemoizedSlowComponent = memo(SlowComponent)

export { SlowComponent, MemoizedSlowComponent }
