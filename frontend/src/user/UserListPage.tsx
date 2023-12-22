import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/Card'
import { useTitle } from '@/shared/hooks/use-title'
import { UserSearch } from '@/user/UserSearch'
import { UserTable } from '@/user/UserTable'

export default function UserListPage() {
  useTitle('用户管理')

  return (
    <Card className="mx-auto h-full w-full">
      <CardHeader>
        <CardTitle>用户管理</CardTitle>
        <CardDescription>可登录系统的所有账号信息</CardDescription>
      </CardHeader>

      <CardContent>
        <UserSearch />

        <UserTable />
      </CardContent>
    </Card>
  )
}
