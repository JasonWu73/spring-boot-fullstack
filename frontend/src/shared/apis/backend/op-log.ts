import { requestApi } from "@/shared/apis/backend/helpers";
import type { PaginationData, PaginationParams } from "@/shared/apis/types";

export type GetLogsParams = PaginationParams & {
  startAt: string;
  endAt: string;
  clientIp?: string;
  username?: string;
  message?: string;
};

export type Log = {
  id: number;
  requestedAt: string;
  clientIp: string;
  username: string;
  message: string;
};

type ChartDataItem = {
  name: string;
  value: number;
};

type ChartData = ChartDataItem[];

/**
 * 获取操作日志分页数据。
 *
 * @param params 分页查询条件
 * @returns Promise 响应结果
 */
export async function getLogsApi(params: GetLogsParams) {
  return await requestApi<PaginationData<Log>>({
    url: "/api/v1/op-logs",
    urlParams: params,
  });
}

/**
 * 获取登录数前 N 名的用户。
 *
 * @param num 前 N 名
 * @returns Promise 响应结果
 */
export async function getLoginsTopApi(num: number) {
  return await requestApi<ChartData>({
    url: `/api/v1/op-logs/logins-top/${num}`,
  });
}

/**
 * 获取最近 N 天的登录数。
 *
 * @param days 最近 N 天
 * @returns Promise 响应结果
 */
export async function getLoginsHistoryApi(days: number) {
  return await requestApi<ChartData>({
    url: `/api/v1/op-logs/logins-history/${days}`,
  });
}
