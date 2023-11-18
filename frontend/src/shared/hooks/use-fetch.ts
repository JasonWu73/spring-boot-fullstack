import React from 'react'

import type { Auth, FetchResponse, IgnoreFetch, ReLogin } from '@/shared/hooks/types'
import { endNProgress, startNProgress } from '@/shared/utils/nprogress'

type State<TData> = {
  data: TData | null
  error: string
  loading: boolean
  reLogin?: ReLogin
}

const initialState: State<unknown> = {
  data: null,
  error: '',
  loading: false
}

type Action<TData> =
  | { type: 'START_LOADING' }
  | { type: 'FETCH_SUCCESS'; payload: TData }
  | { type: 'FETCH_FAILED'; payload: string }
  | { type: 'IGNORE_FETCH' } // 只是忽略请求的结果，而非取消请求；取消请求只会不易于前端调试，因为后端仍然会处理请求

function reducer<TData>(state: State<TData>, action: Action<TData>): State<TData> {
  switch (action.type) {
    case 'START_LOADING': {
      startNProgress()

      return {
        ...state,
        data: null,
        error: '',
        loading: true
      }
    }
    case 'FETCH_SUCCESS': {
      endNProgress()

      return {
        ...state,
        data: action.payload,
        error: '',
        loading: false
      }
    }
    case 'FETCH_FAILED': {
      endNProgress()

      return {
        ...state,
        data: null,
        error: action.payload,
        loading: false
      }
    }
    case 'IGNORE_FETCH': {
      endNProgress()

      return {
        ...state,
        data: null,
        error: '',
        loading: false
      }
    }
    default: {
      throw new Error(`未知的 action 类型：${action}`)
    }
  }
}

type ApiCallback<TData, TParams> = (
  params?: TParams,
  auth?: Auth
) => Promise<FetchResponse<TData>>

type UseFetch<TData, TParams> = {
  data: TData | null
  error: string
  loading: boolean
  fetchData: (params?: TParams) => IgnoreFetch
}

/**
 * 获取数据（包含了身份验证自动刷新机制）的自定义 Hook。
 *
 * @template TData - 返回的数据类型
 * @template TParams - 请求参数类型
 *
 * @param callback - 获取数据的回调函数
 * @returns {UseFetch} - 数据、错误信息、加载状态、获取数据的回调函数
 */
function useFetch<TData, TParams>(
  callback: ApiCallback<TData, TParams>
): UseFetch<TData, TParams> {
  const [{ data, error, loading }, dispatch] = React.useReducer(
    reducer as React.Reducer<State<TData | null>, Action<TData | null>>,
    initialState as State<TData>
  )

  function fetchData(params?: TParams) {
    // 前端应该只是忽略请求结果，而非使用 AbortController 取消请求
    // 后者会导致 F12 中丢失响应信息，不易于前端调试
    let ignoreResult = false

    dispatch({ type: 'START_LOADING' })
    ;(async () => {
      const response = await callback(params)

      // 如果在请求过程中，用户已经点击了路由，那么就忽略请求结果
      if (ignoreResult) return

      if (response.error) {
        dispatch({ type: 'FETCH_FAILED', payload: response.error })
        return
      }

      dispatch({ type: 'FETCH_SUCCESS', payload: response.data })
    })()

    return () => {
      ignoreResult = true
      // 因为 `dispatch` 是异步的，所以必须在此处忽略请求结果
      // 如果放在 IIFE 内则可能会覆盖掉后续的 `dispatch` 结果
      dispatch({ type: 'IGNORE_FETCH' })
    }
  }

  return { data, error, loading, fetchData }
}

export { useFetch }
