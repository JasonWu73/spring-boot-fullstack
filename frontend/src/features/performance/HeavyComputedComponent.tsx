import { memo } from 'react'

function HeavyComputedComponent() {
  let sum = 0

  Array.from({ length: 2_000_000 }, (_, i) => {
    sum += i
  })

  return (
    <div className="p-4 border rounded-md">
      <h2 className="mb-4 leading-none">慢组件</h2>
      <p>构建于：{new Date().toLocaleString()}</p>
      <p className="text-xs">累加值：{sum}</p>
    </div>
  )
}

const MemoizedHeavyComputedComponent = memo(HeavyComputedComponent)

MemoizedHeavyComputedComponent.displayName = 'MemoizedHeavyComputedComponent'

export { HeavyComputedComponent, MemoizedHeavyComputedComponent }
