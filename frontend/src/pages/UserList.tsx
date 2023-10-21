import { useSearchParams } from 'react-router-dom'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/Card'
import { useFetch } from '@/hooks/use-fetch'
import { getUsersApi } from '@/api/dummyjson/user'
import { useRefresh } from '@/hooks/use-refresh'
import { Loading } from '@/components/ui/Loading'

const KEY_PAGE_NUM = 'p'
const KEY_PAGE_SIZE = 's'
const KEY_QUERY = 'q'

const DEFAULT_PAGE_NUM = 1
const DEFAULT_PAGE_SIZE = 10

function UserList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageNum = Number(searchParams.get(KEY_PAGE_NUM)) || DEFAULT_PAGE_NUM
  const pageSize = Number(searchParams.get(KEY_PAGE_SIZE)) || DEFAULT_PAGE_SIZE
  const query = searchParams.get(KEY_QUERY) || ''

  const {
    data: fetchedUsers,
    error,
    loading,
    fetchData: fetchUsers,
    reset: resetFetchUsers
  } = useFetch(getUsersApi)

  useRefresh(() => {
    resetFetchUsers()

    const controller = fetchUsers({ pageNum, pageSize, query })

    return () => {
      controller.abort()
    }
  })

  return (
    <>
      {loading && <Loading />}

      {!loading && (
        <Card className="mx-auto h-full w-11/12">
          <CardHeader>
            <CardTitle>用户列表</CardTitle>

            <CardDescription>来自 dummyJSON 的用户数据</CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              {error && <TableCaption>{error}</TableCaption>}

              {fetchedUsers && (
                <>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>全名</TableHead>
                      <TableHead>用户名</TableHead>
                      <TableHead className="text-right">密码</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {fetchedUsers.users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>
                          {user.firstName + ' ' + user.lastName}
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell className="text-right">
                          {user.password}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </>
              )}
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export { UserList }
