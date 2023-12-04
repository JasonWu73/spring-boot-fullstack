import React from 'react'

import type { ApiRequest, Method } from '@/shared/utils/api-caller'

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
  | { type: 'REQUEST_SUCCESS'; payload: { status?: number; data?: T } }
  | { type: 'REQUEST_FAILED'; payload: { status?: number; error?: string } }
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
    case 'REQUEST_SUCCESS': {
      return {
        ...state,
        status: action.payload.status,
        data: action.payload.data,
        error: undefined,
        loading: false
      }
    }
    case 'REQUEST_FAILED': {
      return {
        ...state,
        status: action.payload.status,
        data: undefined,
        error: action.payload.error,
        loading: false
      }
    }

    // 用于在完成后端 API 请求后，对前端的数据进行更新
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

export type ApiResponse<T> = {
  /**
   * HTTP 响应状态码。
   */
  status?: number

  /**
   * API 响应数据。
   */
  data?: T

  /**
   * API 响应错误信息。
   */
  error?: string
}

export type SetStateAction<T> = State<T> | ((prevState: State<T>) => State<T>)

type PrevFetch = {
  url: string
  timestamp: number
  method?: Method
}

type DiscardRequestParams = { url: string; method?: Method }

type UseApi<T> = {
  /**
   * HTTP 响应状态码。
   */
  status?: number

  /**
   * API 响应数据。
   */
  data?: T

  /**
   * API 响应错误信息。
   */
  error?: string

  /**
   * 是否正在加载数据。
   */
  loading: boolean
  requestData: (request: ApiRequest) => Promise<ApiResponse<T>>
  discardRequest: (params: DiscardRequestParams, timestamp: number) => void
  updateState: (state: SetStateAction<T>) => void
}

/**
 * 获取数据的自定义 Hook。
 *
 * <ul>
 *   <li>提供了常用的状态，如 HTTP 响应状态码、响应数据、是否正在加载中等</li>
 *   <li>提供了发起 HTTP 请求的方法</li>
 *   <li>提供了丢弃请求的方法，即 50 毫秒内不发送请求，主要用于 React Strict Mode 下的重复提交</li>
 *   <li>提供了更新前端数据的方法</li>
 * </ul>
 *
 * @param callback 通过 HTTP 请求获取后端数据的回调函数
 * @returns useApi<T> API 相关数据及方法
 */
export function useFetch<T>(
  callback: (params: ApiRequest) => Promise<ApiResponse<T>>
): UseApi<T> {
  const [state, dispatch] = React.useReducer(
    reducer as React.Reducer<State<T>, Action<T>>,
    initialState as State<T>
  )
  const discardFetchRef = React.useRef<PrevFetch | null>(null)

  const { status, data, error, loading } = state

  /**
   * 发起 HTTP 请求，获取 API 数据。
   *
   * @param request 请求的配置属性
   * @returns Promise<ApiResponse<T>> HTTP 响应数据
   */
  async function requestData(request: ApiRequest): Promise<ApiResponse<T>> {
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
        type: 'REQUEST_FAILED',
        payload: { status: response.status, error: response.error }
      })

      return response
    }

    dispatch({
      type: 'REQUEST_SUCCESS',
      payload: { status: response.status, data: response.data }
    })

    return response
  }

  /**
   * 丢弃请求，即 50 毫秒内不发送请求，主要用于 React Strict Mode 下的重复提交。
   *
   * @param params API Endpoint 信息
   * @param params.url API Endpoint URL
   * @param params.method 请求方法
   * @param timestamp 请求的时间戳
   */
  function discardRequest({ url, method }: DiscardRequestParams, timestamp: number) {
    discardFetchRef.current = { url, method, timestamp }
  }

  /**
   * 更新前端数据。
   *
   * @param newState 更新的数据或更新函数
   */
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

  return {
    status,
    data,
    error,
    loading,
    requestData,
    discardRequest,
    updateState
  }
}
