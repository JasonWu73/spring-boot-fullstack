import { Link } from 'react-router-dom'

import reactLogo from '@/shared/assets/react.svg'

export function Logo() {
  return (
    <Link to="/">
      <span className="flex items-center gap-2">
        <img src={reactLogo} alt="React Logo" />
        <h2 className="uppercase">React</h2>
      </span>
    </Link>
  )
}
