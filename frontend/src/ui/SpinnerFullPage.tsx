import {Spinner} from '@/ui/Spinner'

function SpinnerFullPage() {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 grid grid-rows-1 grid-cols-1 place-items-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="w-10 h-10"/>
        <span>加载中...</span>
      </div>
    </div>
  )
}

export {SpinnerFullPage}
