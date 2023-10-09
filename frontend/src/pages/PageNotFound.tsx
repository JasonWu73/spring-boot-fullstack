import { Link } from 'react-router-dom'

function PageNotFound() {
  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Page Not Found :(</h2>
      <Link to="/" className="text-sky-500 hover:underline">
        Back to Home
      </Link>
    </div>
  )
}

export { PageNotFound }
