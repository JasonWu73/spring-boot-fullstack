import type { SortingState } from '@tanstack/react-table'
import { addDays, format, parse } from 'date-fns'
import { useSearchParams } from 'react-router-dom'

import { OperationLogSearch, QueryParams } from '@/operation-log/OperationLogSearch'
import { OperationLogTable } from '@/operation-log/OperationLogTable'
import type { PaginationData, PaginationParams } from '@/shared/apis/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/Card'
import {
  DEFAULT_PAGE_NUM,
  DEFAULT_PAGE_SIZE,
  type Paging
} from '@/shared/components/ui/DataTable'
import {
  URL_QUERY_KEY_PAGE_NUM,
  URL_QUERY_KEY_PAGE_SIZE,
  URL_QUERY_KEY_SORT_COLUMN,
  URL_QUERY_KEY_SORT_ORDER
} from '@/shared/constants'
import { useApi } from '@/shared/hooks/use-api'
import { useRefresh } from '@/shared/hooks/use-refresh'
import { useTitle } from '@/shared/hooks/use-title'
import { requestApi } from '@/shared/signal/auth'

export type OperationLog = {
  id: number
  requestedAt: string
  clientIp: string
  username: string
  message: string
}

type GetLogsParams = PaginationParams & {
  startAt: string
  endAt: string
  clientIp?: string
  username?: string
  message?: string
}

export default function OperationLogListPage() {
  useTitle('操作日志')

  useRefresh(() => {
    getLogs().then()
  })

  const { apiState: pagingState, requestData } = useApi(
    requestApi<PaginationData<OperationLog>>
  )
  const { loading } = pagingState.value

  const [searchParams, setSearchParams] = useSearchParams()
  const pageNum = Number(searchParams.get(URL_QUERY_KEY_PAGE_NUM)) || DEFAULT_PAGE_NUM
  const pageSize = Number(searchParams.get(URL_QUERY_KEY_PAGE_SIZE)) || DEFAULT_PAGE_SIZE
  const sortColumn = searchParams.get(URL_QUERY_KEY_SORT_COLUMN) || 'requestedAt'
  const sortOrder = searchParams.get(URL_QUERY_KEY_SORT_ORDER) || 'desc'
  const startAt =
    searchParams.get('startAt') || format(addDays(new Date(), -6), 'yyyy-MM-dd')
  const endAt = searchParams.get('endAt') || format(new Date(), 'yyyy-MM-dd')
  const clientIp = searchParams.get('clientIp') || ''
  const username = searchParams.get('username') || ''
  const message = searchParams.get('message') || ''

  async function getLogs() {
    const urlParams: GetLogsParams = { pageNum, pageSize, startAt, endAt }

    if (sortColumn) urlParams.sortColumn = sortColumn
    if (sortOrder) urlParams.sortOrder = sortOrder === 'asc' ? 'asc' : 'desc'
    if (startAt) urlParams.startAt = startAt
    if (endAt) urlParams.endAt = endAt
    if (clientIp) urlParams.clientIp = clientIp
    if (username) urlParams.username = username
    if (message) urlParams.message = message

    return await requestData({ url: '/api/v1/operation-logs', urlParams })
  }

  function handlePaginate(paging: Paging) {
    searchParams.set(URL_QUERY_KEY_PAGE_NUM, String(paging.pageNum))
    searchParams.set(URL_QUERY_KEY_PAGE_SIZE, String(paging.pageSize))

    setSearchParams(searchParams, { replace: true })
  }

  const handleSorting = (sorting: SortingState) => {
    searchParams.delete('requestedAt')

    const sortColumn = sorting[0]?.id === '请求时间' ? 'requestedAt' : ''
    const sortOrder = sorting[0]?.desc === true ? 'desc' : 'asc'

    if (!sortColumn) return

    searchParams.set(URL_QUERY_KEY_SORT_COLUMN, sortColumn)
    searchParams.set(URL_QUERY_KEY_SORT_ORDER, sortOrder)

    setSearchParams(searchParams)
  }

  function handleSearch(params: QueryParams) {
    searchParams.delete(URL_QUERY_KEY_PAGE_NUM)
    searchParams.delete(URL_QUERY_KEY_PAGE_SIZE)
    searchParams.delete('startAt')
    searchParams.delete('endAt')
    searchParams.delete('clientIp')
    searchParams.delete('username')
    searchParams.delete('message')

    const { startAt, endAt, clientIp, username, message } = params

    if (startAt) searchParams.set('startAt', format(startAt, 'yyyy-MM-dd'))
    if (endAt) searchParams.set('endAt', format(endAt, 'yyyy-MM-dd'))
    if (clientIp) searchParams.set('clientIp', clientIp)
    if (username) searchParams.set('username', username)
    if (message) searchParams.set('message', message)

    setSearchParams(searchParams, { replace: true })
  }

  return (
    <Card className="mx-auto h-full w-full">
      <CardHeader>
        <CardTitle>操作日志</CardTitle>
        <CardDescription>目前暂时仅记录了登录日志</CardDescription>
      </CardHeader>

      <CardContent>
        <OperationLogSearch
          queryParams={{
            startAt: parse(startAt, 'yyyy-MM-dd', new Date()),
            endAt: parse(endAt, 'yyyy-MM-dd', new Date()),
            clientIp,
            username,
            message
          }}
          loading={loading}
          onSearch={handleSearch}
        />

        <OperationLogTable
          paging={{ pageNum, pageSize }}
          pagingState={pagingState}
          onPaginate={handlePaginate}
          sortColumn={{
            id: '请求时间',
            desc: searchParams.get(URL_QUERY_KEY_SORT_ORDER) !== 'asc'
          }}
          onSorting={handleSorting}
        />
      </CardContent>
    </Card>
  )
}
