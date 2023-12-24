import { getLoginsTopApi } from '@/shared/apis/backend/operation-log'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useRefresh } from '@/shared/hooks/use-refresh'

export function LoginsTopThree() {
  const {
    loading,
    data: logins,
    error,
    fetchData: getLoginsTop
  } = useFetch(getLoginsTopApi)

  useRefresh(() => {
    getLoginsTop(3).then()
  })

  logins?.map((login) => {
    console.log(login)
  })

  return (
    <div>
      <h1>LoginsTopThree</h1>
    </div>
  )
}
