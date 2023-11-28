import { addDays, format } from 'date-fns'
import { useSearchParams } from 'react-router-dom'

import { useAuth, type PaginationData, type PaginationParams } from '@/auth/AuthProvider'
import { OperationLogSearch } from '@/operation-log/OperationLogSearch'
import { OperationLogTable } from '@/operation-log/OperationLogTable'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/Card'
import { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE } from '@/shared/components/ui/DataTable'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useRefresh } from '@/shared/hooks/use-refresh'
import { useTitle } from '@/shared/hooks/use-title'
import {
  URL_QUERY_KEY_PAGE_NUM,
  URL_QUERY_KEY_PAGE_SIZE,
  URL_QUERY_KEY_SORT_COLUMN,
  URL_QUERY_KEY_SORT_ORDER
} from '@/shared/utils/constants'

type OperationLog = {
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

function OperationLogListPage() {
  useTitle('操作日志')

  const [searchParams] = useSearchParams()

  const { requestApi } = useAuth()
  const {
    data: logPaging,
    error,
    loading,
    fetchData,
    discardFetch
  } = useFetch(requestApi<PaginationData<OperationLog>>)

  const url = '/api/v1/operation-logs'

  useRefresh(() => {
    const timestamp = Date.now()

    getLogs().then()

    return () => discardFetch({ url }, timestamp)
  })

  const pageNum = Number(searchParams.get(URL_QUERY_KEY_PAGE_NUM)) || DEFAULT_PAGE_NUM
  const pageSize = Number(searchParams.get(URL_QUERY_KEY_PAGE_SIZE)) || DEFAULT_PAGE_SIZE
  const startAt =
    searchParams.get('startAt') || format(addDays(new Date(), -6), 'yyyy-MM-dd')
  const endAt = searchParams.get('endAt') || format(new Date(), 'yyyy-MM-dd')

  async function getLogs() {
    const urlParams: GetLogsParams = { pageNum, pageSize, startAt, endAt }

    const sortColumn = searchParams.get(URL_QUERY_KEY_SORT_COLUMN) || 'requestedAt'
    const sortOrder = searchParams.get(URL_QUERY_KEY_SORT_ORDER) || 'desc'
    const clientIp = searchParams.get('clientIp')
    const username = searchParams.get('username')
    const message = searchParams.get('message')

    if (sortColumn) urlParams.sortColumn = sortColumn
    if (sortOrder) urlParams.sortOrder = sortOrder === 'asc' ? 'asc' : 'desc'
    if (startAt) urlParams.startAt = startAt
    if (endAt) urlParams.endAt = endAt
    if (clientIp) urlParams.clientIp = clientIp
    if (username) urlParams.username = username
    if (message) urlParams.message = message

    return await fetchData({ url, urlParams })
  }

  return (
    <Card className="mx-auto h-full w-full">
      <CardHeader>
        <CardTitle>操作日志</CardTitle>
        <CardDescription>目前暂时仅记录了登录日志</CardDescription>
      </CardHeader>

      <CardContent>
        <OperationLogSearch loading={loading} />

        <OperationLogTable
          logs={logPaging?.list || []}
          error={error}
          loading={loading}
          pageNum={pageNum}
          pageSize={pageSize}
          total={logPaging?.total || 0}
        />
      </CardContent>
    </Card>
  )
}

export default OperationLogListPage

export { type OperationLog }
