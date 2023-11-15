import { Spinner } from '@/shared/components/Spinner'

function SpinnerFullPage() {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 grid grid-cols-1 grid-rows-1 place-items-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-10 w-10" />
        <span>加载中...</span>
      </div>
    </div>
  )
}

export { SpinnerFullPage }
