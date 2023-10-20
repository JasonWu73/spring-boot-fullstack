import React, { useCallback, useEffect, useReducer } from 'react'
import NProgress from 'nprogress'

import { type Auth, useAuth } from '@/components/auth/AuthProvider'

type ReLogin = { isOk: true; token: string } | { isOk: false }

type ApiResponse<T> = {
  data: T | null
  error: string
  reLogin?: ReLogin
}

type State<T> = {
  data: T | null
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

type Action<T> =
  | { type: 'fetch/init'; payload: AbortController | null }
  | { type: 'fetch/resolved'; payload: T }
  | { type: 'fetch/rejected'; payload: string }
  | { type: 'fetch/aborted' }
  | { type: 'fetch/reset' }
  | { type: 'auth/reLogin'; payload: ReLogin }

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'fetch/init': {
      return {
        ...(initialState as State<T>),
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
        ...(initialState as State<T>)
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

type FetchData<T> = {
  data: T | null
  error: string
}

type FetchPayload = {
  signal: AbortSignal
  auth: Auth | null
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
  callback: (
    params: E | null,
    payload: FetchPayload
  ) => Promise<ApiResponse<T>>,
  initialCall: boolean = true
) {
  const [{ data, error, loading, reLogin }, dispatch] = useReducer(
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

  const { auth, logout, updateToken } = useAuth()

  useFetchAuth(reLogin, logout, updateToken)

  const fetchData = useCallback(
    async function fetchData(
      params: E | null = null,
      controller = new AbortController()
    ): Promise<FetchData<T>> {
      dispatch({ type: 'fetch/init', payload: controller })

      const response = await callback(params, {
        signal: controller.signal,
        auth
      })

      if (response.reLogin) {
        dispatch({ type: 'auth/reLogin', payload: response.reLogin })
      }

      if (controller.signal.aborted) {
        dispatch({ type: 'fetch/aborted' })
        return response
      }

      if (response.error) {
        dispatch({ type: 'fetch/rejected', payload: response.error })
        return response
      }

      dispatch({ type: 'fetch/resolved', payload: response.data })

      return response
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

    if (reLogin.token) {
      updateToken(reLogin.token)
    }
  }, [reLogin?.isOk])
}

export { useFetch, type ApiResponse, type FetchPayload, type ReLogin }
