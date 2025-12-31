import { useAtomValue } from 'jotai'
import { motion, stagger } from 'motion/react'
import { memo, useMemo, useState } from 'react'
import type { ConcertSelectType } from '~/data/types'
import { cityConcertGroupList, concertListMap } from '~/lib/data'
import { selectedConcertDateTypeMapAtom } from '~/stores/app'
import { DayHighlightType } from '../MonthGrid'
import YearGrid, { type HighlightDateDict } from '../YearGrid'

const getPageData = (selectedConcertDateTypeMap: Record<string, ConcertSelectType>) => {
  const allDates = Object.keys(concertListMap)
  const selectedDates = Object.keys(selectedConcertDateTypeMap)
  const highlightDateDict = allDates.reduce((acc, date) => {
    acc[date] = (
      selectedDates.includes(date) ? DayHighlightType.HIGH : DayHighlightType.LOW
    ) as HighlightDateDict[string]
    return acc
  }, {} as HighlightDateDict)
  return {
    allAmount: Object.keys(concertListMap).length,
    cityAmount: Object.keys(cityConcertGroupList).length - 1, // 去除上海二进宫
    highlightDateDict,
    selectedDates,
    rate: Math.floor((selectedDates.length / Object.keys(concertListMap).length) * 100),
    lastConcertAmount: selectedDates.filter((date) => concertListMap[date].last).length,
  }
}

// 场次概览
const AttendedStat: React.FC = () => {
  const [currentDataFilter, setCurrentDataFilter] = useState<DayHighlightType>(DayHighlightType.NONE)
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
          <motion.p className="text-report-base" variants={itemVariants}>
            2025年
          </motion.p>
          <motion.p
            className="text-report-base"
            onAnimationComplete={() => {
              setCurrentDataFilter(DayHighlightType.LOW)
            }}
            variants={itemVariants}
          >{`${data.cityAmount.toString()} 座城市、${data.allAmount.toString()} 次「回到那一天」`}</motion.p>
          <motion.p
            className="text-report-base"
            onAnimationComplete={() => {
              setCurrentDataFilter(DayHighlightType.HIGH)
            }}
            variants={itemVariants}
          >{`我参与了 ${data.selectedDates.length.toString()} 场${data.lastConcertAmount > 0 ? `，并有幸 ${data.lastConcertAmount.toString()} 次见证尾场` : ''}`}</motion.p>
        </motion.div>
        <YearGrid className="mt-6" filter={currentDataFilter} highlightDates={data.highlightDateDict} year={2025} />
      </div>
    </div>
  )
}

export default memo(AttendedStat)
