import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/Form'
import { FormInput } from '@/components/ui/CustomFormField'
import { Button } from '@/components/ui/Button'
import { ReloadIcon } from '@radix-ui/react-icons'

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
            label="模糊查询"
            labelWidth={60}
            placeholder="针对名字相关的模糊查询"
            isError={form.getFieldState('query')?.invalid}
          />

          <Button type="submit" disabled={loading}>
            {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            查询
          </Button>
          {form.getValues('query').length > 0 && (
            <Button onClick={handleReset} type="button" variant="outline">
              重置
            </Button>
          )}
        </form>
      </Form>
    </div>
  )
}

export { UserSearch }
