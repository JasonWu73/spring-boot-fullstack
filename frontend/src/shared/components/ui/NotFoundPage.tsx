import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="relative mt-8 flex flex-col items-center gap-4 text-slate-950 dark:text-snow">
      <h1 className="text-9xl font-extrabold tracking-widest">404</h1>

      <div className="absolute top-[5.5rem] rotate-12 rounded-sm bg-orange-600 px-2 text-sm text-snow">
        Page Not Found
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
  );
}
