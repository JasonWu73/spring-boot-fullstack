import { CardDescription, CardHeader, CardTitle } from '@/ui/shadcn-ui/Card'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

type ErrorProps = {
  message: string
}

function FormSplitBillError({ message }: ErrorProps) {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-1 text-red-500">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <span className="h-5">分摊账单出错</span>
      </CardTitle>
      <CardDescription>{message}</CardDescription>
    </CardHeader>
  )
}

export { FormSplitBillError }
