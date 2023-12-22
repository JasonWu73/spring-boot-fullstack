import { LogSearch } from '@/operation-log/LogSearch'
import { LogTable } from '@/operation-log/LogTable'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/Card'
import { useTitle } from '@/shared/hooks/use-title'

export default function LogListPage() {
  useTitle('操作日志')

  return (
    <Card className="mx-auto h-full w-full">
      <CardHeader>
        <CardTitle>操作日志</CardTitle>
        <CardDescription>目前暂时仅记录了登录日志</CardDescription>
      </CardHeader>

      <CardContent>
        <LogSearch />

        <LogTable />
      </CardContent>
    </Card>
  )
}
