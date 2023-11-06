import { useMemo, useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/ui/shadcn-ui/Card'
import { Button } from '@/ui/shadcn-ui/Button'
import { useRefresh } from '@/hooks/use-refresh'
import { Code } from '@/ui/Code'
import { MemoizedTooMuchComponent } from '@/features/performance/TooMuchComponent'

export default function UseMemo() {
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
          性能优化 - <Code>useMemo</Code> Hook
        </CardTitle>

        <CardDescription>
          使用 <Code>useMemo</Code> 缓存对象值，可避免重复渲染（JS 中{' '}
          <Code>(&#123;&#125; !== &#123;&#125;) === true</Code>）
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

  const info = {
    name: 'TooMuchComponent',
    version: 'v1.0.0'
  }

  return (
    <div className="space-y-2 border-t border-amber-500 pt-2">
      <Button onClick={() => setCount((prev) => prev + 1)}>
        点击刷新父组件 - {count}
      </Button>

      <MemoizedTooMuchComponent info={info} />
    </div>
  )
}

function AfterOptimization() {
  const [count, setCount] = useState(0)

  const info = useMemo(() => {
    return {
      name: 'TooMuchComponent',
      version: 'v1.0.0'
    }
  }, [])

  return (
    <div className="space-y-2 border-t border-amber-500 pt-2">
      <Button onClick={() => setCount((prev) => prev + 1)}>
        点击刷新父组件 - {count}
      </Button>

      <MemoizedTooMuchComponent info={info} />
    </div>
  )
}
