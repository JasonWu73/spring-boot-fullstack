import { useSignal, type Signal } from '@preact/signals-react'

import type { ApiRequest, Method } from '@/shared/utils/api-caller'

export type ApiState<T> = {
  /**
   * 是否正在加载数据。
   */
  loading: boolean

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

type PrevFetch = {
  url: string
  method?: Method
  timestamp: number
}

type UseApi<T> = {
  /**
   * API 相关数据 Signal。
   */
  apiState: Signal<ApiState<T>>

  /**
   * 发起 HTTP 请求，获取 API 数据。
   *
   * @param request 请求的配置属性
   * @returns Promise<ApiResponse<T>> HTTP 响应数据
   */
  requestData: (request: ApiRequest) => Promise<ApiResponse<T>>
}

/**
 * 获取 API 数据的自定义 Hook。
 *
 * <ul>
 *   <li>自动丢弃 50 毫秒内的重复请求，主要用于解决 React Strict Mode 下的 useEffect 会先执行一个 setup+cleanup cycle，再执行 setup</li>
 *   <li>提供了常用的状态，如 HTTP 响应状态码、响应数据、是否正在加载中等</li>
 *   <li>提供了发起 HTTP 请求的方法</li>
 *   <li>提供了更新前端数据的方法</li>
 * </ul>
 *
 * @param callback 通过 HTTP 请求获取后端数据的回调函数
 * @returns useApi<T> API 相关数据及方法
 */
export function useApi<T>(
  callback: (params: ApiRequest) => Promise<ApiResponse<T>>
): UseApi<T> {
  const apiState = useSignal<ApiState<T>>({ loading: false })
  const prevFetch = useSignal<PrevFetch | undefined>(undefined)

  async function requestData(request: ApiRequest): Promise<ApiResponse<T>> {
    apiState.value = {
      loading: true,
      status: undefined,
      data: undefined,
      error: undefined
    }

    // 丢弃请求，即 50 毫秒内不发送请求，主要用于防止 React Strict Mode 下的重复请求
    if (
      prevFetch.value &&
      prevFetch.value.url === request.url &&
      prevFetch.value.method === request.method &&
      Date.now() - prevFetch.value.timestamp < 50
    ) {
      return {}
    }

    prevFetch.value = {
      url: request.url,
      method: request.method,
      timestamp: Date.now()
    }

    const response = await callback(request)

    apiState.value = {
      loading: false,
      status: response.status,
      data: response.data,
      error: response.error
    }

    if (response.error) return response

    return response
  }

  return {
    apiState,
    requestData
  }
}
