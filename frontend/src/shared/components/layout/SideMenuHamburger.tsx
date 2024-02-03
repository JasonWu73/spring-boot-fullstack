import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/helpers'
import { isCollapsed, setCollapsed } from '@/shared/components/layout/side-menu-signals'

type SideMenuHamburgerProps = {
  className?: string
};

export function SideMenuHamburger({ className }: SideMenuHamburgerProps) {
  const collapsed = isCollapsed();

  const line = 'h-[0.08rem] w-5 bg-slate-50 duration-300'

  return (
    <div className="flex items-center">
      <Button
        onClick={() => setCollapsed(!collapsed)}
        title="开关侧边栏"
        className={cn(
          'flex-col gap-1',
          className
        )}
      >
        <div className={cn(line, !collapsed && 'translate-y-[0.34rem] rotate-45')}/>
        <div className={cn(line, 'duration-0', !collapsed && 'opacity-0')}/>
        <div className={cn(line, !collapsed && '-translate-y-[0.34rem] -rotate-45')}/>
      </Button>
    </div>
  )
}
