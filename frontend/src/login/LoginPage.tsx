import { LoginForm } from '@/login/LoginForm'
import { useTitle } from '@/shared/hooks/use-title'

export default function LoginPage() {
  useTitle('登录')

  return (
    <div
      className="max-w-md mt-36 mx-auto rounded shadow bg-gradient-to-br from-cyan-500 to-amber-300 dark:from-violet-950 dark:to-rose-900"
    >
      <h1
        className="p-2 text-lg font-medium text-slate-100 bg-gradient-to-r from-green-500 to-yellow-500 rounded-tl rounded-tr dark:text-slate-200 dark:from-purple-800 dark:to-red-600"
      >
        全栈前端 Demo
      </h1>

      <div className="mt-4 p-4">
        <LoginForm/>
      </div>
    </div>
  )
}
