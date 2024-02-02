import { Input } from '@/shared/components/ui/Input'

export function Inputs() {
  return (
    <div className="flex items-center gap-2 m-4">
      <Input value="测试文本"/>
      <Input value="测试文本" disabled/>
      <Input type="email" value="测试文本"/>
      <Input type="email" value="测试文本" disabled/>
    </div>
  )
}
