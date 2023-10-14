import React from 'react'
import { useLocation } from 'react-router-dom'

type PageProps = {
  children: React.ReactNode
}

function Page({ children }: PageProps) {
  const location = useLocation()
  return <React.Fragment key={location.key}>{children}</React.Fragment>
}

export { Page }
