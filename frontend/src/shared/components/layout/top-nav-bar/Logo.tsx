import { Link } from 'react-router-dom'

export function Logo() {
  return (
    <Link
      to="/"
      className="text-slate-200 focus:outline-none focus:rounded focus:ring-1 focus:ring-sky-500"
    >
      <span className="flex items-center gap-2">
        <h2
          className="flex items-center h-8 pl-10 uppercase bg-[url('/img/react.svg')] bg-left bg-no-repeat"
        >
          React
        </h2>
      </span>
    </Link>
  )
}
