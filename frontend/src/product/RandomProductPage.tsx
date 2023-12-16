import { useSignal } from '@preact/signals-react'

import { getProductApi } from '@/shared/apis/dummyjson/product'
import LoadingButton from '@/shared/components/ui/LoadingButton'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useRefresh } from '@/shared/hooks/use-refresh'
import { useTitle } from '@/shared/hooks/use-title'
import { cn } from '@/shared/utils/helpers'

export default function RandomProductPage() {
  useTitle('随机商品')

  useRefresh(() => {
    getRandomProduct().then()
  })

  // 成功获取商品的次数
  const count = useSignal(0)

  const {
    loading,
    data: product,
    error,
    fetchData: getProduct
  } = useFetch(async (productId: number) => {
    const response = await getProductApi(productId)

    if (response.data) {
      count.value++
    }

    return response
  })

  function getRandomProduct() {
    const randomId = Math.floor(Math.random() * 110)

    return getProduct(randomId)
  }

  return (
    <div className="mx-auto grid max-w-md grid-cols-1 grid-rows-[2rem_8rem_3rem_2rem] place-items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-950 lg:max-w-2xl">
      <div className="row-span-1">
        {loading && <Title label="加载中..." />}

        {!loading && error && <Title label={error} isError />}

        {!loading && !error && product && (
          <Title label={`${product.id} - ${product.title}`} />
        )}
      </div>

      <div className="row-span-1">
        {(error || !product) && (
          <div className="h-32 w-32 rounded-full border border-gray-300 bg-gradient-to-r from-slate-100 to-slate-300 object-cover shadow-sm" />
        )}

        {!loading && !error && product && (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-32 w-32 rounded-full border border-gray-300 object-cover shadow-sm"
          />
        )}
      </div>

      <div className="row-span-1">
        <LoadingButton loading={loading} onClick={getRandomProduct} className="my-4">
          获取商品
        </LoadingButton>
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
