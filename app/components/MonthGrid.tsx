import clsx from 'clsx'

export enum DayHighlightType {
  NONE = 0,
  LOW = 1,
  HIGH = 2,
}

export interface DayInfo {
  day: number
  month: number
  year: number
  highlight: DayHighlightType
}

export interface MonthInfo {
  name: string
  days: DayInfo[]
}

const MonthGrid: React.FC<{
  month: MonthInfo
  startDayOfWeek: number
  filter: DayHighlightType
}> = ({ month, startDayOfWeek, filter }) => {
  // Create an array for the 7-column grid
  // We need to account for the starting day of the week (Sun=0, Mon=1, etc.)
  const gridCells = new Array(startDayOfWeek).fill(null).concat(month.days) as (DayInfo | null)[]

  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-right text-white/40 text-xs">{month.name}</h3>
      <div className="grid w-fit grid-cols-7 gap-1.5">
        {gridCells.map((day, idx) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: 存在 null 无法使用 id
          <div className="flex h-2.5 w-2.5 items-center justify-center" key={idx}>
            {day ? (
              <CalendarDot highlight={Math.min(day.highlight, filter)} />
            ) : (
              <div className="h-2 w-2 bg-transparent" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

interface CalendarDotProps {
  highlight: DayHighlightType
}

const CalendarDot: React.FC<CalendarDotProps> = ({ highlight }) => {
  return (
    <div className="relative size-2">
      <span
        className={clsx([
          'absolute h-full w-full animate-ping rounded-full bg-transparent transition-colors',
          {
            'bg-amber-500/75!': highlight === DayHighlightType.HIGH,
          },
        ])}
      />
      <span
        className={clsx([
          'absolute h-full w-full rounded-full bg-white/10 transition-colors duration-500',
          {
            'bg-amber-500/90!': highlight === DayHighlightType.HIGH,
            'bg-white/50': highlight === DayHighlightType.LOW,
          },
        ])}
      />
    </div>
  )
}

export default MonthGrid
