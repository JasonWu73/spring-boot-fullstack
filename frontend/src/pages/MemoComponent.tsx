import { useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  MemoizedSlowComponent,
  SlowComponent
} from '@/components/performance/SlowComponent'

function MemoComponent() {
  const [showBefore, setShowBefore] = useState(false)
  const [showAfter, setShowAfter] = useState(false)

  return (
    <Card className="w-64 min-w-fit">
      <CardHeader>
        <CardTitle>
          性能优化 - memo 高阶组件（Higher Order Component）
        </CardTitle>

        <CardDescription>
          使用 <code className="text-amber-500">memo</code> 高阶组件，避免在{' '}
          <code className="text-amber-500">props</code>{' '}
          未发生改变时产生不必要的渲染
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <h2 className="font-bold text-red-500">优化前</h2>
            <Button
              onClick={() => setShowBefore((prev) => !prev)}
              variant="destructive"
            >
              {showBefore ? '关闭' : '打开'}慢组件
            </Button>

            {showBefore && <BeforeOptimization />}
          </div>

          <div className="space-y-2">
            <h2 className="font-bold text-emerald-500">优化后</h2>
            <Button
              onClick={() => setShowAfter((prev) => !prev)}
              variant="destructive"
            >
              {showAfter ? '关闭' : '打开'}慢组件
            </Button>

            {showAfter && <AfterOptimization />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BeforeOptimization() {
  const [count, setCount] = useState(0)

  return (
    <div className="space-y-2 border-t border-amber-500 pt-2">
      <Button onClick={() => setCount((prev) => prev + 1)}>
        点击刷新父组件 - {count}
      </Button>

      <SlowComponent />
    </div>
  )
}

function AfterOptimization() {
  const [count, setCount] = useState(0)

  return (
    <div className="space-y-2 border-t border-amber-500 pt-2">
      <Button onClick={() => setCount((prev) => prev + 1)}>
        点击刷新父组件 - {count}
      </Button>

      <MemoizedSlowComponent />
    </div>
  )
}

export { MemoComponent }
