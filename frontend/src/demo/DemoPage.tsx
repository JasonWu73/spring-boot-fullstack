import { Buttons } from '@/demo/Buttons'
import { Inputs } from '@/demo/Inputs'

export default function DemoPage() {
  return (
    <div>
      <div>
        <h2>按钮</h2>
        <Buttons/>
      </div>

      <div>
        <h2>文本框</h2>
        <Inputs/>
      </div>
    </div>
  )
}
