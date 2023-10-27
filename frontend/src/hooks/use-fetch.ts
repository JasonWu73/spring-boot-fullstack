import React, { useReducer } from 'react'
import NProgress from 'nprogress'

import { type Auth, useAuth } from '@/components/auth/AuthContext'

type ReLogin = { isOk: true; token: string } | { isOk: false }

type ApiResponse<TData> = {
  data: TData | null
  error: string
  reLogin?: ReLogin
}

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
  | { type: 'loading' }
  | { type: 'fetch/resolved'; payload: TData }
  | { type: 'fetch/rejected'; payload: string }
  | { type: 'fetch/aborted' }

function reducer<TData>(
  state: State<TData>,
  action: Action<TData>
): State<TData> {
  switch (action.type) {
    case 'loading': {
      NProgress.start()

      return {
        ...state,
        data: null,
        error: '',
        loading: true,
        loadingCount: state.loadingCount + 1
      }
    }
    case 'fetch/resolved': {
      tryNProgressDone(state.loadingCount)

      return {
        ...state,
        data: action.payload,
        error: '',
        loading: state.loadingCount > 1,
        loadingCount: state.loadingCount - 1
      }
    }
    case 'fetch/rejected': {
      tryNProgressDone(state.loadingCount)

      return {
        ...state,
        data: null,
        error: action.payload,
        loading: state.loadingCount > 1,
        loadingCount: state.loadingCount - 1
      }
    }
    case 'fetch/aborted': {
      tryNProgressDone(state.loadingCount)

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

type FetchPayload = {
  signal: AbortSignal
  auth: Auth | null
}

type ApiCallback<TData, TParams> = (
  payload: FetchPayload,
  params?: TParams
) => Promise<ApiResponse<TData>>

type AbortCallback = () => void

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
  const [{ data, error, loading }, dispatch] = useReducer(
    reducer as React.Reducer<State<TData | null>, Action<TData | null>>,
    initialState as State<TData>
  )

  const { auth, logout, updateToken } = useAuth()

  function fetchData(params?: TParams): AbortCallback {
    const controller = new AbortController()

    dispatch({ type: 'loading' })

    async function executeCallback() {
      const response = await callback(
        {
          signal: controller.signal,
          auth
        },
        params
      )

      // 实现身份验证自动刷新机制
      if (response.reLogin) {
        if (response.reLogin.isOk) {
          updateToken(response.reLogin.token)
        }

        if (!response.reLogin.isOk) {
          logout()
        }
      }

      if (controller.signal.aborted) {
        return
      }

      if (response.error) {
        dispatch({ type: 'fetch/rejected', payload: response.error })
        return
      }

      dispatch({ type: 'fetch/resolved', payload: response.data })
    }

    executeCallback().then()

    return () => {
      dispatch({ type: 'fetch/aborted' })
      controller.abort()
    }
  }

  return { data, error, loading, fetchData }
}

function tryNProgressDone(loadingCount: number) {
  if (loadingCount <= 1) {
    NProgress.done()
  }
}

export {
  useFetch,
  type ApiResponse,
  type FetchPayload,
  type ReLogin,
  type AbortCallback
}
