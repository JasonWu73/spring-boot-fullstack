import React from 'react'

import type { ApiRequest } from '@/shared/utils/http'

type State<T> = {
  status?: number // HTTP 响应状态码
  data?: T
  error?: string
  loading: boolean
}

const initialState: State<unknown> = {
  loading: false
}

type Action<T> =
  | { type: 'START_LOADING' }
  | { type: 'FETCH_SUCCESS'; payload: { status?: number; data?: T } }
  | { type: 'FETCH_FAILED'; payload: { status?: number; error?: string } }
  | { type: 'UPDATE_STATE'; payload: State<T> }

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'START_LOADING': {
      return {
        ...state,
        status: undefined,
        data: undefined,
        error: undefined,
        loading: true
      }
    }
    case 'FETCH_SUCCESS': {
      return {
        ...state,
        status: action.payload.status,
        data: action.payload.data,
        error: undefined,
        loading: false
      }
    }
    case 'FETCH_FAILED': {
      return {
        ...state,
        status: action.payload.status,
        data: undefined,
        error: action.payload.error,
        loading: false
      }
    }

    // 用于后端 API 请求后，对前端的数据更新
    case 'UPDATE_STATE': {
      return {
        ...state,
        ...action.payload
      }
    }

    default: {
      throw new Error(`未知的 action 类型：${action}`)
    }
  }
}

// Fetch API 的响应数据类型
type FetchResponse<T> = {
  status?: number // HTTP 响应状态码
  data?: T
  error?: string
}

type SetStateAction<T> = State<T> | ((prevState: State<T>) => State<T>)

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

type PrevFetch = {
  url: string
  timestamp: number
  method?: Method
}

type DiscardRequestParams = { url: string; method?: Method }

type UseFetch<T> = {
  status?: number // HTTP 响应状态码
  data?: T // API 响应数据
  error?: string // API 响应错误信息
  loading: boolean // 是否正在加载数据
  fetchData: (params: ApiRequest) => Promise<FetchResponse<T>> // 发起 HTTP 请求，获取 API 数据
  discardFetch: (params: DiscardRequestParams, timestamp: number) => void // 丢弃请求，即不发送请求
  updateState: (state: SetStateAction<T>) => void // 更新前端数据
}

/**
 * 获取数据的自定义 Hook。
 *
 * <p>主要用于页面初始化时获取数据。
 *
 * @template T - 返回的数据类型
 *
 * @param callback - 获取数据的回调函数
 * @returns {UseFetch} - 数据、错误信息、加载状态、获取数据的回调函数
 */
function useFetch<T>(
  callback: (params: ApiRequest) => Promise<FetchResponse<T>>
): UseFetch<T> {
  const [state, dispatch] = React.useReducer(
    reducer as React.Reducer<State<T>, Action<T>>,
    initialState as State<T>
  )
  const discardFetchRef = React.useRef<PrevFetch | null>(null)

  const { status, data, error, loading } = state

  async function fetchData(request: ApiRequest): Promise<FetchResponse<T>> {
    dispatch({ type: 'START_LOADING' })

    // 丢弃请求，即 50 毫秒内不发送请求，主要用于 React Strict Mode 下的重复提交
    const discardRequest = discardFetchRef.current

    if (
      discardRequest &&
      discardRequest.url === request.url &&
      discardRequest.method === request.method &&
      Date.now() - discardRequest.timestamp < 50
    ) {
      return {}
    }

    const response = await callback(request)

    if (response.error) {
      dispatch({
        type: 'FETCH_FAILED',
        payload: { status: response.status, error: response.error }
      })

      return response
    }

    dispatch({
      type: 'FETCH_SUCCESS',
      payload: { status: response.status, data: response.data }
    })

    return response
  }

  // 丢弃请求，即 50 毫秒内不发送请求，主要用于 React Strict Mode 下的重复提交
  function discardFetch({ url, method }: DiscardRequestParams, timestamp: number) {
    discardFetchRef.current = { url, method, timestamp }
  }

  function updateState(newState: SetStateAction<T>) {
    if (typeof newState === 'function') {
      const updater = newState as (prevData: State<T>) => State<T>
      const updatedState = updater(state)

      dispatch({
        type: 'UPDATE_STATE',
        payload: updatedState
      })
      return
    }

    dispatch({
      type: 'UPDATE_STATE',
      payload: newState
    })
  }

  return { status, data, error, loading, fetchData, discardFetch, updateState }
}

export { useFetch, type FetchResponse, type SetStateAction }
