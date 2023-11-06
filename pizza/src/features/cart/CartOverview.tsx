import { Link } from 'react-router-dom'

function CartOverview() {
  return (
    <div>
      <p>
        <span>23 个披萨</span>
        <span>$23.45</span>
      </p>
      <Link to="/cart">打开购物车 →</Link>
    </div>
  )
}

export default CartOverview
