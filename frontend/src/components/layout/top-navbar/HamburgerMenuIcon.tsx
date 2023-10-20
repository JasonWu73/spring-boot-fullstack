import { cn, tw } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

type HamburgerIconProps = {
  isOpen: boolean
  onToggle: (isOpen: boolean) => void
}

function HamburgerMenuIcon({ isOpen, onToggle }: HamburgerIconProps) {
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

export { HamburgerMenuIcon }
