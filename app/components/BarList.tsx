// Tremor BarList [v1.0.0]

import React from 'react'

import { cn } from '~/lib/utils'

type Bar<T> = T & {
  key?: string
  href?: string
  value: number
  name: string
}

interface BarListProps<T = unknown> extends React.HTMLAttributes<HTMLDivElement> {
  data: Bar<T>[]
  valueFormatter?: (value: number) => string
  showAnimation?: boolean
  onValueChange?: (payload: Bar<T>) => void
  sortOrder?: 'ascending' | 'descending' | 'none'
}

function BarListInner<T>(
  {
    data = [],
    valueFormatter = (value) => value.toString(),
    showAnimation = false,
    onValueChange,
    sortOrder = 'descending',
    className,
    ...props
  }: BarListProps<T>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>
) {
  const Component = onValueChange ? 'button' : 'div'
  const sortedData = React.useMemo(() => {
    if (sortOrder === 'none') {
      return data
    }
    return [...data].sort((a, b) => {
      return sortOrder === 'ascending' ? a.value - b.value : b.value - a.value
    })
  }, [data, sortOrder])

  const widths = React.useMemo(() => {
    const maxValue = Math.max(...sortedData.map((item) => item.value), 0)
    return sortedData.map((item) => (item.value === 0 ? 0 : Math.max((item.value / maxValue) * 100, 2)))
  }, [sortedData])

  const rowHeight = 'h-6'

  return (
    <div
      aria-sort={sortOrder}
      className={cn('flex justify-between space-x-6', className)}
      ref={forwardedRef}
      tremor-id="tremor-raw"
      {...props}
    >
      <div className="relative w-full space-y-1.5">
        {sortedData.map((item, index) => (
          <Component
            className={cn(
              // base
              'group w-full rounded-sm',
              onValueChange
                ? [
                    '-m-0! cursor-pointer',
                    // hover
                    'hover:bg-gray-50 dark:hover:bg-gray-900',
                  ]
                : ''
            )}
            key={item.key ?? item.name}
            onClick={() => {
              onValueChange?.(item)
            }}
          >
            <div
              className={cn(
                // base
                'flex items-center rounded-sm transition-all',
                rowHeight,
                // background color
                'bg-white/30',
                onValueChange ? 'group-hover:bg-blue-800' : '',
                // margin and duration
                {
                  'mb-0': index === sortedData.length - 1,
                  'duration-800': showAnimation,
                }
              )}
              style={{ width: `${widths[index]}%` }}
            >
              <div className={cn('absolute left-2 flex max-w-full pr-2')}>
                {item.href ? (
                  <a
                    className={cn(
                      // base
                      'truncate whitespace-nowrap rounded-sm text-xs',
                      // text color
                      'text-white/50',
                      // hover
                      'hover:underline hover:underline-offset-2'
                    )}
                    href={item.href}
                    onClick={(event) => event.stopPropagation()}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {item.name}
                  </a>
                ) : (
                  <p
                    className={cn(
                      // base
                      'truncate whitespace-nowrap text-xs',
                      // text color
                      'text-white/50'
                    )}
                  >
                    {item.name}
                  </p>
                )}
              </div>
            </div>
          </Component>
        ))}
      </div>
      <div>
        {sortedData.map((item, index) => (
          <div
            className={cn(
              'flex items-center justify-end',
              rowHeight,
              index === sortedData.length - 1 ? 'mb-0' : 'mb-1.5'
            )}
            key={item.key ?? item.name}
          >
            <p
              className={cn(
                // base
                'truncate whitespace-nowrap text-xs leading-none',
                // text color
                'text-white/30'
              )}
            >
              {valueFormatter(item.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

BarListInner.displayName = 'BarList'

const BarList = React.forwardRef(BarListInner) as <T>(
  p: BarListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof BarListInner>

export { BarList, type BarListProps }
