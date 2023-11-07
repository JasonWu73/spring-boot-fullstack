import { useNavigate, useRouteError } from 'react-router-dom'

function Error() {
  const navigate = useNavigate()

  const error = useRouteError() as { data: string; message: string }

  return (
    <div>
      <h1 className="text-lg font-extrabold">出了些问题😢</h1>
      <p>{error.data || error.message}</p>
      <button
        onClick={() => navigate(-1)}
        className="rounded bg-sky-500 px-2 py-1 text-white hover:bg-sky-600"
      >
        ← 返回
      </button>
    </div>
  )
}

export default Error
