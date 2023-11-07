import { getMenuApi } from '@/services/restaurant-api'

async function menuLoader() {
  return await getMenuApi({ signal: new AbortController().signal })
}

export { menuLoader }
