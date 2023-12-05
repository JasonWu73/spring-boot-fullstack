import { Loading } from '@/shared/components/ui/Loading'

export function LoadingFullPage() {
  return (
    <div className="absolute inset-0 grid grid-cols-1 grid-rows-1 place-items-center">
      <div className="flex flex-col items-center gap-4">
        <Loading />
        <span>加载中...</span>
      </div>
    </div>
  )
}
