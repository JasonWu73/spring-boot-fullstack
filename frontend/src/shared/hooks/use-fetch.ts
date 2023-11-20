import React from 'react'

import type { FetchResponse, IgnoreFetch } from '@/shared/hooks/types'
import { endNProgress, startNProgress } from '@/shared/utils/nprogress'

type State<TData> = {
  status: number // HTTP 响应状态码
  data: TData | null
  error: string
  loading: boolean
}

const initialState: State<unknown> = {
  status: 0,
  data: null,
  error: '',
  loading: false
}

type Action<TData> =
  | { type: 'START_LOADING' }
  | { type: 'FETCH_SUCCESS'; payload: { status: number; data: TData | null } }
  | { type: 'FETCH_FAILED'; payload: { status: number; error: string } }
  | { type: 'IGNORE_FETCH' } // 只是忽略请求的结果，而非取消请求；取消请求只会不易于前端调试，因为后端仍然会处理请求

function reducer<TData>(state: State<TData>, action: Action<TData>): State<TData> {
  switch (action.type) {
    case 'START_LOADING': {
      return {
        ...state,
        status: 0,
        data: null,
        error: '',
        loading: true
      }
    }
    case 'FETCH_SUCCESS': {
      return {
        ...state,
        status: action.payload.status,
        data: action.payload.data,
        error: '',
        loading: false
      }
    }
    case 'FETCH_FAILED': {
      return {
        ...state,
        data: null,
        status: action.payload.status,
        error: action.payload.error,
        loading: false
      }
    }
    case 'IGNORE_FETCH': {
      return {
        ...state,
        status: 0,
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

type ApiCallback<TData, TParams> = (params?: TParams) => Promise<FetchResponse<TData>>

type UseFetch<TData, TParams> = {
  status: number
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
  const [{ status, data, error, loading }, dispatch] = React.useReducer(
    reducer as React.Reducer<State<TData | null>, Action<TData | null>>,
    initialState as State<TData>
  )

  function fetchData(params?: TParams) {
    // 前端应该只是忽略请求结果，而非使用 AbortController 取消请求
    // 后者会导致 F12 中丢失响应信息，不易于前端调试
    let ignoreResult = false

    startNProgress()
    dispatch({ type: 'START_LOADING' })
    ;(async function () {
      const response = await callback(params)

      // 如果在请求过程中，用户已经点击了路由，那么就忽略请求结果
      if (ignoreResult) return

      endNProgress()

      if (response.error) {
        dispatch({
          type: 'FETCH_FAILED',
          payload: { status: response.status, error: response.error }
        })
        return
      }

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: { status: response.status, data: response.data ?? null }
      })
    })()

    return () => {
      ignoreResult = true
      // 因为 `dispatch` 是异步的，所以必须在此处结束进度条
      // 否则当组件被登录过期而跳转到登录页时，进度条并不会被结束
      endNProgress()
      // 因为 `dispatch` 是异步的，所以必须在此处忽略请求结果
      // 如果放在 IIFE 内则可能会覆盖掉后续的 `dispatch` 结果
      dispatch({
        type: 'IGNORE_FETCH'
      })
    }
  }

  return { status, data, error, loading, fetchData }
}

export { useFetch }
