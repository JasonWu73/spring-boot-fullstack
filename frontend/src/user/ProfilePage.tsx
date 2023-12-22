import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/Card'
import { useTitle } from '@/shared/hooks/use-title'
import { Profile } from '@/user/Profile'

export default function UpdateUserPage() {
  useTitle('个人资料')

  return (
    <Card className="mx-auto w-full md:w-4/5 lg:w-2/3">
      <CardHeader>
        <CardTitle>个人资料</CardTitle>
        <CardDescription>您的个人资料</CardDescription>
      </CardHeader>

      <CardContent>
        <Profile />
      </CardContent>
    </Card>
  )
}
