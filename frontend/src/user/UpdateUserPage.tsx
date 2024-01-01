import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/Card";
import { useTitle } from "@/shared/hooks/use-title";
import { UpdateUser } from "@/user/UpdateUser";

export default function UpdateUserPage() {
  useTitle("用户详情");

  return (
    <Card className="mx-auto w-full md:w-4/5 lg:w-2/3">
      <CardHeader>
        <CardTitle>用户详情</CardTitle>
        <CardDescription>用户详情信息</CardDescription>
      </CardHeader>

      <CardContent>
        <UpdateUser />
      </CardContent>
    </Card>
  );
}
