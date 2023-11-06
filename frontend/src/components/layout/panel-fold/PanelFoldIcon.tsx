import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { usePanelFold } from '@/components/layout/panel-fold/PanelFoldContext'
import { tw } from '@/lib/utils'

/**
 * 折叠或展开面板的图标，常用于是否折叠侧边导航栏。
 */
function PanelFoldIcon() {
  const { folded, setFolded } = usePanelFold()

  function handleOpen() {
    return setFolded(false)
  }

  function handleClose() {
    return setFolded(true)
  }

  const style = tw`cursor-pointer text-slate-300`

  return (
    <>
      {folded && <PanelLeftOpen className={style} onClick={handleOpen} />}

      {!folded && <PanelLeftClose className={style} onClick={handleClose} />}
    </>
  )
}

export { PanelFoldIcon }