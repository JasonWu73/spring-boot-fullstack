import { CompoundCounter } from "@/compound-component/CompoundCounter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/Card";
import { useTitle } from "@/shared/hooks/use-title";

export default function CounterPage() {
  useTitle("复合组件");

  return (
    <Card className="mx-auto mt-8 max-w-xs">
      <CardHeader className="text-center">
        <CardTitle>复合组件模式</CardTitle>
        <CardDescription>实现超级灵活的组件</CardDescription>
      </CardHeader>

      <CardContent>
        <CompoundCounter />
      </CardContent>
    </Card>
  );
}
