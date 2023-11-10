import {useState} from 'react'
import {ReloadIcon} from '@radix-ui/react-icons'

import {Button} from '@/ui/shadcn-ui/Button'
import {cn} from '@/utils/helpers'
import {useFetch} from '@/hooks/use-fetch'
import {useTitle} from '@/hooks/use-title'
import {getRandomProductApi} from '@/services/dummyjson/product-api'
import {useRefresh} from '@/hooks/use-refresh'

export default function ProductShowcase() {
  useTitle('产品展示')

  const [count, setCount] = useState(0)

  const {
    data: product,
    loading,
    error,
    fetchData: getProduct
  } = useFetch(async (payload) => {
    const response = await getRandomProductApi(payload)

    if (!response.error && response.data) {
      setCount((prev) => prev + 1)
    }

    return response
  })

  useRefresh(() => {
    const abort = getProduct()

    return () => {
      abort()
    }
  })

  return (
    <div
      className="mx-auto mt-8 grid w-[400px] grid-cols-1 grid-rows-[2rem_8rem_3rem_2rem] place-items-center rounded border p-4 shadow-sm">
      <div className="row-span-1">
        {loading && <Title label="加载中..."/>}

        {error && <Title label={error} isError/>}

        {product && <Title label={product.title}/>}
      </div>

      <div className="row-span-1">
        {!product && (
          <div
            className="h-32 w-32 rounded-full border border-gray-300 bg-gradient-to-r from-slate-100 to-slate-300 object-cover shadow-sm"/>
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
        <Button
          onClick={() => getProduct()}
          className="my-4"
          disabled={loading}
        >
          {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>}
          获取商品
        </Button>
      </div>

      <div className="row-span-1">
        <Message count={count}/>
      </div>
    </div>
  )
}

type TitleProps = {
  label: string
  isError?: boolean
}

function Title({label, isError = false}: TitleProps) {
  return (
    <h1
      className={cn(
        'font-bold tracking-wider',
        isError && 'text-red-500 dark:text-red-600'
      )}
    >
      {label}
    </h1>
  )
}

type MessageProps = {
  count: number
}

function Message({count}: MessageProps) {
  return (
    <p>
      已加载 <strong>{count}</strong> 个商品
    </p>
  )
}
