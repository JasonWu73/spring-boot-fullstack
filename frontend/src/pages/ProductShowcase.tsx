import {
  getRandomProduct,
  type ProductResult
} from '@/api/dummyjson/product-api'
import { useState } from 'react'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useFetch } from '@/lib/use-fetch'
import { useTitle } from '@/lib/use-title'

function ProductShowcase() {
  useTitle('Product Showcase')

  const [count, setCount] = useState(0)

  const {
    data: product,
    error,
    loading,
    fetchData: getProduct
  } = useFetch<ProductResult, null>(async (_, signal?: AbortSignal) => {
    const response = await getRandomProduct(signal)

    if (!response.error && response.data) {
      setCount((prev) => prev + 1)
    }

    return response
  })

  function getProductContent() {
    if (loading) {
      return <Title label="加载中..." />
    }

    if (error) {
      return <Title label={error} isError />
    }

    if (product) {
      return (
        <>
          <Title label={product.title} />
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-32 w-32 rounded-full border border-gray-300 object-cover shadow-sm"
          />
        </>
      )
    }
  }

  return (
    <div className="mx-auto mt-8 flex w-[400px] flex-col items-center rounded border p-4 shadow-sm">
      {getProductContent()}

      <Button onClick={() => getProduct()} className="my-4" disabled={loading}>
        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        获取商品
      </Button>

      <Message count={count} />
    </div>
  )
}

type TitleProps = {
  label: string
  isError?: boolean
}

function Title({ label, isError = false }: TitleProps) {
  return (
    <h1
      className={cn('font-bold tracking-wider', {
        'text-red-500 dark:text-red-600': isError
      })}
    >
      {label}
    </h1>
  )
}

type MessageProps = {
  count: number
}

function Message({ count }: MessageProps) {
  return (
    <p>
      已加载 <strong>{count}</strong> 个商品
    </p>
  )
}

export { ProductShowcase }
