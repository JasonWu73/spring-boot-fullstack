import React, { useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/ui/shadcn-ui/Card'
import { Button } from '@/ui/shadcn-ui/Button'
import { HeavyComputedComponent } from '@/features/performance/HeavyComputedComponent'
import { useRefresh } from '@/hooks/use-refresh'
import { Code } from '@/ui/Code'

export default function ChildrenProp() {
  const [showBefore, setShowBefore] = useState(false)
  const [showAfter, setShowAfter] = useState(false)

  useRefresh(() => {
    setShowBefore(false)
    setShowAfter(false)
  })

  return (
    <Card className="w-64 min-w-fit">
      <CardHeader>
        <CardTitle>
          性能优化 - <Code>children</Code> 属性
        </CardTitle>

        <CardDescription>父组件刷新，导致子组件刷新</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <h2 className="text-red-500">优化前</h2>
            <Button
              onClick={() => setShowBefore((prev) => !prev)}
              variant="destructive"
            >
              {showBefore ? '关闭' : '打开'}慢组件
            </Button>

            {showBefore && <BeforeOptimization />}
          </div>

          <div className="space-y-2">
            <h2 className="text-emerald-500">优化后</h2>
            <Button
              onClick={() => setShowAfter((prev) => !prev)}
              variant="destructive"
            >
              {showAfter ? '关闭' : '打开'}慢组件
            </Button>

            {showAfter && (
              <AfterOptimization>
                <HeavyComputedComponent />
              </AfterOptimization>
            )}
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

      <HeavyComputedComponent />
    </div>
  )
}

type AfterOptimizationProps = {
  children: React.ReactNode
}

function AfterOptimization({ children }: AfterOptimizationProps) {
  const [count, setCount] = useState(0)

  return (
    <div className="space-y-2 border-t border-amber-500 pt-2">
      <Button onClick={() => setCount((prev) => prev + 1)}>
        点击刷新父组件 - {count}
      </Button>

      {children}
    </div>
  )
}
