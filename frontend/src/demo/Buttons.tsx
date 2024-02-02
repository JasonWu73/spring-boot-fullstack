import { Button } from '@/shared/components/ui/Button'

export function Buttons() {
  return (
    <div className="flex items-center gap-2 m-4">
      <Button variant="primary">测试</Button>
      <Button variant="primary" disabled>测试</Button>

      <Button variant="secondary">测试</Button>
      <Button variant="secondary" disabled>测试</Button>

      <Button variant="danger">测试</Button>
      <Button variant="danger" disabled>测试</Button>

      <Button variant="link">测试</Button>
      <Button variant="link" disabled>测试</Button>
    </div>
  )
}
