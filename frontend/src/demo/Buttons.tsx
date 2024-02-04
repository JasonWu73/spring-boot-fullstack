import { Button } from '@/shared/components/ui/Button'

export function Buttons() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant="primary"
        title="主要用于突出显示主要操作，如提交表单、保存更改等。通常在页面上主要的行动按钮。通常具有鲜明的颜色，以引起用户的注意"
      >
        测试
      </Button>
      <Button variant="primary" title="禁用" disabled>测试</Button>

      <Button
        variant="secondary"
        title="用于次要操作，或作为次要行动按钮。可以用于取消、返回或执行辅助操作。通常具有较为柔和的颜色，以不引起用户的注意"
      >
        测试
      </Button>
      <Button variant="secondary" title="禁用" disabled>测试</Button>

      <Button
        variant="danger"
        title="用于危险操作，如删除数据或执行可能导致问题的操作等。通常采用红色或与危险相关的颜色"
      >
        测试
      </Button>
      <Button variant="danger" title="禁用" disabled>测试</Button>

      <Button
        variant="ghost"
        title="透明按钮样式，用于菜单项、不带背景色的按钮"
      >
        测试
      </Button>
      <Button variant="ghost" title="禁用" disabled>测试</Button>

      <Button variant="link" title="超链接样式">测试</Button>
      <Button variant="link" title="禁用" disabled>测试</Button>
    </div>
  )
}
