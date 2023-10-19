import React, { useCallback, useEffect, useReducer } from 'react'
import NProgress from 'nprogress'
import { useLocation, useNavigate } from 'react-router-dom'

type ApiResponse<T> = {
  data: T | null
  error: string
  authFailed?: boolean
}

type State<T> = {
  data: T | null
  error: string
  loading: boolean
  controller: AbortController | null
}

const initialState: State<unknown> = {
  data: null,
  error: '',
  loading: false,
  controller: null
}

type Action<T> =
  | { type: 'init'; payload: AbortController | null }
  | { type: 'resolved'; payload: T }
  | { type: 'rejected'; payload: string }
  | { type: 'aborted' }
  | { type: 'reset' }

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'init': {
      return {
        ...(initialState as State<T>),
        loading: true,
        controller: action.payload
      }
    }
    case 'resolved': {
      return {
        ...state,
        data: action.payload,
        error: '',
        loading: false,
        controller: null
      }
    }
    case 'rejected': {
      return {
        ...state,
        error: action.payload,
        loading: false,
        controller: null
      }
    }
    case 'aborted': {
      return {
        ...state,
        controller: null
      }
    }
    case 'reset': {
      if (state.controller) {
        state.controller.abort()
      }

      return {
        ...(initialState as State<T>)
      }
    }
    default: {
      throw new Error(`未知的 action 类型：${action}`)
    }
  }
}

type FetchData<T> = {
  data: T | null
  error: string
}

/**
 * 获取数据的自定义 Hook。
 *
 * @template T - 返回的数据类型
 * @template E - 请求参数类型
 *
 * @param callback - 获取数据的回调函数
 * @param initialCall - 是否在第一次渲染时自动执行获取数据的回调函数，默认为 true
 * @returns - 数据、错误信息、加载状态、获取数据和重置加载的回调函数
 */
function useFetch<T, E>(
  callback: (values: E | null, signal: AbortSignal) => Promise<ApiResponse<T>>,
  initialCall: boolean = true
) {
  const [{ data, error, loading }, dispatch] = useReducer(
    reducer as React.Reducer<State<T | null>, Action<T | null>>,
    initialState as State<T>
  )

  useEffect(() => {
    if (!initialCall) {
      return
    }

    const controller = new AbortController()

    fetchData(null, controller).then()

    return () => {
      controller.abort()
    }
  }, [])

  useLoading(loading)

  const navigate = useNavigate()
  const location = useLocation()

  const fetchData = useCallback(async function fetchData(
    values: E | null = null,
    controller = new AbortController()
  ): Promise<FetchData<T>> {
    dispatch({ type: 'init', payload: controller })

    const response = await callback(values, controller.signal)

    if (controller.signal.aborted) {
      dispatch({ type: 'aborted' })
      return response
    }

    if (response.error) {
      dispatch({ type: 'rejected', payload: response.error })

      if (response.authFailed) {
        navigate('/login', {
          replace: true,
          state: { from: location.pathname }
        })
      }

      return response
    }

    dispatch({ type: 'resolved', payload: response.data })

    return response
  }, [])

  const reset = useCallback(function reset() {
    dispatch({ type: 'reset' })
  }, [])

  return { data, error, loading, fetchData, reset }
}

function useLoading(loading: boolean) {
  useEffect(() => {
    // 开始加载动画
    loading && NProgress.start()

    // 结束加载动画
    !loading && NProgress.done()
  }, [loading])
}

export { useFetch, type ApiResponse }
