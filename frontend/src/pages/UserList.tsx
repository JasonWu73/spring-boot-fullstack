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
import { useFetch } from '@/hooks/use-fetch2'
import { getUsersApi } from '@/api/dummyjson/user'
import { useRefresh } from '@/hooks/use-refresh2'
import { Loading } from '@/components/ui/Loading'

const DEFAULT_PAGE_NUM = 1
const DEFAULT_PAGE_SIZE = 10

function UserList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageNum = Number(searchParams.get('pageNum')) || DEFAULT_PAGE_NUM
  const pageSize = Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE
  const query = searchParams.get('q') || ''

  const {
    data: usersData,
    error,
    loading,
    fetchData: getUsers,
    reset: resetGetUsers
  } = useFetch(getUsersApi)

  useRefresh(() => {
    resetGetUsers()

    const controller = getUsers({ pageNum, pageSize, query })

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

              {usersData && (
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
                    {usersData.users.map((user) => (
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
