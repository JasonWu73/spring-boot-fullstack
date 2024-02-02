import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/helpers'

type SideMenuHamburgerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  className?: string
};

export function SideMenuHamburger({ open, onOpenChange, className }: SideMenuHamburgerProps) {
  const line = 'h-[0.08rem] w-5 bg-slate-50 duration-300'

  return (
    <div className="flex items-center">
      <Button
        title="侧边栏菜单"
        onClick={() => onOpenChange(!open)}
        className={cn(
          'flex-col gap-1',
          className
        )}
      >
        <div className={cn(line, open && 'translate-y-[0.34rem] rotate-45')}/>
        <div className={cn(line, 'duration-0', open && 'opacity-0')}/>
        <div className={cn(line, open && '-translate-y-[0.34rem] -rotate-45')}/>
      </Button>
    </div>
  )
}
