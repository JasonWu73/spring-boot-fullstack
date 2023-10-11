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
import { useTitle } from '@/lib/use-title'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getAccessToken, Token } from '@/api/fake/auth-api'
import { useFetch } from '@/lib/use-fetch'
import { useLocalStorageState } from '@/lib/use-storage'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useToast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router-dom'

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

  const navigate = useNavigate()
  const { toast } = useToast()
  const [, setToken] = useLocalStorageState('demo-token', '')
  const {
    error,
    loading,
    fetchData: login
  } = useFetch<Token, FormSchema>(async (values, signal) => {
    const { data, error } = await getAccessToken({
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
      navigate('/')
    }

    return { data, error }
  }, false)

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

export { Login }
