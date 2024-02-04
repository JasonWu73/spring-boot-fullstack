import { Link } from 'react-router-dom'

export function Logo() {
  return (
    <Link
      to="/"
      className="px-2 text-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
    >
      <h2
        className="flex items-center h-8 pl-10 uppercase bg-[url('/img/react.svg')] bg-left bg-no-repeat"
      >
        React
      </h2>
    </Link>
  )
}
