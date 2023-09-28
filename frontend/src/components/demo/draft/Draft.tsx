import { useEffect, useState } from 'react'
import { sendRequest } from '@/lib/http'

type Product = {
  id: number
  title: string
}

type ProductsResponse = {
  products: Product[]
}

export default function Draft() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const controller = new AbortController()

    async function fetchData() {
      const { data, error } = await sendRequest<ProductsResponse, string>({
        url: 'https://dummyjson.com/products/search?q=phone',
        signal: controller.signal
      })

      if (error) {
        console.log(error)
        return
      }

      data && setProducts(data.products)
    }

    fetchData().then()

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <div className="mx-auto mt-8 w-96 rounded border border-amber-500 p-4">
      <ul>
        {products.map(({ id, title }) => (
          <li key={id}>{title}</li>
        ))}
      </ul>
    </div>
  )
}
