import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { Button } from '@/shared/components/ui/Button'
import { getFolded, setFolded } from '@/shared/components/layout/panel-fold/panel-fold'
import { cn } from '@/shared/utils/helpers'

/**
 * 折叠或展开面板的图标，常用于折叠或展开侧边导航栏。
 */
export function PanelFold() {
  const folded = getFolded()
  const IconComponent = folded ? PanelLeftOpen : PanelLeftClose

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setFolded(!folded)}
      className={cn('group border-slate-900 focus-visible:ring-slate-300')}
    >
      <IconComponent className="h-[1.2rem] w-[1.2rem] cursor-pointer text-slate-300 group-hover:text-slate-800 group-hover:dark:text-white" />
    </Button>
  )
}
