import {cn} from '@/utils/helpers'
import {Button} from '@/ui/shadcn-ui/Button'

type MenuUnfoldTriggerProps = {
  isOpen: boolean
  onToggle: (isOpen: boolean) => void
}

/**
 * 汉堡菜单图标，常用于移动端展示顶部导航栏内容。
 */
function Hamburger({isOpen, onToggle}: MenuUnfoldTriggerProps) {
  const line = 'my-1 w-[1.2rem] h-[2px] bg-white group-hover:bg-slate-800 group-hover:dark:bg-white duration-300'

  return (
    <div className="flex items-center lg:hidden">
      <Button
        onClick={() => onToggle(!isOpen)}
        variant="outline"
        size="icon"
        className="group flex-col"
      >
        <div
          className={cn(
            line,
            isOpen && 'translate-y-[0.625rem] rotate-45'
          )}
        />
        <div
          className={cn(
            line,
            isOpen ? 'opacity-0' : 'my-0'
          )}
        />
        <div
          className={cn(
            line,
            isOpen && '-translate-y-[0.625rem] -rotate-45'
          )}
        />
      </Button>
    </div>
  )
}

export {Hamburger}
