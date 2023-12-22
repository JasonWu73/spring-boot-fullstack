import { Minus, Plus } from 'lucide-react'

import { Counter } from '@/compound-component/Counter'
import { Code } from '@/shared/components/ui/Code'
import { Separator } from '@/shared/components/ui/Separator'

export function CompoundCounter() {
  return (
    <>
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
          <Counter.Increase icon="▶️" />
          <Counter.Count />
          <Counter.Decrease icon="◀️" />
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
          <Counter.Increase icon="🔜" className="dark:bg-slate-50" />
          <Counter.Decrease icon="🔙" className="dark:bg-slate-50" />
        </div>
      </Counter>
    </>
  )
}
