import { ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons'

import { getLoggedInUsersApi } from '@/shared/apis/backend/auth'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/Alert'
import { ScrollArea } from '@/shared/components/ui/ScrollArea'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useRefresh } from '@/shared/hooks/use-refresh'

export function LoggedInUsers() {
  const {
    loading,
    data: usernames,
    error,
    fetchData: getLoggedInUsers
  } = useFetch(getLoggedInUsersApi)

  useRefresh(() => {
    getLoggedInUsers(null).then()
  })

  return (
    <ScrollArea className="h-72 rounded-md border">
      <div className="space-y-4 p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">当前已登录的用户</h4>

        {loading && (
          <Alert>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            <AlertTitle>加载中...</AlertTitle>
            <AlertDescription>数据加载中</AlertDescription>
          </Alert>
        )}

        {!loading && error && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && usernames && (
          <ul className="divide-y divide-solid divide-slate-200 dark:divide-slate-700">
            {usernames.map((username) => (
              <li key={username} className="p-2">
                {username}
              </li>
            ))}
          </ul>
        )}
      </div>
    </ScrollArea>
  )
}
