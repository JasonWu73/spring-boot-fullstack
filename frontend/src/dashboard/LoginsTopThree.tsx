import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { getLoginsTopApi } from "@/shared/apis/backend/op-log";
import { useFetch } from "@/shared/hooks/use-fetch";
import { useRefresh } from "@/shared/hooks/use-refresh";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function LoginsTopThree() {
  const { data, fetchData: getLoginsTop } = useFetch(getLoginsTopApi);

  useRefresh(() => {
    getLoginsTop(3).then();
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data?.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

const RADIAN = Math.PI / 180;

type RenderCustomizedLabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
};

function renderCustomizedLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: RenderCustomizedLabelProps) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}
