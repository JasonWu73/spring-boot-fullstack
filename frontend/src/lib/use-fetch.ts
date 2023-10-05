import { useCallback, useEffect, useState } from 'react'

type ApiResponse<T> = {
  data: T | null
  error: string
}

/**
 * 获取数据的自定义 Hook.
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

  const fetchData = useCallback(
    async (controller?: AbortController) => {
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
    },
    [callback]
  )

  useEffect(() => {
    const controller = new AbortController()

    fetchData(controller).then()

    return () => {
      controller.abort()
    }
  }, [fetchData])

  return { data, error, loading, fetchData }
}

export { useFetch, type ApiResponse }
