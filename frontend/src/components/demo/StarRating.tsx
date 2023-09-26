import { Card } from '@/components/ui/Card.tsx'
import React, { useState } from 'react'
import { cn } from '@/lib/utils.ts'

type StarRatingProps = {
  maxRating?: number
}

const array = [0, 0, 20, 20, 40, 40, 60, 60, 80, 80]

function StarRating({ maxRating = 5 }: StarRatingProps) {
  const [rating, setRating] = useState(0)
  const [tempRating, setTempRating] = useState(0)

  return (
    <Card className="mx-auto mt-8 w-96 p-4">
      <ul className="relative flex items-center gap-1">
        {Array.from({ length: maxRating * 2 }, (_, i) => (
          <li
            key={i}
            className="absolute"
            style={{
              left: `${array[i]}px`,
              zIndex: i % 2 === 0 ? 10 : 0
            }}
          >
            <StarBox
              type={i % 2 === 0 ? 'half' : 'full'}
              isFilled={rating >= i + 1 || tempRating >= i + 1}
              onRate={() => setRating(i + 1)}
              onHoverIn={(e) => {
                console.log(e.target)
                setTempRating(i + 1)
              }}
              // onHoverOut={() => setTempRating(0)}
            />
          </li>
        ))}
        <li>
          <span className="ml-28 text-amber-500">
            {tempRating / 2 || rating / 2 || ''}
          </span>
        </li>
      </ul>
    </Card>
  )
}

type StarBoxProps = {
  type?: 'full' | 'half'
  isFilled?: boolean
  onRate?: () => void
  onHoverIn?: (e: React.MouseEvent<HTMLSpanElement>) => void
  onHoverOut?: (e: React.MouseEvent<HTMLSpanElement>) => void
}

function StarBox({
  type = 'full',
  isFilled,
  onRate,
  onHoverIn,
  onHoverOut
}: StarBoxProps) {
  return (
    <span
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
      className={cn('peer cursor-pointer', {
        'border-amber-500': isFilled
      })}
    >
      {type === 'full' ? (
        <FullStar isFilled={isFilled} />
      ) : (
        <HalfStart isFilled={isFilled} />
      )}
    </span>
  )
}

type StarProps = {
  isFilled?: boolean
}

function FullStar({ isFilled }: StarProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={isFilled ? '#f59e0b' : 'none'}
      stroke="#f59e0b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-star"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function HalfStart({ isFilled }: StarProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="20"
      viewBox="0 0 12 24"
      fill={isFilled ? '#f59e0b' : 'none'}
      stroke="#f59e0b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-star-half"
    >
      <path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2" />
    </svg>
  )
}

export { StarRating }
