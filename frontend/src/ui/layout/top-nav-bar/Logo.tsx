import {Link} from 'react-router-dom'

import reactLogo from '@/assets/react.svg'

function Logo() {
  return (
    <Link to="/">
      <span className="flex items-center gap-2">
        <img src={reactLogo} alt="React Logo"/>
        <h2 className="text-xl font-bold uppercase">React</h2>
      </span>
    </Link>
  )
}

export {Logo}
