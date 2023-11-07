import { formatCurrency } from '@/utils/helpers-provided'
import { type Menu } from '@/services/restaurant-api'

type MenuItemProps = {
  pizza: Menu
}

function MenuItem({ pizza }: MenuItemProps) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza

  return (
    <li className="rounded-md border bg-slate-300">
      <img src={imageUrl} alt={name} />
      <div>
        <p>{name}</p>
        <p>{ingredients.join(', ')}</p>
        <div>{!soldOut ? <p>{formatCurrency(unitPrice)}</p> : <p>售罄</p>}</div>
      </div>
    </li>
  )
}

export default MenuItem
