import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
      <Card className="mx-auto mt-8 w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to React Demo Project</CardTitle>
        </CardHeader>

        <CardContent>
          <ul>
            <LinkItem link="/fetch">
              Custom Hook: <code>useFetch</code>
            </LinkItem>
            <LinkItem link="/eat-and-split">Comprehensive form</LinkItem>
          </ul>
        </CardContent>
      </Card>
    </>
  )
}

type LinkItemProps = {
  link: string
  children: React.ReactNode
}

function LinkItem({ link, children }: LinkItemProps) {
  return (
    <li>
      <Link to={link}>
        <span className="text-sky-500 hover:underline">{children}</span>
      </Link>
    </li>
  )
}

export { Home }
