import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <h1>页面不存在 😞</h1>
      <Link to="/" className="text-sky-500 hover:underline">
        返回首页
      </Link>
    </div>
  )
}

export default NotFoundPage
