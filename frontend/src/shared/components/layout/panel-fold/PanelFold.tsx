import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { usePanelFold } from '@/shared/components/layout/panel-fold/PanelFoldProvider'
import { Button } from '@/shared/components/ui/Button'

// 折叠或展开面板的图标，常用于折叠或展开侧边导航栏
function PanelFold() {
  const { folded, setFolded } = usePanelFold()

  const IconComponent = folded ? PanelLeftOpen : PanelLeftClose

  return (
    <Button
      onClick={() => setFolded((prevFolded) => !prevFolded)}
      variant="outline"
      size="icon"
      className="group"
    >
      <IconComponent className="h-[1.2rem] w-[1.2rem] cursor-pointer text-slate-300 group-hover:text-slate-800 group-hover:dark:text-white" />
    </Button>
  )
}

export { PanelFold }
