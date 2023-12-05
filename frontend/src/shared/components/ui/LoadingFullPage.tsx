import { Loading } from '@/shared/components/ui/Loading'

export function LoadingFullPage() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-200/20 backdrop-blur-sm dark:bg-slate-800/20">
      <div className="flex flex-col items-center gap-4">
        <Loading />
        <span className="select-none">加载中...</span>
      </div>
    </div>
  )
}
