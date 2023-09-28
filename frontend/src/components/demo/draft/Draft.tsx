import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

const list = [
  {
    id: 1,
    name: 'Tab 1',
    content: 'Tab 1 Content: Agree focus commercial prove.',
    likes: 0
  },
  {
    id: 2,
    name: 'Tab 2',
    content: 'Tab 2 Content: Receive system that reach most continue.',
    likes: 0
  },
  {
    id: 3,
    name: 'Tab 3',
    content: 'Tab 3 Content: Suggest meat final.',
    likes: 0
  },
  {
    id: 4,
    name: 'Tab 4',
    content: 'Tab 4 Content: Animal artist imagine forward wish actually.',
    likes: 0
  }
]

export default function Draft() {
  const [likes, setLikes] = useState(0)
  const [showContent, setShowContent] = useState(true)

  return (
    <Tabs
      defaultValue={`tab${list[0].id}`}
      className="mx-auto mt-8 flex w-[400px] flex-col items-center rounded border border-amber-200 p-4 dark:bg-slate-700"
    >
      <TabsList>
        {list.map(({ id, name }) => (
          <TabsTrigger key={id} value={`tab${id}`}>
            {name}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="w-full">
        {list.map(({ id, name, content }) => (
          <TabsContent key={id} value={`tab${id}`}>
            <Card className="flex flex-col items-center justify-between gap-4 pt-4 dark:bg-slate-600">
              <CardTitle>{name}</CardTitle>

              <CardContent className="w-full">
                {showContent && <div>{content}</div>}

                <div className="flex justify-between">
                  <Button
                    onClick={() => setShowContent((prev) => !prev)}
                    variant="link"
                    className="px-0 text-sky-500"
                  >
                    {showContent ? 'Hide Content' : 'Show Content'}
                  </Button>

                  <div className="flex items-center gap-2">
                    <span>{likes} ❤️</span>
                    <Button
                      onClick={() => setLikes((prev) => prev + 1)}
                      variant="destructive"
                      size="sm"
                    >
                      +
                    </Button>
                    <Button variant="destructive" size="sm">
                      +++
                    </Button>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex w-full justify-start gap-2">
                <Button>Undo</Button>
                <Button>Undo in 2s</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  )
}
