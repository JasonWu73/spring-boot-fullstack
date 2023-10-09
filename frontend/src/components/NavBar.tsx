import reactLogo from '@/assets/react.svg'
import { ModeToggle } from '@/components/ui/ModeToggle'
import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <nav className="flex h-16 items-center justify-between gap-4 bg-slate-950 p-4 text-snow-1 dark:bg-slate-700">
      <Logo />
      <ModeToggle />
    </nav>
  )
}

function Logo() {
  return (
    <Link to="/">
      <div className="flex items-center gap-2">
        <img src={reactLogo} alt="React Logo" />
        <h1 className="text-2xl font-bold">TS + React + Tailwind CSS</h1>
      </div>
    </Link>
  )
}

export { NavBar }
