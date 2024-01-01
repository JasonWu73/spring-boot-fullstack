import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/Card";
import { useTitle } from "@/shared/hooks/use-title";
import { AddUser } from "@/user/AddUser";

export default function AddUserPage() {
  useTitle("新增用户");

  return (
    <Card className="mx-auto w-full md:w-4/5 lg:w-2/3">
      <CardHeader>
        <CardTitle>新增用户</CardTitle>
        <CardDescription>创建可登录系统的账号</CardDescription>
      </CardHeader>

      <CardContent>
        <AddUser />
      </CardContent>
    </Card>
  );
}
