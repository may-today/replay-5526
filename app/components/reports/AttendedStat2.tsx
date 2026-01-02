import { useAtomValue } from 'jotai'
import { motion } from 'motion/react'
import { memo, useMemo } from 'react'
import { NumberTicker } from '~/components/ui/number-ticker'
import type { ConcertSelectType } from '~/data/types'
import { groupVariants, itemVariants } from '~/lib/animated'
import { concertListMap } from '~/lib/data'
import { convertHHmmToMinutes, convertHHmmToString, getConcertTitleByDate } from '~/lib/format'
import { selectedConcertDateTypeMapAtom } from '~/stores/app'
import { BarList } from '../BarList'

export const getPageData = (options: { selectedConcertDateTypeMap: Record<string, ConcertSelectType> }) => {
  console.log('getPageData', options)
  const { selectedConcertDateTypeMap } = options
  const selectedDates = Object.keys(selectedConcertDateTypeMap)
  const dateMinutesMap = selectedDates.reduce(
    (acc, date) => {
      const concert = concertListMap[date]
      if (concert.end && concert.start) {
        acc[date] = convertHHmmToMinutes(concert.end) - convertHHmmToMinutes(concert.start)
      } else {
        acc[date] = 180
      }
      return acc
    },
    {} as Record<string, number>
  )
  const dateMinutesList = Object.entries(dateMinutesMap).map(([date, minutes]) => ({
    name: getConcertTitleByDate(date),
    value: minutes,
  }))
  const totalMinutes = Object.values(dateMinutesMap).reduce((acc, minutes) => acc + minutes, 0)
  const mostLateEndingTime = selectedDates.reduce((acc, date) => {
    const concert = concertListMap[date]
    if (concert.end) {
      return Math.max(acc, concert.end)
    }
    return acc
  }, 0)
  return {
    dateMinutesList,
    totalMinutes,
    // ending time 最晚的场次
    mostLateEndingTime,
    // 最晚的场次名称
    mostLateEndingNameList: selectedDates
      .filter((date) => concertListMap[date].end === mostLateEndingTime)
      .map((date) => getConcertTitleByDate(date)),
  }
}

// 场次概览2
const AttendedStat2: React.FC = () => {
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const data = useMemo(() => getPageData({ selectedConcertDateTypeMap }), [selectedConcertDateTypeMap])
  console.log('AttendedStat2', data)

  return (
    <div className="relative h-full space-y-4 overflow-y-auto p-6">
      <motion.div animate="visible" className="space-y-1" initial="hidden" variants={groupVariants}>
        <motion.div className="mb-4 animate-flicker text-report-base opacity-50!" variants={itemVariants}>
          <p>全剧终</p>
          <p>看见满场空座椅 灯亮起</p>
        </motion.div>
        <motion.div className="text-report-base" variants={itemVariants}>
          <p>这一年的时间坐标里，你和五月天占据了</p>
          <p>
            <NumberTicker value={data.totalMinutes} /> 分钟
          </p>
        </motion.div>
        <motion.p className="text-report-base" variants={itemVariants}>
          <span className="text-report-base">{data.mostLateEndingNameList.join('、')}</span> 是
          <span className="opacity-50"> 夜色最深 </span>
          的一次
        </motion.p>
        <motion.p className="text-report-base" variants={itemVariants}>
          指针停在 🕚 <span>{convertHHmmToString(data.mostLateEndingTime)}</span>，舞台的光才缓缓暗下
        </motion.p>
      </motion.div>
      <motion.div animate={{ opacity: 1, transition: { delay: 1.5 } }} initial={{ opacity: 0 }}>
        <Chart data={data.dateMinutesList} />
      </motion.div>
    </div>
  )
}

const Chart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
  return <BarList className="mt-6" data={data} sortOrder="none" valueFormatter={(value) => `${value} 分钟`} />
}

export default memo(AttendedStat2)
