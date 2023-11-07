import { Link } from 'react-router-dom'

function Header() {
  return (
    <header>
      <Link to="/" className="text-sky-500">
        React 披萨公司
      </Link>

      <p>吴仙杰</p>
    </header>
  )
}

export { Header }
