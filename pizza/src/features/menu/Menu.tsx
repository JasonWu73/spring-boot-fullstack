import { useLoaderData } from 'react-router-dom'

import { type Menu } from '@/services/restaurant-api'
import MenuItem from '@/features/menu/MenuItem'
import { type ApiResponse } from '@/hooks/use-fetch'

function Menu() {
  const { data: menus } = useLoaderData() as ApiResponse<Menu[]>

  return (
    <ul className="flex flex-col gap-4">
      {menus?.map((pizza) => <MenuItem pizza={pizza} key={pizza.id} />)}
    </ul>
  )
}

export default Menu
