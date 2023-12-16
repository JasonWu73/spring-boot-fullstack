import type { SortingState } from '@tanstack/react-table'
import { addDays, format, parse } from 'date-fns'
import { useSearchParams } from 'react-router-dom'

import { LogSearch, type QueryParams } from '@/operation-log/LogSearch'
import { LogTable } from '@/operation-log/LogTable'
import { getLogsApi, type GetLogsParams } from '@/shared/apis/backend/operation-log'
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
  type Pagination
} from '@/shared/components/ui/DataTable'
import {
  URL_QUERY_KEY_PAGE_NUM,
  URL_QUERY_KEY_PAGE_SIZE,
  URL_QUERY_KEY_SORT_COLUMN,
  URL_QUERY_KEY_SORT_ORDER
} from '@/shared/constants'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useRefresh } from '@/shared/hooks/use-refresh'
import { useTitle } from '@/shared/hooks/use-title'

export default function LogListPage() {
  useTitle('操作日志')

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

  const params: GetLogsParams = { pageNum, pageSize, startAt, endAt }

  if (sortColumn) params.sortColumn = sortColumn
  if (sortOrder) params.sortOrder = sortOrder === 'asc' ? 'asc' : 'desc'
  if (startAt) params.startAt = startAt
  if (endAt) params.endAt = endAt
  if (clientIp) params.clientIp = clientIp
  if (username) params.username = username
  if (message) params.message = message

  const {
    loading: loadingLogs,
    data: logs,
    error: errorLogs,
    fetchData: getLogs
  } = useFetch(getLogsApi)

  useRefresh(() => {
    getLogs(params).then()
  })

  function handlePaginate(paging: Pagination) {
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
        <LogSearch
          queryParams={{
            startAt: parse(startAt, 'yyyy-MM-dd', new Date()),
            endAt: parse(endAt, 'yyyy-MM-dd', new Date()),
            clientIp,
            username,
            message
          }}
          loading={loadingLogs}
          onSearch={handleSearch}
        />

        <LogTable
          data={logs?.list || []}
          error={errorLogs}
          loading={loadingLogs}
          pagination={{
            pageNum,
            pageSize,
            total: logs?.total || 0
          }}
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
