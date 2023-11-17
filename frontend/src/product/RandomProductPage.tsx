import { ReloadIcon } from '@radix-ui/react-icons'
import React from 'react'

import { getRandomProductApi } from '@/shared/apis/dummyjson/product-api'
import { Button } from '@/shared/components/ui/Button'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useRefresh } from '@/shared/hooks/use-refresh'
import { useTitle } from '@/shared/hooks/use-title'
import { cn } from '@/shared/utils/helpers'

type Params = {
  abortSignal?: AbortSignal
}

export default function RandomProductPage() {
  useTitle('随机商品')

  // 成功获取商品的次数
  const [count, setCount] = React.useState(0)

  const {
    data: product,
    loading,
    error,
    fetchData: getProduct
  } = useFetch(async (params?: Params) => {
    const response = await getRandomProductApi(params)

    if (!response.error && response.data) {
      setCount((prevCount) => prevCount + 1)
    }

    return response
  })

  const abortGetProductRef = React.useRef<AbortController | null>(null)

  useRefresh(() => {
    const controller = new AbortController()
    getProduct({ abortSignal: controller.signal }).then()

    return () => {
      controller.abort()

      if (abortGetProductRef.current) {
        abortGetProductRef.current.abort()
        abortGetProductRef.current = null
      }
    }
  })

  async function handleGetProduct() {
    const controller = new AbortController()
    abortGetProductRef.current = controller
    await getProduct({ abortSignal: controller.signal })
  }

  return (
    <div className="mx-auto mt-8 grid w-[500px] grid-cols-1 grid-rows-[2rem_8rem_3rem_2rem] place-items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-950">
      <div className="row-span-1">
        {loading && <Title label="加载中..." />}

        {error && <Title label={error} isError />}

        {product && <Title label={product.title} />}
      </div>

      <div className="row-span-1">
        {!product && (
          <div className="h-32 w-32 rounded-full border border-gray-300 bg-gradient-to-r from-slate-100 to-slate-300 object-cover shadow-sm" />
        )}

        {product && (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-32 w-32 rounded-full border border-gray-300 object-cover shadow-sm"
          />
        )}
      </div>

      <div className="row-span-1">
        <Button onClick={handleGetProduct} className="my-4" disabled={loading}>
          {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          获取商品
        </Button>
      </div>

      <div className="row-span-1">
        <p>
          已加载 <strong>{count}</strong> 个商品
        </p>
      </div>
    </div>
  )
}

type TitleProps = {
  label: string
  isError?: boolean
}

function Title({ label, isError = false }: TitleProps) {
  return <h1 className={cn(isError && 'text-red-500 dark:text-red-600')}>{label}</h1>
}
