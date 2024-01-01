import React from "react";

type ApiState<T> = {
  /**
   * 是否正在加载数据。
   */
  loading: boolean;

  /**
   * HTTP 响应状态码。
   */
  status?: number;

  /**
   * API 响应结果。
   */
  data?: T;

  /**
   * API 响应错误信息。
   */
  error?: string;
};

type ApiStateUpdater<T> = (prevState: ApiState<T>) => ApiState<T>;
export type SetApiStateAction<T> = ApiState<T> | ApiStateUpdater<T>;

export type ApiResponse<T> = {
  /**
   * HTTP 响应状态码。
   */
  status?: number;

  /**
   * API 响应结果。
   */
  data?: T;

  /**
   * API 响应错误信息。
   */
  error?: string;
};

type UseFetch<TData, TParam> = ApiState<TData> & {
  /**
   * 发起 HTTP 请求，获取 API 数据。
   *
   * @param request 请求配置项
   * @returns Promise<ApiResponse<T>> HTTP 响应结果
   */
  fetchData: (params: TParam) => Promise<ApiResponse<TData>>;

  /**
   * 使数据失效，在后台发送 API 重新获取数据。
   */
  invalidateFetch: () => Promise<ApiResponse<TData>>;

  /**
   * 重置前端 API 数据状态。
   */
  reset: () => void;

  /**
   * 设置前端 API 数据状态。
   *
   * @param newState 新的状态或状态更新函数
   */
  setState: (newState: SetApiStateAction<TData>) => void;
};

/**
 * 获取 API 数据的自定义 Hook。
 *
 * @param callback 通过 HTTP 请求获取后端数据的回调函数
 * @returns UseFetch<TData, TParam> API 相关数据及方法
 */
export function useFetch<TData, TParam>(
  callback: (params: TParam) => Promise<ApiResponse<TData>>,
): UseFetch<TData, TParam> {
  const [apiState, setApiState] = React.useState<ApiState<TData>>({
    loading: false,
  });

  const prevParams = React.useRef<TParam>();

  async function fetchData(params: TParam): Promise<ApiResponse<TData>> {
    setApiState({
      loading: true,
      status: undefined,
      data: undefined,
      error: undefined,
    });

    prevParams.current = params;

    const response = await callback(params);

    setResponseResult(response);

    if (response.error) return response;

    return response;
  }

  async function invalidateFetch() {
    const response = await callback(prevParams.current!);

    setResponseResult(response);

    return response;
  }

  function reset() {
    setApiState({
      loading: false,
      status: undefined,
      data: undefined,
      error: undefined,
    });
  }

  function setResponseResult(response: ApiResponse<TData>) {
    setApiState({
      loading: false,
      status: response.status,
      data: response.data,
      error: response.error,
    });
  }

  function setState(newState: SetApiStateAction<TData>) {
    if (typeof newState === "function") {
      const updater = newState as ApiStateUpdater<TData>;

      updater(apiState);

      return;
    }

    setApiState(newState);
  }

  return {
    ...apiState,
    fetchData,
    invalidateFetch,
    reset,
    setState,
  };
}
