import { useEffect, useState } from 'react'

type ApiResponse<T> = {
  data: T | null
  error: string
}

/**
 * 获取数据的自定义 Hook.
 *
 * @template T - 数据类型
 *
 * @param callback - 获取数据的回调函数
 * @returns - 数据, 错误信息, 加载状态和获取数据的回调函数
 */
function useFetch<T>(
  callback: (signal?: AbortSignal) => Promise<ApiResponse<T>>
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(
    () => {
      const controller = new AbortController()

      fetchData(controller).then()

      return () => {
        controller.abort()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  async function fetchData(controller?: AbortController) {
    setError('')
    setLoading(true)

    const { data: responseData, error: responseError } = await callback(
      controller?.signal
    )

    setLoading(false)

    if (responseError) {
      setError(responseError)
      return
    }

    setData(responseData)
  }

  return { data, error, loading, fetchData }
}

export { useFetch, type ApiResponse }
