import { getLoginsHistoryApi } from '@/shared/apis/backend/operation-log'
import { useFetch } from '@/shared/hooks/use-fetch'
import { useRefresh } from '@/shared/hooks/use-refresh'

export function LoginHistoryChart() {
  const {
    loading,
    data: logins,
    error,
    fetchData: getLoginsHistory
  } = useFetch(getLoginsHistoryApi)

  useRefresh(() => {
    getLoginsHistory(7).then()
  })

  logins?.map((login) => {
    console.log(login)
  })

  return (
    <div>
      <h1>LoginHistoryChart</h1>
    </div>
  )
}
