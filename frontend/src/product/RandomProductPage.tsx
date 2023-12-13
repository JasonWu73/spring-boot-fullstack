import { useSignal } from '@preact/signals-react'
import { useQuery } from '@tanstack/react-query'

import { getProduct, type Product } from '@/shared/apis/dummyjson/product'
import LoadingButton from '@/shared/components/ui/LoadingButton'
import { useTitle } from '@/shared/hooks/use-title'
import { cn } from '@/shared/utils/helpers'

export default function RandomProductPage() {
  useTitle('随机商品')

  // 成功获取商品的次数
  const count = useSignal(0)

  const {
    isFetching: loading,
    data: product,
    error,
    refetch: refetchProduct
  } = useQuery<Product, string>({
    queryKey: ['product'],
    queryFn: async () => {
      const randomId = Math.floor(Math.random() * 110)
      const product = await getProduct(randomId)

      count.value++

      return product
    }
  })

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
        {!product && (
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
        <LoadingButton
          loading={loading}
          onClick={() => refetchProduct()}
          className="my-4"
        >
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
