import React from 'react'

import { useAuth } from '@/auth/AuthProvider'
import type {
  AbortCallback,
  ApiResponse,
  FetchPayload,
  ReLogin
} from '@/shared/hooks/types'
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
  payload: FetchPayload,
  params?: TParams
) => Promise<ApiResponse<TData>>

type UseFetch<TData, TParams> = {
  data: TData | null
  error: string
  loading: boolean
  fetchData: (params?: TParams) => AbortCallback
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

  const { auth, logout, updateToken } = useAuth()

  function fetchData(params?: TParams): AbortCallback {
    const controller = new AbortController()

    dispatch({ type: 'START_LOADING' })
    ;(async function () {
      const response = await callback(
        {
          signal: controller.signal,
          auth
        },
        params
      )

      // 实现身份验证自动刷新机制
      if (response.reLogin && response.reLogin.isOk) {
        updateToken(response.reLogin.token)
      }
      if (response.reLogin && !response.reLogin.isOk) {
        logout()
      }

      // 因为取消请求的方式一定是通过调用 `fetchData` 返回的 `AbortCallback` 函数实现的
      // 而 `AbortCallback` 函数中包含了 `dispatch`，所以这里无需更新状态，直接返回即可
      if (controller.signal.aborted) return

      if (response.error) {
        return dispatch({ type: 'FETCH_FAILED', payload: response.error })
      }

      dispatch({ type: 'FETCH_SUCCESS', payload: response.data })
    })()

    return () => {
      dispatch({ type: 'ABORT_FETCH' })
      controller.abort()
    }
  }

  return { data, error, loading, fetchData }
}

function tryEndNProgress(loadingCount: number) {
  loadingCount <= 1 && endNProgress()
}

export { useFetch }
