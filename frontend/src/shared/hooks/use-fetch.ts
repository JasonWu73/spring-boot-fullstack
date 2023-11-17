import React from 'react'

import { useAuth } from '@/auth/AuthProvider'
import type { Auth, FetchResponse, ReLogin } from '@/shared/hooks/types'
import { endNProgress, startNProgress } from '@/shared/utils/nprogress'

type State<TData> = {
  data: TData | null
  error: string
  loading: boolean
  loadingCount: number
  reLogin?: ReLogin
}

const initialState: State<unknown> = {
  data: null,
  error: '',
  loading: false,
  loadingCount: 0
}

type Action<TData> =
  | { type: 'START_LOADING' }
  | { type: 'FETCH_SUCCESS'; payload: TData }
  | { type: 'FETCH_FAILED'; payload: string }
  | { type: 'ABORT_FETCH' }

function reducer<TData>(state: State<TData>, action: Action<TData>): State<TData> {
  switch (action.type) {
    case 'START_LOADING': {
      startNProgress()

      return {
        ...state,
        data: null,
        error: '',
        loading: true,
        loadingCount: state.loadingCount + 1
      }
    }
    case 'FETCH_SUCCESS': {
      tryEndNProgress(state.loadingCount)

      return {
        ...state,
        data: action.payload,
        error: '',
        loading: state.loadingCount > 1,
        loadingCount: state.loadingCount - 1
      }
    }
    case 'FETCH_FAILED': {
      tryEndNProgress(state.loadingCount)

      return {
        ...state,
        data: null,
        error: action.payload,
        loading: state.loadingCount > 1,
        loadingCount: state.loadingCount - 1
      }
    }
    case 'ABORT_FETCH': {
      tryEndNProgress(state.loadingCount)

      return {
        ...state,
        data: null,
        error: '',
        loading: state.loadingCount > 1,
        loadingCount: state.loadingCount - 1
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
  fetchData: (params?: TParams) => Promise<FetchResponse<TData>>
}

/**
 * 获取数据（包含了身份验证自动刷新机制）的自定义 Hook。
 *
 * @template TData - 返回的数据类型
 * @template TParams - 请求参数类型，当包含 `AbortSignal` 属性时可触发请求取消
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

  const { auth, deleteLoginCache, refreshAuth } = useAuth()

  async function fetchData(params?: TParams) {
    dispatch({ type: 'START_LOADING' })

    const response = await callback(params, auth || undefined)

    // 实现身份验证自动刷新及退出机制
    if (response.reLogin) {
      if (response.reLogin.success) {
        refreshAuth(response.reLogin.auth)
      } else {
        deleteLoginCache()
      }
    }

    // 检查参数值中是否包含了 AbortSignal 属性
    // 如果包含了 `AbortSignal` 属性，且该属性的 `aborted` 属性为 `true`，则取消请求
    if (
      params &&
      typeof params === 'object' &&
      Object.prototype.hasOwnProperty.call(params, 'abortSignal') &&
      (params as { abortSignal?: AbortSignal }).abortSignal?.aborted
    ) {
      dispatch({ type: 'ABORT_FETCH' })
      return response
    }

    if (response.error) {
      dispatch({ type: 'FETCH_FAILED', payload: response.error })
      return response
    }

    dispatch({ type: 'FETCH_SUCCESS', payload: response.data })
    return response
  }

  return { data, error, loading, fetchData }
}

function tryEndNProgress(loadingCount: number) {
  loadingCount <= 1 && endNProgress()
}

export { useFetch }
