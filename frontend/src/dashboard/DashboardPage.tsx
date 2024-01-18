import { Navigate } from 'react-router-dom'

import { useTitle } from '@/shared/hooks/use-title'
import { hasAdmin } from '@/shared/auth/auth-signals'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/Card'
import { LoggedInUsers } from '@/dashboard/LoggedInUsers'
import { LoginHistoryChart } from '@/dashboard/LoginHistoryChart'
import { LoginsTopThree } from '@/dashboard/LoginsTopThree'

export default function DashboardPage() {
  useTitle('Dashboard')

  // 该页面只显示给管理员用户查看
  if (!hasAdmin()) return <Navigate to="/split-bill" replace/>

  return (
    <Card className="mx-auto mt-8 max-w-7xl">
      <CardHeader className="text-center">
        <CardTitle>Dashboard</CardTitle>

        <CardDescription>
          通常用于展示用户关心的重要指标、图表、图形和其他信息，以便用户可以一目了然地监视和了解系统的整体状况
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
          <div className="w-full md:w-1/2">
            <LoginsTopThree/>
          </div>

          <LoggedInUsers/>
        </div>

        <div className="mt-4">
          <LoginHistoryChart/>
        </div>
      </CardContent>
    </Card>
  )
}
