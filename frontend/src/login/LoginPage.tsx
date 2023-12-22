import { ShieldPlus } from 'lucide-react'

import { LoginForm } from '@/login/LoginForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/Card'
import { useTitle } from '@/shared/hooks/use-title'

export default function LoginPage() {
  useTitle('登录')

  return (
    <Card className="mx-auto mt-8 max-w-md lg:mt-24">
      <CardHeader>
        <CardTitle>登录</CardTitle>
        <CardDescription className="flex items-center text-green-500 dark:text-green-600">
          <ShieldPlus className="mr-1 h-4 w-4" />
          用户名和密码进行加密传输，且不会被保存在本地
        </CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  )
}
