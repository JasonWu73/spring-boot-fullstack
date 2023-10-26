import React, { useCallback, useEffect, useReducer } from 'react'
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
  controller: AbortController | null
  reLogin?: ReLogin
}

const initialState: State<unknown> = {
  data: null,
  error: '',
  loading: false,
  controller: null
}

type Action<TData> =
  | { type: 'fetch/init'; payload: AbortController | null }
  | { type: 'fetch/resolved'; payload: TData }
  | { type: 'fetch/rejected'; payload: string }
  | { type: 'fetch/aborted' }
  | { type: 'fetch/reset' }
  | { type: 'auth/reLogin'; payload: ReLogin }

function reducer<TData>(
  state: State<TData>,
  action: Action<TData>
): State<TData> {
  switch (action.type) {
    case 'fetch/init': {
      return {
        ...(initialState as State<TData>),
        loading: true,
        controller: action.payload
      }
    }
    case 'fetch/resolved': {
      return {
        ...state,
        data: action.payload,
        error: '',
        loading: false,
        controller: null
      }
    }
    case 'fetch/rejected': {
      return {
        ...state,
        data: null,
        error: action.payload,
        loading: false,
        controller: null
      }
    }
    case 'fetch/aborted': {
      return {
        ...state,
        controller: null
      }
    }
    case 'fetch/reset': {
      if (state.controller) {
        state.controller.abort()
      }

      return {
        ...(initialState as State<TData>)
      }
    }
    case 'auth/reLogin': {
      return {
        ...state,
        reLogin: action.payload
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

/**
 * 获取数据（包含了身份验证自动刷新机制）的自定义 Hook。
 *
 * @template TData - 返回的数据类型
 * @template TParams - 请求参数类型
 *
 * @param callback - 获取数据的回调函数
 * @returns - 数据、错误信息、加载状态、获取数据和重置加载的回调函数
 */
function useFetch<TData, TParams>(callback: ApiCallback<TData, TParams>) {
  const [{ data, error, loading, reLogin }, dispatch] = useReducer(
    reducer as React.Reducer<State<TData | null>, Action<TData | null>>,
    initialState as State<TData>
  )

  useLoading(loading)

  const { auth, logout, updateToken } = useAuth()

  useFetchAuth(reLogin, logout, updateToken)

  const fetchData = useCallback(
    function fetchData(params?: TParams): AbortController {
      const controller = new AbortController()

      dispatch({ type: 'fetch/init', payload: controller })

      async function doCallback() {
        const response = await callback(
          {
            signal: controller.signal,
            auth
          },
          params
        )

        if (response.reLogin) {
          dispatch({ type: 'auth/reLogin', payload: response.reLogin })
        }

        if (controller.signal.aborted) {
          dispatch({ type: 'fetch/aborted' })
          return controller
        }

        if (response.error) {
          dispatch({ type: 'fetch/rejected', payload: response.error })
          return controller
        }

        dispatch({ type: 'fetch/resolved', payload: response.data })
      }

      doCallback().then()

      return controller
    },
    [JSON.stringify(auth)]
  )

  const reset = useCallback(function reset() {
    dispatch({ type: 'fetch/reset' })
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

function useFetchAuth(
  reLogin: ReLogin | undefined,
  logout: () => void,
  updateToken: (token: string) => void
) {
  useEffect(() => {
    if (!reLogin) {
      return
    }

    if (!reLogin.isOk) {
      logout()
      return
    }

    updateToken(reLogin.token)
  }, [reLogin?.isOk])
}

export { useFetch, type ApiResponse, type FetchPayload, type ReLogin }
