import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import React from 'react'
import { useForm, type UseFormSetValue } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/ui/shadcn-ui/Button'
import { FormInput } from '@/ui/shadcn-ui/CustomFormField'
import { Form } from '@/ui/shadcn-ui/Form'
import { URL_QUERY_KEY_QUERY } from '@/utils/constants'

const formSchema = z.object({
  query: z.string()
})

type FormSchema = z.infer<typeof formSchema>

type UserSearchProps = {
  onSearch: (query: string) => void
  loading: boolean
}

function UserSearch({ onSearch, loading }: UserSearchProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: ''
    }
  })

  useSyncQuery(form.setValue)

  function onSubmit(values: FormSchema) {
    onSearch(values.query)
  }

  function handleReset() {
    form.reset()
    onSubmit({ query: '' })
  }

  return (
    <div className="flex items-center py-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-4"
        >
          <FormInput
            control={form.control}
            name="query"
            type="text"
            label="模糊搜索"
            labelWidth={60}
            placeholder="搜索用户名..."
            isError={form.getFieldState('query')?.invalid}
          />

          <Button type="submit" disabled={loading}>
            {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            查询
          </Button>

          {form.getValues('query').length > 0 && (
            <Button onClick={handleReset} type="reset" variant="secondary">
              重置
            </Button>
          )}
        </form>
      </Form>
    </div>
  )
}

function useSyncQuery(setValue: UseFormSetValue<FormSchema>) {
  const [searchParams] = useSearchParams()
  const query = searchParams.get(URL_QUERY_KEY_QUERY) || ''

  React.useEffect(() => {
    setValue('query', query)
  }, [query, setValue])
}

export { UserSearch }
