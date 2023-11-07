import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function OrderSearch() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(`/order/${query}`)
    setQuery('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="text"
        placeholder="查询订单"
        className="border px-2 py-1"
      />
    </form>
  )
}

export { OrderSearch }
