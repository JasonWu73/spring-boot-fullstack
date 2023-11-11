import { Button } from '@/ui/shadcn-ui/Button'
import { cn, tw } from '@/utils/helpers'

type HamburgerProps = {
  isOpen: boolean
  onToggle: (isOpen: boolean) => void
}

/**
 * 汉堡菜单图标，常用于移动端展示顶部导航栏内容。
 */
function Hamburger({ isOpen, onToggle }: HamburgerProps) {
  const line = tw`my-1 h-[2px] w-[1.2rem] bg-white duration-300 group-hover:bg-slate-800 group-hover:dark:bg-white`

  return (
    <div className="flex items-center lg:hidden">
      <Button
        onClick={() => onToggle(!isOpen)}
        variant="outline"
        size="icon"
        className="group flex-col"
      >
        <div
          className={cn(line, isOpen && 'translate-y-[0.625rem] rotate-45')}
        />
        <div className={cn(line, isOpen ? 'opacity-0' : 'my-0')} />
        <div
          className={cn(line, isOpen && '-translate-y-[0.625rem] -rotate-45')}
        />
      </Button>
    </div>
  )
}

export { Hamburger }
