import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ReloadIcon } from '@radix-ui/react-icons'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/Card'
import { Form } from '@/components/ui/Form'
import { FormInput } from '@/components/ui/CustomFormField'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/use-toast'
import { useTitle } from '@/lib/use-title'
import { useFetch } from '@/lib/use-fetch'
import { useLocalStorageState } from '@/lib/use-storage'
import { getAccessTokenApi, Token } from '@/api/fake/auth-api'

const formSchema = z.object({
  username: z.string().trim().nonempty('Must enter a username'),
  password: z.string().trim().nonempty('Must enter a password')
})

type FormSchema = z.infer<typeof formSchema>

function Login() {
  useTitle('Login')

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const { toast } = useToast()
  const [token, setToken] = useLocalStorageState('demo-token', '')
  const {
    error,
    loading,
    fetchData: login
  } = useFetch<Token, FormSchema>(async (values, signal) => {
    const { data, error } = await getAccessTokenApi({
      ...values!,
      signal
    })

    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      })
    }

    if (data) {
      setToken(data.accessToken)
    }

    return { data, error }
  }, false)

  useRedirectIfLoggedIn(token)

  async function onSubmit(values: FormSchema) {
    await login(values)
  }

  return (
    <Card className="mx-auto mt-8 w-96 md:w-[22rem] lg:w-[30rem]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        {error && (
          <CardDescription className="text-red-500 dark:text-red-600">
            {error}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormInput
              control={form.control}
              name="username"
              type="text"
              label="Username"
              labelWidth={100}
              placeholder="Username"
              isError={form.getFieldState('username')?.invalid}
            />

            <FormInput
              control={form.control}
              name="password"
              type="password"
              label="Password"
              labelWidth={100}
              placeholder="Password"
              isError={form.getFieldState('password')?.invalid}
            />

            <Button type="submit" disabled={loading}>
              {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function useRedirectIfLoggedIn(token: string) {
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      navigate('/', { replace: true })
    }
  }, [token, navigate])
}

export { Login }