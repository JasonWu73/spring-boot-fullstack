import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import { getLoginsHistoryApi } from '@/shared/apis/backend/operation-log'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useRefresh } from '@/shared/hooks/use-refresh'

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink']

export function LoginHistoryChart() {
  const { data, fetchData: getLoginsHistory } = useFetch(getLoginsHistoryApi)

  useRefresh(() => {
    getLoginsHistory(7).then()
  })

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="value"
          fill="#8884d8"
          shape={<TriangleBar />}
          label={{ position: 'top' }}
        >
          {data?.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % 20]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function getPath(x: number, y: number, width: number, height: number) {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${
    y + height / 3
  }
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
    x + width
  }, ${y + height}
  Z`
}

type TriangleBarProps = {
  fill?: string
  x?: number
  y?: number
  width?: number
  height?: number
}

function TriangleBar(props: TriangleBarProps) {
  const { fill, x, y, width, height } = props

  return <path d={getPath(x!, y!, width!, height!)} stroke="none" fill={fill} />
}
