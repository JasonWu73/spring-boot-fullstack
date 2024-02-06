import React from 'react'
import * as echarts from 'echarts'

import { getLoginsHistoryApi } from "@/shared/apis/backend/op-log";
import { useFetch } from "@/shared/hooks/use-fetch";
import { useRefresh } from "@/shared/hooks/use-refresh";

export function LoginHistoryChart() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const chartRef = React.useRef<echarts.EChartsType>()
  const { data, fetchData: getLoginsHistory } = useFetch(getLoginsHistoryApi);

  useRefresh(() => {
    getLoginsHistory(7).then();
  });

  React.useEffect(() => {
    // 初始化图表
    if (!chartRef.current || chartRef.current.isDisposed()) {
      chartRef.current = echarts.init(containerRef.current!)
      chartRef.current.showLoading()
    }

    if (!data) return

    const chart = chartRef.current

    chart.hideLoading()

    chart.setOption({
      xAxis: {
        data: data.map(item => item.name)
      },
      yAxis: {},
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'bar',
          data: data
        }
      ]
    })

    // 监听图表容器的大小并改变图表大小
    window.addEventListener('resize', resizeChart)

    function resizeChart() {
      return chart.resize()
    }

    return () => {
      // 销毁图表实例
      chart.dispose()

      // 移除监听
      window.removeEventListener('resize', resizeChart)
    }
  }, [data])

  return <div ref={containerRef} className="h-96 w-fit text-center"/>
}
