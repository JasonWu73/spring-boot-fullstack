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

/**
 * 获取操作日志分页数据。
 *
 * @param params 分页查询条件
 * @returns Promise 响应结果
 */
export async function getLogs(params: GetLogsParams) {
  return await requestApi<PaginationData<Log>>({
    url: '/api/v1/operation-logs',
    urlParams: params
  })
}
