import React, {useState} from 'react'

import {cn} from '@/utils/helpers'

type Size = 'default' | 'sm' | 'lg'

type StarRatingProps = {
  onRate: (rate: number) => void
  maxRating?: number
  defaultRating?: number
  color?: string
  size?: Size
  isShowLabel?: boolean
  className?: string
}

function StarRating({
  onRate,
  maxRating = 5,
  defaultRating = 0,
  color = '#f59e0b',
  size = 'default',
  isShowLabel = true,
  className
}: StarRatingProps) {
  const [rating, setRating] = useState(0)
  const [tempRating, setTempRating] = useState(0)
  const sizePx = getSizePx(size)

  const leftPxOffsets = Array.from({length: maxRating * 2}, (_, i) => {
    if (i % 2 === 0) {
      return (i / 2) * sizePx
    } else {
      return (i / 2) * sizePx - sizePx / 2
    }
  })

  function handleRate(rate: number) {
    setRating(rate)
    onRate(rate)
  }

  return (
    <ul
      className={cn('relative flex items-center', className)}
      style={{
        height: `${size}px`,
        width: `${maxRating * sizePx}px`
      }}
    >
      {Array.from({length: maxRating * 2}, (_, i) => (
        <li
          key={i}
          className="absolute"
          style={{
            left: `${leftPxOffsets[i]}px`,
            zIndex: i % 2 === 0 ? 10 : 0
          }}
        >
          <StarBox
            color={color}
            size={sizePx}
            type={i % 2 === 0 ? 'half' : 'full'}
            isFilled={
              tempRating
                ? tempRating * 2 >= i + 1
                : rating
                  ? rating * 2 >= i + 1
                  : defaultRating / 0.5 >= i + 1
            }
            onRate={() => handleRate((i + 1) / 2)}
            onHoverIn={() => setTempRating((i + 1) / 2)}
            onHoverOut={() => setTempRating(0)}
          />
        </li>
      ))}

      {isShowLabel && (
        <li>
          <span
            className={cn({
              'text-lg': size !== 'sm' && size !== 'lg',
              'text-sm': size === 'sm',
              'text-xl': size === 'lg'
            })}
            style={{
              marginLeft: `${leftPxOffsets[maxRating * 2 - 1] + sizePx + 6}px`,
              color: color
            }}
          >
            {tempRating || rating || defaultRating || ''}
          </span>
        </li>
      )}
    </ul>
  )
}

type StarBoxProps = {
  color?: string
  size?: number
  type?: 'full' | 'half'
  isFilled?: boolean
  onRate?: () => void
  onHoverIn?: (e: React.MouseEvent<HTMLSpanElement>) => void
  onHoverOut?: (e: React.MouseEvent<HTMLSpanElement>) => void
}

function StarBox({
  color,
  size,
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
        <FullStar isFilled={isFilled} color={color} size={size}/>
      ) : (
        <HalfStart isFilled={isFilled} color={color} size={size}/>
      )}
    </span>
  )
}

type StarProps = {
  color?: string
  isFilled?: boolean
  size?: number
}

function FullStar({color = '#f59e0b', isFilled, size = 20}: StarProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? color : 'none'}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-star"
    >
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

function HalfStart({color = '#f59e0b', isFilled, size = 20}: StarProps) {
  const width = size / 2

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={size}
      viewBox={`0 0 ${width + 2} 24`}
      fill={isFilled ? color : 'none'}
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-star"
    >
      <path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2"/>
    </svg>
  )
}

function getSizePx(size: Size) {
  switch (size) {
    case 'sm':
      return 16
    case 'lg':
      return 22
    default:
      return 20
  }
}

export {StarRating}
