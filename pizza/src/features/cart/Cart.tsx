import { Link } from 'react-router-dom'

const fakeCart = [
  {
    pizzaId: 12,
    name: 'Mediterranean',
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32
  },
  {
    pizzaId: 6,
    name: 'Vegetale',
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13
  },
  {
    pizzaId: 11,
    name: 'Spinach and Mushroom',
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15
  }
]

function Cart() {
  const cart = fakeCart

  return (
    <div>
      <Link to="/menu" className="text-sky-500">
        ← 返回菜单
      </Link>

      <h2 className="text-lg font-bold">您的购物车，%NAME%</h2>

      <div>
        <Link to="/order/new" className="text-sky-500">
          订购披萨
        </Link>
        <button className="rounded bg-sky-500 px-2 py-1 text-white hover:bg-sky-600">
          清除购物车
        </button>
      </div>
    </div>
  )
}

export default Cart
