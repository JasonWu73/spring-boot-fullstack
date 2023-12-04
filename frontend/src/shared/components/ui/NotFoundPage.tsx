import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <h1>页面不存在 😞</h1>
      <Link
        to="/"
        className="text-sky-500 underline-offset-4 hover:text-sky-500/90 hover:underline"
      >
        返回首页
      </Link>
    </div>
  )
}
