import { Minus, Plus } from 'lucide-react'

import { Counter } from '@/compound-component/Counter'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/Card'
import { Code } from '@/shared/components/ui/Code'
import { Separator } from '@/shared/components/ui/Separator'
import { useTitle } from '@/shared/hooks/use-title'

export default function CounterPage() {
  useTitle('复合组件')

  return (
    <Card className="mx-auto mt-8 max-w-xs">
      <CardHeader className="text-center">
        <CardTitle>复合组件模式</CardTitle>
        <CardDescription>实现超级灵活的组件</CardDescription>
      </CardHeader>

      <CardContent>
        <Counter className="flex flex-col items-center justify-center gap-4">
          <Counter.Label className="font-semibold">Counter 复合组件</Counter.Label>

          <div className="flex items-center justify-center gap-2">
            <Counter.Decrease icon={<Minus />} />
            <Counter.Count />
            <Counter.Increase icon={<Plus />} />
          </div>
        </Counter>

        <Separator className="my-4" />

        <Counter className="flex flex-col items-center justify-center gap-4">
          <Counter.Label className="font-semibold">Counter 复合组件</Counter.Label>

          <div className="flex items-center justify-center gap-2">
            <Counter.Decrease icon="◀️" />
            <Counter.Count />
            <Counter.Increase icon="▶️" />
          </div>
        </Counter>

        <Separator className="my-4" />

        <Counter className="flex flex-col items-center justify-center gap-4">
          <Counter.Label className="font-semibold">
            <span>Counter 复合组件：</span>
            <Code>
              <Counter.Count />
            </Code>
          </Counter.Label>

          <div className="flex items-center justify-center gap-2">
            <Counter.Increase icon="🔙" className="dark:bg-slate-50" />
            <Counter.Decrease icon="🔜" className="dark:bg-slate-50" />
          </div>
        </Counter>
      </CardContent>
    </Card>
  )
}
