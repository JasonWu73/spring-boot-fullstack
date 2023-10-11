import React, { useEffect, useReducer } from 'react'

type ApiResponse<T> = {
  data: T | null
  error: string
}

type State<T> = {
  data: T | null
  error: string
  loading: boolean
}

const initialState: State<unknown> = {
  data: null,
  error: '',
  loading: false
}

type Action<T> =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_FAILURE'; payload: string }

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        error: '',
        loading: true
      }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        data: action.payload,
        error: '',
        loading: false
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    default: {
      throw new Error('Action type is not supported')
    }
  }
}

/**
 * 获取数据的自定义 Hook.
 *
 * @template T - 数据类型
 * @template E - 请求参数类型
 *
 * @param callback - 获取数据的回调函数
 * @param firstTimeAutoRunCallback - 是否在第一次渲染时自动执行回调函数, 默认为 true
 * @returns - 数据, 错误信息, 加载状态和获取数据的回调函数
 */
function useFetch<T, E>(
  callback: (
    values?: E | null,
    signal?: AbortSignal
  ) => Promise<ApiResponse<T>>,
  firstTimeAutoRunCallback: boolean = true
) {
  const [{ data, error, loading }, dispatch] = useReducer(
    reducer as React.Reducer<State<T>, Action<T>>,
    initialState as State<T>
  )

  useEffect(() => {
    if (!firstTimeAutoRunCallback) {
      return
    }

    const controller = new AbortController()

    fetchData(null, controller).then()

    return () => {
      controller.abort()
    }
  }, [])

  async function fetchData(values?: E | null, controller?: AbortController) {
    dispatch({ type: 'FETCH_INIT' })

    const { data: responseData, error: responseError } = await callback(
      values,
      controller?.signal
    )

    if (responseError) {
      dispatch({ type: 'FETCH_FAILURE', payload: responseError })
      return
    }

    if (responseData) {
      dispatch({ type: 'FETCH_SUCCESS', payload: responseData })
    }
  }

  return { data, error, loading, fetchData }
}

export { useFetch, type ApiResponse }
