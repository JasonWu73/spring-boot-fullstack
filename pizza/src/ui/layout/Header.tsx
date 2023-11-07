import { Link } from 'react-router-dom'

import { OrderSearch } from '@/features/order/OrderSearch'

function Header() {
  return (
    <header>
      <Link to="/" className="text-sky-500">
        React 披萨公司
      </Link>

      <OrderSearch />

      <p>吴仙杰</p>
    </header>
  )
}

export { Header }
