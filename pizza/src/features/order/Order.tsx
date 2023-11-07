import { useLoaderData } from 'react-router-dom'

import {
  calcMinutesLeft,
  formatCurrency,
  formatDate
} from '@/utils/helpers-provided'
import { type ApiResponse } from '@/hooks/use-fetch'
import { type Order } from '@/services/restaurant-api'

// Test ID: IIDSAT

function Order() {
  const { data: order } = useLoaderData() as ApiResponse<Order>

  const { status, priority, priorityPrice, orderPrice, estimatedDelivery } =
    order!

  const deliveryIn = calcMinutesLeft(estimatedDelivery)

  return (
    <div>
      <div>
        <h2>订单状态</h2>

        <div>
          {priority && <span>优先</span>}
          <span>{status} 订单</span>
        </div>
      </div>

      <div>
        <p>
          {deliveryIn >= 0
            ? `仅剩 ${calcMinutesLeft(estimatedDelivery)} 分钟😃`
            : '订单应该已到达'}
        </p>
        <p>（预计送达：{formatDate(estimatedDelivery)}）</p>
      </div>

      <div>
        <p>披萨价格：{formatCurrency(orderPrice)}</p>
        {priority && <p>优先派送加价：{formatCurrency(priorityPrice)}</p>}
        <p>货到付款：{formatCurrency(orderPrice + priorityPrice)}</p>
      </div>
    </div>
  )
}

export default Order
