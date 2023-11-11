import {PanelLeftClose, PanelLeftOpen} from 'lucide-react'

import {usePanelFold} from '@/ui/layout/panel-fold/PanelFoldProvider'
import {Button} from '@/ui/shadcn-ui/Button'

/**
 * 折叠或展开面板的图标，常用于是否折叠侧边导航栏。
 */
function PanelFold() {
  const {folded, setFolded} = usePanelFold()

  function handleToggle() {
    setFolded(prevFolded => !prevFolded)
  }

  const IconComp = folded ? PanelLeftOpen : PanelLeftClose

  return (
    <Button onClick={handleToggle} variant="outline" size="icon" className="group">
      <IconComp
        className="w-[1.2rem] h-[1.2rem] text-slate-300 group-hover:text-slate-800 group-hover:dark:text-white cursor-pointer"
      />
    </Button>
  )
}

export {PanelFold}
