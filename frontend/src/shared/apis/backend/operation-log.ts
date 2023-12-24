import { requestApi } from '@/shared/apis/backend/helpers'
import type { PaginationData, PaginationParams } from '@/shared/apis/types'

export type GetLogsParams = PaginationParams & {
  startAt: string
  endAt: string
  clientIp?: string
  username?: string
  message?: string
}

export type Log = {
  id: number
  requestedAt: string
  clientIp: string
  username: string
  message: string
}

type ChartDataItem = {
  name: string
  value: number
}

export type ChartData = ChartDataItem[]

/**
 * 获取操作日志分页数据。
 *
 * @param params 分页查询条件
 * @returns Promise 响应结果
 */
export async function getLogsApi(params: GetLogsParams) {
  return await requestApi<PaginationData<Log>>({
    url: '/api/v1/operation-logs',
    urlParams: params
  })
}

/**
 * 获取登录数前几的用户。
 *
 * @param num 前几
 * @returns Promise 响应结果
 */
export async function getLoginsTopApi(num: number) {
  return await requestApi<ChartData>({
    url: `/api/v1/operation-logs/logins-top/${num}`
  })
}

/**
 * 获取最近几天的登录数。
 *
 * @param days 最近几天
 * @returns Promise 响应结果
 */
export async function getLoginsHistoryApi(days: number) {
  return await requestApi<ChartData>({
    url: `/api/v1/operation-logs/logins-history/${days}`
  })
}
