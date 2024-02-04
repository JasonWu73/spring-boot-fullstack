import { Link, useRouteError } from 'react-router-dom'

type ErrorPageProps = {
  notFound?: boolean
  forbidden?: boolean
}

export default function ErrorPage({ notFound, forbidden }: ErrorPageProps) {
  const error = useRouteError() as Error

  if (notFound || forbidden) return <SpecificPage notFound={notFound} forbidden={forbidden}/>

  return (
    <div className="relative flex flex-col items-center gap-4 mt-8 text-slate-900 dark:text-slate-200">
      <h1 className="text-red-600 text-9xl font-extrabold">ERROR</h1>

      <div
        className="absolute top-[4.5rem] px-2 text-slate-50 bg-orange-600 text-sm rotate-12 rounded-sm dark:text-slate-200"
      >
        {error.name}
      </div>

      <p className="text-rose-500 italic">{error.message}</p>
    </div>
  )
}

type SpecificPageProps = {
  notFound?: boolean
  forbidden?: boolean
}

function SpecificPage({ notFound, forbidden }: SpecificPageProps) {
  return (
    <div className="relative flex flex-col items-center gap-4 mt-8 text-slate-900 dark:text-slate-200">
      <h1 className="text-9xl font-extrabold tracking-widest">
        {notFound && '404'}

        {forbidden && '403'}
      </h1>

      <div
        className="absolute top-[5.5rem] px-2 text-slate-50 bg-orange-600 text-sm rotate-12 rounded-sm dark:text-slate-200"
      >
        {notFound && 'Page Not Found'}

        {forbidden && 'Access is Denied'}
      </div>

      <div className="mt-5">
        <Link
          to="/"
          className="group relative inline-block text-slate-50 text-sm font-medium focus:rounded-md focus:outline-none focus:ring-1 focus:ring-orange-600 dark:text-slate-200"
        >
          <span
            className="group-hover:translate-y-0 group-hover:translate-x-0 group-focus:translate-y-0 group-focus:translate-x-0 absolute inset-0 translate-y-0.5 translate-x-0.5 rounded-md bg-orange-600 transition-transform"
          />

          <span
            className="group-hover:bg-slate-800 group-focus:bg-slate-800 relative block py-3 px-8 bg-slate-900 border border-current rounded-md"
          >
            返回首页
          </span>
        </Link>
      </div>
    </div>
  )
}
