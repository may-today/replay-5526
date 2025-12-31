import { useAtomValue } from 'jotai'
import { motion, stagger } from 'motion/react'
import { memo, useMemo } from 'react'
import { NumberTicker } from '~/components/ui/number-ticker'
import type { ConcertSelectType } from '~/data/types'
import { concertListMap } from '~/lib/data'
import { convertHHmmToMinutes, convertHHmmToString, getConcertTitleByDate } from '~/lib/format'
import { selectedConcertDateTypeMapAtom } from '~/stores/app'
import { BarList } from '../BarList'

const getPageData = (selectedConcertDateTypeMap: Record<string, ConcertSelectType>) => {
  const selectedDates = Object.keys(selectedConcertDateTypeMap)
  const dateMinutesMap = selectedDates.reduce(
    (acc, date) => {
      const concert = concertListMap[date]
      if (concert.end && concert.start) {
        acc[date] = convertHHmmToMinutes(concert.end) - convertHHmmToMinutes(concert.start)
      } else {
        acc[date] = 0
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
  const data = useMemo(() => getPageData(selectedConcertDateTypeMap), [selectedConcertDateTypeMap])

  const groupVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: stagger(1),
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  }

  return (
    <div className="relative h-full overflow-y-auto">
      <div className="flex-1 space-y-4 p-6">
        {/* <TextAnimate animation="blurInUp" by="line" className="text-report-base" duration={1} once></TextAnimate> */}
        <motion.div animate="visible" initial="hidden" variants={groupVariants}>
          <motion.p className="mb-4 animate-flicker text-report-base opacity-50!" variants={itemVariants}>
            全剧终
            <br />
            看见满场空座椅 灯亮起
          </motion.p>
          <motion.p className="text-report-base" variants={itemVariants}>
            这一年的时间坐标里，你和五月天占据了 <NumberTicker value={data.totalMinutes} /> 分钟
          </motion.p>
          <motion.p className="text-report-base" variants={itemVariants}>
            <span className="text-report-lg">{data.mostLateEndingNameList.join('、')}</span> 是夜色最深的一次
          </motion.p>
          <motion.p className="text-report-base" variants={itemVariants}>
            指针停在 <span>{convertHHmmToString(data.mostLateEndingTime)}</span>，舞台的光才缓缓暗下
          </motion.p>
        </motion.div>
        <Chart data={data.dateMinutesList} />
      </div>
    </div>
  )
}

export const description = 'A bar chart with a custom label'

const Chart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
  return <BarList className="mt-6" data={data} sortOrder="none" valueFormatter={(value) => `${value} 分钟`} />
}

export default memo(AttendedStat2)
