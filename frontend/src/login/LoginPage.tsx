import { LoginForm } from '@/login/LoginForm'
import { useTitle } from '@/shared/hooks/use-title'

export default function LoginPage() {
  useTitle('登录')

  return (
    <div
      className="max-w-md mt-8 mx-auto rounded shadow bg-gradient-to-br from-teal-500 to-cyan-100 dark:from-violet-950 dark:to-rose-900 sm:mt-36"
    >
      <h1
        className="p-2 text-lg font-medium text-slate-900 bg-gradient-to-r from-green-500 to-amber-100 rounded-tl rounded-tr dark:text-slate-200 dark:from-purple-800 dark:to-pink-600"
      >
        全栈前端 Demo
      </h1>

      <div className="mt-4 p-4">
        <LoginForm/>
      </div>
    </div>
  )
}
