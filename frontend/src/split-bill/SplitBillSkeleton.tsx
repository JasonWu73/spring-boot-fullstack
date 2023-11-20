import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/Card'
import { Skeleton } from '@/shared/components/ui/Skeleton'

function SplitBillSkeleton() {
  return (
    <>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-[300px]" />
        </CardTitle>
        <CardDescription className="space-y-2">
          <Skeleton className="h-5 w-[300px]" />
          <Skeleton className="h-6 w-[200px]" />
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}

        <Skeleton className="h-8 w-20 self-end" />
      </CardContent>
    </>
  )
}

export { SplitBillSkeleton }
