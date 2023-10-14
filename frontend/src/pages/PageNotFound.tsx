import { Link } from 'react-router-dom'

function PageNotFound() {
  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">页面不存在 :(</h2>
      <Link to="/" className="text-sky-500 hover:underline">
        返回首页
      </Link>
    </div>
  )
}

export { PageNotFound }
