import { memo } from 'react'

function HeavyComputedComponent() {
  let sum = 0

  Array.from({ length: 2_000_000 }, (_, i) => {
    sum += i
  })

  return (
    <div className="rounded-md border p-4">
      <h2 className="mb-4 font-medium leading-none">慢组件</h2>
      <p>构建于：{new Date().toLocaleString()}</p>
      <p className="text-xs">累加值：{sum}</p>
    </div>
  )
}

const MemoizedHeavyComputedComponent = memo(HeavyComputedComponent)

MemoizedHeavyComputedComponent.displayName = 'MemoizedHeavyComputedComponent'

export { HeavyComputedComponent, MemoizedHeavyComputedComponent }
