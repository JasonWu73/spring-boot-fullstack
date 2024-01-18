import { Link } from 'react-router-dom'

export default function ForbiddenPage() {
  return (
    <div className="relative flex flex-col items-center gap-4 mt-8 text-slate-950 dark:text-snow">
      <h1 className="text-9xl font-extrabold tracking-widest">403</h1>

      <div className="absolute top-[5.5rem] px-2 rounded-sm rotate-12 text-sm text-snow bg-orange-600">
        Access Is Denied
      </div>

      <div className="mt-5">
        <Link
          to="/"
          className="group relative inline-block text-sm font-medium text-orange-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-600 active:text-orange-500"
        >
          <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 rounded-md bg-orange-600 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

          <span className="relative block rounded-md border border-current bg-night px-8 py-3">
            返回首页
          </span>
        </Link>
      </div>
    </div>
  )
}
