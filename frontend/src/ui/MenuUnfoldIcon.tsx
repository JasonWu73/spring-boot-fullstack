import {cn, tw} from '@/utils/helpers'
import {Button} from '@/ui/shadcn-ui/Button'

type MenuUnfoldTriggerProps = {
  isOpen: boolean
  onToggle: (isOpen: boolean) => void
}

/**
 * 汉堡菜单图标，常用于移动端展示顶部导航栏。
 *
 * @param isOpen - 展开状态
 * @param onToggle - 切换展开状态
 */
function MenuUnfoldIcon({isOpen, onToggle}: MenuUnfoldTriggerProps) {
  const line = tw`ease my-1 h-[2px] w-[1.2rem] transform rounded-full bg-white transition duration-300 group-hover:bg-slate-800 group-hover:dark:bg-white`

  return (
    <div className="flex items-center lg:hidden">
      <Button
        onClick={() => onToggle(!isOpen)}
        variant="outline"
        size="icon"
        className="group flex-col"
      >
        <div
          className={cn(line, {
            'translate-y-[0.625rem] rotate-45': isOpen
          })}
        />
        <div
          className={cn(line, {
            'opacity-0': isOpen,
            'my-0': !isOpen
          })}
        />
        <div
          className={cn(line, {
            '-translate-y-[0.625rem] -rotate-45': isOpen
          })}
        />
      </Button>
    </div>
  )
}

export {MenuUnfoldIcon}
