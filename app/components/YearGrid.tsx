import clsx from 'clsx'
import MonthGrid, { DayHighlightType, type DayInfo, type MonthInfo } from './MonthGrid'

export type HighlightDateDict = Record<string, DayHighlightType>

const YearGrid: React.FC<{
  year: number
  className?: string
  highlightDates: HighlightDateDict
  filter?: DayHighlightType
}> = ({ year, className, highlightDates, filter = DayHighlightType.HIGH }) => {
  const yearData = getYearData(year, highlightDates)

  return (
    <main className={clsx('grid w-full max-w-4xl grid-cols-3 gap-3 md:grid-cols-4', className)}>
      {yearData.map((month, idx) => {
        const firstDay = new Date(year, idx, 1).getDay()
        return (
          <div className="flex items-start justify-center" key={month.name}>
            <MonthGrid filter={filter} month={month} startDayOfWeek={firstDay} />
          </div>
        )
      })}
    </main>
  )
}

const getYearData = (year: number, highlightDates: HighlightDateDict): MonthInfo[] => {
  const months: MonthInfo[] = []
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

  for (let m = 0; m < 12; m++) {
    const days: DayInfo[] = []
    // Get number of days in month
    const lastDayOfMonth = new Date(year, m + 1, 0).getDate()

    // Optional: Add empty padding dots to keep the grid aligned like a real calendar
    // We'll add them as nulls or special objects if we want them invisible or dim.
    // For "dot representation", we'll just output the actual days.

    for (let d = 1; d <= lastDayOfMonth; d++) {
      const date = `${year}.${(m + 1).toString().padStart(2, '0')}.${d.toString().padStart(2, '0')}`
      days.push({
        day: d,
        month: m,
        year,
        highlight: highlightDates[date] || DayHighlightType.NONE,
      })
    }

    months.push({
      name: monthNames[m],
      days,
    })
  }

  return months
}

export default YearGrid
