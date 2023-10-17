import React, { useCallback, useEffect, useReducer } from 'react'
import NProgress from 'nprogress'

type ApiResponse<T> = {
  data: T | null
  error: string
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
  | { type: 'FETCH_INIT'; payload: AbortController | null }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'RESET' }

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'FETCH_INIT': {
      return {
        ...state,
        error: '',
        loading: true,
        controller: action.payload
      }
    }
    case 'FETCH_SUCCESS': {
      return {
        ...state,
        data: action.payload,
        error: '',
        loading: false,
        controller: null
      }
    }
    case 'FETCH_FAILURE': {
      return {
        ...state,
        error: action.payload,
        loading: false,
        controller: null
      }
    }
    case 'RESET': {
      if (state.controller) {
        state.controller.abort()
      }

      return {
        ...initialState
      } as State<T>
    }
    default: {
      throw new Error('Action type is not supported')
    }
  }
}

/**
 * 获取数据的自定义 Hook.
 *
 * @template T - 返回的数据类型
 * @template E - 请求参数类型
 *
 * @param callback - 获取数据的回调函数
 * @param initialCall - 是否在第一次渲染时自动执行获取数据的回调函数, 默认为 true
 * @returns - 数据, 错误信息, 加载状态, 获取数据的回调函数以前加载状态重置函数
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

  const fetchData = useCallback(async function fetchData(
    values: E | null = null,
    controller = new AbortController()
  ) {
    dispatch({ type: 'FETCH_INIT', payload: controller })

    const { data: responseData, error: responseError } = await callback(
      values,
      controller.signal
    )

    if (responseError) {
      dispatch({ type: 'FETCH_FAILURE', payload: responseError })
      return
    }

    dispatch({ type: 'FETCH_SUCCESS', payload: responseData })
  }, [])

  const reset = useCallback(function reset() {
    dispatch({ type: 'RESET' })
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
