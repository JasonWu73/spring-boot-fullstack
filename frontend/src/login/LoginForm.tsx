import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { toast } from '@/shared/components/ui/use-toast'
import { useFetch } from '@/shared/hooks/use-fetch'
import { loginApi } from '@/shared/apis/backend/auth'
import { getAuth, setAuth } from '@/shared/auth/auth-signals'

const DEFAULT_REDIRECT_URL = '/'

type LoginParam = {
  username: string
  password: string
}

export function LoginForm() {
  const { loading, fetchData: login } = useFetch(
    async ({ username, password }: LoginParam) => await loginApi(username, password)
  )

  const location = useLocation()
  const targetUrl = location.state?.from || DEFAULT_REDIRECT_URL

  // 已登录则跳转到目标页面，即登录后就不允许再访问登录页面
  if (getAuth()) return <Navigate to={targetUrl} replace/>

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    let username = formData.get('username') as string
    username = username.trim()
    let password = formData.get('password') as string
    password = password.trim()

    const { data, error } = await login({ username, password })

    if (error) {
      toast({
        title: '登录失败',
        description: error,
        variant: 'destructive'
      })
      return
    }

    if (data) {
      setAuth(data)
    }

    form.reset()
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <div>
        <label htmlFor="username">用户名</label>
        <Input
          type="text"
          name="username"
          id="username"
          placeholder="用户名"
          autoComplete="username"
          required
          minLength={2}
          onValidate={validityState => {
            if (validityState.valueMissing) return '用户名不能为空'

            if (validityState.tooShort) return '用户名至少 2 个字符'
          }}
        />
      </div>

      <div>
        <label htmlFor="password">密码</label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="密码"
          autoComplete="current-password"
          required
          minLength={2}
          onValidate={validityState => {
            if (validityState.valueMissing) return '密码不能为空'

            if (validityState.tooShort) return '密码至少 2 个字符'
          }}
        />
      </div>

      <Button type="submit" loading={loading}>
        登录
      </Button>
    </form>
  )
}
